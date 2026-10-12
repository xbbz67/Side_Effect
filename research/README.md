# Side Effects research specification

Research date: **12 October 2026 (Asia/Bangkok)**. Target: Pillbox Games' English **89-card retail base game**, provisionally; historical Kickstarter cards are separated. No production game code has been written.

## Read this first

The core rules, eight Disorder Episode effects, and seven Drug side-effect relationships are supported by the publisher's illustrated instruction booklet. **This is not yet a fully verified implementation specification.** Exact retail copy counts, several timing rulings, and full continuous video observation remain open. Do not turn unknowns into defaults without a documented ruling.

Evidence labels used throughout:

- **VERIFIED RULE**: directly supported by an inspected publisher rule image, card photograph, or other identified primary evidence.
- **INFERRED BEHAVIOR**: logical consequence, secondary-source report, or interpretation without an explicit primary ruling. Confidence is recorded separately.
- **PROPOSED DIGITAL UX**: presentation or online policy; also used for proposed engine/network design. Never a claim about the physical rules.
- **UNKNOWN — NEEDS VERIFICATION**: information unavailable or ambiguous. Null JSON fields mean unknown, not an empty effect.

Rule IDs resolve through [sources.md](sources.md). Source IDs and full URLs are machine-readable in [sources.json](sources.json). The coverage calculation uses [rules-verification.json](rules-verification.json); it does not claim that every conceivable rule has been discovered.

## Documents

| Topic | Entry point |
|---|---|
| Evidence and disagreements | [Sources and rule ledger](sources.md) |
| Physical rules | [Complete rules](rules/complete-rules.md), [setup](rules/setup.md), [turn structure](rules/turn-structure.md), [victory](rules/win-condition.md) |
| Card database | [Taxonomy](cards/card-taxonomy.md), [cards](cards/cards.md), [JSON](cards/cards.json), [interactions](cards/interactions.md) |
| Unresolved rules | [Unknowns](unknown-rules.md), [edge cases](rules/edge-cases.md) |
| Gameplay model | [Game loop](gameplay/game-loop.md), [state machine](gameplay/state-machine.md), [Psyche](gameplay/psyche-system.md), [targeting](gameplay/targeting.md), [events](gameplay/event-system.md) |
| Observed play | [Timestamped sampled observations](gameplay/video-observations.md) |
| Presentation | [Table layout](ux/table-layout.md), [interaction](ux/interaction-spec.md), [animation](ux/animation-spec.md), [responsive layout](ux/responsive-layout.md), [sound](ux/sound-spec.md) |
| Online | [Architecture](multiplayer/architecture.md), [room flow](multiplayer/room-flow.md), [reconnect](multiplayer/reconnect.md), [visibility and security](multiplayer/information-security.md) |
| Validation | [Gameplay scenarios](testing/gameplay-tests.md), [multiplayer scenarios](testing/multiplayer-tests.md) |
| Next steps | [Implementation plan](implementation-plan.md), [research verdict](research-verdict.md) |
| Visual asset separation | [Asset policy](assets.md) |

The alternate paths requested earlier in Research.txt (`research/cards.md`, `research/cards.json`, `research/game-loop.md`, `research/animation-spec.md`) are also provided. Markdown files point to canonical documents; the two JSON files must remain identical.

## Evidence limitations

All twelve publisher rules images and seven product photographs were downloaded and visually inspected. They are research references, not authorized distribution assets. Two videos were examined chronologically using their actual timestamped preview images (99 and 147 samples at approximately ten-second intervals). Continuous playback/audio was not available: browser inventory was empty, the web reader could not fetch video playback, and caption endpoints returned zero bytes. Sampled frames support visible positions and changes; they do not prove card identities in unreadable frames, exact action timing, spoken rulings, or reactions. This falls short of the requested full continuous video study and is tracked explicitly.

BGG's main page and some threads were accessible through search-indexed text; direct page/file access returned errors or 403. Community file contents were not downloaded or relied on. No publisher was contacted.
