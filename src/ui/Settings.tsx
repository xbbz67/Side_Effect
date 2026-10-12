import { useState } from 'react';
import type { GameController } from '../game/GameController';
export function Settings({ controller }: { controller: GameController }) {
  const [values, setValues] = useState({ ...controller.audio.settings });
  const [reduced, setReduced] = useState(controller.reduced);
  return (
    <div className="settings">
      <label className="check">
        <input
          type="checkbox"
          checked={reduced}
          onChange={(e) => {
            setReduced(e.target.checked);
            controller.reduced = e.target.checked;
            if (e.target.checked) controller.fastForward();
          }}
        />{' '}
        Reduced motion / instant card effects
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={values.mute}
          onChange={(e) => {
            const v = { ...values, mute: e.target.checked };
            setValues(v);
            controller.audio.settings = v;
            controller.audio.save();
          }}
        />{' '}
        Mute audio
      </label>
      {(['master', 'music', 'sfx'] as const).map((k) => (
        <label key={k}>
          {k === 'sfx' ? 'Card & effect volume' : `${k[0].toUpperCase() + k.slice(1)} volume`}
          <input
            type="range"
            min="0"
            max="1"
            step=".05"
            value={values[k]}
            onChange={(e) => {
              const v = { ...values, [k]: Number(e.target.value) };
              setValues(v);
              controller.audio.settings = v;
              controller.audio.unlock();
              controller.audio.save();
            }}
          />
        </label>
      ))}
      <p className="fine-print">
        Sounds are original synthesized tones. The table plays normally with sound muted. Music is a
        quiet sustained tone and is off by default.
      </p>
    </div>
  );
}
