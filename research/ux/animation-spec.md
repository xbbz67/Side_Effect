# Animation and motion design system

All timings and motion choices are **PROPOSED DIGITAL UX**. They communicate accepted card movements, not game rules. Repetitive motions observed in [sampled gameplay](../gameplay/video-observations.md) suggest travel, reveal, attach, removal, and inspection primitives. No timing below is empirically validated.

## Principles and timing tokens

Server commits gameplay before presenting it. Client domain state reflects the latest accepted revision; the rendered card scene can temporarily show an earlier visual revision during travel. Input legality always uses current authoritative state, with stale-scene interactions disabled until reconciled. Losing a frame, cancelling animation, or changing reduced-motion settings never changes game outcome.

Priority: **P0** required choice/deadline or winning outcome; **P1** card-zone movement; **P2** status/turn transition; **P3** hover decoration. P0 may cancel P3; P1 order within a transaction is preserved. Do not replay a minute of motions on reconnect: update snapshot immediately and display a concise missed-events summary.

Easing tokens: `lift = cubic-bezier(.2,.8,.2,1)`; `travel = cubic-bezier(.22,.61,.36,1)`; `settle = cubic-bezier(.16,1,.3,1)`; `linear` for countdown only. Hover spring/tilt can use a critically damped response, no repeated bounce. Maximum decorative tilt 2°. No gameplay shake of the whole viewport; Episode danger uses localized card emphasis.

## Reusable primitives

Queue keys: **S** serial with causal transaction; **C** concurrent only for independent card paths; **R** replace/cancel previous local decoration. Sync: event sequence/transaction drives motion; deadline uses server time; owner-only faces are audience-projected.

| Primitive | Trigger; start → end | Duration / easing | Delay / stagger / priority | Interruptibility / queue | Multiplayer synchronization |
|---|---|---|---|---|---|
| CARD_DRAW | CARD_DRAWN; deck top → hand slot | 450ms / travel | 0 / 70ms between two / P1 | Finish or snap on snapshot / S | Public back; only owner flips; no deck identity leakage |
| CARD_PLAY | CARD_PLAYED; lifted hand → center resolving zone | 300ms / travel | 0 / 0 / P1 | Snap on resync / S | Accepted command only; unique event ID |
| CARD_TARGET | Local selected card; neutral → selected outline | 120ms / lift | 0 / 0 / P3 | Fully cancellable / R | Local only |
| CARD_ATTACK | Public attack; center → victim slot | 320ms / travel | 80ms preview / 0 / P1 | Snap on resync / S | Actor/target IDs choose anchors, never fixed screen coordinates |
| CARD_ATTACH | DRUG_ATTACHED; center → overlapping Disorder | 260ms / settle | 60ms target pulse / 0 / P1 | Snap on resync / S | Slot and Drug IDs; status derived from accepted attachment |
| CARD_DISCARD | CARDS_DISCARDED; source zone → discard | 240ms / travel | 0 / 35ms for batch / P1 | Can shorten in bulk / S or C within batch | Public identities after committed discard |
| CARD_FLIP | Owner draw/reveal; back → face | 160ms / lift | After travel / 0 / P1 | Snap safely / S | Face payload sent only to entitled client |
| CARD_REVEAL | Authorized reveal; concealed rack → readable drawer | 180ms / lift | 0 / 25ms / P0 | Cancel on revocation/resync / S | Anxiety attacker only; public sees generic prompt |
| CARD_SHAKE | Invalid local action; neutral → ±3px → neutral | 120ms / settle | 0 / 0 / P3 | Cancellable / R | Local rejection feedback; not broadcast |
| CARD_PULSE | Resolved Episode/treatment; normal → outline → normal | 220ms / settle | 0 / 0 / P2 | Cancellable / R | Refer accepted event/card ID |
| TARGET_GLOW | Local legal targets; neutral → outline with icon | 120ms / lift | 0 / 0 / P3 | Replace on legality change / R | Calculated from permitted current projection |
| PLAYER_HIT | Resolved opposing attack; normal seat → accent → normal | 200ms / settle | After impact / 0 / P2 | Cancellable / R | Target event only; no actual HP implication |
| STATUS_APPLY | Restriction applied; absent → badge | 180ms / lift | 0 / 40ms batch / P2 | Snap on resync / S | Exact expiry text from agreed policy |
| STATUS_REMOVE | Restriction expiry; badge → absent | 140ms / lift | 0 / 0 / P2 | Snap on resync / S | Not triggered merely by local card removal |
| TURN_TRANSITION | TURN_CHANGED; prior ring → new ring | 180ms / lift | 0 / 0 / P2 | Replace newer turn / S | Turn ID ensures no duplicate mandatory draw |
| WIN_SEQUENCE | GAME_WON; final board → emphasis → overlay | 700–1000ms total / settle | 250ms readable pause / 0 / P0 | Skip to final result allowed / S | Outcome already committed, no reaction grace period |

## Effect sequences

**Draw:** deck top lifts, travels, and turns toward owner only. Opponents see backs and count change. If a draw crosses recycling, show a short shuffle before the remaining draw; no new randomness is created by visual shuffle.

**Drug:** move to center, label selected Disorder, dock as overlap, reveal “Treated” badge and Drug vulnerabilities. Keep Disorder name visible. Total approximately 650ms, with effect text readable in rail.

**New Disorder:** show enabling Drug and actor→victim arrow, create a slot, place face-up condition, pulse once. Total 600–750ms. Do not display this as an automatic reaction to prior treatment.

**Episode:** center play, target outline, persistent punishment text, then actual movement/restriction. Local dimming may be 8% for 150ms, preserving contrast. Forced-choice UI appears promptly and never waits on an elaborate danger animation. No generic counterattack prompt.

**Therapy:** use a calm outline; chosen Disorder and Therapy travel together to discard. Close the slot after cards leave. Do not create a permanent Therapy attachment or immunity badge.

**Madness:** remove all Drugs as one atomic logical batch; visually stagger 35ms and re-expose conditions. Highlight the changed untreated count once; never show intermediate states as playable.

**Win:** resolve the final card/treatment, hold the visible board for roughly 250ms, then show winner and rematch controls. The visual pause cannot authorize another attack. Allow “Skip celebration.”

## Queue, catch-up, and timers

```text
Accepted server transaction
  -> authoritative state + sequence stored
  -> viewer-specific event batch
  -> deduplicate/order; reconcile logical state
  -> build presentation jobs using stable card/seat anchors
  -> visual travel and settle
  -> reconcile rendered scene to latest state
```

One presentation job per domain movement, not both generic CARD_PLAY and a duplicate renderer-triggered movement. Resolve jobs using old/new zone snapshots so React reconciliation does not destroy moving objects. On event gap request missing events or fresh projection; do not guess. On scene timeout (>2s), missing asset, layout change, reduced-motion change, or hidden tab, snap and retain log. Queue backlog above three seconds collapses to final state plus a summary. Store animation acknowledgements only locally; server never waits for them.

Tremors deadline is **not** an animation duration. Timer fairness, readiness handshake, deadline inclusivity, reconnect during challenge, and keyboard/accessibility accommodation need a documented policy before use. Never delay or extend it merely because a decorative card job ran slowly.

## Reduced motion and game feel

With reduced motion, use 0–80ms fades/outlines, direct card placement, explicit text and counts; remove tilt, travel, pulses, shake, and dimming. This is supported by [W3C animation guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). Placement sounds remain optional. Shadow and stable spacing provide depth without sustained movement. Hover sound is off by default to avoid noise while fanning. Test at 60Hz and low frame rates; no correctness claim depends on framerate.
