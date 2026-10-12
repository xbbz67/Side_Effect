# Side Effects digital table

A desktop card game with local bots or private hotseat play for 2–8 players. Built with TypeScript, React, Vite, PixiJS and Motion. The 89-card retail baseline uses documented digital rulings for unresolved physical edge cases; it is not an edition-complete certified transcription.

## Run

Requires Node 22.12+ (tested on Node 24.19).

```powershell
npm ci
npm run dev
```

Open the printed localhost URL, normally **http://127.0.0.1:5173/**. A match starts from the lobby. Choose bots or local hotseat, 2–8 seats and an integer shuffle seed. Draw two, select a card and choose a highlighted target. Dragging, target buttons and keyboard selection all work. Press I to inspect, Esc to cancel. End your turn at six hand cards or fewer. In hotseat, Pass table privately switches hands without changing turn ownership so another player can offer a card off-turn.

Browser saves are under Save; exported files include all local hidden hands and accepted replay commands. Use Import save to restore a validated exported match. Saves are local, with no account/cloud service.

If PowerShell chooses a broken npm shim, run the equivalent with your installed npm CLI, e.g. `node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" run dev` on this machine.

## Checks and developer tools

```powershell
npm run check
npm run simulate
npx playwright install chromium
npm run test:ui
```

`simulate` runs 100, 1,000 and 10,000 seeded matches and writes `artifacts/simulations.json`. Engine tests need no browser. UI checks cover every desktop resolution and seat count, targeting/drag, saves, privacy, developer screens, animation teardown and an entire match.

- `/?debug=true`: phase, legal commands/IDs, resolution, scale, FPS sample, events and queue controls.
- `/dev/cards`: all 17 definitions, search, category filter, readable inspection and motion preview.
- `/dev/animations`: draw, discard, play, flip, hover, target, attack, side effect, Therapy, win, shuffle and deal; pause/restart/cancel/speed.
- `node scripts/qa-performance.mjs`: software-WebGL performance sample and repeated scene cleanup counts (start dev server first).
- `npm run build`: distributable static output in `dist/`; configure an SPA fallback to index.html for developer routes if hosting it.

## Edit safely

Read `agent.MD` and `memory.MD` before every workspace task. Read `MASTER.md` before architecture edits and `docs/GAME_RULES.md` before rule edits. Change card definitions in `data/cards/base.json`, rules in `docs/GAME_RULES.json`, and visual tokens in `src/config/`. Engine changes require tests and simulations; layout changes require the five resolution checks. Replacement art is configured through `src/assets/manifest.json`.

See [rules](docs/GAME_RULES.md), [edge cases](docs/EDGE_CASES.md), [architecture](docs/ARCHITECTURE.md), [animation specification](docs/ANIMATION_SPEC.md), [UI specification](docs/UI_UX_SPEC.md), and [validation evidence](docs/VALIDATION.md). Original research and its limitations remain in [research](research/README.md).

This version has no online rooms/backend, expansions or historical bonus cards. Artwork is replaceable original vector placeholder art; research reference images are not shipped. The 60 FPS target still needs hardware-browser verification; headless software WebGL measurements are recorded candidly in the validation report.
