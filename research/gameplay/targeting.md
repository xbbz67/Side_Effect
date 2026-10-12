# Targeting and player interaction

**VERIFIED RULE:** standard legality comes from [Drug/Disorder rules](https://pillboxgames.com/cdn/shop/files/4.png?v=1778020951&width=900), [vulnerability/duplicates](https://pillboxgames.com/cdn/shop/files/5.png?v=1778020982&width=900), [Therapy exceptions](https://pillboxgames.com/cdn/shop/files/6.png?v=1778021000&width=900), and [Episode rules](https://pillboxgames.com/cdn/shop/files/7.png?v=1778021009&width=900).

| Interaction | Initiator | Select | Legal target | Response / resolution | Proposed presentation |
|---|---|---|---|---|---|
| Drug treatment | Active player | Hand Drug + own Disorder | Matching own condition; treated stacking gated | No counter; persist as attachment | Own slot outlines; card docks, treated icon |
| Side-effect Disorder attack | Active player | Hand Disorder + opponent | Enabling attached Drug; absent Disorder name | No counter; add face-up Disorder | Show enabling Drug ribbon and directional path |
| Therapy | Active player | Therapy + own condition | Untreated non-Tremors | No counter; both discarded | Calm lift/removal, no Drug ribbon |
| Episode | Active player | Episode + opponent Disorder | Untreated opposing condition | Forced effect; some choices mandatory | Effect preview names condition and punishment |
| Anxiety theft | Episode inflictor | One revealed victim card or decline | Only authorized temporary reveal | Victim reveals; attacker may take one | Private drawer for attacker, generic public banner |
| Gambling theft | Episode inflictor | Accept/decline per final ruling | Random victim hand copies | Server samples; short-hand rule gated | Victim backs shuffle; no pre-theft identities leaked |
| Tremors discard | Victim | Distinct hand cards | Count/deadline policy gated | Success discards three; failure loses hand | Accessible server countdown and clear selection |
| Bargain gift | Card owner, any turn | Owned hand cards + recipient | Hand-to-hand; pending-window policy gated | No extra play; card ownership changes | Recipient private receipt; public count delta |

Episode targeting chooses a Disorder, not just a player, because the chosen condition determines punishment. Disorder attack needs only victim choice, but the UI should explain at least one enabling Drug. Multiple enabling Drugs do not imply separate stacked penalties.

## PROPOSED DIGITAL UX / ENGINE DESIGN — validation order

Authenticate seat from session; verify match/command ID/revision; reject terminal/paused/incorrect phase; require actor authority; confirm owned instance and definition; check remaining play count; check target membership/owner; check type-specific predicate; check pending-effect locks; then apply atomically. Do not accept client-supplied side-effect lists, counts, random outcomes, player role, or treated flags.

Server returns a bounded reason such as `NOT_YOUR_TURN`, `TARGET_ALREADY_HAS_DISORDER`, `NO_ENABLING_DRUG`, `THERAPY_IMMUNE`, `TARGET_TREATED`, `CHOICE_NOT_YOURS`, or `STALE_REVISION`. Rejection does not reveal another hand, mutate cards, or consume a play.

## Proposed complete ordinary action

```json
{
  "commandId": "opaque-client-generated-id",
  "matchId": "match-42",
  "expectedRevision": 18,
  "type": "PLAY_CARD",
  "cardInstanceId": "owner-visible-instance-id",
  "target": {"playerId": "P3", "disorderInstanceId": "public-instance-id"}
}
```

Drug/Therapy/Episode specify Disorder instance; Disorder attack specifies only victim. The server determines the initiating player from authentication. Client selection is cancellable before submission. No victim-confirm button is inserted into ordinary attacks: that would invent a defense rule.
