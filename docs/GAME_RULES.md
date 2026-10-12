# Side Effects: digital profile 1

This is a local desktop adaptation of the provisional English 89-card retail baseline. Core rules are sourced from the publisher booklet in `research/evidence` and the claim ledger in `research/rules-verification.json`. This is not a claim that every edition or unresolved physical ruling has been verified. Descriptions are functional paraphrases, not transcribed card text. `GAME_RULES.json` and `data/cards/base.json` define the engine profile.

## Verified core

2–8 players, clockwise. Deal four unique Disorders to each player at 2–5 seats, three at 6–8. Shuffle remaining Disorders into the other cards and deal four hand cards. Duplicate setup Disorders return to the bottom and retry. Ordinary turns draw two, allow zero to two plays, and finish at six or fewer hand cards. Recycle the shuffled discard when the draw pile empties. No off-turn plays; hand gifts may occur off-turn.

Drugs attach to matching own Disorders. A treated Disorder stays in the Psyche and counts as treated toward victory. Attached Drugs expose their owner's listed vulnerabilities. A hand Disorder can attack an opponent exposed to that name; no attached Drugs means immunity. Duplicate Disorder names, including treated ones, are prohibited. Therapy removes an own untreated Disorder except Tremors; Anorexia has no Drug. Episodes target opponent untreated Disorders and resolve that Disorder's punishment. First fully treated Psyche wins.

## Explicit digital policies (not publisher verification)

One round means the victim's next scheduled turn. Repeated restrictions refresh, never stack. Treating/removing the source does not cancel an already applied restriction. Skipping consumes that scheduled turn without opening main or enforcing a hand cap; blocked draw/play expire after it. A Drug can target only an untreated matching Disorder, with one attachment.

Tremors: victim explicitly starts a three-second clock and discards min(3, hand size) distinct cards in one submission; timeout discards the whole hand. The engine accepts monotonic logical timestamps from its authority, never reads wall time. There is no timer before readiness. Pause/menu does not pause an armed game timer. Pending effects freeze other commands, including gifts. Gambling allows decline or taking min(3, hand size) uniformly at random without replacement. Anxiety reveals only to the inflictor until that inflictor chooses one card or declines.

Voluntary discards are permitted in own main phase, cost no play, and only own end enforces six. Gifts can occur during any main phase and do not consume plays, but cannot self-target. Empty draw plus empty discard yields the available number (possibly zero). No automatic fabricated cards or winner. Victory is checked after the entire command/effect finishes; an empty Psyche qualifies. New Disorders may be Episode targets in the same turn. Vulnerabilities union across attached Drugs. Start player is seat one; the physical nightmare convention is not modeled.

Deck counts are provisional/inferred (sum 89). Historical Misdiagnosis and High Tolerance, expansions, and continued placement mode are excluded. No treatment names or ingredient spellings are presented as medical advice. Bots and local hotseat are supported; remote rooms are an architectural future feature.

## Episode map

Madness removes all victim attached Drugs. Suicidal Thoughts discards the victim hand. Depression skips the next turn. Tremors uses the ready/timed discard above. Gambling Addiction takes up to three random hand cards optionally. Anxiety reveals the hand for optional one-card theft. Impotence blocks plays next turn. Anorexia blocks draws next turn.

See `EDGE_CASES.md` for decisions and remaining research limitations. Never modify engine rules without updating this profile and headless tests.
