import { useEffect, useState } from 'react';
import type { GameController } from '../game/GameController';
import { definition } from '../game/cards/CardRegistry';
import { Modal } from './Modal';
export function PendingEffect({ controller }: { controller: GameController }) {
  const view = controller.getSnapshot(),
    e = view.projection.pending!;
  const actor = e.kind === 'tremors' ? e.victim : e.actor;
  const player = view.projection.players.find((p) => p.id === actor)!;
  const victim = view.projection.players.find((p) => p.id === e.victim)!;
  const [selection, setSelection] = useState<string[]>([]),
    [remaining, setRemaining] = useState(3);
  useEffect(() => {
    const timer = setInterval(
      () =>
        setRemaining(
          Math.max(0, ((e.deadline ?? controller.now() + 3000) - controller.now()) / 1000),
        ),
      50,
    );
    return () => clearInterval(timer);
  }, [controller, e.deadline]);
  const now = () => controller.now();
  if (actor !== view.projection.viewer)
    return (
      <div className="pending-wait" role="status">
        Waiting for {player.name} to resolve {e.kind}.
      </div>
    );
  const resolve = (cards?: string[], take?: boolean) =>
    void controller.execute({ type: 'RESOLVE', playerId: actor, cards, take, now: now() });
  const options =
    e.kind === 'tremors' ? (victim.hand ?? []) : e.kind === 'anxiety' ? (victim.hand ?? []) : [];
  return (
    <Modal
      title={
        e.kind === 'tremors'
          ? 'Steady your hand'
          : e.kind === 'gambling'
            ? 'Try your luck'
            : 'A look inside'
      }
      onClose={() => controller.cancel()}
    >
      <p>
        {e.kind === 'tremors'
          ? `Choose ${e.required} cards in 3 seconds. If time runs out, your whole hand is discarded.`
          : e.kind === 'gambling'
            ? `Take up to 3 random cards from ${victim.name}, or decline.`
            : `${victim.name}'s hand is revealed to you. Take 1 card or decline.`}
      </p>
      {e.kind === 'tremors' && e.deadline === undefined ? (
        <button
          className="primary"
          onClick={() => void controller.execute({ type: 'READY', playerId: actor, now: now() })}
        >
          Ready — start 3 seconds
        </button>
      ) : (
        <>
          {e.kind === 'tremors' && (
            <div
              className="countdown"
              role="timer"
              aria-label={`${remaining.toFixed(1)} seconds remaining`}
            >
              {remaining.toFixed(1)}s
            </div>
          )}
          <div className="choice-cards">
            {options.map((c) => (
              <button
                key={c}
                aria-pressed={selection.includes(c)}
                className={selection.includes(c) ? 'chosen' : ''}
                onClick={() => {
                  if (e.kind === 'anxiety') resolve([c]);
                  else
                    setSelection(
                      selection.includes(c)
                        ? selection.filter((x) => x !== c)
                        : selection.length < e.required
                          ? [...selection, c]
                          : selection,
                    );
                }}
              >
                {definition(c).name}
              </button>
            ))}
          </div>
          {e.kind === 'tremors' ? (
            <button
              className="primary"
              disabled={selection.length !== e.required || controller.busy}
              onClick={() => resolve(selection)}
            >
              Discard {selection.length} / {e.required}
            </button>
          ) : e.kind === 'gambling' ? (
            <div className="dialog-actions">
              <button className="primary" onClick={() => resolve(undefined, true)}>
                Take random cards
              </button>
              <button onClick={() => resolve(undefined, false)}>Decline</button>
            </div>
          ) : (
            <button onClick={() => resolve([])}>Decline theft</button>
          )}
        </>
      )}
    </Modal>
  );
}
