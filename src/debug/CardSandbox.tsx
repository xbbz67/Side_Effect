import { useState } from 'react';
import { motion } from 'motion/react';
import { cards } from '../game/cards/CardRegistry';
import { CardFace } from '../ui/CardPreview';
import { Modal } from '../ui/Modal';
export function CardSandbox() {
  const params = new URLSearchParams(location.search);
  const [query, setQuery] = useState(params.get('q') ?? ''),
    [type, setType] = useState(params.get('type') ?? 'all'),
    [inspect, setInspect] = useState<string>(),
    [sample, setSample] = useState(0);
  const filtered = cards.filter(
    (c) =>
      (type === 'all' || c.type === type) && c.name.toLowerCase().includes(query.toLowerCase()),
  );
  const sync = (q: string, t: string) => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (t !== 'all') p.set('type', t);
    history.replaceState(null, '', `${location.pathname}${p.size ? '?' + p.toString() : ''}`);
  };
  return (
    <div className="sandbox">
      <header>
        <a href="/">Back to lobby</a>
        <h1>Card room</h1>
        <a href="/dev/animations">Animation lab</a>
      </header>
      <div className="sandbox-toolbar">
        <label>
          Find a card
          <input
            type="search"
            name="q"
            autoComplete="off"
            placeholder="Anxiety…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              sync(e.target.value, type);
            }}
          />
        </label>
        <label>
          Card type
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              sync(query, e.target.value);
            }}
          >
            {['all', 'disorder', 'drug', 'therapy', 'episode'].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <span>{filtered.length} definitions • functional paraphrases</span>
        <button onClick={() => setSample(sample + 1)}>Preview play animation</button>
      </div>
      <div className="catalogue">
        {filtered.map((c, i) => (
          <motion.button
            key={c.id}
            className="catalogue-card"
            aria-label={`Inspect ${c.name}`}
            initial={false}
            animate={sample ? { y: [0, -25, 0], rotate: [0, 2, 0] } : {}}
            transition={{ duration: 0.45, delay: i * 0.025 }}
            whileHover={{ y: -12, scale: 1.04 }}
            onClick={() => setInspect(c.id)}
          >
            <CardFace cardId={c.id} />
          </motion.button>
        ))}
        {!filtered.length && <p>No cards match. Try another name or type.</p>}
      </div>
      {inspect && (
        <Modal
          title={cards.find((c) => c.id === inspect)!.name}
          onClose={() => setInspect(undefined)}
        >
          <div className="sandbox-preview">
            <CardFace cardId={inspect} />
          </div>
        </Modal>
      )}
    </div>
  );
}
