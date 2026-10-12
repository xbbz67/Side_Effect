import { useState } from 'react';
import { CardFace } from './CardPreview';
import type { Setup } from '../game/engine/GameState';
export function Lobby({
  onStart,
  onResume,
  hasSave,
  onRules,
}: {
  onStart: (setup: Setup) => void;
  onResume: () => void;
  hasSave: boolean;
  onRules: () => void;
}) {
  const [count, setCount] = useState(3),
    [mode, setMode] = useState('bots'),
    [name, setName] = useState('You'),
    [seed, setSeed] = useState('42');
  const [error, setError] = useState('');
  const start = () => {
    const number = Number(seed);
    if (!Number.isSafeInteger(number) || !name.trim()) {
      setError('Enter your name and a whole-number seed.');
      return;
    }
    onStart({
      seed: number,
      players: Array.from({ length: count }, (_, i) => ({
        name:
          i === 0
            ? name.trim().slice(0, 30)
            : ['Mara', 'Felix', 'June', 'Iris', 'Theo', 'Remy', 'Ada'][i - 1],
        bot: i > 0 && mode === 'bots',
      })),
    });
  };
  return (
    <div className="lobby">
      <header className="lobby-header">
        <a href="/" className="wordmark" translate="no">
          Pillbox / digital table
        </a>
        <div className="lobby-nav">
          {hasSave && (
            <button type="button" className="text-button" onClick={onResume}>
              Resume saved table
            </button>
          )}
          <button className="text-button" onClick={onRules}>
            How to play
          </button>
        </div>
      </header>
      <section className="lobby-copy">
        <div className="prescription">
          <span>For external play only</span>
          <span>2–8 minds</span>
        </div>
        <h1>
          SIDE
          <br />
          EFFECTS<span className="title-period">®</span>
        </h1>
        <p className="lobby-intro">
          A little treatment.
          <br />A whole lot of trouble.
        </p>
        <p className="lobby-description">
          Treat your Psyche. Navigate the side effects.
          <br />
          Try to keep your friends out of your head.
        </p>
        <form
          className="lobby-controls"
          onSubmit={(e) => {
            e.preventDefault();
            start();
          }}
        >
          <div className="seat-chooser">
            <span>At the table</span>
            <div role="group" aria-label="Player count">
              {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  type="button"
                  key={n}
                  className={n === count ? 'chosen' : ''}
                  aria-pressed={n === count}
                  onClick={() => setCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="lobby-fields">
            <label>
              Your name
              <input
                name="name"
                autoComplete="off"
                maxLength={30}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Company
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="bots">Play with bots</option>
                <option value="hotseat">Local hotseat</option>
              </select>
            </label>
            <label className="seed-field">
              Shuffle seed
              <input
                name="seed"
                inputMode="numeric"
                autoComplete="off"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
              />
            </label>
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="primary start" type="submit">
            Take a seat <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>
      <div className="lobby-art" aria-hidden="true">
        <div className="lobby-art-caption">Every cure has a catch.</div>
        <div className="hero-card hero-left">
          <CardFace cardId="anxiety" />
        </div>
        <div className="hero-card hero-right">
          <CardFace cardId="drug_anxiety" />
        </div>
        <div className="hero-card hero-center">
          <CardFace cardId="episode" />
        </div>
        <div className="stamp">
          Handle
          <br />
          with care
        </div>
        <div className="handwritten">
          side effects may include
          <br />
          losing all your friends
        </div>
      </div>
      <footer className="lobby-footer">
        <span>An independent digital adaptation of Side Effects by Pillbox Games.</span>
        <span>Local play • Digital rules profile 1</span>
        <a href="/dev/cards">Card room</a>
      </footer>
    </div>
  );
}
