# Structured commands, events, and replay

**PROPOSED DIGITAL UX / ENGINE DESIGN.** All events describe accepted server facts; commands describe player intent. Event payloads are audience-projected before delivery.

```json
{
  "schemaVersion": 1,
  "matchId": "M42",
  "eventId": "E105",
  "sequence": 105,
  "transactionId": "TX31",
  "causationCommandId": "C31",
  "revision": 31,
  "type": "DISORDER_ADDED",
  "sourcePlayerId": "P1",
  "targetPlayerId": "P3",
  "cardInstanceId": "public-instance-after-reveal",
  "cardDefinitionId": "anorexia",
  "reason": "opponent_side_effect_play",
  "enablingDrugInstanceIds": ["public-depression-drug"],
  "serverTimeMs": 1791770000000
}
```

The reason deliberately describes an opponent's card play, not spontaneous disease generation. This schema is an example, not a production format already implemented.

| Intent/event family | Authority / privacy | State or visual consequence |
|---|---|---|
| PLAY_CARD / CARD_PLAYED | Active seat; played definition becomes public | Resolving card movement, play budget decrement |
| Automatic draw / CARD_DRAWN | Server; definition only to owner | Deck-to-hand; everyone else sees back/count |
| DISORDER_ADDED | Public | New Psyche slot |
| DISORDER_TREATED / DRUG_ATTACHED | Public | Attach, treated status |
| DISORDER_REMOVED | Public cause and visible card | Therapy removal |
| EPISODE_TRIGGERED | Public target/effect kind | Brief effect explanation |
| CHOICE_REQUIRED / RESOLVE_CHOICE | Designated chooser; choices projected privately | Anxiety drawer / discard choice / Tremors countdown |
| HAND_REVEAL_GRANTED / REVOKED | Only attacker gets identities | Temporary Anxiety visibility; no public list |
| CARDS_TRANSFERRED | Count public; definitions limited to authorized owners/known audience | Gift/theft movement |
| CARDS_DISCARDED / DRUG_REMOVED | Card faces become public | Discard paths; derived status updates |
| RESTRICTION_APPLIED / EXPIRED | Public recipient/kind/expiry | Phase badges |
| DECK_RECYCLED | Public count, private order | Shuffle visual |
| TURN_STARTED / TURN_CHANGED | Public | Turn badge, draw phase |
| GAME_WON | Public immutable outcome | Final treatment then result overlay |
| ROOM_PAUSED / PLAYER_RECONNECTED | Room lifecycle | Pause/connection banner; no card play |

## Transaction and replay contract

Serialize per-room commands. Resolve nondeterminism on the server, recording chosen random results and timer outcomes internally. A pure transition can return next state, ordered domain events, and an optional pending choice. A persisted event batch must commit atomically with its new revision, deduplication receipt, and necessary snapshot. Never broadcast an uncommitted outcome.

Use one monotonically increasing match sequence. Multi-card Madness removal can be an atomic batch with subevents for motion, so nobody acts halfway through a partial un-treatment. The reducer must not generate fresh randomness when replaying; it applies stored outcomes. Log rules/content/policy versions and setup outcomes. Private complete logs are server-side only.

The public action history is not the private engine log. Public draw entries say who drew and how many; owner receives identities separately. Anxiety does not expose its revealed hand in the public history, replay download, analytics, error details, or spectator stream. A privately informed attacker can remember what they saw, but revocation stops future hidden updates. Public discard faces naturally reveal discarded identities; unseen retained cards remain secret.

## Bot-readiness without bots

Future API contracts: `getLegalActions(state, player)`, `applyAction(state, action)`, `evaluateState(state, player)`, `projectState(state, viewer)`. Human and bot actions use the same validation. Bots receive an observation view and legal actions computed without leaking opponent hands/deck; full state can be limited to offline simulations. Evaluation scores are heuristics, not a game rule. No bot code is implemented in this research.
