# Actual game loop and proposed digital phases

The real ordinary loop is **draw two → optional maximum two card plays → discard excess to six → next clockwise player**. It is not a draw-or-play action economy. Episodes and bargaining create additional resolution/transfer situations. [Official turns](https://pillboxgames.com/cdn/shop/files/3.png?v=1778020934&width=900), [Episode/turn end](https://pillboxgames.com/cdn/shop/files/7.png?v=1778021009&width=900), [bargaining](https://pillboxgames.com/cdn/shop/files/8.png?v=1778021129&width=900).

```text
SETUP
  -> TURN_START / inspect existing Episode restrictions [timing gate]
  -> DRAW_TWO [or blocked-draw/skip policy after ruling]
  -> MAIN: zero to two plays
       PLAY intent -> VALIDATE -> RESOLVE
          Drug: attach / mark treated
          Disorder: add to eligible opponent Psyche
          Therapy: discard Therapy + own eligible Disorder
          Episode: resolve selected untreated opponent Disorder
             automatic effect OR mandatory choice/timed challenge
       -> WIN_CHECK [exact boundary is proposed]
       -> MAIN if budget remains; otherwise CLEANUP
  -> CLEANUP: discard own excess above six
  -> TURN_END / restriction expiry [timing gate]
  -> next clockwise TURN_START

WIN_CHECK -> GAME_OVER if first winner
```

The capitalized phases are **PROPOSED DIGITAL UX / ENGINE DESIGN** for expressing verified actions. They are not printed rulebook phase names. No generic OPTIONAL_RESPONSE state belongs in the retail base game: Episode victim selections are required effect resolution. Out-of-turn hand transfers are separate bargaining commands, not a free card-play phase.

[State machine](state-machine.md) defines phase authority; [turn structure](../rules/turn-structure.md) identifies unresolved timing; [targeting](targeting.md) defines validation; [event model](event-system.md) defines visible movement.

## Minimum transition conditions

- Mandatory draw completes before a main play is accepted, unless a researched restriction replaces that phase.
- A play consumes one allowance only after validation succeeds. A pending Episode blocks another ordinary play until resolved.
- Local selection/cancel does not move cards. A server-confirmed accepted play can require a victim choice without opening a card response window.
- Turn cannot advance while required choices or excess-hand cleanup remain unresolved.
- Once victory is committed, ordinary game intents stop. Animation can continue rendering that accepted outcome.
- Every phase transition is logged; reconnect does not repeat automatic draw or consume a second allowance.

These conditions are design contracts. Timing-sensitive claims depend on the unknowns, rather than being implied by this diagram.
