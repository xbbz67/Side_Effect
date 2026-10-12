import { definition, type CardDefinition } from '../game/cards/CardRegistry';
import manifest from '../assets/manifest.json';
export function CardArt({ card }: { card: CardDefinition }) {
  const path = (manifest as Record<string, string | null>)[`card.${card.id}`];
  if (path) return <img src={path} alt="" width="180" height="180" />;
  const drug = card.type === 'drug';
  return (
    <svg viewBox="0 0 180 180" aria-hidden="true">
      <circle cx="90" cy="90" r="76" fill="currentColor" opacity=".07" />
      <circle cx="90" cy="90" r="74" fill="none" stroke="currentColor" opacity=".3" />
      {drug ? (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <rect x="56" y="25" width="68" height="130" rx="34" transform="rotate(30 90 90)" />
          <path d="M58 71L120 108M85 37L79 55M96 42L90 60M107 47L101 65" />
        </g>
      ) : card.type === 'episode' ? (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M90 18L109 54L151 37L133 79L165 101L126 115L136 153L96 134L65 164L60 123L20 117L50 85L29 49L71 56Z" />
          <path d="M90 63V103" strokeWidth="7" />
          <circle cx="90" cy="120" r="4" fill="currentColor" />
        </g>
      ) : card.type === 'therapy' ? (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M90 141C26 116 45 40 90 63C133 32 158 114 90 141ZM90 141V165" />
          <ellipse cx="90" cy="95" rx="46" ry="53" />
        </g>
      ) : (
        <g fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M65 150C33 122 42 44 83 32C132 15 150 98 119 140L112 150Z" />
          <path d="M85 32C43 89 126 92 69 124M112 43C57 54 140 102 95 137M60 72C139 50 53 112 126 110M51 108C135 145 120 43 74 70M73 150V164H113V150" />
          <circle cx="71" cy="87" r="11" />
        </g>
      )}
    </svg>
  );
}
export function CardFace({ cardId, compact = false }: { cardId: string; compact?: boolean }) {
  const d = definition(cardId);
  return (
    <article className={`paper-card ${d.type}${compact ? ' compact' : ''}`}>
      <span className="card-type">{d.type === 'drug' ? 'Treatment' : d.type}</span>
      <h3>{d.name}</h3>
      <CardArt card={d} />
      {!compact && (
        <>
          <p>{d.type === 'disorder' ? `Episode: ${episodeDescription(d.episode)}` : d.effect}</p>
          {d.sideEffects.length > 0 && (
            <div className="side-effects">
              <strong>Exposes you to</strong>
              <span>{d.sideEffects.map((id) => definition(id).name).join(', ')}</span>
            </div>
          )}
          {d.type === 'disorder' && (
            <small>
              {d.therapyAllowed ? 'Therapy allowed' : 'Cannot use Therapy'}
              {d.id === 'anorexia' ? ' • No Drug' : ''}
            </small>
          )}
        </>
      )}
    </article>
  );
}
export function episodeDescription(kind: string | null) {
  return (
    (
      {
        remove_all_attached_drugs: 'Lose all attached Drugs.',
        discard_entire_hand: 'Discard your entire hand.',
        skip_round: 'Skip your next turn.',
        timed_discard: 'Discard 3 cards in 3 seconds or lose your hand.',
        random_hand_theft: 'The attacker may take up to 3 random hand cards.',
        reveal_hand_optional_theft: 'Reveal your hand to the attacker, who may take 1 card.',
        block_play_round: 'No card plays on your next turn.',
        block_draw_round: 'No draws on your next turn.',
      } as Record<string, string>
    )[kind ?? ''] ?? 'Choose an opponent’s untreated Disorder.'
  );
}
