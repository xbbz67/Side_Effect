# Setup

**VERIFIED RULE — R05–R10.** [Publisher page 2](https://pillboxgames.com/cdn/shop/files/2.png?v=1778020923&width=900), [page 3](https://pillboxgames.com/cdn/shop/files/3.png?v=1778020934&width=900).

1. Separate every Disorder copy from the other categories and shuffle the Disorder pile.
2. Give each player face-up Psyche cards: four at 2–5 players, three at 6–8 players.
3. If the next card duplicates a Disorder already in that player's Psyche, put it at the bottom of the Disorder pile and try the next card. Do not discard it or remove its copy from the game.
4. Shuffle all remaining Disorder cards into all remaining non-Disorder cards.
5. Deal four face-down hand cards per player. Do not restrict hands to treatments: Disorders can occur in hands.
6. Put the remaining mixed deck face down centrally. Begin with an empty face-up discard pile alongside it.
7. The most recent nightmare determines the starting player; turns go clockwise.

**UNKNOWN — NEEDS VERIFICATION:** whether to deal each Psyche one player at a time or round-robin. Both affect seeded replay outcomes without changing the category constraints. Proposed digital setup uses round-robin, logged as a digital convention after agreement.

## Numerical fixtures

**INFERRED BEHAVIOR:** if the retail 89-card distribution matches the historical deck minus six bonuses, then the following conservation checks apply:

| Seats | Psyche cards per seat | Total in Psyches | Total in hands | Draw pile after setup |
|---:|---:|---:|---:|---:|
| 2 | 4 | 8 | 8 | 73 |
| 3 | 4 | 12 | 12 | 65 |
| 4 | 4 | 16 | 16 | 57 |
| 5 | 4 | 20 | 20 | 49 |
| 6 | 3 | 18 | 24 | 47 |
| 7 | 3 | 21 | 28 | 40 |
| 8 | 3 | 24 | 32 | 33 |

Do not use these numbers as proof of per-name retail copy counts. The historical 95-card profile adds six to the initial draw counts if enabled, subject to its distinct card rules.

## PROPOSED DIGITAL UX

Room locks the edition, seating order, first player, and rules version before shuffling. Server uses private randomness and assigns every physical copy a unique internal instance ID. Clients receive only their own hand identities. Setup animation reveals the Psyches first, then deals concealed hands. An accessibility option displays the same final setup immediately. Record random outcomes internally for replay; never expose the live deck seed.

A possible pathological duplicate-deal loop must be detected in future engine validation. Do not invent a reshuffle fallback: confirm the intended physical remedy if remaining available Disorder types cannot satisfy the next seat.
