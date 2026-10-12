# Future gameplay validation plan

These are **test specifications, not executed game-engine tests**. No engine has been implemented. Verified or inferred expectations are labelled; gated cases must not be assigned invented assertions. Future fixtures reference an approved content/rules/policy version and account for every physical copy.

## Setup and conservation

| ID | Scenario | Expected assertion | Evidence/status |
|---|---|---|---|
| S01 | Setup 2 seats | Four unique face-up Disorders and four hidden hand cards each | VERIFIED R05–R08 |
| S02 | Setup 3 seats | Same per-seat counts; remaining Disorders in mixed draw deck | VERIFIED |
| S03 | Setup 4 seats | Same counts; no duplicate Psyche name | VERIFIED |
| S04 | Setup 8 seats | Three unique Disorders and four hand cards each | VERIFIED |
| S05 | Setup 5/6 threshold | Four vs three starting Disorders respectively | VERIFIED |
| S06 | Force duplicate next setup card | Duplicate goes to bottom; next attempted | VERIFIED R07 |
| S07 | Provisional retail count | Sum 89, reported categories 38/36/5/10 | Total VERIFIED, distribution U01 |
| S08 | After every transition | Each physical instance appears once in exactly one zone, including resolving | PROPOSED invariant |
| S09 | Deck order / same recorded setup | Replaying accepted setup yields identical state | PROPOSED deterministic contract |

## Treatment and attacks

| ID | Scenario | Expected assertion | Status |
|---|---|---|---|
| D01 | Each of seven matching Drugs | Treat correct own Disorder, persist attachment, consume one play | VERIFIED R15–R16 |
| D02 | Wrong Drug/name or opponent own-treatment target | Reject unchanged state and budget | VERIFIED legality; digital rejection contract |
| D03 | Every Drug side-effect edge | Each listed Disorder attack succeeds if name absent and hand copy owned | VERIFIED mapping R28–R34 |
| D04 | Nonlisted Disorder | Reject, no discard or action consumption | VERIFIED R17 |
| D05 | Target no attached Drugs | Reject attack | VERIFIED R18 |
| D06 | Existing untreated duplicate | Reject | VERIFIED R19 |
| D07 | Existing treated duplicate | Reject; underlying Disorder still counts | VERIFIED R19 |
| D08 | Multiple enabling Drugs | One supplied Disorder added, not repeated for each Drug | INFERRED R41 / U15 |
| D09 | New Disorder then Episode as second play | Effect targets newly acquired untreated condition | INFERRED R38 / U15 |
| D10 | Already-treated Drug target | Expected legality awaits ruling | GATED U09 |
| D11 | Matching Drug played with two other original conditions still untreated | No premature win | VERIFIED condition |

Use a Cartesian treatment predicate test: all seven Drugs × all eight Disorders, plus each side-effect edge/non-edge, target ownership, presence and treatment state. Assertions should test published relationships, not merely repeat the implementation's own lookup function as an oracle.

## Therapy — all interactions

| ID | Scenario | Expected |
|---|---|---|
| H01 | Each non-Tremors untreated Disorder | Discard Therapy and target, remove slot, consume one play — VERIFIED |
| H02 | Tremors | Reject — VERIFIED R21 |
| H03 | Anorexia | Therapy succeeds; no Drug exists — VERIFIED R22 |
| H04 | Already-treated condition | Reject under explicit quick rule — VERIFIED R20 |
| H05 | Another player's Disorder | Reject under own-Psyche treatment — VERIFIED |
| H06 | Removed Disorder returned via valid vulnerability | Re-add legal if name absent — VERIFIED broad behavior |
| H07 | Removed Disorder returned to player with no Drugs | Reject — VERIFIED R18 |
| H08 | Remove final untreated Disorder | Win after completed resolution — INFERRED R39/R42, U10 |
| H09 | Therapy cures source of existing restriction | Restriction lifecycle assertion awaits U04 |

## Every Episode

| ID | Disorder | Required scenario / oracle |
|---|---|---|
| E01 | Madness | Zero/one/multiple attached Drugs; all removed, conditions persist. No-impact legality needs ruling. |
| E02 | Suicidal Thoughts | Entire victim hand discarded; zero-hand legality needs ruling; conservation preserved. |
| E03 | Depression | Broad sit-out applied; phase skipping, start/expiry and gifts need U02/U08. |
| E04 | Tremors | Successful timed discard, late failure, 0–2 cards, exactly three cards, timer/reconnect/keyboard; U05 before assertions. |
| E05 | Gambling Addiction | Accept/decline, unique random copies, 0–2-card hand, attacker cap after theft; U06/U08. |
| E06 | Anxiety | Only inflictor sees grant; take one vs decline; selected card changes ownership; empty hand; U17. |
| E07 | Impotence | Play prevented during agreed boundary; draw/cleanup/gift behavior U02/U08. |
| E08 | Anorexia | Draw prevented for agreed duration; legal main phase/cleanup U02. |
| E09 | Any treated condition | Episode rejected; no card/budget movement — VERIFIED R23. |
| E10 | Own condition | Rejected opponent-only targeting — VERIFIED R23. |
| E11 | Repeated same restriction | Stack/refresh oracle gated U03. |
| E12 | Combined Depression/Anorexia/Impotence | Phase and expiry composition gated U02–U04. |

## Turns, piles and bargaining

| ID | Scenario | Expected |
|---|---|---|
| T01 | Ordinary turn | Mandatory two draws, zero-to-two plays, cleanup to six — VERIFIED |
| T02 | No legal play / choose no play | End early permitted — VERIFIED |
| T03 | Third play | Reject unchanged state/budget — VERIFIED limit |
| T04 | Excess hand after draw | Retain during main, choose cleanup to six — VERIFIED boundary |
| T05 | Hand discard | Does not consume play; voluntary window gated U07 |
| T06 | Empty draw/nonempty discard | Recycle discard — VERIFIED R14 |
| T07 | One draw card left in two-card draw | Correct straddle and conservation; timing/order U12 |
| T08 | Both piles empty | Outcome gated U11, no fabricated cards |
| T09 | Clockwise turn progression | Once per completed turn, except approved restriction/continuation policy |
| T10 | Own/off-turn gifts | Ownership transferred without card play; timing/cap U08 |
| T11 | Bargain promises | No future-action enforcement inferred from verbal promise; swap feature is digital proposal |
| T12 | Pending theft vs concurrent gift | Serial resolution follows approved U08 policy |

## Victory

V01: all remaining conditions Drug-treated wins despite vulnerability. V02: original conditions treated, acquired fifth untreated prevents win. V03: treated Tremors alone wins. V04: final Therapy removal / empty Psyche U10. V05: never award win for preview/rejected intent. V06: after winning transaction reject queued ordinary commands. V07: chained/multi-event resolution winner boundary U10. V08: continuation mode disabled until U14. V09: slow/broken celebration cannot change outcome.

## Property tests and review

Once authorized and implemented, generate legal sequences under each approved profile and test card conservation, no duplicate Psyche names, attachment matching, actions-used bound, correct current actor, pending chooser exclusivity, replay equivalence and terminal immutability. Fault generation should use the actual rule oracle/fixtures, not create random illegal states and declare their behavior canonical. No balance changes based on simulations are introduced without a separate decision.
