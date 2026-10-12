# SIDE EFFECTS — WEB GAME MASTER SPEC

## 1. Project Goal

Develop a polished desktop web adaptation of the **Side Effects card game**.

Primary goals:

- Desktop-first web application.
- Ignore mobile support for the first production version.
- 2D card-based gameplay.
- Smooth, game-like animations.
- Automatically scale to different desktop resolutions.
- Strong 2D game UI/UX rather than ordinary website UI.
- Game logic must be independent from rendering.
- Architecture must be maintainable and easy to extend.
- Assets, animation values and layout values should be replaceable without rewriting the game engine.
- The final result should feel like a digital board/card game, not a dashboard or generic React website.

Target desktop resolutions:

- 1366×768
- 1600×900
- 1920×1080
- 2560×1440

Primary design resolution:

```text
1920 × 1080
```

The game should automatically scale from this logical resolution.

---

# 2. Required Research Before Coding

Before implementing gameplay:

1. Research the complete Side Effects rules.
2. Identify every card category.
3. Identify:
   - setup rules
   - turn structure
   - valid actions
   - targeting restrictions
   - Disorder behavior
   - Drug behavior
   - Episode behavior
   - Therapy behavior
   - side-effect mechanics
   - special cards
   - victory conditions
   - edge cases
4. Create a normalized machine-readable rules document.
5. Do not implement rules from memory.
6. Separate verified rules from assumptions.

Create:

```text
/docs/
    GAME_RULES.md
    GAME_RULES.json
    EDGE_CASES.md
    ANIMATION_SPEC.md
    UI_UX_SPEC.md
```

The rule files become the source of truth for the engine.

---

# 3. Agent Skills Required

The coding agent should install/use relevant skills before implementation.

## Priority 1 — Frontend / UI Engineering

Use skills from:

```text
vercel-labs/agent-skills
```

Relevant skills should cover:

- frontend design
- React architecture
- web design guidelines
- accessibility
- performance
- component architecture

Use these during both implementation and review.

---

## Priority 2 — Game UI Design

Use a frontend-design skill focused on:

- visual hierarchy
- spatial composition
- typography
- interaction states
- hover feedback
- game HUD design
- card readability
- action feedback
- information density

The resulting interface MUST NOT look like:

- admin dashboard
- SaaS application
- Bootstrap page
- generic Tailwind template
- generic AI-generated landing page

It should look like an actual digital card game.

---

## Priority 3 — Animation / Creative Coding

Use an animation/creative coding skill.

It must understand:

- motion hierarchy
- easing
- anticipation
- follow-through
- stagger
- overshoot
- card movement
- drag interaction
- hover interaction
- target highlighting
- impact animation
- transition sequencing
- animation cancellation
- animation queues

Recommended supplementary skill source:

```text
MengTo/Skills
```

Useful categories:

```text
creative coding
web animation
interaction design
game UI
frontend design
```

---

## Priority 4 — UI/UX Review

The agent must periodically perform a UI review covering:

```text
visual hierarchy
interaction clarity
game state clarity
card readability
target readability
action discoverability
animation clarity
feedback latency
misclick prevention
resolution scaling
accessibility
```

Do this after every major UI milestone.

---

# 4. Recommended Technical Stack

## Core

```text
TypeScript
React
Vite
```

React should control:

- menus
- lobby
- settings
- HUD
- dialogs
- overlays
- tooltips
- history panel
- game results
- debug tools

---

# 5. 2D Game Rendering

Evaluate both:

```text
PixiJS
Phaser
```

Recommended architecture:

```text
React
   ↓
Game Controller
   ↓
Game Engine
   ↓
Renderer Adapter
   ↓
Phaser / PixiJS
```

Do NOT allow Phaser/Pixi objects to contain the authoritative game rules.

The engine must work without the renderer.

Example:

```text
engine.playCard(...)
```

changes state.

Then:

```text
renderer.animateCardPlay(...)
```

visualizes the result.

Never reverse this dependency.

---

# 6. Animation Stack

Recommended:

```text
Motion
```

Use Motion for:

- menus
- modal transitions
- HUD animation
- card information panels
- player status
- notifications
- tooltip transitions
- result screens
- lightweight card interactions rendered in DOM

Use Phaser/Pixi animation systems for objects inside the game canvas.

Do not create competing animation ownership.

Example:

```text
Game board objects
→ Phaser/Pixi

DOM UI
→ Motion
```

---

# 7. Drag & Drop

Evaluate:

```text
dnd-kit
```

Use only if DOM cards require complex drag/drop interaction.

If cards are rendered inside Phaser/Pixi, use the renderer's pointer/input system instead.

Never implement two drag systems for the same card.

---

# 8. Game Architecture

Use approximately:

```text
src/
│
├── app/
│   ├── App.tsx
│   ├── Router.tsx
│   └── providers/
│
├── game/
│   ├── engine/
│   │   ├── GameEngine.ts
│   │   ├── GameState.ts
│   │   ├── TurnEngine.ts
│   │   ├── ActionResolver.ts
│   │   ├── TargetResolver.ts
│   │   ├── WinCondition.ts
│   │   └── Validation.ts
│   │
│   ├── cards/
│   │   ├── definitions/
│   │   ├── effects/
│   │   ├── CardRegistry.ts
│   │   └── CardTypes.ts
│   │
│   ├── commands/
│   ├── events/
│   ├── rules/
│   ├── selectors/
│   ├── tests/
│   └── simulation/
│
├── renderer/
│   ├── GameRenderer.ts
│   ├── scenes/
│   ├── cards/
│   ├── animations/
│   ├── effects/
│   ├── particles/
│   └── layout/
│
├── ui/
│   ├── lobby/
│   ├── hud/
│   ├── hand/
│   ├── psyche/
│   ├── tooltip/
│   ├── dialogs/
│   ├── history/
│   └── results/
│
├── assets/
│
├── audio/
│
├── config/
│
└── debug/
```

---

# 9. Game Engine Requirements

The engine must be deterministic.

Game state must contain all information required to reconstruct a match.

Example:

```ts
GameState {
    players
    deck
    discardPile
    activePlayer
    turnNumber
    phase
    pendingEffects
    actionHistory
    rngState
}
```

No gameplay logic should depend on:

```text
DOM state
CSS state
animation completion
mouse position
renderer objects
React component state
```

---

# 10. Command-Based Gameplay

Player actions should become commands.

Examples:

```text
DRAW_CARD
PLAY_DRUG
PLAY_EPISODE
PLAY_THERAPY
TARGET_PLAYER
TARGET_DISORDER
DISCARD_CARD
END_TURN
```

Flow:

```text
Player Interaction
       ↓
Command
       ↓
Validation
       ↓
Game Engine
       ↓
State Change
       ↓
Game Event
       ↓
Animation
       ↓
UI Update
```

This will make multiplayer, bots, replays and debugging significantly easier later.

---

# 11. Event System

Important engine events:

```text
TURN_STARTED

CARD_DRAWN
CARD_PLAYED
CARD_DISCARDED

DRUG_APPLIED
DISORDER_TREATED
DISORDER_ADDED

EPISODE_TRIGGERED

THERAPY_USED

PLAYER_TARGETED

SIDE_EFFECT_TRIGGERED

PLAYER_WON

TURN_ENDED
```

Renderer listens to events and produces animations.

---

# 12. Animation Queue

Never allow important animations to overlap randomly.

Create:

```text
AnimationQueue
```

Example:

```text
PLAY_CARD
↓
CARD_MOVES_TO_CENTER
↓
CARD_REVEAL
↓
TARGET_HIGHLIGHT
↓
EFFECT_TRIGGER
↓
STATE_UPDATE_VISUAL
↓
CARD_TO_DISCARD
↓
NEXT_ACTION
```

Animations must support:

```text
await
cancel
skip
fast-forward
```

---

# 13. Animation Timing Guidelines

Base ranges:

```text
hover              80–140 ms
button feedback    80–140 ms
card pickup        180–260 ms
card play          240–400 ms
card flip          250–400 ms
target highlight   200–350 ms
impact             150–300 ms
major effect       400–800 ms
turn transition    300–500 ms
```

Avoid unnecessarily slow gameplay.

Animation should communicate game logic.

Animation should NEVER block the game for visual decoration alone.

---

# 14. Card Interaction

Cards in hand must support:

```text
hover
focus
selection
drag
playable
unplayable
target-required
disabled
preview
```

Suggested hover behavior:

```text
translateY(-20px)
scale(1.05–1.10)
increase z-index
increase shadow
show readable preview
```

Selected card:

```text
strong border/glow
slightly larger
clearly separated from neighboring cards
```

Playable cards should be immediately distinguishable.

Unplayable cards should be visually subdued without becoming unreadable.

---

# 15. Card Hand Layout

Cards should form a dynamic fan.

Example:

```text
2 cards → almost flat

5 cards → slight fan

10 cards → stronger overlap

15+ cards → tighter overlap + scroll/fan compensation
```

Do not let cards become unreadable.

Hovered card must rise above neighboring cards.

Hand should remain centered.

---

# 16. Game Table Layout

Conceptual desktop layout:

```text
┌────────────────────────────────────────────────────────┐
│                  OPPONENT AREA                         │
│                                                        │
│   Player 2      Player 3      Player 4      Player 5   │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│                    GAME TABLE                          │
│                                                        │
│       Draw Deck                  Discard Pile          │
│                                                        │
│                  Action Area                           │
│                                                        │
├────────────────────────────────────────────────────────┤
│                 YOUR PSYCHE                            │
│                                                        │
│ Disorder    Disorder    Disorder    Disorder            │
│                                                        │
├────────────────────────────────────────────────────────┤
│                     YOUR HAND                          │
│                                                        │
│            🂠 🂠 🂠 🂠 🂠 🂠                           │
└────────────────────────────────────────────────────────┘
```

This is conceptual only.

The UI/UX skill should refine it.

---

# 17. Opponent UI

Each opponent requires:

```text
name
avatar
card count
psyche
treated disorders
active-player indicator
status/effects
targetable state
```

Do not show hidden hand contents.

Opponents should remain readable even with 8 players.

Layout algorithm should reposition players depending on player count.

---

# 18. Dynamic Player Layout

Support:

```text
2 players
3 players
4 players
5 players
6 players
7 players
8 players
```

Do NOT use manually hardcoded coordinates for each individual player.

Create:

```text
OpponentLayoutManager
```

Input:

```text
playerCount
viewportWidth
viewportHeight
```

Output:

```text
player positions
psyche bounds
avatar bounds
interaction bounds
```

---

# 19. Auto Scale System

Use a logical game resolution:

```text
DESIGN_WIDTH  = 1920
DESIGN_HEIGHT = 1080
```

Calculate:

```ts
scale = Math.min(
    viewportWidth / DESIGN_WIDTH,
    viewportHeight / DESIGN_HEIGHT
)
```

Game world should scale uniformly.

Maintain aspect ratio.

Never stretch cards.

Use safe margins.

Allow letterboxing if necessary.

---

# 20. Layout Units

Avoid scattering magic pixel values.

Use layout tokens.

Example:

```ts
LAYOUT = {
    safeMargin: 32,
    cardWidth: 180,
    cardHeight: 300,
    cardGap: 18,
    opponentGap: 32,
    handBottom: 24
}
```

Everything should derive from the design coordinate system.

---

# 21. Card Component Architecture

Create a generic card renderer.

```text
Card
├── CardFrame
├── CardArtwork
├── CardTitle
├── CardType
├── CardDescription
├── CardEffect
├── CardTags
└── CardOverlay
```

Do not manually code every card component.

Card content comes from data.

---

# 22. Card Data

Example:

```json
{
    "id": "example-card",
    "name": "Example",
    "type": "DISORDER",
    "art": "example.webp",
    "effect": {},
    "metadata": {}
}
```

All card definitions should exist in:

```text
data/cards/
```

Game engine loads definitions through a CardRegistry.

---

# 23. Asset Independence

UI must not depend on final artwork.

Use placeholders initially.

Every asset should be referenced through:

```text
AssetRegistry
```

Example:

```text
card.disorder.anxiety
card.drug.example
ui.deck.back
ui.table.background
fx.cardGlow
```

Never directly scatter paths like:

```text
/assets/cards/123.png
```

through game logic.

---

# 24. Asset Replacement

Final artwork should be replaceable by changing:

```text
manifest.json
```

rather than editing gameplay code.

Example:

```json
{
    "card.anxiety": "/assets/cards/anxiety.webp"
}
```

---

# 25. Visual Effects

Use subtle effects such as:

```text
glow
shadow
blur
mask
particle burst
screen shake
card trails
highlight rings
pulse
flash
```

Do not overuse effects.

Card readability is more important than visual spectacle.

---

# 26. Important Gameplay Animations

At minimum implement polished animations for:

### Draw Card

```text
deck pulse
→ card rises
→ card moves toward player
→ card rotates
→ card joins hand
→ hand reorganizes
```

### Play Card

```text
selected card rises
→ neighboring cards move aside
→ card flies to center
→ card enlarges
→ effect resolves
→ card moves to target/discard
```

### Apply Drug

```text
drug card moves toward Disorder
→ Disorder highlights
→ cards visually bind
→ treated-state indicator appears
```

### Episode

```text
Episode enters center
→ target player highlighted
→ targeted Disorder highlighted
→ impact animation
→ effect resolves
```

### Therapy

```text
Therapy card enters play
→ target Disorder glows
→ cure animation
→ Disorder leaves psyche
```

### Side Effect

```text
Drug pulses
→ side-effect indicator appears
→ incoming Disorder travels toward player
→ psyche layout reorganizes
```

### Victory

```text
freeze gameplay
→ dim background
→ winner focus
→ victory animation
→ match summary
```

---

# 27. Hover & Interaction Feedback

Every interactive object needs feedback.

States:

```text
normal
hover
pressed
selected
disabled
invalid
targetable
targeted
resolving
```

Never require the player to guess whether something can be clicked.

---

# 28. Target Selection UX

When a card needs a target:

1. Dim irrelevant objects.
2. Highlight valid targets.
3. Invalid targets should not respond.
4. Hovering a target shows expected result.
5. Clicking empty space cancels selection when allowed.
6. ESC cancels.
7. Selected card remains visible throughout targeting.

---

# 29. Tooltip System

Cards should support enlarged inspection.

Methods:

```text
hover delay
right click
keyboard shortcut
```

Large preview should display:

```text
art
card title
effect
side effects
important keywords
```

Do not require tiny card text to be read directly from the table.

---

# 30. Game Log

Include collapsible history.

Example:

```text
Hieu drew a card.

Minh played Fluoxetine.

Minh treated Depression.

Side effect exposed:
Anxiety.

Linh played Episode on Minh.

Depression episode triggered.
```

Useful for:

- understanding gameplay
- debugging
- replay
- multiplayer synchronization

---

# 31. Feedback Layer

Important actions should produce feedback in several channels:

```text
animation
text
sound
highlight
state change
```

Example:

```text
INVALID TARGET

→ short shake
→ subtle red outline
→ tooltip explaining why
```

Do not silently reject actions.

---

# 32. Audio Architecture

Create separate audio system:

```text
AudioManager
```

Categories:

```text
UI
card
effect
ambience
music
```

Settings:

```text
master volume
music volume
SFX volume
mute
```

Gameplay must work with audio disabled.

---

# 33. State Management

Do not place the authoritative game state entirely inside React components.

Recommended separation:

```text
GameEngine
    authoritative state

Store
    UI-visible state

React
    presentation
```

A lightweight store such as Zustand can be used for application/UI state.

---

# 34. Deterministic RNG

Use seeded randomness.

Never call uncontrolled:

```ts
Math.random()
```

inside important game logic.

Use:

```text
SeededRandom
```

This enables:

```text
replays
tests
bot simulations
bug reproduction
multiplayer synchronization
```

---

# 35. Replay Architecture

Store commands/events.

Example:

```json
[
  {
    "turn": 1,
    "player": "P1",
    "command": "DRAW_CARD"
  },
  {
    "turn": 1,
    "player": "P1",
    "command": "PLAY_DRUG",
    "card": "..."
  }
]
```

A game should theoretically be reconstructable from:

```text
initial seed
+
command log
```

---

# 36. Bot-Ready Architecture

Even if bots are not implemented immediately, engine APIs must allow:

```ts
getLegalActions(playerId)
```

and:

```ts
executeAction(action)
```

This allows future bots to evaluate game state without interacting with the UI.

---

# 37. Multiplayer-Ready Architecture

Do not build gameplay that assumes the active player and client are the same thing.

Use:

```text
playerId
```

for every action.

Example:

```ts
engine.execute({
    type: "PLAY_CARD",
    playerId,
    cardId,
    targetId
})
```

This allows later implementation of:

```text
WebSocket
rooms
invite links
reconnect
spectators
```

without rewriting the core game.

---

# 38. Performance Requirements

Target:

```text
60 FPS animation
```

Avoid unnecessary React re-renders.

Use:

```text
transform
opacity
GPU-friendly animation
requestAnimationFrame
texture atlas where appropriate
```

Avoid animating:

```text
width
height
top
left
```

every frame when transforms can be used instead.

---

# 39. Resolution Testing

Automatically test UI at:

```text
1366×768
1440×900
1600×900
1920×1080
2560×1440
```

Check:

```text
no clipped buttons
no overlapping player panels
cards readable
hand accessible
targets clickable
modal fits screen
tooltips stay inside viewport
```

---

# 40. Gameplay Testing

Create automated tests for:

```text
setup
card draw
turn order
valid card plays
invalid card plays
target validation
drug treatment
side effects
episode resolution
therapy
special cards
deck exhaustion
player victory
```

Tests must operate directly against the engine.

No browser required.

---

# 41. Simulation Testing

Create:

```text
game/simulation/
```

Implement random legal-action bots.

Run:

```text
100
1,000
10,000
```

automated matches.

Look for:

```text
crashes
impossible states
infinite turns
invalid targets
duplicate cards
negative card counts
deadlocks
unreachable victory
```

---

# 42. Visual Debug Mode

Developer mode:

```text
?debug=true
```

Should expose:

```text
FPS
resolution
render scale
game phase
active player
current legal actions
card IDs
player IDs
animation queue
event history
```

Optional:

```text
bounding boxes
hit areas
layout anchors
```

---

# 43. Animation Debugger

Create a developer animation panel.

Allow:

```text
play animation
pause
restart
slow motion
0.25×
0.5×
1×
2×
```

Animations should be previewable without playing an entire match.

---

# 44. Card Sandbox

Create developer route:

```text
/dev/cards
```

Capabilities:

```text
display every card
search card
filter by type
hover preview
play animations
test artwork
test card text
test different resolutions
```

---

# 45. Interaction Sandbox

Create:

```text
/dev/animations
```

Show individually:

```text
draw
discard
play
flip
hover
target
attack
side effect
therapy
win
shuffle
deal
```

This prevents animation development from requiring full gameplay sessions.

---

# 46. UI Editor-Friendly Architecture

Important visual parameters should live in configuration.

Example:

```text
ui.config.ts
animation.config.ts
layout.config.ts
```

Values:

```text
card size
hover amount
fan angle
animation duration
easing
player spacing
deck position
discard position
psyche positions
HUD positions
```

Avoid hiding layout constants inside components.

---

# 47. Design Tokens

Centralize:

```text
colors
spacing
radius
shadow
font scale
z-index
animation duration
easing
```

Example:

```ts
export const motionTokens = {
    fast: 120,
    normal: 240,
    slow: 420,
    dramatic: 700
}
```

---

# 48. UI Style Direction

Visual direction should feel:

```text
psychological
medical
surreal
darkly playful
premium tabletop game
```

Avoid turning the interface into a hospital management dashboard.

Potential visual language:

```text
paper texture
clinical labels
pharmaceutical packaging
handwritten annotations
psychiatric chart motifs
subtle distortion
ink
controlled grain
```

Keep the cards themselves visually dominant.

---

# 49. Accessibility

Even though this is a game:

- Do not rely exclusively on color.
- Provide clear hover/selected states.
- Support reduced motion.
- Keep important text readable.
- Keyboard ESC should dismiss/cancel.
- Important actions should have tooltips.
- Use sufficient contrast.
- Never use rapid flashing.

When:

```text
prefers-reduced-motion
```

is enabled:

reduce or eliminate:

```text
camera shake
large translations
rapid scaling
particle effects
```

---

# 50. Error Handling

Never silently fail.

Development errors should contain:

```text
action
player
card
game phase
expected state
actual state
```

Example:

```text
InvalidActionError:
Player P3 attempted PLAY_DRUG
during TARGET_SELECTION.
```

---

# 51. Save / Restore

Game state should be serializable.

Functions:

```ts
serializeGame()
deserializeGame()
```

This enables:

```text
save game
reconnect
debug snapshots
replays
multiplayer
```

---

# 52. Development Order

Do NOT start by polishing final graphics.

Follow this order.

## Phase 1 — Research

```text
rules
cards
game states
edge cases
interaction map
```

## Phase 2 — Engine

```text
state
rules
commands
effects
validation
win conditions
```

## Phase 3 — Automated Tests

Make sure engine works without UI.

## Phase 4 — Simulation

Random bots should complete matches.

## Phase 5 — Basic Renderer

Placeholder rectangles/cards only.

## Phase 6 — Full Interaction

```text
draw
select
play
target
discard
end turn
```

## Phase 7 — UI/UX

Build the actual table layout.

## Phase 8 — Animation

Add animation queue and polished interactions.

## Phase 9 — Assets

Replace placeholders.

## Phase 10 — Audio

Add feedback.

## Phase 11 — Polish

```text
resolution testing
performance
animation tuning
UX testing
bug fixing
```

---

# 53. Definition of Done

The base game is considered complete only when:

- A complete game can start.
- All supported player counts work.
- Rules are enforced by the engine.
- Illegal actions are prevented.
- Players can draw cards.
- Players can play all relevant card types.
- Target selection works.
- Side effects resolve correctly.
- Episodes resolve correctly.
- Therapy resolves correctly.
- Victory is detected correctly.
- Game animations remain synchronized with state.
- Animations run smoothly at approximately 60 FPS.
- UI automatically scales across target desktop resolutions.
- No mobile implementation is required.
- Game state is serializable.
- Engine tests pass.
- Automated bot simulations finish reliably.
- Visual debug tools work.
- Animation sandbox works.
- Card sandbox works.
- Assets can be replaced without changing gameplay logic.

---

# 54. Strict Coding Rules for the Agent

When working on this repository:

1. Read this `MASTER.md` before making architectural changes.
2. Read `GAME_RULES.md` before changing game logic.
3. Never mix animation logic with rule resolution.
4. Never put authoritative gameplay logic inside React components.
5. Never use artwork dimensions as game logic.
6. Never hardcode individual cards when a data-driven system can be used.
7. Never add mobile-specific code unless explicitly requested.
8. Never sacrifice gameplay clarity for flashy animation.
9. Never silently ignore invalid actions.
10. Never rewrite working systems solely for aesthetic reasons.
11. Keep renderer and engine independent.
12. Add tests whenever gameplay logic changes.
13. Run engine tests after rule modifications.
14. Run simulations after significant gameplay changes.
15. Check all target desktop resolutions after layout changes.
16. Use existing design/animation skills before inventing a new approach.
17. Prefer established libraries over custom implementations where appropriate.
18. Keep code modular and replaceable.
19. Update documentation when architecture changes.
20. Leave the repository in a playable state after every major milestone.

---

# 55. Final Product Standard

The target quality is not:

```text
"the rules technically work"
```

The target is:

```text
a polished digital tabletop/card-game experience
```

The player should immediately understand:

```text
Whose turn is it?
What can I play?
What can I target?
What just happened?
Why did it happen?
What changed?
What should I do next?
```

Every animation, highlight, sound and layout decision should help answer one of those questions.