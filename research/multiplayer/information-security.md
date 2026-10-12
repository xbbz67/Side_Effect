# Information visibility and security

Physical sources: [hidden hands / public discard](https://pillboxgames.com/cdn/shop/files/3.png?v=1778020934&width=900), [public Psyche](https://pillboxgames.com/cdn/shop/files/2.png?v=1778020923&width=900), [Anxiety reveal](https://pillboxgames.com/cdn/shop/files/12.png?v=1778021197&width=900). Spectators and network payloads are **PROPOSED DIGITAL UX**, never publisher rules.

## Visibility matrix

| Data | Owner | Opponents | Spectators (proposed) | Evidence status |
|---|---|---|---|---|
| Current hand card identity | Yes | No normally | No | VERIFIED concealed hand, P03 |
| Anxiety victim hand during pending effect | Victim yes | Inflictor yes; others no proposed | No | VERIFIED inflictor reveal; exclusivity/lifetime refinement U17 |
| Hand size | Yes | Yes | Yes | INFERRED physical countability; explicit digital policy |
| Psyche Disorder identities | Yes | Yes | Yes | VERIFIED face-up setup/play |
| Drug attachments / treated status | Yes | Yes | Yes | VERIFIED visible attachment |
| Current vulnerabilities | Yes | Yes | Yes | INFERRED derived from visible Drug labels |
| Draw pile count | Yes | Yes | Yes | INFERRED countable component; digital policy |
| Draw order and next card | No | No | No | INFERRED concealed draw pile; enforced digital policy |
| Discard top face | Yes | Yes | Yes | VERIFIED face-up discard |
| Entire discard browse | Yes | Yes | Yes proposed | Inspection permission not expressly detailed; digital convenience |
| Public played/discarded card history | Yes | Yes | Yes | PROPOSED log of publicly revealed actions |
| Stolen/gifted card identity | New owner yes; previous owner already knows | Only if explicitly entitled | No | PROPOSED projection preserving hidden hand rules |
| Pending effect target / required chooser | Yes | Yes | Yes | PROPOSED readable public effect metadata |
| Private chooser options | Authorized chooser only | No except specific reveal grant | No | PROPOSED effect-scoped projection |
| Internal seed / private replay / all-hand snapshot | No in live game | No | No | PROPOSED server-only security boundary |
| Anonymous resume credential | Seat holder only | No | No | DIGITAL-ONLY capability |

Knowing the identity of a card previously revealed does not justify receiving future updates to its current hidden location. A spectator must not obtain hidden hands through host status, room code, replay endpoints, event IDs, browser devtools, or payload fields that the UI simply chooses not to draw.

## Projection contract

Maintain one full state exclusively on server. Construct an allowlisted viewer DTO, not `fullState` followed by deleting a few known keys. Opponent hands contain count/back placeholders without stable hidden card-instance IDs or definition IDs. Owner hand has their instance IDs/definitions. Public instances receive safe public handles when revealed. When public cards re-enter a shuffled hidden deck, do not leak persistent per-copy tracking handles or random seed.

Emit public events separately from per-seat identity payloads. Server authentication chooses the projection; client `viewerId`, query parameter, or host role cannot request another player's hand. Temporary Anxiety reveal grants are bound to effect, attacker, victim hand revision and current phase. After resolution, send no live revealed-hand updates; normal human memory is not erased.

Check public messages for nested identities, enabled-card lists, random seeds, undealt card IDs, RNG state, stack traces, projected-snapshot checksums based on private state, and internal event body copies. Hashes/debug logs can leak secret-dependent data or enable guessing; public checksum should cover public projection only.

## Online session controls

Use TLS; private high-entropy seat credentials, preferably secure HttpOnly cookies in a same-origin deployment; explicit allowed Origin/CORS configuration; bounded message sizes; request schema validation; per-session and room-code lookup rate limits. [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie) documents security attributes; exact deployment configuration must be verified during implementation. This is a proposal, not a claim that room codes provide security.

Do not transmit credentials through invite URLs or public history. Host has room administration only. Spectator membership is an independent role with public projection. Reconnect validates current seat capability and controlling connection generation before resuming pending choices.

Private engine logs remain protected. Proposed public replay uses public events; an owner's private export includes only their legitimately visible information. Revealing everyone's hands after the match would be an additional product policy requiring explicit agreement, not an automatic benefit of event sourcing.
