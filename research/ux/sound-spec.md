# Sound and readable game feel

**PROPOSED DIGITAL UX.** Sounds support visible accepted events and are never the only way to learn a state change.

| Cue | Trigger | Length / level / delay | Priority / overlap |
|---|---|---|---|
| Hover | Local inspection, optional | 30–60ms; very quiet; no delay | Low; throttle 100ms, off by default |
| Draw | Accepted CARD_DRAWN travel | 80–120ms paper flick; onset at travel | Medium; one cue per two-card batch |
| Card placement | Accepted card settles | 70–110ms light paper tap | Medium; suppress duplicate generic/attach cue |
| Drug treatment | Attachment settles | 120–180ms soft resolving note | Medium; no medical monitor sound |
| Disorder attack | New condition arrives | 100–160ms muted impact | Medium; local seat emphasis, no screen shake |
| Episode | Target effect begins | 180–250ms distinct low accent | High; no jump scare or startling peak |
| Therapy | Removal begins | 140–200ms calm paper sweep | Medium; distinct from Drug |
| Restriction expiry | Badge removal | 60–100ms subtle tick | Low; optional, may be omitted |
| Your turn | TURN_CHANGED to owner | 100–160ms gentle two-note cue | High; optional background notification |
| Win | Confirmed GAME_WON | 700–1200ms short flourish | High; user can skip/mute |

Provide master volume, effects toggle, turn alert toggle, and persistence in local preference storage. Start audio only after browser-permitted user interaction. Cap concurrent effects at three, duck low-priority cues while a required choice/win cue plays, and coalesce bulk discards. Do not announce another hand identity through sound labels or accessibility text.

No ambient music is required. The visual system must remain satisfying through lift, shadow, directed travel, readable target text, and settled state even when silent. Use original or appropriately licensed sound assets; research reference media are not deployment assets.
