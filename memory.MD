# Workspace memory

- Always read `agent.MD` and `memory.MD` before any task.
- User request: execute `Research.txt`, save the work log to `agent.MD`, and persistent memory to `memory.MD`.
- Project: browser multiplayer adaptation of Side Effects by Pillbox Games.
- Latest user request: execute `requirement.txt`. Its development instructions explicitly authorize implementation; the earlier research-only restriction is superseded for this task.
- Clearly distinguish VERIFIED RULE, INFERRED BEHAVIOR, and PROPOSED DIGITAL UX; never invent missing card text or evidence.

## Research saved on 2026-10-12

- Start with `research/README.md`, `research/research-verdict.md`, `research/unknown-rules.md` and `research/sources.md`. Canonical card data: `research/cards/cards.json`; `research/cards.json` is an identical compatibility copy.
- Baseline is provisionally the current English 89-card retail game: four categories, eight Disorder definitions, seven Drug definitions, Therapy and Episode. Historical Misdiagnosis/High Tolerance are excluded from baseline; no expansions/Hex Effects rules silently mixed in.
- VERIFIED broad rules: 2–5 seats start with four unique Disorders, 6–8 with three; four hidden hand cards each; draw two at ordinary turn start; up to two card plays; own-turn end hand limit six; clockwise turns; recycle shuffled discard when draw exhausted. Off-turn hand gifts are permitted, not off-turn card plays.
- Drug treats matching own Disorder persistently; side effects create opponent attack permissions, not automatic new Disorders. Duplicate names are forbidden even when treated. Therapy discards itself and an own untreated non-Tremors Disorder; Anorexia has no Drug. Episode targets an opponent untreated Disorder. Fully treated Psyche wins; clearing all cards is not required.
- Publisher's full 12-image booklet and 7 photographs are in `research/evidence`; game key verifies all 8 broad Episode effects and 7 Drug vulnerability mappings. Do not distribute those research reference assets as game artwork.
- Exact selected-edition literal card text and retail per-name multiplicities remain unverified. Historical counts are secondary evidence. All exact card-text JSON fields are null; do not interpret null as no effect.
- `research/rules-verification.json`: 35 verified, 7 inferred, 13 unknown out of 55 tracked claims (63.6%). `unknown-rules.md` contains 18 questions including continuous video-review limitation.
- Two videos inspected only through timestamped preview content (99 and 147 samples at ~10-second intervals). Captions empty, browser surfaces unavailable. Full continuous playback/audio, reactions, exact action chronology and win declaration remain outstanding; never claim they were watched continuously.
- Engine-critical gaps: one-round scheduling/expiry, repeated restrictions, curing source, Tremors timer and short hands, Gambling short hands, discard windows, pending bargains and off-turn hand cap, treated Drug target/stacking, winning boundary, both piles empty, order conventions and edition verification. Optional historical/continuation modes need separate rulings.
- Proposed architecture: framework-independent TypeScript engine, authoritative Node server, React DOM client, Socket.IO, serialized room writer, durable receipts/events/snapshots, strict viewer projections. No hidden hand/deck identities or seed to unauthorized clients. Gameplay state must not depend on animation completion.
- Validation command: `node research/validate-research.cjs`; last result passed with no artifact/link/JSON/reference errors. This validates research structure, not an unimplemented game engine.
- The earlier Phase 0 recommendation remains research history. Implementation is now authorized by the user request to do requirement.txt; unresolved original rules remain research gaps and are handled by the explicit digital profile.

## Playable implementation saved on 2026-10-12

- React/TypeScript/Vite + PixiJS canvas + Motion DOM game is now in src/. Local bots and private hotseat support 2-8 seats. There is no online backend/rooms yet; multiplayer-ready actor commands and privacy projections are implemented.
- requirement.txt is the master input. MASTER.md is an exact copy, created to satisfy its filename instruction. Read MASTER.md before architecture edits and docs/GAME_RULES.md before logic edits. Also read agent.MD and this file before every task.
- Rule source: docs/GAME_RULES.json, docs/GAME_RULES.md, docs/EDGE_CASES.md and data/cards/base.json. Digital profile 1 deliberately resolves timing/stacking/short-hand/cap/empty-pile choices without marking publisher research verified. Historical bonuses/expansions excluded. 17 definitions / provisional 89 copies.
- Engine: src/game/engine/GameEngine.ts. Pure createState, executeAction, getLegalActions, project, assertInvariants plus session wrapper. Seeded serializable RNG; command/effect commits before rendering; no DOM dependencies. Pending actor validation was regression-fixed for Tremors.
- Save format side-effects-save-1 includes setup + accepted commands + snapshot. Restore replays, checks snapshot and card invariants. Files contain hidden local information. Future server must authenticate actors, use trusted timer timestamps and transmit only projections/redacted events.
- Controller store is independent of React. Bots select from legal commands; future choices use engine RNG/revision/initial seed. Timer authority uses monotonic host timestamps; readiness precedes the 3-second Tremors deadline. Pending effects freeze gifting/other plays.
- Renderer owns canvas pointer drag exclusively. World scale uses min(viewport/1920x1080) with letterboxes. Algorithmic opponent slots and hand fan support all seat counts and large hands. DOM hand/target controls provide keyboard alternatives.
- Rendering is on demand while idle. Cached card textures and a cached frozen board reduce animation work. Queue supports await, pause, speed, cancel, skip and fast-forward; generation guards prevent old continuations from finalizing newer state. Dispose cancels timers/listeners/queue and removes canvas resources.
- Assets: src/assets/manifest.json, null means original vector placeholder. Do not distribute research publisher images as game art. Palette/layout/motion tokens are in src/config.
- Developer routes /dev/cards, /dev/animations; ?debug=true on game route. Rules/settings/history/saves/inspection/handoff/results implemented.
- Commands: npm run dev, npm run check, npm run simulate, npm run test:ui. If Windows npm shim breaks, use node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" with the same arguments. Vite polling avoids OneDrive EBUSY watcher crashes.
- Validation: 43 headless tests; 19 Playwright cases including 5 resolutions, all 7 seat counts, canvas drag, save/restore, hotseat privacy, complete match and mid-animation exit. Simulations 100/1000/10000 all won with zero crashes/caps/invariant failures; largest max turn 132. See docs/VALIDATION.md and artifacts/.
- Performance remains a material limitation: software-WebGL headless sample below 60 FPS despite caching; actual hardware 60 FPS has not been certified. Instant/reduced motion is playable. Do not claim all production Definition of Done criteria passed. Three route cycles returned to baseline DOM/canvas counts, not a full heap/GPU leak certification.
- Installed/applied skills in ~/.codex/skills: react-best-practices, composition-patterns, web-design-guidelines, frontend-design, animation-systems, optimize-web-animations. Sites portable local-preview workflow applied; no hosted site deployed.
- README.md provides launch/edit instructions; docs/ARCHITECTURE.md explains Pixi vs Phaser, dnd-kit omission, renderer authority boundary, save/replay and future multiplayer boundary.

- Hotseat Pass table switches the private viewer independently of turn ownership; off-turn card offers are supported and tested, with recipient end-turn cap enforced.

## GitHub publication

- User requested a public GitHub repository on 2026-10-12; publication is authorized. Local Git is initialized on main. Repository creation/push await GitHub account authentication.
- Portable tools: `%LOCALAPPDATA%/SideEffectTools/git/cmd/git.exe` and `%LOCALAPPDATA%/SideEffectTools/gh/bin/gh.exe`. Installed Git 2.56.0.windows.2 and gh 2.102.0. Use their absolute paths or add these directories to the current shell PATH; no global PATH changes were made.
- Keep downloaded research/evidence images, HTML, video metadata and captions out of the public Git repository. Its README and extraction helpers are tracked; public source URLs and observations remain available. The research validator also passes in a public checkout with no downloaded evidence.
- Never store authentication tokens/device codes in project files. Use GitHub CLI's account authentication and credential storage. No remote or completed push has been recorded yet.
- Initial local commit: 2489f51 on main, agent-authored as Codex <codex@localhost>. GitHub sign-in remains necessary; configure repo-local identity from the authenticated account for subsequent commits. Public contents were validated through an index-only export, with no third-party evidence downloads.
