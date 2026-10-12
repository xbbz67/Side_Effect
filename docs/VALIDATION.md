# Validation record — 2026-10-12

## Automated rules and layout checks

`npm run check`: 43 headless tests pass, strict TypeScript passes and the Vite production build succeeds. Tests cover setup at every seat count, deterministic draws/recycling, turn order and budgets, invalid commands/targets, Drug matching and vulnerability, Therapy/Tremors restriction, all eight Episode punishments, empty and short hands, timer deadlines, optional theft, gifts and cap boundaries, hidden projections, save replay/tamper rejection, victory, seat geometry, long fans and queue cancel/restart/skip sequencing.

No historical special card is fabricated: tests reject unsupported historical card IDs. These are digital-profile tests, not proof that unresolved physical rulings match the publisher.

## Simulation

| Seeded batch | Winners | Crashes | Cap hits | Max turn | Commands |
|---|---:|---:|---:|---:|---:|
| 100 | 100 | 0 | 0 | 80 | 9,154 |
| 1,000 | 1,000 | 0 | 0 | 82 | 92,110 |
| 10,000 | 10,000 | 0 | 0 | 132 | 913,809 |

Every accepted command was followed by conservation, uniqueness, valid attachment, turn-counter and pending-phase checks. Simulations cycle seat counts 2–8. Bots choose a random currently legal play when one exists; otherwise they discard to cap and end. Gifts are available to people but excluded from this simulation strategy to avoid deliberately prolonging play. A diagnostic limit would be recorded as a cap, never as a win. The largest batch took approximately 96 seconds. Raw evidence: `artifacts/simulations.json`.

## Browser and visual review

19 Playwright checks pass. The browser suite uses real controls, not direct state injection. A full two-seat match against a bot reached the result screen (seed 42, 17 turns, 62 commands in the saved screenshot).

Resolution checks at 1366×768, 1440×900, 1600×900, 1920×1080 and 2560×1440 cover visible controls, hand access, enlarged-preview bounds, modal fit, keyboard Escape and absence of page exceptions. Separate tests start a playable table at all seven seat counts, exercise actual canvas drag into a legal Disorder plus an invalid drop, save/reload/restore, hotseat privacy, catalogue search/type/deep-link/inspection, sandbox speed/pause/cancel, private off-turn hotseat gifts with recipient cap enforcement, and leaving during an active animation. Evidence: `artifacts/browser-results.json` and screenshots in `artifacts/`.

Visual reviews occurred after the basic table, interactions and final layout. Fixed draw/opponent and Psyche-heading overlaps, the footer intercepting Resume, card art colliding with long titles, small-table type labels, missing opponent monograms and result grammar. At eight seats the public mini-cards remain compact; full inspection and keyboard controls supply readable details. No mobile layout is implemented.

Vercel web-interface-guidelines review: controls named, forms labeled, keyboard alternatives, visible focus, noncolor treated/playable/selected labels, live status, focus-managed dialogs, Escape handling, reduced motion, explicit transform/opacity transitions and bounded inspection panels. Corrected the modal focus effect so timer updates do not continually steal keyboard focus. No automated WCAG certification is claimed.

## Performance and teardown

The first interaction probe showed roughly eight-second inspection delay in headless software rendering because the table rendered continuously. Demand rendering reduced that same interaction to roughly 30ms, with the rest of the probe completing in about 4 seconds. Static card surfaces are cached; the frozen board is composited during queued command animation; graphics are invalidated for interaction and new state. Hidden/paused animations stop drawing. Scene exit cancels old continuations and destroys the canvas.

Three repeated scene/lobby cycles returned to 102 DOM elements, zero canvases and zero image elements, identical to the baseline, with no page errors. This demonstrates observable cleanup, not absence of all JS/GPU leaks; heap allocation was not independently certified.

The headless Chromium software-WebGL animation sample remains below the approximate 60 FPS target. Before caching, it averaged about 9.3 RAF FPS; after card/table texture caching the final active-draw sample averaged 20.0 FPS, with a worst interval of 233.3ms and expensive transitions. The driver was confirmed as ANGLE SwiftShader. See `artifacts/performance.json` for the latest run. RAF averages include state transitions and are not a complete rendered-frame profiler. Hardware-browser 60 FPS verification remains outstanding. Reduced-motion/instant effects are fully playable and tested. Do not report this version as meeting every Definition of Done performance criterion.

`npm audit` reports zero vulnerabilities after replacing the initially vulnerable test-tool version. Build has a nonfatal Pixi chunk-size warning. The Sites installer helper encountered a Windows npm-shim path error; the standard npm CLI install completed successfully. Vite uses polling with research/test-artifact exclusions because OneDrive native watching raised EBUSY.

## Remaining boundaries

- Research gaps and provisional inventory remain documented; literal publisher card text and continuous video/audio review are not falsely marked verified.
- Placeholder vector artwork is original and replaceable; no publisher reference images ship in the bundle.
- Online rooms, invite links, authoritative backend and reconnect are future transport work, as described in the master spec's multiplayer-ready section.
- Hardware performance verification and final commissioned/licensed artwork remain outstanding before calling this an edition-faithful final production release.
