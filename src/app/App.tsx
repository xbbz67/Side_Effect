import { lazy, Suspense, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { World } from './World';
import { Lobby } from '../ui/Lobby';
import { Modal } from '../ui/Modal';
import { Rules } from '../ui/Rules';
import { GameController } from '../game/GameController';
import type { Setup } from '../game/engine/GameState';
const GameTable = lazy(() => import('../ui/GameTable').then((m) => ({ default: m.GameTable })));
const CardSandbox = lazy(() =>
  import('../debug/CardSandbox').then((m) => ({ default: m.CardSandbox })),
);
const AnimationSandbox = lazy(() =>
  import('../debug/AnimationSandbox').then((m) => ({ default: m.AnimationSandbox })),
);
function saved() {
  try {
    return localStorage.getItem('side-effects-save-1');
  } catch {
    return null;
  }
}
export function App() {
  const [controller, setController] = useState<GameController>(),
    [rules, setRules] = useState(false),
    [error, setError] = useState('');
  const start = (setup: Setup) => {
    controller?.dispose();
    setController(new GameController(setup));
  };
  const leave = () => {
    controller?.dispose();
    setController(undefined);
  };
  const resume = () => {
    try {
      const data = saved();
      if (!data) throw new Error('No browser save found');
      const s = JSON.parse(data);
      const c = new GameController(s.setup);
      try {
        c.restore(data);
      } catch (e) {
        c.dispose();
        throw e;
      }
      setController(c);
    } catch (e) {
      setError(String(e));
    }
  };
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to table
      </a>
      <World>
        <Suspense
          fallback={
            <div className="loading" role="status">
              Preparing the table…
            </div>
          }
        >
          {location.pathname === '/dev/cards' ? (
            <CardSandbox />
          ) : location.pathname === '/dev/animations' ? (
            <AnimationSandbox />
          ) : controller ? (
            <GameTable controller={controller} onLeave={leave} />
          ) : (
            <Lobby
              onStart={start}
              onResume={resume}
              hasSave={!!saved()}
              onRules={() => setRules(true)}
            />
          )}
        </Suspense>
        {rules && (
          <Modal title="How to play" onClose={() => setRules(false)}>
            <Rules />
          </Modal>
        )}
        {error && (
          <Modal title="Saved table could not open" onClose={() => setError('')}>
            <p>{error}</p>
          </Modal>
        )}
      </World>
    </MotionConfig>
  );
}
