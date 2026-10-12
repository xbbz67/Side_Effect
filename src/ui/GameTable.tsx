import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { GameController } from '../game/GameController';
import { GameRenderer } from '../renderer/GameRenderer';
import { definition } from '../game/cards/CardRegistry';
import type { Command } from '../game/engine/GameState';
import { CardFace } from './CardPreview';
import { Modal } from './Modal';
import { Rules } from './Rules';
import { Settings } from './Settings';
import { PendingEffect } from './PendingEffect';
import { DebugPanel } from '../debug/DebugPanel';

export function GameTable({
  controller,
  onLeave,
}: {
  controller: GameController;
  onLeave: () => void;
}) {
  const host = useRef<HTMLDivElement>(null),
    renderer = useRef<GameRenderer>(null);
  const view = useSyncExternalStore(controller.subscribe, controller.getSnapshot);
  const [preview, setPreview] = useState<string>(),
    [dialog, setDialog] = useState<
      'rules' | 'settings' | 'history' | 'gift' | 'leave' | 'save' | 'seat' | undefined
    >(),
    [localNotice, setLocalNotice] = useState('');
  const importFile = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const r = new GameRenderer(controller, (id) => setPreview(id));
    renderer.current = r;
    void r.init(host.current!).catch((e) => {
      setLocalNotice(
        `The table renderer could not start: ${e.message}. Check WebGL support and reload.`,
      );
    });
    return () => {
      r.dispose();
      renderer.current = null;
    };
  }, [controller]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || dialog)
        return;
      if (e.key === 'Escape') {
        controller.cancel();
        setPreview(undefined);
      }
      if (e.key.toLowerCase() === 'i' && controller.selected) setPreview(controller.selected);
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [controller, dialog]);
  const s = view.projection,
    own = s.players.find((p) => p.id === s.viewer),
    active = s.players[s.active],
    isOwn = active.id === s.viewer;
  const plays = view.legal.filter(
    (a): a is Extract<Command, { type: 'PLAY_CARD' }> =>
      a.type === 'PLAY_CARD' && a.cardId === view.selected,
  );
  const discard = view.legal.find((a) => a.type === 'DISCARD_CARD' && a.cardId === view.selected);
  const save = () => {
    try {
      localStorage.setItem('side-effects-save-1', controller.engine.serializeGame());
      setLocalNotice('Table saved on this browser.');
    } catch (e) {
      setLocalNotice(`Browser save failed: ${String(e)}. Use Export save instead.`);
    }
  };
  const download = () => {
    const blob = new Blob([controller.engine.serializeGame()], { type: 'application/json' }),
      url = URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = url;
    a.download = `side-effects-turn-${s.turn}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setLocalNotice('Save exported with the replay and full local match state.');
  };
  const send = (a: Command) => {
    setPreview(undefined);
    setLocalNotice('');
    void controller.execute(a);
  };
  return (
    <>
      <div className="canvas-host" ref={host} />
      <div className="table-ui">
        <div className="visually-hidden">
          <h1>Side Effects card table</h1>
          <h2>Public Psyches</h2>
          <ul>
            {s.players.map((p) => (
              <li key={p.id}>
                {p.name}: {p.handCount} hand cards.
                {p.psyche
                  .map(
                    (c) =>
                      `${definition(c.card).name}${
                        c.drug
                          ? `, treated; exposes ${definition(c.drug)
                              .sideEffects.map((id) => definition(id).name)
                              .join(', ')}`
                          : ', untreated'
                      }`,
                  )
                  .join('. ')}
              </li>
            ))}
          </ul>
        </div>
        <header className="table-header">
          <button
            className="brand-button"
            onClick={() => setDialog('leave')}
            title="Return to the lobby"
          >
            SIDE EFFECTS<small>A table for troubled minds</small>
          </button>
          <div className="turn-badge">
            <span className="turn-number">Turn {s.turn}</span>
            <strong>{isOwn ? 'Your turn' : `${active.name}'s turn`}</strong>
            <span>
              {s.phase === 'main'
                ? `${s.plays} / 2 plays`
                : s.phase === 'draw'
                  ? 'Draw phase'
                  : s.phase === 'pending'
                    ? 'Episode resolving'
                    : 'Match complete'}
            </span>
          </div>
          <nav aria-label="Table controls">
            {s.players.filter((p) => !p.bot).length > 1 && (
              <button disabled={view.busy || s.phase !== 'main'} onClick={() => setDialog('seat')}>
                Pass table
              </button>
            )}
            <button onClick={() => setDialog('rules')}>Rules</button>
            <button onClick={() => setDialog('history')}>History</button>
            <button onClick={() => setDialog('save')}>Save</button>
            <button onClick={() => setDialog('settings')} aria-label="Audio and motion settings">
              Settings
            </button>
          </nav>
        </header>
        <div className="table-instruction" role="status" aria-live="polite">
          <span>{view.busy ? 'Resolving cards…' : view.error || localNotice || view.notice}</span>
          {view.busy && (
            <button className="text-button" onClick={() => controller.fastForward()}>
              Skip animation
            </button>
          )}
        </div>
        <div className="turn-actions">
          {isOwn && s.phase === 'draw' && (
            <button
              className="primary"
              disabled={view.busy || view.handoff}
              onClick={() => send({ type: 'START_TURN', playerId: s.viewer })}
            >
              {own?.penalties.skip
                ? 'Sit out this turn'
                : own?.penalties.draw
                  ? 'Begin turn'
                  : 'Draw 2 cards'}
            </button>
          )}
          {isOwn && s.phase === 'main' && (
            <>
              <span>
                {own!.handCount > 6
                  ? `Discard ${own!.handCount - 6} to finish`
                  : `${own!.handCount} cards in hand`}
              </span>
              <button
                className="primary"
                disabled={view.busy || own!.handCount > 6}
                title="Finish after discarding to 6 or fewer cards"
                onClick={() => send({ type: 'END_TURN', playerId: s.viewer })}
              >
                End turn
              </button>
            </>
          )}
          {!isOwn && !s.pending && <span className="waiting">Waiting for {active.name}</span>}
        </div>
        {view.selected && !view.busy && (
          <aside className="selection-panel">
            <div className="selection-title">
              <span>{definition(view.selected).name}</span>
              <button onClick={() => controller.cancel()} aria-label="Cancel card selection">
                ×
              </button>
            </div>
            <p>
              {plays.length ? 'Choose a legal target:' : 'No legal target for this card right now.'}
            </p>
            <div className="target-buttons">
              {plays.map((a, i) => (
                <button
                  key={i}
                  className="target-button"
                  title={`Apply ${definition(a.cardId).name} to ${s.players.find((p) => p.id === a.targetPlayer)!.name}${a.targetCard ? ` / ${definition(a.targetCard).name}` : ''}`}
                  onClick={() => send(a)}
                >
                  {s.players.find((p) => p.id === a.targetPlayer)!.name}
                  {a.targetCard && <small>{definition(a.targetCard).name}</small>}
                </button>
              ))}
            </div>
            <div className="selection-tools">
              <button onClick={() => setPreview(view.selected)}>Inspect (I)</button>
              {discard && <button onClick={() => send(discard)}>Discard</button>}
              {s.phase === 'main' && <button onClick={() => setDialog('gift')}>Give card</button>}
            </div>
          </aside>
        )}
        {own && own.hand && !view.handoff && (
          <div
            className="hand-keyboard"
            role="group"
            aria-label="Your hand. Select a card, then choose a target."
          >
            {own.hand.map((id, i) => (
              <button
                key={id}
                className={id === view.selected ? 'chosen' : ''}
                disabled={view.busy}
                title={definition(id).name}
                aria-label={`Select ${definition(id).name}${view.legal.some((a) => a.type === 'PLAY_CARD' && a.cardId === id) ? ', playable' : ', no legal play'}`}
                aria-pressed={id === view.selected}
                onFocus={() => setPreview(id)}
                onBlur={() => setPreview(undefined)}
                onClick={() => controller.select(id)}
              >
                <span>{i + 1}</span>
                <span className="keyboard-card-name">{definition(id).name}</span>
              </button>
            ))}
          </div>
        )}
        <div className="table-footer">
          <span>Digital profile 1</span>
          <span>
            {s.players.length} players • {s.deckCount + s.discardCount} cards in piles
          </span>
        </div>
        {preview && !view.handoff && !dialog && (
          <div className="card-inspection">
            <button
              className="preview-close"
              onClick={() => setPreview(undefined)}
              aria-label="Close card inspection"
            >
              ×
            </button>
            <CardFace cardId={preview} />
          </div>
        )}
      </div>
      {view.handoff && (
        <div className="handoff">
          <div className="handoff-card">
            <span className="handoff-symbol" aria-hidden="true">
              ✳
            </span>
            <h2>
              Pass the table to
              <br />
              {s.players.find((p) => p.id === controller.viewer)!.name}
            </h2>
            <p>The next hand is hidden until they're ready.</p>
            <button className="primary" onClick={() => controller.reveal()}>
              I'm ready — show my hand
            </button>
          </div>
        </div>
      )}
      {s.pending && !view.handoff && !view.busy && (
        <PendingEffect key={s.pending.episode} controller={controller} />
      )}
      {s.phase === 'won' && !view.busy && (
        <div className="result">
          <div className="result-paper">
            <span className="result-seal" aria-hidden="true">
              ✓
            </span>
            <p>A clear state of mind</p>
            <h2>
              {s.players.find((p) => p.id === s.winner)!.name === 'You'
                ? 'You win.'
                : `${s.players.find((p) => p.id === s.winner)!.name} wins.`}
            </h2>
            <p>
              Every Disorder treated.
              <br />
              One less troubled mind at the table.
            </p>
            <div className="result-summary">
              <span>{s.turn} turns</span>
              <span>{controller.engine.commands.length} actions</span>
              <span>Seed {controller.engine.setup.seed}</span>
            </div>
            <button className="primary" onClick={onLeave}>
              Back to the table lobby
            </button>
            <button className="text-button" onClick={download}>
              Export match replay
            </button>
          </div>
        </div>
      )}
      {dialog && (
        <Modal
          title={
            {
              rules: 'How to play',
              settings: 'Sound & motion',
              history: 'At this table',
              gift: 'A little bargaining',
              leave: 'Leave this table?',
              save: 'Keep this table',
              seat: 'Whose hand?',
            }[dialog]
          }
          onClose={() => setDialog(undefined)}
        >
          {dialog === 'seat' ? (
            <>
              <p>
                Pass the table privately to another local player. This changes the visible hand, not
                whose turn it is. Off-turn players can offer cards.
              </p>
              <div className="choice-cards">
                {s.players
                  .filter((p) => !p.bot && p.id !== s.viewer)
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPreview(undefined);
                        setDialog(undefined);
                        controller.switchViewer(p.id);
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
              </div>
            </>
          ) : dialog === 'rules' ? (
            <Rules />
          ) : dialog === 'settings' ? (
            <Settings controller={controller} />
          ) : dialog === 'history' ? (
            <ol className="history">
              {view.history.length ? (
                view.history.map((e, i) => <li key={i}>{e.text}</li>)
              ) : (
                <li>The table has been dealt. Draw to begin.</li>
              )}
            </ol>
          ) : dialog === 'gift' ? (
            <>
              <p>
                Give {view.selected ? definition(view.selected).name : 'your selected card'} to
                another player. This does not count as a play.
              </p>
              <div className="choice-cards">
                {s.players
                  .filter((p) => p.id !== s.viewer)
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        if (view.selected)
                          send({
                            type: 'GIFT_CARD',
                            playerId: s.viewer,
                            cardId: view.selected,
                            targetPlayer: p.id,
                          });
                        setDialog(undefined);
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
              </div>
            </>
          ) : dialog === 'leave' ? (
            <>
              <p>Save this match before returning to the lobby.</p>
              <div className="dialog-actions">
                <button
                  className="primary"
                  onClick={() => {
                    save();
                    onLeave();
                  }}
                >
                  Save & leave
                </button>
                <button onClick={onLeave}>Leave without saving</button>
              </div>
            </>
          ) : (
            <>
              <p>
                Save to this browser, or export a file you can restore later. Exports contain all
                local hands and the deterministic replay.
              </p>
              <div className="dialog-actions">
                <button className="primary" onClick={save}>
                  Save in browser
                </button>
                <button onClick={download}>Export save</button>
                <button onClick={() => importFile.current?.click()}>Import save</button>
              </div>
              <p role="status">{localNotice}</p>
            </>
          )}
        </Modal>
      )}
      <input
        ref={importFile}
        type="file"
        accept=".json,application/json"
        className="visually-hidden"
        aria-label="Import game save"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file)
            try {
              controller.restore(await file.text());
              setDialog(undefined);
              setLocalNotice('Saved table restored.');
            } catch (err) {
              setLocalNotice(`Cannot restore: ${String(err)}`);
            }
          e.target.value = '';
        }}
      />
      {new URLSearchParams(location.search).get('debug') === 'true' && (
        <DebugPanel controller={controller} renderer={renderer} />
      )}
    </>
  );
}
