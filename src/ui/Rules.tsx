export function Rules() {
  return (
    <div className="rules-copy">
      <p>
        <strong>Be the first to treat every Disorder in your Psyche.</strong> Treated cards can stay
        on the table. A clear Psyche also wins.
      </p>
      <ol>
        <li>Draw 2 cards at the start of your turn.</li>
        <li>Play up to 2 cards. You may also pass.</li>
        <li>Discard to 6 hand cards or fewer, then end your turn.</li>
      </ol>
      <dl>
        <dt>Drugs</dt>
        <dd>
          Attach a Drug to its matching untreated Disorder in your own Psyche. Its side effects let
          opponents attack you with the listed Disorders.
        </dd>
        <dt>Disorders</dt>
        <dd>
          Add a Disorder from your hand to an opponent exposed to it. They cannot already have that
          Disorder. Players with no Drugs are immune.
        </dd>
        <dt>Therapy</dt>
        <dd>
          Remove an untreated Disorder from your own Psyche, except Tremors. Anorexia has no Drug,
          so use Therapy.
        </dd>
        <dt>Episodes</dt>
        <dd>
          Target an opponent's untreated Disorder to trigger its punishment. Inspect the Disorder to
          see its Episode.
        </dd>
        <dt>Bargaining</dt>
        <dd>
          You may give hand cards to other players during anyone's main phase. Gifts and discards
          cost no plays.
        </dd>
      </dl>
      <p>
        Click a card, then a highlighted target. You can drag it onto a target, or use the hand and
        target controls with a keyboard. Press I to inspect; Esc cancels.
      </p>
      <p className="fine-print">
        Digital policies: restrictions last through the victim's next scheduled turn; repeated
        penalties refresh. Tremors starts when the victim is ready, with 3 seconds to choose up to 3
        cards. Some physical edge cases and copy counts remain unverified. See docs/GAME_RULES.md
        for the full profile. Historical bonus cards and expansions are excluded.
      </p>
    </div>
  );
}
