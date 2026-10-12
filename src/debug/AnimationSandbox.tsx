import { useEffect, useRef, useState } from 'react';
import { GameController } from '../game/GameController';
import { GameRenderer } from '../renderer/GameRenderer';
import type { GameEvent } from '../game/engine/GameState';
export function AnimationSandbox() {
  const host = useRef<HTMLDivElement>(null),
    r = useRef<GameRenderer>(null),
    c = useRef<GameController>(null);
  const [kind, setKind] = useState('draw'),
    [status, setStatus] = useState('Ready'),
    [paused, setPaused] = useState(false),
    [speed, setSpeed] = useState(1);
  useEffect(() => {
    const controller = new GameController({
      seed: 42,
      players: [
        { name: 'Animation subject', bot: false },
        { name: 'Target subject', bot: false },
      ],
    });
    const renderer = new GameRenderer(controller, () => {});
    c.current = controller;
    r.current = renderer;
    void renderer.init(host.current!).catch((e) => setStatus(String(e)));
    return () => controller.dispose();
  }, []);
  const play = () => {
    const controller = c.current,
      renderer = r.current;
    if (!controller || !renderer) return;
    controller.queue.cancel();
    controller.queue.setPaused(false);
    setPaused(false);
    controller.queue.setSpeed(speed);
    const types: Record<string, string> = {
      draw: 'CARD_DRAWN',
      discard: 'CARD_DISCARDED',
      play: 'CARD_PLAYED',
      flip: 'SANDBOX_FLIP',
      hover: 'SANDBOX_HOVER',
      target: 'PLAYER_TARGETED',
      attack: 'EPISODE_TRIGGERED',
      'side effect': 'SIDE_EFFECT_TRIGGERED',
      therapy: 'THERAPY_USED',
      win: 'PLAYER_WON',
      shuffle: 'DECK_SHUFFLED',
      deal: 'CARD_DRAWN',
    };
    const p = controller.engine.state.players;
    const event: GameEvent = {
      type: types[kind],
      text: kind,
      playerId: 'P1',
      targetPlayer: 'P2',
      targetCard: p[1].psyche[0].card,
      cardId: p[0].hand[0],
    };
    setStatus(`Playing ${kind}`);
    void controller.queue
      .enqueue(
        Array.from({ length: kind === 'deal' ? 4 : 1 }, () => ({
          label: kind,
          run: (signal) => renderer.animate(event, signal),
        })),
      )
      .then(() => setStatus('Complete'));
  };
  return (
    <>
      <div className="canvas-host" ref={host} />
      <div className="animation-lab">
        <a href="/">Back to lobby</a>
        <h1>Animation lab</h1>
        <p>Isolated canvas primitives. No game actions are executed.</p>
        <div className="animation-choices">
          {[
            'draw',
            'discard',
            'play',
            'flip',
            'hover',
            'target',
            'attack',
            'side effect',
            'therapy',
            'win',
            'shuffle',
            'deal',
          ].map((k) => (
            <button
              key={k}
              aria-pressed={k === kind}
              className={k === kind ? 'chosen' : ''}
              onClick={() => setKind(k)}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="dialog-actions">
          <button className="primary" onClick={play}>
            Play / restart
          </button>
          <button
            onClick={() => {
              c.current?.queue.setPaused(!paused);
              setPaused(!paused);
            }}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={() => {
              c.current?.queue.cancel();
              setStatus('Cancelled — final visual position');
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              c.current?.queue.fastForward();
              setStatus('Skipped to end');
            }}
          >
            Fast-forward
          </button>
          <label>
            Speed
            <select
              value={speed}
              onChange={(e) => {
                const n = Number(e.target.value);
                setSpeed(n);
                c.current?.queue.setSpeed(n);
              }}
            >
              {[0.25, 0.5, 1, 2].map((n) => (
                <option key={n} value={n}>
                  {n}×
                </option>
              ))}
            </select>
          </label>
        </div>
        <p role="status">{status}</p>
        <a href="/dev/cards">Open card room</a>
      </div>
    </>
  );
}
