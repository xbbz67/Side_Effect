# Multiplayer architecture research

Everything here is **PROPOSED DIGITAL UX / ENGINE DESIGN**. This is a design recommendation, not implemented software or a benchmark.

## Recommended shape

Use a TypeScript headless domain package; a Node.js server with one serialized command queue per match; Socket.IO for transport and room channels; React/TypeScript DOM cards for client presentation. Persist accepted command receipts, event batches, pending choices and snapshots in a durable database. PostgreSQL is a suitable proposed production store; its [transaction documentation](https://www.postgresql.org/docs/current/tutorial-transactions.html) explains the atomic persistence model, and implementation must validate deployment/transaction configuration. Begin with one authoritative server process and room ownership before distributed scaling.

The game is turn-based with a small deck and only 2–8 players per room. Clear rules, idempotency, projection security, and stable pending effects are more important than a high-frequency tick loop. A timer service is needed for the chosen Tremors policy and room lifecycle deadlines, not for a physics engine.

```text
Client local preview
  -> authenticated intent (command ID + expected revision)
  -> per-room serialized validator
  -> headless transition / effect resolver
  -> durable atomic transaction: receipt + state + events
  -> viewer projections
  -> realtime delivery
  -> latest logical state + client animation queue
```

## Options evaluated

| Choice | Benefit | Cost / risk | Decision |
|---|---|---|---|
| React DOM cards | Text accessibility, pointer/keyboard controls, separate inspectors | Needs stable overlays for moving cards | Recommended initial UI |
| Canvas/WebGL table | Large custom visual surface | Manual semantics, text hit areas and accessibility; unjustified for 89-card table | Defer |
| Plain native WebSocket | Small standard transport | Must build reconnect, ack, room routing and buffering conventions | Viable if team wants minimal dependency |
| Socket.IO | Room channels, acknowledgements and reconnection facilities | Own protocol; delivery/recovery do not replace domain guarantees | Recommended |
| Browser-to-browser authority | Low server compute | Active player's client would own private deck/state and dispute resolution | Not appropriate for this design |
| HTTP intents + streamed events | Simple command endpoints, easy audit | Separate streaming/reconnect layer still required | Viable alternative, unnecessary initial split |
| Fully distributed room engine immediately | More processes | Ownership/fencing, duplicate writers, cross-node recovery complexity | Defer until load justifies |

[MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) describes native WebSocket's bidirectional channel and lack of backpressure. [Socket.IO](https://socket.io/docs/v4/delivery-guarantees/) guarantees ordering of arriving messages, but defaults to at-most-once delivery; durable replay and deduplication are application responsibilities. [Recovery documentation](https://socket.io/docs/v4/connection-state-recovery/) says recovery can fail and adapter support varies. Do not claim transport gives exactly-once gameplay.

## Headless reducer/event suitability

A pure transition approach makes fixtures, simulations, replay and reconnect agree on the same engine. [React's reducer guidance](https://react.dev/learn/extracting-state-logic-into-a-reducer) supports centralizing state transitions; the authoritative domain reducer should be framework-independent, not a React hook on the server. Return `nextState`, domain events and optional pending effect after validating input. Supply random outcomes and server deadline decisions explicitly; replay must not call the clock or random generator afresh.

Separate immutable card definitions, physical card instances, rule policy versions, and viewer projections. Unknown policies stay disabled/gated; do not hard-code ambiguous rule text as a catch-all card function. Bots later operate through the same legal-action interface and permitted observations.

## Proposed module map

```text
/game-engine
  cards/definition-schema, edition-profiles
  effects/instant, forced-choice, restrictions
  validation/intent, phase, ownership
  reducer/transition, events
  turn-manager/start, cleanup, expiry
  win-condition/predicate
  targeting/legal-actions
  projection/viewer-state
  replay/apply-recorded-events
/server
  rooms/lifecycle, seat-order, host
  websocket/auth, intents, projection-delivery
  player-session/anonymous-capability, resume
  persistence/receipts, events, snapshots
  timers/pending-effects, lifecycle
/client
  table/adaptive-seating, psyche
  cards/hand, inspector, target-selector
  animations/queue, anchors, reduced-motion
  hud/current-action, history, connection
  lobby/create, join, ready, rematch
```

This is a future file plan only; no production directories have been created.

## Consistency and operations

One room writer owns revisions. Do not broadcast directly from multiple parallel intent handlers. Persist the state/event batch before acknowledging acceptance; retain deduplication receipts for the match lifetime. Reject stale revisions with a fresh projected state; retry lost acknowledgement with the same ID. Automatic draw uses a turn ID guard so reconnect cannot draw twice.

Use cryptographically secure server randomness for live shuffles/theft, with recorded outcomes retained privately. [Node crypto](https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback) provides random-integer sampling; a future shuffle should use unbiased bounded choices, not `sort(() => random() - .5)`. Never send live RNG seed or deck order to clients.

Rooms are server routing channels, not access-control proof. [Socket.IO rooms](https://socket.io/docs/v4/rooms/) are useful for broadcast grouping, but hand delivery requires per-seat authorization and separate payloads. The host is lobby administrator, not a client-side game authority or privileged viewer of other hands.

Reconnect correctness is mandatory even if the process restarts. In-memory room state alone cannot provide that promise. If future scaling uses multiple nodes, select an adapter/recovery mechanism compatible with the deployment and establish room writer fencing. [Socket.IO multiple-node guidance](https://socket.io/docs/v4/using-multiple-nodes/) discusses transport/session routing requirements; reassess at implementation rather than choosing an adapter by name now.
