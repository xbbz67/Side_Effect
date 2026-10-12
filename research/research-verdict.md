# RESEARCH VERDICT

**Core gameplay is documented; the requested research is not yet fully verified or ready for faithful production implementation.** The rules database and design package are complete as a research deliverable with explicit gaps. Continuous video/audio study and several original timing rulings remain outstanding. No game implementation has started.

## Verified percentage

**35 of 55 tracked physical-rule claims (63.6%) are confidently verified**, seven are inferred, and thirteen are unknown. Calculation and exact claims appear in [rules-verification.json](rules-verification.json) and [sources.md](sources.md). This is a checklist coverage score, not a claim that 63.6% of every possible rule has been discovered. Broad Episode effects are verified while timing precision is separately unresolved. Digital design choices and sampled video motions do not inflate the score.

All eight Disorder names, eight broad Episode effects and seven Drug side-effect relationships are supported by the [publisher game key](https://pillboxgames.com/cdn/shop/files/12.png?v=1778021197&width=900). Setup, ordinary turn, treatment, attack legality, Therapy exceptions, bargaining and recycling are supported by the inspected booklet. The current total is 89 cards, supported by the [publisher page](https://pillboxgames.com/products/side-effects) and box photograph.

## Unresolved rules and card information

- Retail multiplicities and printing choice; historical 95/96/100 reports must not be merged.
- Meaning/expiry of one round, repeated Episode restrictions, and whether treating their source cancels them.
- Tremors timer start, short hands and online accessibility/fairness policy; Gambling short hands and optional count.
- Optional discard timing, bargains during pending effects and off-turn hand-limit enforcement.
- Already-treated Drug targeting/stacking, exact winning transaction boundary, empty-pile fallback, and deterministic dealing/recycling order.
- Full literal text and ingredient spelling for the chosen 17 retail card definitions; JSON leaves exact text unknown rather than guessing.
- Historical Misdiagnosis/High Tolerance text and continuation-after-winning protocol if those modes are wanted.
- Temporary reveal lifetime/permissions and spectator/replay policies.
- Continuous gameplay review with audio: two actual videos were sampled chronologically, but exact actions, speech, reactions and winner declarations were not continuously observed.

See [unknown-rules.md](unknown-rules.md) for eighteen questions, evidence confidence, and consequences. Seventeen retail definitions plus two separately marked historical bonus definitions are recorded in [cards.json](cards/cards.json); category and individual retail counts remain inferred apart from the verified total.

## Best sources found

1. Publisher's complete twelve-image illustrated booklet, especially [turn/setup](https://pillboxgames.com/cdn/shop/files/3.png?v=1778020934&width=900), [bargaining](https://pillboxgames.com/cdn/shop/files/8.png?v=1778021129&width=900), [explicit untreated Therapy rule](https://pillboxgames.com/cdn/shop/files/11.png?v=1778021187&width=900), and game key.
2. Seven publisher photographs, including a 2024 89-card box and physical game in progress, saved with source references.
3. [BGG 230765](https://boardgamegeek.com/boardgame/230765/side-effects) indexed inventory and [independent inventory report](https://www.reddit.com/r/boardgames/comments/121cwxn/side_effects_contents/) for historical copy counts; secondary evidence rather than current printing proof.
4. [Official prototype playthrough](https://www.youtube.com/watch?v=tGGV8ixHG8w) and [Skytiger video](https://www.youtube.com/watch?v=vVcEQWEbTK8) for sampled movement/layout evidence. Their full review remains necessary.

## Recommended architecture

**Proposed:** React/TypeScript DOM client; framework-independent TypeScript engine; authoritative Node.js server; Socket.IO transport; durable command receipts/events/snapshots and per-room serialization; strict viewer-specific projections. Native WebSocket is viable if a smaller transport dependency is preferred, but recovery/deduplication still belong to the application. [Socket.IO delivery documentation](https://socket.io/docs/v4/delivery-guarantees/) makes clear that arrival guarantees alone do not deliver exactly-once game actions.

The same engine should expose legal actions, apply intents, project state and replay recorded outcomes for humans, future bots, simulations and tests. Animation follows accepted events; hidden identities are never sent to unauthorized clients.

## Biggest implementation risks

Silent house rules in timing; edition mixing; bargaining concurrency; hidden-hand/replay leaks; client-driven challenge deadlines; premature victory/duplicate commands; and relying on copyrighted reference assets as deployable artwork.

## MUST be resolved before coding

Complete Phase 0 of [implementation-plan.md](implementation-plan.md): lock the retail profile, resolve engine-critical timing and shortfall questions, verify functional card fields against selected-edition faces, complete continuous gameplay review, and document any chosen digital adaptations explicitly. Resolve spectator/reconnect/transfer policy before online work; establish asset authorization before distribution. Historical/continuation modes remain disabled until separately resolved.

**STOP: no engine, server, UI, bots, or production game assets implemented.**
