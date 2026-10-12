import { useEffect, useState, type RefObject } from 'react';
import type { GameController } from '../game/GameController';
import type { GameRenderer } from '../renderer/GameRenderer';
import { worldScale } from '../config/layout.config';
export function DebugPanel({
  controller,
  renderer,
}: {
  controller: GameController;
  renderer: RefObject<GameRenderer | null>;
}) {
  const [fps, setFps] = useState(0),
    [open, setOpen] = useState(true);
  useEffect(() => {
    const timer = setInterval(
      () =>
        setFps(Math.round(controller.queue.frameStats.averageFps || renderer.current?.fps || 0)),
      500,
    );
    return () => clearInterval(timer);
  }, [renderer, controller]);
  const s = controller.getSnapshot();
  return (
    <aside className="debug-panel">
      <button onClick={() => setOpen(!open)}>Debug {open ? '−' : '+'}</button>
      {open && (
        <>
          <p>
            {fps} FPS • {innerWidth}×{innerHeight} • scale{' '}
            {worldScale(innerWidth, innerHeight).toFixed(3)}
          </p>
          <p>
            Phase {s.projection.phase} • {s.projection.players[s.projection.active].id} • viewer{' '}
            {s.projection.viewer} • revision {s.projection.version}
          </p>
          <p>
            Queue {controller.queue.length}: {controller.queue.current || 'idle'}
          </p>
          <div className="debug-actions">
            <button onClick={() => controller.queue.setPaused(!controller.queue.paused)}>
              {controller.queue.paused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={() => controller.queue.skip()}>Skip step</button>
            <button onClick={() => controller.fastForward()}>Fast-forward</button>
            <label>
              Speed
              <select
                defaultValue="1"
                onChange={(e) => controller.queue.setSpeed(Number(e.target.value))}
              >
                {[0.25, 0.5, 1, 2].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
          <details>
            <summary>{s.legal.length} legal actions / IDs</summary>
            <pre>{JSON.stringify(s.legal, null, 2)}</pre>
          </details>
          <details>
            <summary>Recent events</summary>
            <pre>{JSON.stringify(s.history.slice(-10), null, 2)}</pre>
          </details>
          <a href="/dev/animations">Animation lab</a> <a href="/dev/cards">Card room</a>
        </>
      )}
    </aside>
  );
}
