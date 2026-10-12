# Desktop table layout

Everything in this file is **PROPOSED DIGITAL UX**. Target 1920×1080. Rules requiring public Psyches and treatment/vulnerability readability come from [the booklet](https://pillboxgames.com/cdn/shop/files/5.png?v=1778020982&width=900). Layout choices are informed by [sampled physical play](../gameplay/video-observations.md), not validated usability results.

## Shared geometry

Reserve a 64px top bar for room, turn, connection, and sound/settings. Reserve a 320px right rail for current action, readable card inspector, and history. The remaining 1600px width is the play surface, with 16px gutters. Vertically: opponent/center region y=64–620, local Psyche y=620–840, own hand y=840–1080. Within the bottom strip, retain at least 44px button targets and 16px text labels; do not rely on tiny printed artwork.

The local Psyche uses eight possible 176×180 slot summaries across the surface; each slot always shows Disorder name, untreated/treated status, treatment name, and vulnerability labels. Full card artwork is available in the 300px inspector. Actual physical-card proportions are approximately 70:120 per historical BGG inventory; summary tiles need not reproduce them.

The hand fan uses 130×223 card presentations; overlapping cards preserve a name/ID header. Excessively large hands become a horizontal scrollable rack with explicit count and selection drawer, not narrower cards. Pointer hover expands a card in the inspector without obscuring legal targets.

## Adaptive seating

| Seats | Arrangement of opponents | Board detail policy |
|---|---|---|
| 2 | One wide opposing Psyche across upper band; deck/discard in center | Show all enemy slots and treatments at once; compare directly with own board |
| 3–4 | Two/three wide boards in upper arc; central action area below | 420–500px boards; inline vulnerability chips and expandable full Psyche |
| 5–6 | Three top boards, remaining one/two on left/right middle edges | 340–380px board summaries; four-slot previews plus full expansion drawer |
| 7–8 | Three top boards, two left, one/two right around center | Approximately 300×150 summaries, each with all Disorder names in a 2-column list; dedicated selected-opponent drawer |

Seven opponents need not display 56 full illustrated cards simultaneously. Every opponent summary must still enumerate **all** Disorder names/statuses without hiding the existence of overflow cards. At eight conditions, use two columns of four compact rows, plus hover/click details for treatments and side effects. During targeting, preserve each legal target's row and scroll it into view in the selected board; target selection may use a readable list in the rail. Avoid hover-only target access.

```text
1920 x 1080
┌──────────────────── room / active turn / connection ─────────────────────┐
│           opponents, adaptive arc/grid                    │ Action       │
│ left seats       draw / discard / current effect   right  │ Inspector    │
│                                                         │ History      │
├────────────────── YOUR PSYCHE (stable slots) ─────────────┤              │
│                       YOUR HAND                          │              │
│                 play/confirm/end controls                │              │
└──────────────────────────────────────────────────────────┴──────────────┘
```

Seat order is clockwise and numbered permanently. Each client's own seat is visually bottom-centered; server turn order does not change when a client rotates the view. Avatar, name, turn ring, hand count, Disorder count, and status badges remain stable. Color accompanies text/icons and never carries legality alone.

## Piles and pending action

Deck shows back and count, never next identity. Discard shows top face and count; opening it shows public discarded cards subject to ordering policy. Current action includes actor → target, card/effect description, who must decide, and optional server deadline. The action panel stays separate from hover inspector content so browsing cannot overwrite a mandatory prompt.

## Acceptance criteria

At 2/4/6/8 seats and up to eight Disorders per Psyche, users can identify active player, their legal cards, every target's untreated conditions, treatment name, attack vulnerability source, hand counts, piles, and pending chooser. Keyboard targeting and 200% zoom remain usable. These dimensions are initial proposals, not a visually tested live UI.
