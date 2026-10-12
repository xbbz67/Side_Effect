# Complete known card catalogue

The database records all **17 current retail definitions** supported by the four-category booklet and **two historically reported bonus definitions**. This is a definition catalogue, not proof of the exact physical-copy inventory for a particular printing. All functional descriptions below are paraphrases. No invented literal card text is supplied. [Publisher game key](https://pillboxgames.com/cdn/shop/files/12.png?v=1778021197&width=900) is the primary Episode/mapping source; counts and ingredient labels are secondary [BGG inventory](https://boardgamegeek.com/boardgame/230765/side-effects) data.

## Eight Disorders

| ID / name | Historical copies; retail inferred | Valid treatment | Episode effect (VERIFIED broad effect) | Precision still unknown |
|---|---:|---|---|---|
| `madness` — Madness | 4 | drug_madness, therapy | Remove every Drug currently attached in the victim's Psyche. | Exact resolution transaction timing |
| `suicidal_thoughts` — Suicidal Thoughts | 5 | drug_suicidal_thoughts, therapy | Victim discards all cards in their hand. | Exact resolution transaction timing |
| `depression` — Depression | 5 | drug_depression, therapy | Victim sits out one round; exact turn scheduling needs a ruling. | UNKNOWN — NEEDS VERIFICATION: expiry, stacking, curing-source behavior |
| `tremors` — Tremors | 5 | drug_tremors | Victim has three seconds to discard three cards; otherwise their whole hand is lost. | UNKNOWN — NEEDS VERIFICATION: timer start and short-hand behavior |
| `gambling_addiction` — Gambling Addiction | 5 | drug_gambling_addiction, therapy | Inflictor may take three random cards from the victim's hand. | UNKNOWN — NEEDS VERIFICATION: short-hand behavior and optional transfer count |
| `anxiety` — Anxiety | 5 | drug_anxiety, therapy | Victim shows their hand to the inflictor, who may take one card. | Exact resolution transaction timing |
| `impotence` — Impotence | 5 | drug_impotence, therapy | Victim cannot put cards into play for one round. | UNKNOWN — NEEDS VERIFICATION: expiry, stacking, curing-source behavior |
| `anorexia` — Anorexia | 4 | therapy | Victim cannot draw cards for one round. | UNKNOWN — NEEDS VERIFICATION: expiry, stacking, curing-source behavior |

## Seven Drugs

| ID / treatment | Copies (secondary / retail inferred) | May expose victim to | Reported historical ingredient, spelling not verified |
|---|---:|---|---|
| `drug_madness` — Madness Treatment | 5 | tremors | Chlorpromazine |
| `drug_suicidal_thoughts` — Suicidal Thoughts Treatment | 5 | madness | Clozapine |
| `drug_depression` — Depression Treatment | 5 | suicidal_thoughts, impotence, anorexia | Fluoxetine |
| `drug_tremors` — Tremors Treatment | 6 | gambling_addiction, depression, madness | Pramiprexole |
| `drug_gambling_addiction` — Gambling Addiction Treatment | 5 | impotence | Lithium |
| `drug_anxiety` — Anxiety Treatment | 5 | suicidal_thoughts, depression, madness | Lorazapam |
| `drug_impotence` — Impotence Treatment | 5 | anxiety | Sildenafil |

Drugs persist over their Disorder. They do not add the listed side effects automatically or allow duplicates. Their Episode protection lasts while the Disorder is treated. Anorexia has no Drug. Tremors treatment exists, but Therapy cannot treat Tremors. The actual card title convention emphasizes what each Drug treats; ingredient naming is auxiliary metadata and must not drive legality.

## Two standard action definitions

| ID | Purpose | Requirements | Destination | Persistence |
|---|---|---|---|---|
| `therapy` | Remove one own Disorder | Untreated, non-Tremors; own-turn play | Both selected Disorder and Therapy to discard | None |
| `episode` | Activate one punishment | Opponent untreated Disorder; own-turn play | Episode to discard after resolution | Card none; resulting restriction may persist |

Reported copy counts: five Therapy, ten Episode. These sum with reported 38 Disorders and 36 Drugs to 89; retail per-name verification remains open. Standard targeting sources: [publisher page 6](https://pillboxgames.com/cdn/shop/files/6.png?v=1778021000&width=900), [page 7](https://pillboxgames.com/cdn/shop/files/7.png?v=1778021009&width=900), [quick rules](https://pillboxgames.com/cdn/shop/files/11.png?v=1778021187&width=900).

## Two historical bonus definitions — excluded from retail

`misdiagnosis` and `high_tolerance` have three reported historical copies each. Their names and general actions are independently reported, but original printed text has not been inspected. JSON leaves executable effect/requirements/destination null. The [current Booster Shot descriptions](https://pillboxgames.com/products/side-effects-booster-shot?variant=48090540179691) verify current expansion behavior, not the exact wording of the historical bonuses. Do not enable these cards until original faces and edition rules are reconciled.

## Completeness boundaries

- All eight broad Episode punishments and all seven side-effect mappings: primary-source verified.
- Literal full text: UNKNOWN — NEEDS VERIFICATION on every selected-edition card face. Visible portions exist in photographs; a complete edition-matched transcription was not obtained.
- Drug ingredient labels: historical community report only; two reported spellings may differ from actual labels. No medical list is used to fill game content.
- Copy counts by name: historical secondary report / retail inference; total current retail 89 is verified.
- Duration wording, repeated penalties, short hands, timer start, historical specials: see [unknown rules](../unknown-rules.md).
- Boilerplate flavor text and artwork are intentionally not reconstructed for distribution.

Use field-level verification in JSON: a record with a verified broad effect still has unknown literal text, and may have unknown timing. `persistent:false` on Episode refers to the physical card, not a claim that its restriction is instantaneous.
