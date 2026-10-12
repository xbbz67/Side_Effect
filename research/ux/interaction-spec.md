# Card interaction specification

**PROPOSED DIGITAL UX.** Legality is always server-validated against [targeting rules](../gameplay/targeting.md).

## Hover and focus

On pointer hover or keyboard focus, lift own hand card 10px over 120ms, scale at most 1.04, increase shadow, and display readable card details in the rail. Explain the effect, currently legal targets, and why a card cannot be played. Do not expose another hand identity. On leave, return over 120ms. Hover is inspection, not action selection or remote broadcast.

## Click / keyboard sequence

1. First click, Enter, or Space selects an owned card locally. Highlight legal target rows; announce “Select a target.” Legal-target data must reflect current player projection and current revision.
2. Click or keyboard-select the target. Show a plain-language preview: for Disorder attack, name the enabling Drug; for Episode, name the precise punishment. Target choice does not yet submit.
3. Press **Play** or Enter on the confirmation control to send one atomic intent. For no-target actions such as EndTurn, show their relevant condition directly.
4. Disable duplicate submission while pending; keep network feedback visible. Accepted server event starts card movement. On rejection, restore selectable state and explain the reason; refresh highlights.

A second click on the selected card can deselect it; it must not unexpectedly confirm an unresolved target. Escape cancels local selection before submission. Once accepted by server, no unilateral undo is offered. Avoid a confirmation modal for ordinary plays: inline preview+Play is sufficient.

## Drag

Optional desktop shortcut only. Dragging uses the same legal target overlays; dropping on a legal target populates the preview rather than bypassing confirmation. Invalid drop returns card to its hand slot and explains the reason. No mandatory dragging, especially for timed discards or users using keyboard/touch. Start after an 8px threshold so clicking remains reliable.

## Forced choices

- Anxiety: only inflictor sees victim's temporary face-up hand drawer. Select one card or explicitly decline. Other clients see backs and a waiting banner.
- Gambling: attacker accepts or declines according to the final ruling. Victim hand backs shuffle; server selects outcomes. Do not let the attacker choose a known identity.
- Tremors: victim can mark three cards with pointer/keyboard and submit together. The timer must not begin from an animation finishing. The online fairness/accessibility policy remains unresolved; no silent turn clock substitutes for the printed challenge.
- End-turn excess: show “Discard N to finish” and a multi-select rack, preserving order-independent selection. Playing another card is disabled after the budget is exhausted.
- Gifts/trades: select cards privately; show recipient and count, with identities visible only as authorized. Binding swaps are a proposed convenience and must not imply an enforceable future promise in physical bargaining.

## Invalid actions and live changes

Disabled card inspection still works. Failed intent gives a 120ms small local shake (or static outline under reduced motion), an explanation such as “P3 already has this Disorder,” and focus stays on the relevant control. Never merely reject silently. Invalid-target cursor is supplementary.

If a gift or resolved effect changes legality while selecting, recompute and retain the selection if still owned. If invalid, announce why and clear only the obsolete target. If state revision advanced after submission, server rejection cannot consume a play or move a card. Local target highlights are recommendations, not authority.

For pending network requests, display “Waiting for server” after 300ms and offer reconnection status after 2 seconds. Do not animate irreversible card placement optimistically. If server accepted but ack was lost, resend the same command ID and recover its receipt.

## Accessibility

Tab traverses controls and card groups; arrows move within a group; Enter selects/confirms; Escape cancels local preview. Provide text for every icon, visible focus, a readable action history, screen-reader announcements for accepted actions, and a reduced-motion setting. Do not depend on colors, hover, sounds, dragging, or a visual countdown alone. Timed Tremors adaptation requires an explicit accepted policy before implementation.
