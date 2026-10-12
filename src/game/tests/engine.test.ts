import { describe, it, expect } from 'vitest';
import {
  GameEngine,
  assertInvariants,
  createState,
  executeAction,
  getLegalActions,
  project,
  vulnerability,
} from '../engine/GameEngine';
import { cards, definition } from '../cards/CardRegistry';
import type { Command, GameState } from '../engine/GameState';
const setup = (n = 3) => ({
  seed: 739,
  players: Array.from({ length: n }, (_, i) => ({ name: `Seat ${i + 1}`, bot: false })),
});
function fixture(
  disorders: string[] = ['anxiety', 'tremors'],
  hand = ['therapy', 'episode', 'drug_anxiety'],
): GameState {
  const s = createState(setup(2));
  s.deck = cards.flatMap((c) => Array.from({ length: c.copies }, (_, i) => `${c.id}:${i + 1}`));
  s.discard = [];
  const take = (id: string) =>
    s.deck.splice(
      s.deck.findIndex((c) => definition(c).id === id),
      1,
    )[0];
  for (const p of s.players) {
    p.psyche = disorders.map((id) => ({ card: take(id) }));
    p.hand = [];
  }
  s.players[0].hand = hand.map(take);
  s.players[1].hand = ['therapy', 'episode', 'madness', 'anorexia'].map(take);
  s.phase = 'main';
  return s;
}
const play = (
  s: GameState,
  type: string,
  target = 0,
  disorder?: string,
): Extract<Command, { type: 'PLAY_CARD' }> => ({
  type: 'PLAY_CARD',
  playerId: 'P1',
  cardId: s.players[0].hand.find((c) => definition(c).id === type)!,
  targetPlayer: `P${target + 1}`,
  targetCard: disorder
    ? s.players[target].psyche.find((c) => definition(c.card).id === disorder)!.card
    : undefined,
});
function apply(s: GameState, c: Command) {
  const r = executeAction(s, c);
  assertInvariants(r.state);
  return r.state;
}
describe('deterministic core', () => {
  it.each([2, 3, 4, 5, 6, 7, 8])('sets up %i seats with conserved unique cards', (n) => {
    const s = createState(setup(n));
    assertInvariants(s);
    expect(s.players.every((p) => p.hand.length === 4 && p.psyche.length === (n < 6 ? 4 : 3))).toBe(
      true,
    );
    expect(s).toEqual(createState(setup(n)));
  });
  it('draws exactly two once, ends clockwise, rejects repeated draw', () => {
    let s = createState(setup());
    s = apply(s, { type: 'START_TURN', playerId: 'P1' });
    expect(s.players[0].hand).toHaveLength(6);
    expect(() => executeAction(s, { type: 'START_TURN', playerId: 'P1' })).toThrow();
    s = apply(s, { type: 'END_TURN', playerId: 'P1' });
    expect(s.active).toBe(1);
    expect(s.turn).toBe(2);
  });
  it('rejects wrong player, historical cards and malformed targets atomically', () => {
    const s = fixture();
    const before = JSON.stringify(s);
    for (const c of [
      { ...play(s, 'therapy', 0, 'anxiety'), playerId: 'P2' },
      { ...play(s, 'therapy', 0, 'anxiety'), targetPlayer: 'P9' },
      { ...play(s, 'therapy', 0, 'anxiety'), cardId: 'misdiagnosis:1' },
    ])
      expect(() => executeAction(s, c)).toThrow();
    expect(JSON.stringify(s)).toBe(before);
  });
  it('treats matching own only, unions vulnerabilities, forbids treated stacking', () => {
    let s = fixture();
    const c = play(s, 'drug_anxiety', 0, 'anxiety');
    expect(() => executeAction(s, { ...c, targetPlayer: 'P2' })).toThrow();
    s = apply(s, c);
    expect(vulnerability(s.players[0])).toEqual(['suicidal_thoughts', 'depression', 'madness']);
    expect(s.players[0].psyche[0].drug).toBeTruthy();
    expect(
      getLegalActions(s, 'P1').some(
        (a) =>
          a.type === 'PLAY_CARD' &&
          a.targetCard === c.targetCard &&
          definition(a.cardId).type === 'drug',
      ),
    ).toBe(false);
  });
  it('Therapy cannot remove Tremors or treated conditions, empty psyche wins', () => {
    let s = fixture(['anorexia'], ['therapy']);
    expect(() => executeAction(fixture(), play(fixture(), 'therapy', 0, 'tremors'))).toThrow();
    s = apply(s, play(s, 'therapy', 0, 'anorexia'));
    expect(s.winner).toBe('P1');
    expect(s.phase).toBe('won');
    expect(getLegalActions(s, 'P1')).toEqual([]);
  });
  it('winning with treatment does not require removing the Disorder', () => {
    let s = fixture(['anxiety'], ['drug_anxiety']);
    s = apply(s, play(s, 'drug_anxiety', 0, 'anxiety'));
    expect(s.winner).toBe('P1');
    expect(s.players[0].psyche).toHaveLength(1);
  });
  it('requires vulnerability and forbids duplicate Disorder attacks', () => {
    let s = fixture(['anxiety', 'tremors'], ['madness', 'drug_anxiety']);
    expect(
      getLegalActions(s, 'P1').some(
        (a) => a.type === 'PLAY_CARD' && definition(a.cardId).type === 'disorder',
      ),
    ).toBe(false);
    const d = s.deck.splice(
      s.deck.findIndex((c) => definition(c).id === 'drug_anxiety'),
      1,
    )[0];
    s.players[1].psyche[0].drug = d;
    s = apply(s, play(s, 'madness', 1));
    expect(s.players[1].psyche.some((x) => definition(x.card).id === 'madness')).toBe(true);
    expect(vulnerability(s.players[1])).toContain('madness');
  });
  it('enforces play budget, cap, voluntary discard, off-turn gift boundary', () => {
    let s = fixture(['anxiety', 'anorexia', 'madness'], ['therapy', 'therapy', 'therapy']);
    s = apply(s, play(s, 'therapy', 0, 'anxiety'));
    s = apply(s, play(s, 'therapy', 0, 'anorexia'));
    expect(getLegalActions(s, 'P1').some((a) => a.type === 'PLAY_CARD')).toBe(false);
    s = apply(s, {
      type: 'GIFT_CARD',
      playerId: 'P2',
      cardId: s.players[1].hand[0],
      targetPlayer: 'P1',
    });
    while (s.players[0].hand.length < 7) s.players[0].hand.push(s.deck.pop()!);
    expect(() => executeAction(s, { type: 'END_TURN', playerId: 'P1' })).toThrow();
    s = apply(s, { type: 'DISCARD_CARD', playerId: 'P1', cardId: s.players[0].hand[0] });
    expect(s.plays).toBe(2);
  });
  it('recycles discard deterministically and handles both piles empty', () => {
    let s = fixture();
    s.discard = s.deck;
    s.deck = [];
    s.phase = 'draw';
    s = apply(s, { type: 'START_TURN', playerId: 'P1' });
    expect(s.deck.length).toBeGreaterThan(0);
    s.players[1].hand.push(...s.deck);
    s.deck = [];
    s.phase = 'draw';
    const before = s.players[0].hand.length;
    s = apply(s, { type: 'START_TURN', playerId: 'P1' });
    expect(s.players[0].hand.length).toBe(before);
  });
  it('hides hands and deck, and grants Anxiety reveal only to inflictor', () => {
    let s = fixture(['anxiety', 'tremors'], ['episode']);
    const a = project(s, 'spectator');
    expect(a.players.every((p) => !p.hand)).toBe(true);
    expect('deck' in a).toBe(false);
    s = apply(s, play(s, 'episode', 1, 'anxiety'));
    expect(project(s, 'P1').players[1].hand).toBeDefined();
    expect(project(s, 'spectator').players[1].hand).toBeUndefined();
    s = apply(s, { type: 'RESOLVE', playerId: 'P1', cards: [], now: 0 });
    expect(project(s, 'P1').players[1].hand).toBeUndefined();
  });
  it('roundtrips saves and rejects tampered snapshots', () => {
    const e = new GameEngine(setup());
    e.executeAction({ type: 'START_TURN', playerId: 'P1' });
    e.executeAction({ type: 'END_TURN', playerId: 'P1' });
    expect(GameEngine.deserializeGame(e.serializeGame()).state).toEqual(e.state);
    const d = JSON.parse(e.serializeGame());
    d.state.rng++;
    expect(() => GameEngine.deserializeGame(JSON.stringify(d))).toThrow('Snapshot');
  });
});
describe('all Episode punishments', () => {
  it.each(['tremors', 'gambling_addiction', 'anxiety'])(
    '%s handles one-card and empty victim hands',
    (id) => {
      let s = fixture([id], ['episode']);
      s.deck.push(...s.players[1].hand.splice(1));
      s = apply(s, play(s, 'episode', 1, id));
      if (id === 'tremors') {
        expect(s.pending?.required).toBe(1);
        s = apply(s, { type: 'READY', playerId: 'P2', now: 0 });
        s = apply(s, { type: 'RESOLVE', playerId: 'P2', cards: [...s.players[1].hand], now: 1 });
      } else if (id === 'gambling_addiction')
        s = apply(s, { type: 'RESOLVE', playerId: 'P1', take: true, now: 0 });
      else s = apply(s, { type: 'RESOLVE', playerId: 'P1', cards: [s.players[1].hand[0]], now: 0 });
      expect(s.players[1].hand).toHaveLength(0);
      expect(s.pending).toBeUndefined();
      let empty = fixture([id], ['episode']);
      empty.deck.push(...empty.players[1].hand.splice(0));
      empty = apply(empty, play(empty, 'episode', 1, id));
      expect(empty.pending).toBeUndefined();
      expect(empty.phase).toBe('main');
    },
  );
  it('Madness removes every attached Drug, preserves Disorders', () => {
    let s = fixture(['madness', 'anxiety', 'tremors'], ['episode']);
    for (const x of s.players[1].psyche.slice(1)) {
      x.drug = s.deck.splice(
        s.deck.findIndex((c) => definition(c).id === `drug_${definition(x.card).id}`),
        1,
      )[0];
    }
    s = apply(s, play(s, 'episode', 1, 'madness'));
    expect(s.players[1].psyche.every((x) => !x.drug)).toBe(true);
    expect(s.players[1].psyche).toHaveLength(3);
  });
  it('Suicidal Thoughts discards the full hand', () => {
    let s = fixture(['suicidal_thoughts'], ['episode']);
    s = apply(s, play(s, 'episode', 1, 'suicidal_thoughts'));
    expect(s.players[1].hand).toHaveLength(0);
  });
  it.each([
    ['depression', 'skip'],
    ['impotence', 'play'],
    ['anorexia', 'draw'],
  ])('%s applies only next scheduled turn, refreshes and survives cure', (id, key) => {
    let s = fixture([id, 'tremors'], ['episode', 'episode']);
    s = apply(s, play(s, 'episode', 1, id));
    s = apply(s, play(s, 'episode', 1, id));
    expect(s.players[1].penalties[key as 'skip']).toBe(true);
    s = apply(s, { type: 'END_TURN', playerId: 'P1' });
    const n = s.players[1].hand.length;
    s = apply(s, { type: 'START_TURN', playerId: 'P2' });
    expect(s.players[1].penalties).toEqual({ skip: false, draw: false, play: false });
    if (key === 'skip') expect(s.active).toBe(0);
    else {
      expect(s.blocked[key as 'play']).toBe(true);
      expect(s.players[1].hand.length).toBe(n + (key === 'draw' ? 0 : 2));
    }
  });
  it('Tremors readiness, distinct selection, short hand, timeout and clock checks', () => {
    let s = fixture(['tremors'], ['episode']);
    s = apply(s, play(s, 'episode', 1, 'tremors'));
    expect(s.pending?.deadline).toBeUndefined();
    expect(getLegalActions(s, 'P1')).toEqual([]);
    s = apply(s, { type: 'READY', playerId: 'P2', now: 100 });
    expect(() =>
      executeAction(s, {
        type: 'RESOLVE',
        playerId: 'P2',
        cards: [s.players[1].hand[0], s.players[1].hand[0], s.players[1].hand[1]],
        now: 101,
      }),
    ).toThrow();
    s = apply(s, {
      type: 'RESOLVE',
      playerId: 'P2',
      cards: s.players[1].hand.slice(0, 3),
      now: 200,
    });
    expect(s.players[1].hand).toHaveLength(1);
    let t = fixture(['tremors'], ['episode']);
    t = apply(t, play(t, 'episode', 1, 'tremors'));
    t = apply(t, { type: 'READY', playerId: 'P2', now: 0 });
    expect(() => executeAction(t, { type: 'TIMEOUT', playerId: 'P2', now: 2999 })).toThrow();
    expect(() =>
      executeAction(t, {
        type: 'RESOLVE',
        playerId: 'P2',
        cards: t.players[1].hand.slice(0, 3),
        now: 3000,
      }),
    ).toThrow();
    t = apply(t, { type: 'TIMEOUT', playerId: 'P2', now: 3000 });
    expect(t.players[1].hand).toHaveLength(0);
  });
  it('Gambling optionally steals min3 without replacement, deterministic RNG', () => {
    let s = fixture(['gambling_addiction'], ['episode']);
    s = apply(s, play(s, 'episode', 1, 'gambling_addiction'));
    const decline = apply(s, { type: 'RESOLVE', playerId: 'P1', take: false, now: 0 });
    expect(decline.players[1].hand).toHaveLength(4);
    const taken = apply(s, { type: 'RESOLVE', playerId: 'P1', take: true, now: 0 });
    expect(taken.players[0].hand).toHaveLength(3);
    expect(taken.players[1].hand).toHaveLength(1);
    expect(taken).toEqual(apply(s, { type: 'RESOLVE', playerId: 'P1', take: true, now: 0 }));
  });
  it('Anxiety one-card theft rejects arbitrary IDs and ends reveal', () => {
    let s = fixture(['anxiety'], ['episode']);
    s = apply(s, play(s, 'episode', 1, 'anxiety'));
    expect(() =>
      executeAction(s, { type: 'RESOLVE', playerId: 'P1', cards: ['made-up'], now: 0 }),
    ).toThrow();
    s = apply(s, { type: 'RESOLVE', playerId: 'P1', cards: [s.players[1].hand[0]], now: 0 });
    expect(s.players[0].hand).toHaveLength(1);
    expect(s.pending).toBeUndefined();
  });
});
