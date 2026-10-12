# Card relationship and interaction matrix

**VERIFIED RULE — R28–R35:** mapping decoded from the eight symbol rows of the [publisher game key](https://pillboxgames.com/cdn/shop/files/12.png?v=1778021197&width=900). Drug ribbons visible in publisher product photographs corroborate the orientation: a row's side effects belong to the Drug treating that row's Disorder, not to an untreated Disorder merely being present.

The authoritative machine-readable mapping is [cards.json](cards.json). Display names for Drugs use treatment names, because ingredient spelling across physical printings has not been fully verified.

| Drug treats | Madness | Suicidal Thoughts | Depression | Tremors | Gambling Addiction | Anxiety | Impotence | Anorexia |
|---|---|---|---|---|---|---|---|---|
| Madness | — | — | — | vulnerable | — | — | — | — |
| Suicidal Thoughts | vulnerable | — | — | — | — | — | — | — |
| Depression | — | vulnerable | — | — | — | — | vulnerable | vulnerable |
| Tremors | vulnerable | — | vulnerable | — | vulnerable | — | — | — |
| Gambling Addiction | — | — | — | — | — | — | vulnerable | — |
| Anxiety | vulnerable | vulnerable | vulnerable | — | — | — | — | — |
| Impotence | — | — | — | — | — | vulnerable | — | — |

This table is permission data, not an automatic trigger chain. Victim vulnerability is the union of currently attached Drugs' labels minus every Disorder name already in their Psyche, treated or untreated. That union formula is **INFERRED BEHAVIOR / ENGINE MODEL** derived from the publisher's Drug and duplicate rules.

## Treatment relationships

Each of the seven Drugs treats its named Disorder. Anorexia has no Drug. Therapy targets the seven non-Tremors Disorder names only while untreated. An attached Drug does not cure/remove the underlying Disorder, so it continues to block duplicates. An Episode targets an untreated Disorder; it does not target the Drug or a currently treated condition. See [cards.md](cards.md) for the eight punishments.

## Worked implications

**INFERRED BEHAVIOR:**

1. Depression treatment permits attacks with Impotence, Suicidal Thoughts, or Anorexia copies, but only names absent from that Psyche.
2. If Impotence is already present under its own Drug, it cannot be received again through Depression treatment.
3. Treating Madness opens Tremors vulnerability; adding Tremors uses an opponent's separate play and card.
4. Madness Episode removes all attached Drugs. Underlying Disorders remain and become untreated; vulnerability labels from removed Drugs disappear.
5. A successful Therapy removes duplicate protection for the removed Disorder. Another attacker still needs an enabling attached Drug to re-add it.
6. One added Disorder can be Episode-targeted on the attacker's second play if it is untreated and the attacker has an Episode. No summoning-delay rule was found; this timing remains an inference.

## Historical/expansion interaction boundary

High Tolerance followed by Episode on exposed Madness is described in an [older BGG review](https://boardgamegeek.com/thread/1960411/a-sick-tic-tac-toe-like-card-game-a-review-of-side). It is a historical/expansion combo, not a legal retail-only action list. The publisher's [Booster Shot description](https://pillboxgames.com/products/side-effects-booster-shot?variant=48090540179691) gives current Misdiagnosis a keep-in-hand option, whereas that old review describes discarding the exchanged Disorder. Record the difference; obtain historical printed text before enabling that profile.
