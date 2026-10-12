# Turn structure and timing

**VERIFIED RULE:** R11–R14, R23–R26. [Turn rules](https://pillboxgames.com/cdn/shop/files/3.png?v=1778020934&width=900), [Episode/discard rules](https://pillboxgames.com/cdn/shop/files/7.png?v=1778021009&width=900), [bargaining](https://pillboxgames.com/cdn/shop/files/8.png?v=1778021129&width=900).

| Boundary | Mandatory | Optional | Open precision |
|---|---|---|---|
| Start | Draw two unless an applicable Episode restricts this | None established | Meaning and expiry of a one-round restriction |
| Main action | Resolve a played card before interpreting its final outcome | Play up to two cards, or finish early | Voluntary discard window is not explicit |
| Episode resolution | Victim obeys punishment; Episode eventually discarded | Some thefts say attacker may take cards | Sub-three-card hands and timer details |
| End | Reduce own hand to six if above six | Owner selects excess cards | Off-turn gifted excess cards |
| Deck exhausted | Reuse shuffled discard | No deck-building choices | Both piles empty; exact instant of recycling |
| Winning treatment | Fully treated Psyche wins | Booklet allows optional continued placing | Exact transaction boundary for winner declaration |

A two-card draw is mandatory, not an action alternative. Playing a Drug is one play, playing a Disorder is another, and playing Therapy or Episode is one each. Required Episode transfers/discards are not additional played cards; a victim following a punishment is not using their turn's two plays. The latter is **INFERRED BEHAVIOR** from the mandatory punishment wording and turn-only play rule.

The ordinary six-card limit applies at the end of the player's turn; it is not an instantaneous global cap. A first ordinary turn reaches six after its draw. Theft/gifts may create larger hands. Never discard an attacker's stolen cards automatically during another player's pending choice without a specific ruling.

## Restrictions from Episodes

Read the eight effects in [the card database](../cards/cards.md). The broad restrictions are verified; scheduling details are not. Proposed counters such as `skipTurnsRemaining`, `blockedDrawTurnsRemaining`, and `blockedPlayTurnsRemaining` are design fields awaiting a policy for repeated Episodes and curing the source Disorder. Do not keep restrictions as booleans that silently lose repeated applications.

## Resolution transaction proposal

Validate the complete intent against the latest revision; move the played card into a public resolving zone; consume one play; resolve all required choices/random outcomes; move cards to their final zones; check winner; enforce end-of-turn excess if the game continues; then advance clockwise. This sequence is a **PROPOSED DIGITAL UX / ENGINE DESIGN**, not a verified published timing chart.

There is no ordinary victim counterplay timer. Only a required Episode choice creates a pending step. Selection and hover remain local and do not consume a play. A targeted play is submitted atomically; a separate `SELECT_TARGET` network command is unnecessary for the ordinary baseline.
