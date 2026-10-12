# Future online, presentation and security tests

**PROPOSED validation scenarios; not executed implementation tests.** Every test must compare authoritative revision, card zones, per-seat projection, command receipts and visible UI outcome. Transport connection alone is not success.

| ID | Fault/scenario | Expected contract |
|---|---|---|
| M01 | Create/join via code/invite, no login | Separate authenticated anonymous seats; no resume credential in URL |
| M02 | Concurrent final seats in 8-player lobby | Capacity checked atomically; ninth seat rejected clearly |
| M03 | Start with 1/9 players, unready seat, changed rules | No setup begins; settings change clears readiness |
| M04 | 2/3/4/8 players start | Correct unique Psyches and hidden hand projections |
| M05 | Double-click Play | One accepted command, one play consumed |
| M06 | Same command retried after ack loss | Same receipt; no second draw, play, theft or attachment |
| M07 | Same ID with changed payload | Reject conflict; do not reinterpret original command |
| M08 | Two different stale intents from same/other tabs | One serial valid outcome; stale revision explained |
| M09 | Offline before submission | Local preview changes no state |
| M10 | Offline after accepted play/before ack | Resume state/receipt confirms one application |
| M11 | Browser refresh at draw phase | Same seat; mandatory draw performed once per turn ID |
| M12 | Victim disconnect during Anxiety choice | Grant only attacker; pending choice restored or pause policy applied |
| M13 | Victim/attacker disconnect during Gambling | Recorded randomness unchanged; policy determines pause |
| M14 | Disconnect / latency near Tremors deadline | Server deadline/race order per agreed policy; animation cannot decide |
| M15 | Host disappears | Server match survives; separate lobby-control migration |
| M16 | All seats disconnected / explicit leave | Recoverable pause/expiry path according to disclosed digital policy |
| M17 | Server crash before commit | Retry applies at most once; no uncommitted broadcast |
| M18 | Server crash after commit before broadcast/ack | Durable receipt/events restore same outcome |
| M19 | Socket recovery fails / retained event suffix missing | Fresh filtered snapshot converges all entitled clients |
| M20 | Packet duplicate/reorder/gap | Deduplicate by event ID; sequence check/resync; no fabricated state |
| M21 | Pending effect then gift/play race | Room writer and involved-hand policy serialize consistently |
| M22 | Victory plus queued attack | Winner committed once; postterminal ordinary play rejected |
| M23 | Rematch plus stale old-match commands | New match ID/session namespace; old commands rejected |
| M24 | Two browser tabs same seat | Defined controlling generation; no conflicting unacknowledged writers |
| M25 | Malicious client names another player/target/card | Session-derived actor; ownership/phase/type validation |
| M26 | Spectator/host inspects websocket traffic | No concealed identities, instance trackers, seeds or private log |
| M27 | Temporary Anxiety reveal ends | No future hidden updates; private prior knowledge not publicized |
| M28 | Public discard re-enters hidden shuffled deck | Internal tracking IDs and order not exposed |
| M29 | Error response/replay/analytics/debug payload | No credentials/private card data through secondary routes |
| M30 | Bad/oversized/flooded command and code lookup | Bounded schemas/rate limits; no room crash or unauthorized access |
| M31 | 2/4/6/8 seats, every Psyche eight names | Readable statuses/targets; no tiny clipped card text required |
| M32 | Large gifted hand and excess cleanup | Accessible scrolling rack; accurate required count |
| M33 | Keyboard-only, reduced motion, muted sound | Every choice playable; same logical outcome |
| M34 | Animation failure/slow device/tab throttling | Snap to latest state; deadlines/outcome independent |
| M35 | Lag 100/500/2000ms, reconnect during visual sequence | Clear pending status; no optimistic illegal placement |
| M36 | 200% zoom / 1280×720 / long names | Current action and legal target controls remain accessible |

## Projection assertions

Capture every viewer's actual serialized payloads across setup, draw, play, theft, reveal, discard, reshuffle, reconnect and replay. Search for another seat's hidden definitions/instance IDs and live deck seed/order. Test negative authorization against snapshot, event suffix, private history, pending-choice endpoints and room channel membership. UI screenshots cannot establish information security.

## Load and persistence

After correctness, simulate realistic rooms/turn frequencies and burst reconnections; measure commit latency, queue backlog, duplicate receipt rate, snapshot sizes and memory. Establish an explicit operating target before claiming scalability. If multiple servers are introduced, test room writer fencing, node death, sticky-session/transport routing and adapter recovery compatibility. Avoid performance work that changes published rules.
