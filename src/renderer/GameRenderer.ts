import { Application, Container, Graphics, Rectangle, Sprite } from 'pixi.js';
import { LAYOUT } from '../config/layout.config';
import { UI } from '../config/ui.config';
import { ANIMATION } from '../config/animation.config';
import { createCard, text } from './cards/CardView';
import { handLayout, OpponentLayoutManager } from './layout/OpponentLayoutManager';
import { definition } from '../game/cards/CardRegistry';
import { AssetRegistry } from '../assets/AssetRegistry';
import type { GameController, RendererAdapter } from '../game/GameController';
import type { Command, GameEvent, Projection } from '../game/engine/GameState';
interface Position {
  x: number;
  y: number;
}
export class GameRenderer implements RendererAdapter {
  app = new Application();
  private board = new Container();
  private fx = new Container();
  private positions = new Map<string, Position>();
  private targets: { bounds: Rectangle; command: Command }[] = [];
  private projection?: Projection;
  private disposed = false;
  private signature = '';
  private dragging?: {
    node: Container;
    card: string;
    start: Position;
    origin: Position;
    moved: boolean;
  };
  private hoverTimer?: ReturnType<typeof setTimeout>;
  fps = 0;
  private hoverTweens = new Map<
    Container,
    { from: number; to: number; elapsed: number; rotation: number; lift: number }
  >();
  constructor(
    private controller: GameController,
    private onInspect: (cardId?: string) => void,
  ) {}
  async init(host: HTMLElement) {
    await this.app.init({
      width: LAYOUT.width,
      height: LAYOUT.height,
      resolution: Math.min(devicePixelRatio, 1.5),
      autoDensity: true,
      antialias: true,
      autoStart: false,
      backgroundAlpha: 0,
      preference: 'webgl',
    });
    if (this.disposed) {
      this.app.destroy(true, { children: true });
      return;
    }
    await AssetRegistry.load();
    if (this.disposed) {
      this.app.destroy(true, { children: true });
      return;
    }
    host.appendChild(this.app.canvas);
    this.app.canvas.setAttribute(
      'aria-label',
      'Side Effects card table. Use the hand and target buttons for keyboard play.',
    );
    this.app.canvas.setAttribute('role', 'img');
    this.app.stage.addChild(this.board, this.fx);
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = new Rectangle(0, 0, LAYOUT.width, LAYOUT.height);
    this.app.stage.on('globalpointermove', (e) => {
      const d = this.dragging;
      if (d) {
        if (Math.hypot(e.global.x - d.start.x, e.global.y - d.start.y) > 8) d.moved = true;
        if (d.moved) {
          d.node.position.set(
            d.origin.x + e.global.x - d.start.x,
            d.origin.y + e.global.y - d.start.y,
          );
          d.node.rotation = 0;
          d.node.scale.set(1.07);
          this.render();
        }
      }
    });
    this.app.stage.on('pointerup', (e) => this.release(e.global));
    this.app.stage.on('pointerupoutside', (e) => this.release(e.global));
    this.app.stage.on('pointertap', (e) => {
      if (e.target === this.app.stage) this.controller.cancel();
    });
    this.app.ticker.maxFPS = 60;
    this.app.ticker.add((t) => {
      this.fps = this.app.ticker.FPS;
      for (const [node, a] of this.hoverTweens) {
        a.elapsed += t.deltaMS;
        const u = ANIMATION.ease(Math.min(1, a.elapsed / ANIMATION.hover));
        if (!node.destroyed) {
          node.scale.set(a.from + (a.to - a.from) * u);
          node.y = a.lift + (a.to > 1 ? -LAYOUT.hoverLift * u : LAYOUT.hoverLift * (1 - u));
          node.rotation = a.rotation * (a.to > 1 ? 1 - u : u);
        }
        if (a.elapsed >= ANIMATION.hover) this.hoverTweens.delete(node);
      }
      if (!this.hoverTweens.size) this.app.stop();
    });
    document.addEventListener('visibilitychange', this.visibility);
    host.addEventListener('contextmenu', this.contextMenu);
    this.controller.attach(this);
  }
  private render() {
    if (!this.disposed && this.app.renderer) this.app.render();
  }
  private visibility = () => {
    if (document.hidden) this.app.stop();
    else if (this.hoverTweens.size) this.app.start();
    else this.render();
  };
  private contextMenu = (e: Event) => e.preventDefault();
  private release(point: Position) {
    const d = this.dragging;
    if (!d) return;
    this.dragging = undefined;
    if (d.moved) {
      this.signature = '';
      this.controller.select(d.card);
      const candidates = this.controller
        .getSnapshot()
        .legal.filter((a) => a.type === 'PLAY_CARD' && a.cardId === d.card);
      const target = this.targets.find(
        (t) =>
          t.bounds.contains(point.x, point.y) &&
          candidates.some((c) => JSON.stringify(c) === JSON.stringify(t.command)),
      );
      if (target) void this.controller.execute(target.command);
      else
        this.update(
          this.projection!,
          this.controller.getSnapshot().legal,
          this.controller.selected,
        );
    } else this.controller.select(d.card);
  }
  update(state: Projection, legal: Command[], selected?: string) {
    if (!this.app.renderer || this.disposed) return;
    const signature = `${state.version}|${state.viewer}|${selected ?? ''}|${legal.length}`;
    if (this.signature === signature) return;
    this.signature = signature;
    this.board.cacheAsTexture(false);
    this.projection = state;
    this.dragging = undefined;
    this.hoverTweens.clear();
    this.positions.clear();
    this.targets = [];
    for (const c of this.board.removeChildren()) c.destroy({ children: true });
    const { felt, deep, yellow, paper } = UI.colors;
    const backgroundTexture = AssetRegistry.get('ui.table.background');
    if (backgroundTexture) {
      const background = new Sprite(backgroundTexture);
      background.anchor.set(0.5);
      background.position.set(LAYOUT.width / 2, LAYOUT.height / 2);
      background.scale.set(
        Math.max(LAYOUT.width / backgroundTexture.width, LAYOUT.height / backgroundTexture.height),
      );
      this.board.addChild(background);
    }
    this.board.addChild(
      new Graphics()
        .ellipse(960, 526, 885, 472)
        .fill({ color: 0x0c2623, alpha: 0.32 })
        .stroke({ color: yellow, width: 1, alpha: 0.15 }),
    );
    this.board.addChild(
      new Graphics()
        .ellipse(960, 512, 864, 455)
        .fill(felt)
        .stroke({ color: yellow, width: 1, alpha: 0.22 }),
    );
    for (let i = 0; i < 30; i++) {
      const x = 120 + ((i * 173) % 1690),
        y = 155 + ((i * 137) % 680);
      this.board.addChild(new Graphics().circle(x, y, 1).fill({ color: paper, alpha: 0.12 }));
    }
    const logo = text('SIDE EFFECTS', 960, 507, 22, yellow, undefined, UI.body);
    logo.anchor.x = 0.5;
    logo.alpha = 0.35;
    this.board.addChild(logo);
    const own = state.players.find((p) => p.id === state.viewer);
    const others = state.players.filter((p) => p.id !== state.viewer);
    const slots = OpponentLayoutManager(others.length + 1);
    others.forEach((p, i) => {
      const l = slots[i];
      this.positions.set(p.id, { x: l.x, y: l.y + 58 });
      const active = state.players[state.active].id === p.id;
      const ring = new Graphics()
        .roundRect(l.x - l.width / 2 - 7, l.y - 83, l.width + 14, 237, 18)
        .fill({ color: deep, alpha: 0.27 })
        .stroke({
          color: active ? yellow : paper,
          width: active ? 2 : 1,
          alpha: active ? 0.8 : 0.12,
        });
      this.board.addChild(ring);
      const name = text(
        `${active ? '▶ ' : ''}${p.name}`,
        l.x,
        l.y - 67,
        21,
        paper,
        undefined,
        UI.body,
      );
      name.anchor.x = 0.5;
      if (name.width > l.width - 55) name.scale.set((l.width - 55) / name.width);
      this.board.addChild(name);
      const avatarX = l.x - l.width / 2 + 20;
      this.board.addChild(
        new Graphics().circle(avatarX, l.y - 57, 13).fill({ color: paper, alpha: 0.15 }),
      );
      const avatar = text(
        p.name[0].toUpperCase(),
        avatarX,
        l.y - 64,
        14,
        yellow,
        undefined,
        UI.body,
      );
      avatar.anchor.x = 0.5;
      this.board.addChild(avatar);
      const untreated = p.psyche.filter((c) => !c.drug).length;
      const sub = text(
        `${p.handCount} in hand  /  ${untreated} untreated`,
        l.x,
        l.y - 38,
        15,
        yellow,
        undefined,
        UI.body,
      );
      sub.anchor.x = 0.5;
      this.board.addChild(sub);
      const w = Math.min(86, (l.width - 12) / Math.max(1, p.psyche.length) - 5);
      p.psyche.forEach((condition, j) => {
        const x = l.x + (j - (p.psyche.length - 1) / 2) * (w + 5);
        const y = l.y + 55;
        const card = createCard(condition.card, w, 139, { mini: true, treated: !!condition.drug });
        card.position.set(x, y);
        this.addTarget(card, condition.card, p.id, legal, selected, w, 139, condition.drug);
        this.board.addChild(card);
        if (condition.drug) this.positions.set(condition.drug, { x, y: y - 20 });
      });
      const statuses = Object.entries(p.penalties)
        .filter(([, v]) => v)
        .map(([k]) => (k === 'skip' ? 'Skip next' : k === 'draw' ? 'No draw' : 'No play'))
        .join(' • ');
      if (statuses) {
        const status = text(statuses, l.x, l.y + 132, 14, yellow, undefined, UI.body);
        status.anchor.x = 0.5;
        this.board.addChild(status);
      }
      const disorderAction = legal.find(
        (a) =>
          a.type === 'PLAY_CARD' &&
          a.cardId === selected &&
          a.targetPlayer === p.id &&
          !a.targetCard,
      );
      if (disorderAction) {
        this.highlight(l.x, l.y + 45, l.width + 10, 230);
        ring.eventMode = 'static';
        ring.cursor = 'crosshair';
        ring.on('pointertap', () => void this.controller.execute(disorderAction));
        this.targets.push({
          bounds: new Rectangle(l.x - l.width / 2 - 7, l.y - 83, l.width + 14, 237),
          command: disorderAction,
        });
      }
    });
    const deck = createCard(undefined, 140, 210);
    deck.position.set(LAYOUT.deck.x, LAYOUT.deck.y);
    deck.rotation = -0.06;
    this.board.addChild(deck);
    const discard = createCard(state.discardTop, 140, 210);
    discard.position.set(LAYOUT.discard.x, LAYOUT.discard.y);
    discard.rotation = 0.08;
    this.board.addChild(discard);
    [
      ['Draw pile', state.deckCount, LAYOUT.deck.x],
      ['Discard', state.discardCount, LAYOUT.discard.x],
    ].forEach(([label, count, x]) => {
      const t = text(`${label}  ${count}`, Number(x), 570, 18, paper, undefined, UI.body);
      t.anchor.x = 0.5;
      this.board.addChild(t);
    });
    if (state.phase === 'draw' && state.players[state.active].id === state.viewer) {
      deck.eventMode = 'static';
      deck.cursor = 'pointer';
      deck.on(
        'pointertap',
        () => void this.controller.execute({ type: 'START_TURN', playerId: state.viewer }),
      );
      this.highlight(LAYOUT.deck.x, LAYOUT.deck.y, 152, 222);
    }
    if (own) {
      this.positions.set(own.id, { x: 960, y: LAYOUT.psycheY });
      const label = text(`${own.name}'s Psyche`, 960, 594, 20, paper, undefined, UI.body);
      label.anchor.x = 0.5;
      this.board.addChild(label);
      const gap = Math.min(156, 1100 / Math.max(own.psyche.length, 1));
      own.psyche.forEach((condition, i) => {
        const x = 960 + (i - (own.psyche.length - 1) / 2) * gap;
        const card = createCard(condition.card, 136, 168, {
          mini: true,
          treated: !!condition.drug,
        });
        card.position.set(x, LAYOUT.psycheY + 42);
        this.addTarget(card, condition.card, own.id, legal, selected, 136, 168, condition.drug);
        this.board.addChild(card);
        if (condition.drug) {
          this.positions.set(condition.drug, { x, y: LAYOUT.psycheY });
          const tab = text('Rx', x + 43, LAYOUT.psycheY + 98, 16, paper, undefined, UI.body);
          this.board.addChild(tab);
        }
      });
      const hand = own.hand ?? [];
      const fan = handLayout(hand.length);
      hand.forEach((id, i) => {
        const available = legal.some((a) => a.type === 'PLAY_CARD' && a.cardId === id);
        const card = createCard(id, LAYOUT.cardWidth, LAYOUT.cardHeight, {
          playable: available,
          selected: id === selected,
        });
        card.position.set(fan[i].x, fan[i].y - (id === selected ? 20 : 0));
        card.rotation = id === selected ? 0 : fan[i].rotation;
        this.positions.set(id, { x: card.x, y: card.y });
        if (!available) card.alpha = 0.86;
        this.board.addChild(card);
        card.eventMode = 'static';
        card.cursor = available ? 'grab' : 'pointer';
        card.on('pointerover', () => {
          if (this.dragging) return;
          this.board.cacheAsTexture(false);
          card.zIndex = 100;
          this.board.sortableChildren = true;
          if (!this.controller.reduced)
            this.hoverTweens.set(card, {
              from: card.scale.x,
              to: 1.07,
              elapsed: 0,
              rotation: fan[i].rotation,
              lift: fan[i].y,
            });
          if (!this.controller.reduced) this.app.start();
          clearTimeout(this.hoverTimer);
          this.hoverTimer = setTimeout(() => this.onInspect(id), 420);
        });
        card.on('pointerout', () => {
          clearTimeout(this.hoverTimer);
          if (!this.dragging) {
            card.zIndex = i;
            if (!this.controller.reduced)
              this.hoverTweens.set(card, {
                from: card.scale.x,
                to: 1,
                elapsed: 0,
                rotation: fan[i].rotation,
                lift: fan[i].y,
              });
            if (!this.controller.reduced) this.app.start();
            this.onInspect(undefined);
          }
        });
        card.on('rightclick', () => this.onInspect(id));
        card.on('pointerdown', (e) => {
          if (e.button !== 0 || this.controller.busy) return;
          clearTimeout(this.hoverTimer);
          this.onInspect(undefined);
          card.zIndex = 200;
          this.dragging = {
            node: card,
            card: id,
            start: { x: e.global.x, y: e.global.y },
            origin: { x: card.x, y: card.y },
            moved: false,
          };
        });
      });
    }
    this.render();
  }
  private addTarget(
    card: Container,
    cardId: string,
    playerId: string,
    legal: Command[],
    selected: string | undefined,
    w: number,
    h: number,
    attachedDrug?: string,
  ) {
    this.positions.set(cardId, { x: card.x, y: card.y });
    const action = legal.find(
      (a) =>
        a.type === 'PLAY_CARD' &&
        a.cardId === selected &&
        a.targetPlayer === playerId &&
        a.targetCard === cardId,
    );
    if (selected && !action) card.alpha = 0.55;
    card.eventMode = 'static';
    card.cursor = action ? 'crosshair' : selected ? 'default' : 'help';
    card.on('pointerover', () => {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = setTimeout(() => this.onInspect(attachedDrug ?? cardId), 420);
    });
    card.on('pointerout', () => {
      clearTimeout(this.hoverTimer);
      this.onInspect(undefined);
    });
    card.on('rightclick', () => this.onInspect(attachedDrug ?? cardId));
    card.on('pointertap', () => {
      if (action) void this.controller.execute(action);
      else if (!selected) this.onInspect(attachedDrug ?? cardId);
    });
    if (action) {
      this.highlight(card.x, card.y, w + 8, h + 8);
      this.targets.push({
        bounds: new Rectangle(card.x - w / 2, card.y - h / 2, w, h),
        command: action,
      });
    }
  }
  private highlight(x: number, y: number, w: number, h: number) {
    this.board.addChild(
      new Graphics()
        .roundRect(x - w / 2, y - h / 2, w, h, 12)
        .stroke({ color: UI.colors.yellow, width: 3 }),
    );
  }
  async animate(event: GameEvent, signal: AbortSignal) {
    if (this.disposed || this.controller.reduced) return;
    // During a command the table is visually frozen; composite it once, then
    // move only the effect layer. Interactive transforms uncache on hover.
    this.board.cacheAsTexture({ resolution: 1, antialias: false });
    const { queue } = this.controller;
    const target = this.positions.get(
      event.targetCard ?? event.targetPlayer ?? event.playerId ?? '',
    ) ?? { x: 960, y: 440 };
    if (event.type === 'SANDBOX_FLIP' || event.type === 'SANDBOX_HOVER') {
      const card = createCard(event.cardId);
      this.fx.addChild(card);
      card.position.set(960, 440);
      await queue.tween(
        event.type === 'SANDBOX_FLIP' ? ANIMATION.flip : ANIMATION.pickup * 2,
        (t) => {
          if (event.type === 'SANDBOX_FLIP') card.scale.x = Math.abs(Math.cos(t * Math.PI));
          else {
            card.y = 440 - Math.sin(t * Math.PI) * 20;
            card.scale.set(1 + Math.sin(t * Math.PI) * 0.07);
          }
          this.render();
        },
        signal,
      );
      if (!card.destroyed) card.destroy({ children: true });
      this.render();
      return;
    }
    if (['CARD_DRAWN', 'CARD_PLAYED', 'CARD_DISCARDED', 'DECK_SHUFFLED'].includes(event.type)) {
      const draw = event.type === 'CARD_DRAWN',
        played = event.type === 'CARD_PLAYED',
        shuffle = event.type === 'DECK_SHUFFLED';
      const own = event.playerId === this.projection?.viewer;
      const visible = !(draw && !own);
      const card = createCard(visible ? event.cardId : undefined, 136, 200);
      const source = draw
        ? LAYOUT.deck
        : shuffle
          ? LAYOUT.discard
          : (this.positions.get(event.cardId ?? '') ?? { x: 960, y: 900 });
      let destination = draw
        ? own
          ? { x: 960, y: LAYOUT.handY }
          : target
        : shuffle
          ? LAYOUT.deck
          : LAYOUT.discard;
      if (played && event.cardId && ['drug', 'disorder'].includes(definition(event.cardId).type))
        destination = target;
      this.fx.addChild(card);
      await queue.tween(
        draw ? ANIMATION.play : ANIMATION.play + ANIMATION.flip,
        (t) => {
          const ease = ANIMATION.ease(t);
          const center = { x: 960, y: 455 };
          const split = played ? 0.55 : 0;
          if (played && t < split) {
            const u = ANIMATION.ease(t / split);
            card.position.set(
              source.x + (center.x - source.x) * u,
              source.y + (center.y - source.y) * u,
            );
            card.scale.set(1 + u * 0.16);
          } else {
            const u = played ? ANIMATION.ease((t - split) / (1 - split)) : ease;
            const from = played ? center : source;
            card.position.set(
              from.x + (destination.x - from.x) * u,
              from.y + (destination.y - from.y) * u - Math.sin(u * Math.PI) * 45,
            );
            card.scale.set(played ? 1.16 - u * 0.16 : 1);
          }
          card.rotation = Math.sin(t * Math.PI) * 0.12;
          this.render();
        },
        signal,
      );
      if (!card.destroyed) card.destroy({ children: true });
      this.render();
    } else {
      const ring = new Graphics();
      this.fx.addChild(ring);
      const color = event.type === 'EPISODE_TRIGGERED' ? UI.colors.red : UI.colors.yellow;
      await queue.tween(
        event.type === 'PLAYER_WON' ? ANIMATION.effect : ANIMATION.target,
        (t) => {
          ring
            .clear()
            .circle(target.x, target.y, 30 + t * 85)
            .stroke({ color, width: 4, alpha: 1 - t });
          if (event.type === 'THERAPY_USED')
            ring
              .circle(target.x, target.y, 65 - t * 30)
              .stroke({ color: UI.colors.paper, width: 2, alpha: 1 - t });
          this.render();
        },
        signal,
      );
      if (!ring.destroyed) ring.destroy();
      this.render();
    }
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    clearTimeout(this.hoverTimer);
    document.removeEventListener('visibilitychange', this.visibility);
    if (this.app.renderer) {
      this.app.canvas.removeEventListener('contextmenu', this.contextMenu);
      this.app.destroy(true, { children: true });
    }
  }
}
