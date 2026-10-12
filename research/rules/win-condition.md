# Victory and losses

**VERIFIED RULE — R27.** [Publisher win rules](https://pillboxgames.com/cdn/shop/files/3.png?v=1778020934&width=900), [turn-ending rules](https://pillboxgames.com/cdn/shop/files/7.png?v=1778021009&width=900).

Win means every Disorder presently in a player's Psyche is treated. A Drug-covered Tremors card counts as treated; the Psyche need not be physically empty. Future vulnerability to another Disorder does not invalidate victory. A 2025 [BGG clarification discussion](https://boardgamegeek.com/thread/3623887/how-does-a-player-actually-remove-the-tremors-card) corroborates this and documents players mistakenly waiting to remove all cards.

**INFERRED BEHAVIOR:** Therapy removing the final untreated Disorder also satisfies victory; an empty Psyche has no untreated Disorders. The invariant is zero untreated Disorders, rather than zero cards, original Disorders only, or zero vulnerability labels.

**PROPOSED DIGITAL UX / ENGINE DESIGN:** check after a complete accepted resolution and before accepting another action or turn change. Once declared, the terminal outcome cannot be reversed by a later network request. Keep the final table visible and animate the resolving treatment before opening results. Animation completion never controls the winner.

There is no separate ordinary elimination/life system in the inspected base rules. Remaining players lose the first-winner match. Resignation, abandonment, and timeout are digital policies, not effects printed on Disorders.

The booklet allows continuing until one person is left. **UNKNOWN — NEEDS VERIFICATION:** disposition of a winner's hand and Psyche, whether remaining seats can target or bargain with them, reduced turn order, remaining restrictions, and tie/placement rules. Default online plan: first-winner mode only until continuation is researched.

## Critical examples

- One Tremors, matching Drug attached: winning Psyche despite remaining possible side effects.
- Three Disorders, two treated, Therapy legally removes the third: winning Psyche.
- All four original Disorders treated but a fifth acquired Disorder untreated: not winning.
- Matching Drug in hand: not winning until legally played and resolved.
- A rejected/duplicate command or merely previewed card: no victory.
- Both players appear to win during one effect: ordinary retail plays do not establish this case; require a ruling before introducing multi-target expansion effects.
