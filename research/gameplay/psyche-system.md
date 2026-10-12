# Psyche model

**VERIFIED RULE:** starting size 4 at 2–5 seats or 3 at 6–8; no duplicate Disorder names even treated; Drug goes over matching Disorder; Therapy removes an untreated eligible Disorder; Episodes target untreated Disorders. [Setup](https://pillboxgames.com/cdn/shop/files/2.png?v=1778020923&width=900), [duplicates/Therapy](https://pillboxgames.com/cdn/shop/files/5.png?v=1778020982&width=900), [untreated rule](https://pillboxgames.com/cdn/shop/files/11.png?v=1778021187&width=900).

## Supported conceptual state

```text
Match
  edition / rulesVersion / policyVersion / cardDefinitionsVersion
  seatOrder / activeSeat / turnId / playsUsed / phase / revision
  drawPile [private ordered card-instance IDs]
  discardPile [public card definitions; ordering convention gated]
  resolvingCard? / pendingEffect? / terminalOutcome?
  players
    id / seat / displayName
    hand [private card-instance IDs]
    psyche
      Disorder instance
        definitionId / enteredByEvent
        attachedDrug instance? [single-attachment policy gated]
    episodeRestrictions [recipient/phase/expiry/cause; details gated]
Room [separate from physical game]
  connections / session capabilities / host / ready / pause / expiry
```

**PROPOSED DIGITAL UX / ENGINE DESIGN:** derive `treated` from an attached valid matching Drug; do not keep a freely mutable boolean that can disagree with the cards. A Therapy treatment is represented by absence of the Disorder, not a persistent Therapy flag. Active vulnerabilities are derived from attachments and missing Disorder names; no independently mutable side-effect list.

The baseline has no ongoing Episode card attachment, HP, damage, disease severity, emotional meter, or abstract permanent cured-name list. An Episode restriction can outlast the physical Episode card; its precise lifecycle needs a ruling. Room connection state is not part of the Disorder model.

## Bounds and ordering

**INFERRED BEHAVIOR:** maximum eight distinct Disorders in this base profile, because eight names exist and duplicates are forbidden. Minimum zero after removals, which satisfies the proposed winning predicate. Public card slots should survive treatment so both Disorder identity and Drug vulnerabilities remain legible. There is no sourced mechanical left/right ordering advantage. Preserve entry order for visual continuity only.

One Drug per Disorder is depicted; whether further Drugs can be stacked/replaced remains U09. Do not assert arbitrary multi-attachment behavior or store multiple treatments before that ruling. No Therapy/Drug mixed stack appears in this baseline.

## Card-zone transitions

| Operation | From | To | Other state |
|---|---|---|---|
| Deal starting Disorder | Disorder setup pile | Psyche | Public, untreated |
| Deal/draw hand card | Mixed draw pile | Hand | Owner only identity |
| Treat | Own hand Drug | Attachment to own matching Disorder | Derived treated; vulnerability labels available |
| Attack | Actor hand Disorder | Opponent Psyche | Public, untreated, absent name checked |
| Therapy | Actor hand Therapy + own Disorder | Discard | Removed name can be acquired later if vulnerable |
| Episode play | Actor hand Episode | Resolving, then discard | Trigger selected punishment |
| Madness punishment | Every victim attachment | Discard | Underlying Disorders persist, all now untreated |
| Hand loss | Relevant hand | Discard | Forced loss, no ordinary play count |
| Hand theft / gift | One hand | Another hand | Identity projection depends on effect |

Every instance must occupy exactly one zone, including pending resolution. Public treatment attachment represents two instances, not one flattened card. A server replay tracks instance movement even if the client only receives permitted identities.
