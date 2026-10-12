# Edge cases

VERIFIED means explicit booklet support; INFERRED includes unanswered physical details; DIGITAL-ONLY means an online policy proposal. Unknown cases must not pass future tests with an invented expected result. U IDs refer to [unknown-rules.md](../unknown-rules.md); R IDs refer to [sources.md](../sources.md).

| Case | Label | Expected behavior / unresolved point | Evidence / gate |
|---|---|---|---|
| Duplicate during setup | VERIFIED | Put duplicate at bottom and try next | R07 |
| Duplicate attack against untreated or treated copy | VERIFIED | Illegal; treated cards still block duplicate | R19 |
| No Drugs in target Psyche | VERIFIED | Disorder attack illegal | R18 |
| Drug has several side effects | VERIFIED | Opponent may play a listed Disorder they actually hold; no automatic acquisition | R17, R30–R33 |
| Two Drugs list same vulnerability | INFERRED | Permission union; no double Disorder addition | R41 / U15 |
| Already-treated Disorder targeted by Episode | VERIFIED | Illegal | R23 |
| Own Disorder targeted by Episode | VERIFIED | Opponent-only | R23 |
| Drug for somebody else's Disorder | VERIFIED | Not baseline; explicitly house rule | R15, P08 |
| Therapy on Tremors | VERIFIED | Illegal | R21 |
| Therapy on already-treated Disorder | VERIFIED | Quick rules explicitly restrict to untreated | R20 |
| Anorexia without Therapy | VERIFIED | No Drug remedy; wait/trade for Therapy | R22 |
| Therapy-removed Disorder returns | VERIFIED | Can be added again if Drug vulnerability exists and name absent | P06, R17, R19 |
| Newly added Disorder punishment immediately fires | INFERRED | No automatic punishment; Episode is separate | R37 / U15 |
| Episode as second play on newly acquired Disorder | INFERRED | Likely legal if untreated | R38 / U15 |
| Drug on already-treated condition | INFERRED | Single attachment depicted; explicit legality unresolved | R40 / U09 |
| Madness with several Drugs attached | VERIFIED | Remove all Drugs in Psyche, retain Disorders | R28 |
| Madness with no Drugs | INFERRED | Broad punishment changes no cards; legality of a zero-impact Episode not explicit | R23, R28 |
| Suicidal Thoughts with empty hand | INFERRED | Emptying zero cards is a no-op; attack legality not explicit | R29 |
| Anxiety with empty hand | INFERRED | No steal available; no fabricated card | R32 / U17 |
| Anxiety optional theft declined | VERIFIED | Inflictor may take one, so may decline | R32 |
| Gambling with fewer than three cards | INFERRED | No primary shortfall rule | U06 |
| Tremors with 0–2 cards | INFERRED | Three discards impossible; penalty semantics unclear | U05 |
| Tremors exact deadline race | DIGITAL-ONLY | Server decides deadline order; accessible policy unresolved | U05 |
| Depression skips turn vs merely no play | INFERRED | Broad sit-out verified; phases/expiry need ruling | U02 |
| Anorexia blocks draw but play remains available | INFERRED | Block only draw is likely; other phases need timing confirmation | U02 |
| Impotence blocks play but draws/discards continue | INFERRED | Block only plays is likely; gifts/discards differ from putting cards into play | U02, U08 |
| Repeated same Episode | INFERRED | Stack/refresh not established | U03 |
| Two different restrictions on one player | INFERRED | Must resolve phase overlap and expiry | U02–U04 |
| Therapy cures source of timed restriction | INFERRED | Existing restriction lifecycle unresolved | U04 |
| Draw pile empty, discard nonempty | VERIFIED | Shuffle discard into draw pile | R14 |
| Last draw card / two-card draw straddles recycle | INFERRED | Draw available card then recycle for remainder | U12 |
| Both piles empty | INFERRED | No legal fallback established | U11 |
| No legal main play | VERIFIED | May end without playing | R12 |
| Hand exceeds six after draw | VERIFIED | Need not immediately trim; end-turn cap | R13 |
| Hand exceeds six after off-turn gift | INFERRED | Cap enforcement boundary ambiguous | U08 |
| Voluntary discard under cap | INFERRED | No-play-cost rule exists; window/permission unclear | U07 |
| Two cards played then excess cleanup | VERIFIED | No further play; required cleanup is not a third play | R12–R14 |
| Victim decision while not active player | INFERRED | Resolves punishment; not a reaction card play | R24–R25 |
| Trade during theft selection or timer | DIGITAL-ONLY | Proposed involved-hand lock; deviates from unrestricted bargaining wording if enforced | U08 |
| Full treatment but vulnerable to absent Disorders | VERIFIED | Vulnerability does not require waiting; full treatment wins | R27, B03 |
| Last untreated Disorder removed with Therapy | INFERRED | Zero untreated -> win | R39 / U10 |
| Victory during chained effect | INFERRED | After atomic completed effect proposed; baseline has no printed general trigger stack | U10 |
| Continuing after first winner | INFERRED | Permission verified; practical protocol unresolved | U14 |
| 2 seats | VERIFIED | Four starting Disorders, ordinary rules; bargaining still permitted | R05, R26 |
| 8 seats | VERIFIED | Three starting Disorders; no extra per-turn actions | R05, R12 |
| Disconnect while selecting card locally | DIGITAL-ONLY | Discard local preview; authoritative state unchanged | reconnect spec |
| Disconnect after submitted action, before ack | DIGITAL-ONLY | Retry same request ID; result applied once | reconnect spec |
| Victim disconnects during forced choice | DIGITAL-ONLY | Pause/restore pending choice; do not invent victim consent | room policy |
| Host disconnects | DIGITAL-ONLY | Server game persists; migrate lobby control separately | room spec |
| Player explicitly leaves / all disconnected | DIGITAL-ONLY | Proposed pause/abandon path; no automatic bot or elimination | room spec |
| Double click / duplicate request | DIGITAL-ONLY | Idempotent request ledger; consume one play | event spec |
| Invalid/stale target | DIGITAL-ONLY | Reject atomically, explain, no card movement/action consumption | targeting spec |
| Simultaneous gifts and play | DIGITAL-ONLY | Server serializes room commands; validate revision | architecture |
| Animation fails / tab throttles | DIGITAL-ONLY | Latest state correct; skip presentation backlog | animation spec |
| Extra rules from Booster/Legal Vice/Hex | VERIFIED boundary | Excluded base scope; separate researched content versions | P02, E01, E03 |

No finite table can guarantee every future edge case. Future property tests should enforce conservation, hidden-information projection, target validity, pending-choice authority, and terminal-state immutability across generated legal sequences.
