# Gated implementation plan — no implementation authorized yet

This plan is created after the current evidence synthesis. **Research.txt is not fully resolved:** unknown timing/copy counts and continuous video review remain. Phase 0 is the next research step. Production work starts only after the user explicitly instructs implementation and Phase 0 gates are met.

| Phase | Objectives | Future files/modules | Dependencies | Tests/review | Definition of done |
|---|---|---|---|---|---|
| **0 — Verified rules database** | Select printing; inventory cards; resolve U01–U12/U15–U17; continuously review video/audio; document digital policies separately | `research/cards`, `sources`, `unknown-rules`, edition profile and policy decision records | Primary booklet/copy photos; accessible full videos; publisher rulings where necessary | Card counts, mappings, source links, contradictory timing review; every effect has an oracle | Complete functional edition database; no unknown engine-critical field; policy/edition version locked; research limitations addressed |
| **1 — Headless engine** | Implement setup, validation, targeting, effects, phase manager and winning predicate independent of UI | `/game-engine/{cards,effects,validation,reducer,turn-manager,win-condition,targeting,projection}` | Phase 0; explicit implementation instruction | Minimal meaningful rule fixtures and conservation checks | Every approved card action/choice resolves deterministically; unknown profiles disabled; no UI/network imports |
| **2 — Automated engine tests** | Build published-rule oracles and generated legal-sequence/replay tests | `/game-engine/tests`, fixture data, replay test utilities | Phase 1 | Full scenarios in gameplay-tests; all treatment and side-effect pairs, restrictions, short hands, piles, gifts, winning boundary | Approved rules all covered; invalid actions atomic; conservation/projection/replay properties pass |
| **3 — Basic local UI** | Readable two-seat table, hand, Psyche, piles, inspector, action log | `/client/{table,cards,hud}` with placeholder manifest | Phases 1–2; original placeholder assets | Local full matches; keyboard; all eight conditions; draw/cleanup flow | Complete correct local match without network or sophisticated motion; every pending choice usable |
| **4 — Full card interactions** | All targeting, previews, forced choice drawers, gifts, optional drag, adaptive 2–8 seats | `/client/cards/{selection,targeting,choices}`, `/client/table/adaptive-seating` | Phase 3 | Wrong target/stale state, all Episode choices, Therapy exceptions, excessive hand, desktop layouts | All approved actions accessible with click/keyboard; readable eight-seat summaries; no local legality authority |
| **5 — Animation system** | Event-based card-zone motion, stable anchors, reduced motion and queue recovery | `/client/animations/{queue,primitives,anchors}`, motion tokens | Phase 4 and stable event schema | Cancel/fail every primitive; backlog, layout resize, hidden tab, reduced motion; winning sequence | Every accepted movement clear; no hidden reveal; correctness independent of motion |
| **6 — Online rooms** | Anonymous sessions, code/invite, ready/host/rematch, serialized intents, durable transaction receipts | `/server/{rooms,websocket,player-session,persistence,timers}`, `/client/lobby` | Phases 1–5; session/projection design; chosen room policies | Multi-client joins, 2/4/8-seat games, forged actor/card, double clicks, capacity race, privacy captures | Server authoritative; start/rematch safe; durable commits precede delivery; all hidden data protected |
| **7 — Reconnect and state recovery** | Restore seat/phase/pending choice; snapshot/suffix; crash handling and host separation | `/server/player-session/resume`, snapshots/checkpoints, `/client/hud/recovery` | Phase 6 persistence and IDs | Browser refresh, ack loss, transport recovery failure, process crash, every pending Episode | Correct convergence without repeated automatic draw/random theft; credentials safe; disclosed disconnect policy works |
| **8 — Game logs and replay** | Public history plus protected internal domain replay; viewer-specific exports | `/game-engine/replay`, `/server/persistence/events`, `/client/hud/replay` | Stable schema and Phase 7 | Deterministic final-state equality; version compatibility; public/private leak tests | Replay reconstructs accepted state; export respects audience; no seed/all-hand leak |
| **9 — Bots** | Observation-based policies through legal actions; offline simulations before online use | `/bots/{policy,evaluation,simulation}`, engine adapter | Phases 1–2; Phase 8 diagnostic replay | No illegal action/hidden hand access; repeated fixture games; deterministic seeded offline outcomes | Bot works without UI and uses same validation; no unannounced disconnect takeover; no rules changed |
| **10 — Polish, sound and final UX** | Final adaptive layouts, licensed/original assets, sound preferences, performance/readability | `/client/{table,cards,animations,hud}`, assets/sound manifests | Prior phases; cleared asset set; usability review | 1920×1080, 1440×900, 1280×720, 200% zoom, keyboard/mute/reduced motion, low-end/lags | Correct, readable, accessible complete 2–8-player game; asset records complete; measured latency/load targets met |

## Cross-phase contracts

Card definitions, rule policies, match schema and asset manifest have independent versions. Every intent is authenticated and validated; every mutation goes through the headless engine; every animation comes from accepted visible events. Randomness/deadline outcomes are server facts and replay inputs. Private logs and public history are separate projections.

Phase 6 must include durable receipt/snapshot foundations even though richer replay arrives in Phase 8; deferring persistence until reconnect would create incompatible command guarantees. Phase 2 broadens tests after Phase 1's basic fixtures; it is not permission to implement an untested engine. Optional historical cards/expansions and continued rankings remain out of scope until individually researched.

## Biggest risks

1. Turning ambiguous “one round” and repeated punishments into invisible house rules.
2. Mixing 89/95/96/100-card descriptions or current expansion text with historical bonuses.
3. Leaking hand identities through shared event payloads, replay, or persistent hidden instance handles.
4. Omitting bargaining, or permitting concurrent gifts to evade pending punishments without a stated policy.
5. Using client animation timing as authority for Tremors or winning outcomes.
6. Claiming fidelity from sampled video stills or literal card text not inspected.

Stop after this research package. No production engine, server, client, bot, or deployable site was created.
