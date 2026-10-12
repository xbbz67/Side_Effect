# Room lifecycle

**PROPOSED DIGITAL UX / ONLINE POLICY.** No room or host rules exist in the physical booklet.

```text
Create room -> assign anonymous owner seat -> show code and invite URL
Join -> validate room code/capacity -> issue private seat session
Lobby -> pick display name -> fix seating -> choose edition/policies
Ready -> every occupied seat ready, 2–8 seats
Start -> server locks configuration and creates match
In game -> authorized intents / effects / reconnect
Finished -> immutable outcome + visible final table
Rematch -> reset readiness, preserve consenting seats, new match ID/shuffle
Expired/abandoned -> retain only according to published retention policy
```

## Lobby details

Show player count, clockwise seat order, initial Disorder count, baseline edition, any digital Tremors/bargaining policy, reconnect status and readiness. Defaults cannot conceal house rules. Host may change lobby seating/configuration; changing settings clears readiness. Server rejects start if fewer than two/more than eight players, unresolved profile, missing consent, or occupied seat without readiness.

Invite URL contains a join locator, not any existing player's resume credential. Room code can be eight unambiguous characters with rate-limited lookup, but does not authenticate a seat or authorize reading hands. Anonymous seats receive independent opaque high-entropy session credentials. Friendly names and socket IDs never establish identity.

New arrivals during a match are spectator-only if allowed; do not insert them into an existing shuffle/turn sequence. Full rooms give a clear capacity message. Names and codes are safely escaped in UI and logs. Room uniqueness and capacity are enforced server-side under the same room lock.

## Disconnect and leaving proposal

An offline non-chooser can be targeted under the chosen room policy, with their accepted state recoverable. If the next mandatory actor or pending chooser is offline, pause for a configurable grace interval (initial proposal 120 seconds). Expiry offers pause continuation or abandonment; automatic bot takeover/forced discard/seat elimination is not introduced without a separate agreed policy. Timed Tremors requires a specific anti-abuse rule; pausing its clock automatically could be exploitable and remains unresolved.

Host disconnection does not delete the server match. Reassign lobby controls to the earliest connected seat after a short grace interval, preserving original seat identities; returning host does not automatically reclaim authority. During a match, host cannot silently kick a seat, alter hands, restart the game, or change rules. An explicit leave is distinct from accidental connection loss and must show consequences before applying the chosen digital leave policy.

## Rematch and completion

Retain the result/history snapshot while all willing players become ready. New match gets a fresh ID, shuffle and request-ID namespace, with clear settings. No stale command from the previous match can affect it. Disconnected seats do not consent to rematch by absence. Joining spectators can be seated only in the next lobby and within the eight-player limit.

Room lifecycle states and match phase states are separate. A paused room preserves turn, pending effect, private hands and authoritative deadline information. Expiration duration and retained log lifetime are implementation decisions to disclose in product settings.
