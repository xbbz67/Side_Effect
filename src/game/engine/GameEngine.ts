import rules from '../../../docs/GAME_RULES.json';
import { cards, definition } from '../cards/CardRegistry';
import { nextRandom, shuffle } from './SeededRandom';
import type { Command, GameEvent, GameState, Player, Projection, Setup } from './GameState';

export class InvalidActionError extends Error {
  constructor(
    public action: Command,
    public phase: string,
    public expected: string,
    public actual: string,
  ) {
    super(
      `${action.type} / ${action.playerId}${'cardId' in action ? ` / ${action.cardId}` : ''} during ${phase}: ${expected}. Actual: ${actual}`,
    );
    this.name = 'InvalidActionError';
  }
}
const initialPenalties = () => ({ skip: false, draw: false, play: false });
export function createState(setup: Setup): GameState {
  if (
    !Number.isSafeInteger(setup.seed) ||
    setup.players.length < rules.playerMin ||
    setup.players.length > rules.playerMax
  )
    throw new Error('Use an integer seed and 2–8 players');
  if (setup.players.some((p) => !p.name.trim() || p.name.length > 30 || typeof p.bot !== 'boolean'))
    throw new Error('Names need 1–30 characters; bot must be boolean');
  const s: GameState = {
    version: 1,
    profile: 'digital-1',
    players: setup.players.map((p, i) => ({
      id: `P${i + 1}`,
      name: p.name.trim(),
      bot: p.bot,
      hand: [],
      psyche: [],
      penalties: initialPenalties(),
    })),
    deck: [],
    discard: [],
    active: 0,
    turn: 1,
    phase: 'draw',
    plays: 0,
    rng: setup.seed >>> 0 || 0x9e3779b9,
    clock: 0,
    blocked: { draw: false, play: false },
    revision: 0,
  };
  const all = cards.flatMap((c) => Array.from({ length: c.copies }, (_, i) => `${c.id}:${i + 1}`));
  let disorders = shuffle(
    all.filter((c) => definition(c).type === 'disorder'),
    s,
  );
  const n =
    setup.players.length >= rules.largeTableStartsAt
      ? rules.setupDisordersLarge
      : rules.setupDisordersSmall;
  for (let r = 0; r < n; r++)
    for (const p of s.players) {
      let attempts = 0;
      while (true) {
        const c = disorders.pop()!;
        if (!p.psyche.some((x) => definition(x.card).id === definition(c).id)) {
          p.psyche.push({ card: c });
          break;
        }
        disorders.unshift(c);
        if (++attempts > 100) throw new Error('Setup cannot deal unique Disorders');
      }
    }
  s.deck = shuffle([...disorders, ...all.filter((c) => definition(c).type !== 'disorder')], s);
  for (let r = 0; r < rules.startingHand; r++)
    for (const p of s.players) p.hand.push(s.deck.pop()!);
  return s;
}
export function vulnerability(p: Player): string[] {
  return [...new Set(p.psyche.flatMap((x) => (x.drug ? definition(x.drug).sideEffects : [])))];
}
export function getLegalActions(s: GameState, playerId: string): Command[] {
  const p = s.players.find((p) => p.id === playerId);
  if (!p || s.phase === 'won') return [];
  const active = s.players[s.active].id === playerId;
  if (s.pending) {
    const e = s.pending;
    if (e.kind === 'tremors') {
      if (e.victim !== playerId) return [];
      if (e.deadline === undefined) return [{ type: 'READY', playerId, now: s.clock }];
      return [
        { type: 'RESOLVE', playerId, cards: p.hand.slice(0, e.required), now: s.clock },
        { type: 'TIMEOUT', playerId, now: Math.max(s.clock, e.deadline) },
      ];
    }
    if (e.actor === playerId) {
      return e.kind === 'gambling'
        ? [
            { type: 'RESOLVE', playerId, take: true, now: s.clock },
            { type: 'RESOLVE', playerId, take: false, now: s.clock },
          ]
        : [
            { type: 'RESOLVE', playerId, cards: [], now: s.clock },
            ...s.players
              .find((p) => p.id === e.victim)!
              .hand.map((c) => ({ type: 'RESOLVE' as const, playerId, cards: [c], now: s.clock })),
          ];
    }
    return [];
  }
  if (s.phase === 'draw') return active ? [{ type: 'START_TURN', playerId }] : [];
  const a: Command[] = [];
  // Gifts are available off-turn during main phase. A UI may offer them explicitly.
  for (const c of p.hand)
    for (const other of s.players)
      if (other.id !== playerId)
        a.push({ type: 'GIFT_CARD', playerId, cardId: c, targetPlayer: other.id });
  if (!active) return a;
  for (const c of p.hand) a.push({ type: 'DISCARD_CARD', playerId, cardId: c });
  if (p.hand.length <= rules.handLimit) a.push({ type: 'END_TURN', playerId });
  if (s.plays >= rules.playsPerTurn || s.blocked.play) return a;
  for (const c of p.hand) {
    const d = definition(c);
    for (const t of s.players) {
      if (d.type === 'disorder') {
        if (
          t.id !== p.id &&
          vulnerability(t).includes(d.id) &&
          !t.psyche.some((x) => definition(x.card).id === d.id)
        )
          a.push({ type: 'PLAY_CARD', playerId, cardId: c, targetPlayer: t.id });
      } else
        for (const x of t.psyche) {
          const target = definition(x.card);
          if (
            !x.drug &&
            ((d.type === 'drug' && t.id === p.id && d.treats.includes(target.id)) ||
              (d.type === 'therapy' && t.id === p.id && target.therapyAllowed) ||
              (d.type === 'episode' && t.id !== p.id))
          )
            a.push({
              type: 'PLAY_CARD',
              playerId,
              cardId: c,
              targetPlayer: t.id,
              targetCard: x.card,
            });
        }
    }
  }
  return a;
}
function equalAction(a: Command, b: Command) {
  return (
    a.type === b.type &&
    a.playerId === b.playerId &&
    (!('cardId' in a) || ('cardId' in b && a.cardId === b.cardId)) &&
    (!('targetPlayer' in a) || ('targetPlayer' in b && a.targetPlayer === b.targetPlayer)) &&
    (!('targetCard' in a) || ('targetCard' in b && a.targetCard === b.targetCard))
  );
}

export function executeAction(
  previous: GameState,
  cmd: Command,
): { state: GameState; events: GameEvent[] } {
  const invalid = (expected: string, actual: string): never => {
    throw new InvalidActionError(cmd, previous.phase, expected, actual);
  };
  if (
    !cmd ||
    typeof cmd.playerId !== 'string' ||
    !getLegalActions(previous, cmd.playerId).some((a) => equalAction(a, cmd))
  )
    invalid('Choose a currently legal action and target', JSON.stringify(cmd));
  const s: GameState = structuredClone(previous);
  const events: GameEvent[] = [];
  const p = s.players.find((p) => p.id === cmd.playerId)!;
  const emit = (type: string, text: string, extra: Partial<GameEvent> = {}) =>
    events.push({ type, text, playerId: cmd.playerId, ...extra });
  const discard = (owner: Player, c: string) => {
    owner.hand.splice(owner.hand.indexOf(c), 1);
    s.discard.push(c);
    emit('CARD_DISCARDED', `${owner.name} discarded ${definition(c).name}.`, {
      playerId: owner.id,
      cardId: c,
    });
  };
  const finishPending = () => {
    s.discard.push(s.pending!.episode);
    s.pending = undefined;
    s.phase = 'main';
  };
  const advance = () => {
    s.active = (s.active + 1) % s.players.length;
    s.turn++;
    s.plays = 0;
    s.blocked = { draw: false, play: false };
    s.phase = 'draw';
  };
  if ('now' in cmd) {
    if (!Number.isFinite(cmd.now) || cmd.now < s.clock)
      invalid('A finite monotonic authority timestamp', String(cmd.now));
    s.clock = cmd.now;
  }
  switch (cmd.type) {
    case 'START_TURN': {
      emit('TURN_STARTED', `${p.name}'s turn.`);
      s.blocked = { draw: p.penalties.draw, play: p.penalties.play };
      const skip = p.penalties.skip;
      p.penalties = initialPenalties();
      if (skip) {
        emit('TURN_SKIPPED', `${p.name} sits out this turn (Depression).`);
        advance();
        break;
      }
      if (s.blocked.draw) emit('DRAW_BLOCKED', `${p.name} cannot draw this turn (Anorexia).`);
      else
        for (let i = 0; i < rules.drawPerTurn; i++) {
          if (!s.deck.length && s.discard.length) {
            s.deck = shuffle(s.discard, s);
            s.discard = [];
            emit('DECK_SHUFFLED', 'The discard pile was shuffled into the deck.');
          }
          const c = s.deck.pop();
          if (c) {
            p.hand.push(c);
            emit('CARD_DRAWN', `${p.name} drew a card.`, { cardId: c, privateTo: [p.id] });
          } else emit('DECK_EMPTY', 'No cards remain available to draw.');
        }
      s.phase = 'main';
      break;
    }
    case 'END_TURN':
      emit('TURN_ENDED', `${p.name} ended their turn.`);
      advance();
      break;
    case 'DISCARD_CARD':
      discard(p, cmd.cardId);
      break;
    case 'GIFT_CARD': {
      const t = s.players.find((p) => p.id === cmd.targetPlayer)!;
      p.hand.splice(p.hand.indexOf(cmd.cardId), 1);
      t.hand.push(cmd.cardId);
      emit('CARD_GIFTED', `${p.name} gave ${t.name} a card.`, {
        cardId: cmd.cardId,
        targetPlayer: t.id,
        privateTo: [p.id, t.id],
      });
      break;
    }
    case 'PLAY_CARD': {
      const d = definition(cmd.cardId),
        t = s.players.find((p) => p.id === cmd.targetPlayer)!;
      p.hand.splice(p.hand.indexOf(cmd.cardId), 1);
      s.plays++;
      emit('CARD_PLAYED', `${p.name} played ${d.name}.`, {
        cardId: cmd.cardId,
        targetPlayer: t.id,
        targetCard: cmd.targetCard,
      });
      emit('PLAYER_TARGETED', `${t.name} was targeted.`, {
        targetPlayer: t.id,
        targetCard: cmd.targetCard,
      });
      if (d.type === 'disorder') {
        t.psyche.push({ card: cmd.cardId });
        emit('SIDE_EFFECT_TRIGGERED', `${t.name}'s treatment exposes ${d.name}.`, {
          targetPlayer: t.id,
          cardId: cmd.cardId,
        });
        emit('DISORDER_ADDED', `${d.name} joined ${t.name}'s Psyche.`, {
          targetPlayer: t.id,
          cardId: cmd.cardId,
        });
      } else {
        const x = t.psyche.find((x) => x.card === cmd.targetCard)!;
        if (d.type === 'drug') {
          x.drug = cmd.cardId;
          emit('DRUG_APPLIED', `${p.name} treated ${definition(x.card).name}.`, {
            cardId: cmd.cardId,
            targetCard: x.card,
            targetPlayer: t.id,
          });
          emit('DISORDER_TREATED', `${definition(x.card).name} is treated.`, {
            targetCard: x.card,
            targetPlayer: t.id,
          });
        } else if (d.type === 'therapy') {
          t.psyche.splice(t.psyche.indexOf(x), 1);
          s.discard.push(x.card, cmd.cardId);
          emit('THERAPY_USED', `${p.name} removed ${definition(x.card).name} with Therapy.`, {
            cardId: cmd.cardId,
            targetCard: x.card,
            targetPlayer: t.id,
          });
        } else {
          const kind = definition(x.card).episode;
          emit('EPISODE_TRIGGERED', `${definition(x.card).name} Episode on ${t.name}.`, {
            cardId: cmd.cardId,
            targetPlayer: t.id,
            targetCard: x.card,
          });
          if (kind === 'remove_all_attached_drugs') {
            for (const condition of t.psyche)
              if (condition.drug) {
                s.discard.push(condition.drug);
                emit('DRUG_REMOVED', `${t.name} lost ${definition(condition.drug).name}.`, {
                  cardId: condition.drug,
                  targetPlayer: t.id,
                });
                delete condition.drug;
              }
          }
          if (kind === 'discard_entire_hand') for (const c of [...t.hand]) discard(t, c);
          if (kind === 'skip_round') t.penalties.skip = true;
          if (kind === 'block_play_round') t.penalties.play = true;
          if (kind === 'block_draw_round') t.penalties.draw = true;
          if (
            ['timed_discard', 'random_hand_theft', 'reveal_hand_optional_theft'].includes(kind!)
          ) {
            s.pending = {
              kind:
                kind === 'timed_discard'
                  ? 'tremors'
                  : kind === 'random_hand_theft'
                    ? 'gambling'
                    : 'anxiety',
              actor: p.id,
              victim: t.id,
              episode: cmd.cardId,
              required: Math.min(3, t.hand.length),
            };
            s.phase = 'pending';
            if (!t.hand.length) {
              emit('EFFECT_RESOLVED', `${t.name} has no hand cards; the Episode ends.`);
              finishPending();
            }
          } else s.discard.push(cmd.cardId);
        }
      }
      break;
    }
    case 'READY':
      s.pending!.deadline = s.clock + rules.tremorsMs;
      emit('TIMER_STARTED', `${p.name} has 3 seconds to choose ${s.pending!.required} cards.`);
      break;
    case 'TIMEOUT': {
      if (s.clock < s.pending!.deadline!) invalid('Wait for the Tremors deadline', String(s.clock));
      const victim = s.players.find((p) => p.id === s.pending!.victim)!;
      for (const c of [...victim.hand]) discard(victim, c);
      emit('EFFECT_RESOLVED', 'Tremors timed out; the whole hand was discarded.');
      finishPending();
      break;
    }
    case 'RESOLVE': {
      const e = s.pending!,
        victim = s.players.find((p) => p.id === e.victim)!,
        actor = s.players.find((p) => p.id === e.actor)!;
      if (e.kind === 'tremors') {
        if (s.clock >= e.deadline!) invalid('Submit before the Tremors deadline', String(s.clock));
        const selection = cmd.cards ?? [];
        if (
          selection.length !== e.required ||
          new Set(selection).size !== selection.length ||
          selection.some((c) => !victim.hand.includes(c))
        )
          invalid(`Choose ${e.required} distinct victim hand cards`, JSON.stringify(selection));
        for (const c of selection) discard(victim, c);
      } else if (e.kind === 'gambling') {
        if (typeof cmd.take !== 'boolean') invalid('Choose take or decline', String(cmd.take));
        if (cmd.take)
          for (let i = 0, n = Math.min(3, victim.hand.length); i < n; i++) {
            s.rng = nextRandom(s.rng);
            const c = victim.hand.splice(s.rng % victim.hand.length, 1)[0];
            actor.hand.push(c);
            emit('CARD_STOLEN', `${actor.name} took a random card from ${victim.name}.`, {
              cardId: c,
              targetPlayer: victim.id,
              privateTo: [actor.id, victim.id],
            });
          }
      } else {
        const selection = cmd.cards ?? [];
        if (selection.length > 1 || selection.some((c) => !victim.hand.includes(c)))
          invalid('Choose one revealed card or decline', JSON.stringify(selection));
        if (selection.length) {
          const c = selection[0];
          victim.hand.splice(victim.hand.indexOf(c), 1);
          actor.hand.push(c);
          emit('CARD_STOLEN', `${actor.name} took a card from ${victim.name}.`, {
            cardId: c,
            targetPlayer: victim.id,
            privateTo: [actor.id, victim.id],
          });
        }
      }
      emit('EFFECT_RESOLVED', 'The Episode has resolved.');
      finishPending();
      break;
    }
  }
  if (!s.pending)
    for (const player of s.players)
      if (player.psyche.every((c) => c.drug)) {
        s.winner = player.id;
        s.phase = 'won';
        emit('PLAYER_WON', `${player.name} has a fully treated Psyche and wins.`, {
          playerId: player.id,
        });
        break;
      }
  s.revision++;
  return { state: s, events };
}

export function project(s: GameState, viewer: string): Projection {
  const revealed =
    s.pending?.kind === 'anxiety' && s.pending.actor === viewer ? s.pending.victim : undefined;
  return {
    version: s.revision,
    viewer,
    players: s.players.map((p) => {
      const { hand, ...publicPlayer } = p;
      return {
        ...structuredClone(publicPlayer),
        handCount: hand.length,
        ...(p.id === viewer || p.id === revealed ? { hand: [...hand] } : {}),
      };
    }),
    deckCount: s.deck.length,
    discardTop: s.discard.at(-1),
    discardCount: s.discard.length,
    active: s.active,
    turn: s.turn,
    phase: s.phase,
    plays: s.plays,
    pending: s.pending ? { ...s.pending } : undefined,
    winner: s.winner,
    clock: s.clock,
    blocked: { ...s.blocked },
  };
}
export function assertInvariants(s: GameState) {
  const physical = [
    ...s.deck,
    ...s.discard,
    ...s.players.flatMap((p) => [
      ...p.hand,
      ...p.psyche.flatMap((c) => [c.card, ...(c.drug ? [c.drug] : [])]),
    ]),
    ...(s.pending ? [s.pending.episode] : []),
  ];
  if (physical.length !== 89 || new Set(physical).size !== 89)
    throw new Error(`Card conservation failed: ${physical.length}/${new Set(physical).size}`);
  if (s.plays < 0 || s.plays > 2 || s.active < 0 || s.active >= s.players.length)
    throw new Error('Invalid turn counters');
  for (const p of s.players) {
    const ids = p.psyche.map((x) => definition(x.card).id);
    if (new Set(ids).size !== ids.length) throw new Error('Duplicate Psyche');
    for (const x of p.psyche)
      if (x.drug && !definition(x.drug).treats.includes(definition(x.card).id))
        throw new Error('Mismatched Drug');
  }
  if ((s.phase === 'pending') !== Boolean(s.pending)) throw new Error('Invalid pending phase');
}
export class GameEngine {
  state: GameState;
  commands: Command[] = [];
  events: GameEvent[] = [];
  constructor(public setup: Setup) {
    this.setup = structuredClone(setup);
    this.state = createState(setup);
    assertInvariants(this.state);
  }
  executeAction(cmd: Command) {
    const r = executeAction(this.state, cmd);
    this.state = r.state;
    this.commands.push(structuredClone(cmd));
    this.events.push(...r.events);
    return r.events;
  }
  getLegalActions(playerId: string) {
    return getLegalActions(this.state, playerId);
  }
  serializeGame() {
    return JSON.stringify({
      format: 'side-effects-save-1',
      setup: this.setup,
      commands: this.commands,
      state: this.state,
    });
  }
  static deserializeGame(raw: string) {
    if (raw.length > 8_000_000) throw new Error('Save is too large');
    const data = JSON.parse(raw);
    if (
      data.format !== 'side-effects-save-1' ||
      !Array.isArray(data.commands) ||
      data.commands.length > 50000
    )
      throw new Error('Unsupported save format');
    const e = new GameEngine(data.setup);
    for (const c of data.commands) e.executeAction(c);
    if (JSON.stringify(e.state) !== JSON.stringify(data.state))
      throw new Error('Snapshot does not match the validated replay');
    assertInvariants(e.state);
    return e;
  }
}
