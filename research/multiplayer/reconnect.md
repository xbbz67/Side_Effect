# Reconnect and recovery

**PROPOSED DIGITAL UX / ENGINE DESIGN.** [Socket.IO recovery](https://socket.io/docs/v4/connection-state-recovery/) is an optimization; correctness needs snapshot fallback because recovery can fail.

## Resume protocol

1. Client reconnects with its private anonymous-seat credential and last received sequence. Use server-issued seat authority, not a desired player ID or old socket ID.
2. Server validates match membership and session generation, then serializes recovery relative to current room operations.
3. Server sends a viewer-specific authoritative snapshot containing revision, current turn, phase, plays used, public cards/counts, own hand, own permitted pending choice, restriction states and policy versions.
4. If compatible missing events remain available, server may send an ordered projected suffix after the snapshot boundary. Otherwise the snapshot is sufficient. Do not send a complete private history as a shortcut.
5. Client replaces stale local logical state, clears local card preview/drag, deduplicates events, reconstructs current choice, and displays a brief missed-action summary.
6. Retry a previously submitted uncertain command with the same command ID; persisted receipt distinguishes accepted, rejected, and unknown. Refreshing a browser must not make it a new game action.

## Snapshot contents and persistence

Internal snapshot retains every card instance/zone, private draw order, hands, active seat, turn ID, play budget, pending-choice stage, timer deadline/result, committed outcome, sequence, rules/content/policy versions and random outcomes needed for replay. Public/owner snapshots are projections of that internal state. Store resumable credentials separately from domain history and redact them from logs.

Persist after each committed transaction or maintain a durable event stream with checked checkpoints. If a server crashes after commit but before acknowledgement, recovery reuses the persisted receipt; if it crashes before commit, the command may be retried and applied once. Emitting before commit would break this distinction.

## Cases

| Interruption | Recovery behavior |
|---|---|
| Hover/target selection | Purely local; reset preview, no domain mutation |
| Submitted Drug before ack | Inspect command receipt; never duplicate attachment/play count |
| Animation mid-flight | Snap scene to recovered state; animation not resumed as gameplay |
| Anxiety reveal/choice | Restore chooser-only grant if still pending; otherwise revoke live drawer |
| Gambling random theft | Reuse committed sampled outcomes; never resample on retry |
| Tremors challenge | Show authoritative remaining deadline or committed failure/success; pause policy remains U05 |
| End-turn excess discard | Restore hand and required count; do not advance prematurely |
| Host offline | Separate host reassignment from game state |
| Browser refresh | Credential restores same seat; stale match/command namespaces rejected |
| Entire server restart | Durable state restores room or honestly reports unrecoverable match; no fake clean restart |

Transport buffers can contain stale intents. After reconnect, do not blindly flush new IDs for locally guessed past actions. Only explicitly reconcile uncertain submitted commands. [Socket.IO delivery guidance](https://socket.io/docs/v4/delivery-guarantees/) notes retries/persistence need application handling; refresh can lose pending client events.

A second browser tab for the same seat must have a stated policy: proposed one controlling connection generation with other tabs read-only, so competing intents cannot silently race. Credential theft prevention and rotation belong to session security, not game legality.
