# Runtime architecture

`requirement.txt` is the user master spec; `MASTER.md` is its exact copy, created because the spec explicitly requires that filename. Read both workspace memory files before work, MASTER before architecture changes and GAME_RULES before rule changes.

## Rendering decision

React + TypeScript + Vite are the requested foundation. PixiJS provides the scene graph, WebGL rendering, graphics, text, sprites and pointer hit testing this card table needs. Phaser's scene lifecycle, cameras, physics and game-oriented systems are useful for scene-heavy games, but add unused systems here. We chose PixiJS and keep the rules independent of either library. Primary references: [Pixi Application](https://pixijs.com/8.x/guides/components/application), [Pixi events](https://pixijs.com/8.x/guides/components/events), [Phaser scenes](https://docs.phaser.io/phaser/concepts/scenes).

Motion owns DOM overlays and catalogue interactions. Pixi owns the table and card drags. dnd-kit was evaluated and omitted because no live game card is a DOM drag object. The small external controller store uses React `useSyncExternalStore`; Zustand would add another state owner without a need here. Heavy renderer and developer screens are lazy imports. Pixi is a separate chunk; its current roughly 593KB minified chunk causes a nonfatal Vite size warning, with about 173KB gzip.

## Module boundaries

`game/engine` consumes normalized rule JSON and CardRegistry, with no DOM or rendering dependencies. Commands contain actor, physical card and target IDs. The pure executor validates before cloning/mutating, uses a serializable xorshift RNG state and returns committed state + ordered events. Illegal commands preserve state and RNG.

`GameController` owns the engine session, UI subscriptions, host monotonic clock, bot scheduling, audio and event-to-animation pacing. Engine state commits before rendering. Canvas holds the pre-command projection while queued effects travel, then snaps to the committed projection. Skip/cancel invalidates old continuations; an old animation cannot consume or finalize a newer command. Animation errors retain the committed state and surface an error.

`renderer` handles cards, targets, hand fan and algorithmic opponent placement at 1920×1080. Uniform `min(viewport/design)` scale keeps the world and DOM HUD aligned with letterboxes. Cards cache their static graphics as textures; during command visualization the frozen table is composited into a texture. Transform changes and new state invalidate the appropriate cache. Static canvas uses demand rendering, not a permanent render loop. Pointer hover starts/stops its own bounded ticker; queue tweens use RAF, stop drawing when paused/hidden, and are canceled on teardown. Pixi documents the [cache-as-texture tradeoff](https://pixijs.com/8.x/guides/components/scene-objects/container/cache-as-texture).

`ui` contains lobby, public HUD, readable inspection, target and keyboard controls, settings, focus-managed dialogs, history, privacy handoff and results. The game hand and target controls provide a click/keyboard alternative to dragging. Hotseat Pass table switches the private viewer independently from active player; off-turn gifts return through a privacy handoff. Anonymous projections hide every hand; player projections include only that player's hand, except temporary Anxiety permission for its inflictor. The local controller contains full match state because this is an offline game.

## Save, replay and multiplayer boundary

Save format `side-effects-save-1` contains setup, accepted commands and snapshot. Restore constructs the original seeded setup, replays each command, compares the resulting snapshot and checks card/phase invariants. Engine clock inputs are part of replay. Controller bot decisions are seeded from current engine RNG + revision + initial seed so restore resumes from reconstructable inputs.

An online implementation must authenticate actors, stamp timer commands at the host, execute commands through a serialized room authority, redact events and transmit projections rather than full state, persist snapshots/receipts and implement reconnect. Those future transport pieces are not implemented. No real rooms, invite links, backend or spectator connections are claimed.

## Assets and skills

`src/assets/manifest.json` supports replacement card art, deck back and table background without rule edits. Null entries select original code-generated vector placeholders. Use a path under `public/assets/`, e.g. `/assets/cards/anxiety.webp`; preserve aspect ratio. Shared loaded textures live at the AssetRegistry level; scene-owned generated caches are destroyed with their containers. Publisher research images stay under research and are not bundled into the game.

Installed and applied: Vercel react-best-practices, composition-patterns, web-design-guidelines; Anthropic frontend-design; MengTo animation-systems and optimize-web-animations. The Sites skill's portable local preview workflow was applied to this IDE repository. The user's explicit Vite stack takes precedence over its recommended site starter. No hosted deployment was requested; the result stays in the workspace.
