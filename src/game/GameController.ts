import { GameEngine, getLegalActions, project } from './engine/GameEngine';
import type { Command, GameEvent, Projection, Setup } from './engine/GameState';
import { chooseBotAction } from './simulation/bot';
import { AnimationQueue } from '../renderer/animations/AnimationQueue';
import { AudioManager } from '../audio/AudioManager';
export interface RendererAdapter {
  update: (state: Projection, legal: Command[], selected?: string) => void;
  animate: (event: GameEvent, signal: AbortSignal) => Promise<void>;
  dispose: () => void;
}
export interface ControllerView {
  projection: Projection;
  legal: Command[];
  selected?: string;
  error?: string;
  notice: string;
  busy: boolean;
  handoff: boolean;
  history: GameEvent[];
  queueVersion: number;
}
export class GameController {
  engine: GameEngine;
  queue = new AnimationQueue();
  audio = new AudioManager();
  renderer?: RendererAdapter;
  viewer = 'P1';
  selected?: string;
  handoff = false;
  busy = false;
  notice = 'Draw two cards to begin your turn.';
  error?: string;
  reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  private listeners = new Set<() => void>();
  private snapshot!: ControllerView;
  private botRng = { value: 8371 };
  private botTimer?: ReturnType<typeof setTimeout>;
  private timeout?: ReturnType<typeof setInterval>;
  private epoch = performance.now();
  private disposed = false;
  private queueVersion = 0;
  private visualProjection?: Projection;
  private actionGeneration = 0;
  constructor(setup: Setup) {
    this.engine = new GameEngine(setup);
    this.viewer = this.engine.state.players.find((p) => !p.bot)?.id ?? 'spectator';
    this.queue.subscribe(() => {
      this.queueVersion++;
      this.publish();
    });
    this.publish();
    this.timeout = setInterval(() => this.checkTimer(), 80);
  }
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  getSnapshot = () => this.snapshot;
  now() {
    return Math.max(this.engine.state.clock, Math.round(performance.now() - this.epoch));
  }
  attach(renderer: RendererAdapter) {
    this.renderer = renderer;
    this.publish();
    this.scheduleBot();
  }
  private publish() {
    if (this.disposed) return;
    const projection = project(this.engine.state, this.handoff ? 'spectator' : this.viewer);
    const legal = this.handoff ? [] : getLegalActions(this.engine.state, this.viewer);
    this.snapshot = {
      projection,
      legal,
      selected: this.selected,
      error: this.error,
      notice: this.notice,
      busy: this.busy,
      handoff: this.handoff,
      history: this.engine.events.map((e) =>
        e.privateTo && !e.privateTo.includes(this.viewer) ? { ...e, cardId: undefined } : e,
      ),
      queueVersion: this.queueVersion,
    };
    this.renderer?.update(
      this.visualProjection ?? projection,
      this.busy ? [] : legal,
      this.selected,
    );
    for (const f of this.listeners) f();
  }
  select(cardId?: string) {
    if (this.busy || this.handoff) return;
    this.selected = cardId;
    this.error = undefined;
    const legal = getLegalActions(this.engine.state, this.viewer).filter(
      (a) => a.type === 'PLAY_CARD' && a.cardId === cardId,
    );
    this.notice = cardId
      ? legal.length
        ? 'Choose a highlighted target, or press Esc to cancel.'
        : 'This card has no legal play now. You can inspect, discard or give it.'
      : this.defaultNotice();
    this.audio.play('ui');
    this.publish();
  }
  cancel() {
    this.selected = undefined;
    this.error = undefined;
    this.notice = this.defaultNotice();
    this.publish();
  }
  private defaultNotice() {
    const s = this.engine.state;
    if (s.pending)
      return s.pending.kind === 'tremors'
        ? 'Tremors: the victim must resolve the timed discard.'
        : 'Resolve the Episode choice.';
    if (s.phase === 'draw')
      return s.players[s.active].id === this.viewer
        ? 'Draw two cards to begin your turn.'
        : `${s.players[s.active].name} is about to draw.`;
    if (s.phase === 'won') return 'The match is complete.';
    if (s.players[s.active].id !== this.viewer)
      return `${s.players[s.active].name}'s turn. You may offer a card.`;
    return s.blocked.play
      ? 'Impotence: no plays this turn. Discard to six, then end.'
      : `Play up to ${2 - s.plays} more cards, or end your turn.`;
  }
  async execute(command: Command) {
    if (this.disposed || this.busy) return;
    this.error = undefined;
    const generation = ++this.actionGeneration;
    try {
      this.audio.unlock();
      const before = project(this.engine.state, this.viewer);
      const events = this.engine.executeAction(command);
      this.selected = undefined;
      this.notice = events.at(-1)?.text ?? this.defaultNotice();
      this.visualProjection = before;
      this.busy = true;
      this.publish();
      // Authority has committed. Renderer uses previous projection only for travel origins.
      if (this.renderer && !this.reduced) {
        this.renderer.update(before, [], undefined);
        await this.queue.enqueue(
          events
            .filter((e) =>
              [
                'CARD_DRAWN',
                'CARD_PLAYED',
                'DRUG_APPLIED',
                'THERAPY_USED',
                'EPISODE_TRIGGERED',
                'SIDE_EFFECT_TRIGGERED',
                'PLAYER_WON',
                'DECK_SHUFFLED',
                'TURN_STARTED',
                'CARD_DISCARDED',
              ].includes(e.type),
            )
            .map((e) => ({ label: e.type, run: (signal) => this.renderer!.animate(e, signal) })),
        );
      }
      if (generation !== this.actionGeneration || this.disposed) return;
      this.visualProjection = undefined;
      this.audio.play(events.some((e) => e.type === 'EPISODE_TRIGGERED') ? 'effect' : 'card');
      this.busy = false;
      this.ensureViewer();
      this.notice = this.defaultNotice();
      this.publish();
      this.scheduleBot();
    } catch (e) {
      if (generation !== this.actionGeneration || this.disposed) return;
      this.visualProjection = undefined;
      this.busy = false;
      this.queue.cancel();
      this.error = e instanceof Error ? e.message : String(e);
      this.notice = 'Action could not finish. Check the target and current turn.';
      this.publish();
      this.scheduleBot();
    }
  }
  private ensureViewer() {
    const s = this.engine.state;
    const actor = s.pending
      ? s.pending.kind === 'tremors'
        ? s.pending.victim
        : s.pending.actor
      : s.players[s.active].id;
    const p = s.players.find((p) => p.id === actor);
    if (p && !p.bot && p.id !== this.viewer) {
      this.viewer = p.id;
      this.handoff = true;
    }
  }
  reveal() {
    this.handoff = false;
    this.notice = this.defaultNotice();
    this.publish();
    this.scheduleBot();
  }
  switchViewer(playerId: string) {
    if (this.busy || this.engine.state.phase !== 'main' || this.engine.state.pending) return;
    if (!this.engine.state.players.some((p) => p.id === playerId && !p.bot)) return;
    this.viewer = playerId;
    this.selected = undefined;
    this.handoff = true;
    this.publish();
  }
  fastForward() {
    this.actionGeneration++;
    this.visualProjection = undefined;
    this.queue.fastForward();
    this.busy = false;
    this.ensureViewer();
    this.notice = this.defaultNotice();
    this.publish();
    this.scheduleBot();
  }
  private scheduleBot() {
    clearTimeout(this.botTimer);
    if (this.disposed || this.busy || this.handoff) return;
    const s = this.engine.state;
    if (s.phase === 'won') return;
    const actor = s.pending
      ? s.pending.kind === 'tremors'
        ? s.pending.victim
        : s.pending.actor
      : s.players[s.active].id;
    if (!s.players.find((p) => p.id === actor)?.bot) return;
    this.botTimer = setTimeout(
      () => {
        this.botRng.value =
          (this.engine.state.rng ^ this.engine.state.revision ^ this.engine.setup.seed) >>> 0 ||
          8371;
        const a = chooseBotAction(this.engine.state, actor, this.botRng);
        if (a) {
          if ('now' in a) a.now = this.now();
          void this.execute(a);
        }
      },
      this.reduced ? 25 : 360,
    );
  }
  private checkTimer() {
    const s = this.engine.state;
    if (
      s.pending?.kind === 'tremors' &&
      s.pending.deadline !== undefined &&
      this.now() >= s.pending.deadline
    ) {
      if (this.busy) this.fastForward();
      void this.execute({ type: 'TIMEOUT', playerId: s.pending.victim, now: this.now() });
    }
  }
  restore(raw: string) {
    const engine = GameEngine.deserializeGame(raw);
    this.actionGeneration++;
    this.visualProjection = undefined;
    this.queue.cancel();
    clearTimeout(this.botTimer);
    this.engine = engine;
    this.viewer = engine.state.players.find((p) => !p.bot)?.id ?? 'spectator';
    this.epoch = performance.now() - engine.state.clock;
    this.selected = undefined;
    this.busy = false;
    this.handoff = false;
    this.ensureViewer();
    this.notice = this.defaultNotice();
    this.publish();
    this.scheduleBot();
  }
  dispose() {
    this.disposed = true;
    clearTimeout(this.botTimer);
    clearInterval(this.timeout);
    this.queue.cancel();
    this.renderer?.dispose();
    this.renderer = undefined;
    this.audio.dispose();
    this.listeners.clear();
  }
}
