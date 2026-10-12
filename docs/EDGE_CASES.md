# Edge cases and evidence boundary

All policy choices in GAME_RULES.md are intentional digital rulings for reproducibility. They do not close the publisher research questions in `research/unknown-rules.md`.

| Research gap | Digital profile decision |
|---|---|
| U01 inventory | Provisional 89-copy list, seven Drug definitions |
| U02–04 duration, stacking, source cure | Next scheduled turn; refresh; survives cure |
| U05 timer/short hand | Explicit ready, 3 seconds, min(3,n), timeout loses all |
| U06 Gambling | Optional min(3,n), seeded sampling without replacement |
| U07–08 discard/gifts | Main phase only; off-turn gifts; freeze during pending |
| U09 treated Drugs | Untreated matching targets only, one Drug |
| U10 victory | After complete command; empty Psyche qualifies |
| U11 empty piles | Partial draw, zero if both empty; no invented win |
| U12 setup/order | Seeded round-robin unique deal, top at array end |
| U13–14 historical/continuation | Excluded |
| U15 attack/episode | Union vulnerabilities; same-turn target allowed |
| U16 literal text | Functional paraphrases only |
| U17 privacy | Viewer projections; Anxiety temporary inflictor permission |
| U18 videos | Continuous video/audio review still incomplete |

Timers are host authority inputs; a future server must stamp trusted timestamps, validate seat authentication, and transmit projections only. Local downloaded saves contain all hidden information and are intended for local restore/debug. No online security claim is made by the offline client.

Simulation caps are diagnostic, not alternate victory rules. Any cap hit must be reported, never mislabeled a win. Invalid commands preserve every state field and RNG; errors include command, player, card, phase, expected and actual. Restore replays commands from the original seed/configuration, then compares the snapshot so malformed or tampered saves cannot bypass normal validation.
