import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { definition, type CardDefinition } from '../../game/cards/CardRegistry';
import { UI } from '../../config/ui.config';
import { AssetRegistry } from '../../assets/AssetRegistry';
export const cardColor = (d: CardDefinition) =>
  d.type === 'drug'
    ? UI.colors.drug
    : d.type === 'episode'
      ? UI.colors.red
      : d.type === 'therapy'
        ? UI.colors.therapy
        : UI.colors.ink;
export function text(
  value: string,
  x: number,
  y: number,
  size = 20,
  color = UI.colors.ink,
  width?: number,
  font = UI.font,
): Text {
  const t = new Text({
    text: value,
    style: {
      fontFamily: font,
      fontSize: size,
      fill: color,
      wordWrap: !!width,
      wordWrapWidth: width,
      lineHeight: size * 1.18,
    },
  });
  t.position.set(x, y);
  return t;
}
export function originalArt(id: string, size = 90, color = UI.colors.ink) {
  const c = new Container(),
    g = new Graphics();
  const seed = [...id].reduce((a, x) => a + x.charCodeAt(0), 0);
  const cx = size / 2,
    cy = size / 2;
  g.circle(cx, cy, size * 0.44)
    .fill({ color, alpha: 0.07 })
    .stroke({ color, width: 1, alpha: 0.25 });
  // Original line drawings generated from a definition key, never publisher artwork.
  if (id.startsWith('drug')) {
    g.roundRect(size * 0.28, size * 0.12, size * 0.42, size * 0.76, size * 0.21)
      .fill({ color: 0xffffff, alpha: 0.5 })
      .stroke({ color, width: 2.3 });
    g.moveTo(size * 0.29, cy)
      .lineTo(size * 0.71, cy)
      .stroke({ color, width: 2 });
    for (let i = 0; i < 4; i++)
      g.moveTo(size * 0.37 + i * 5, size * 0.24)
        .lineTo(size * 0.34 + i * 5, size * 0.37)
        .stroke({ color, width: 1 });
  } else if (id === 'therapy') {
    g.ellipse(cx, cy, size * 0.28, size * 0.31).stroke({ color, width: 2.3 });
    g.moveTo(cx, cy + size * 0.23)
      .bezierCurveTo(cx - size * 0.55, cy, cx + size * 0.4, cy - size * 0.3, cx, cy + size * 0.23)
      .stroke({ color, width: 2 });
    g.moveTo(cx, cy + size * 0.23)
      .lineTo(cx, cy + size * 0.43)
      .stroke({ color, width: 2 });
  } else if (id === 'episode') {
    const pts: number[] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i * Math.PI) / 8,
        r = size * (i % 2 ? 0.25 : 0.43);
      pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    g.poly(pts).stroke({ color, width: 2.3 });
    g.moveTo(cx, cy - size * 0.18)
      .lineTo(cx, cy + size * 0.1)
      .stroke({ color, width: 5 });
    g.circle(cx, cy + size * 0.22, 3).fill(color);
  } else {
    g.ellipse(cx, cy, size * 0.28, size * 0.35).stroke({ color, width: 2 });
    for (let i = 0; i < 5; i++) {
      const a = i * 1.27 + seed * 0.01;
      g.moveTo(cx, cy)
        .bezierCurveTo(
          cx + Math.sin(a) * size * 0.32,
          cy - size * 0.3,
          cx - Math.cos(a) * size * 0.32,
          cy + size * 0.25,
          cx + Math.sin(a) * size * 0.22,
          cy + Math.cos(a) * size * 0.29,
        )
        .stroke({ color, width: 1.6 });
    }
    g.moveTo(cx - size * 0.22, cy + size * 0.35)
      .lineTo(cx + size * 0.22, cy + size * 0.35)
      .stroke({ color, width: 2 });
  }
  c.addChild(g);
  return c;
}
export function createCard(
  cardId?: string,
  width = 170,
  height = 250,
  options: { treated?: boolean; selected?: boolean; playable?: boolean; mini?: boolean } = {},
) {
  const c = new Container();
  c.cacheAsTexture({ resolution: 1, antialias: false });
  const { paper, yellow, deep } = UI.colors;
  c.addChild(
    new Graphics()
      .roundRect(-width / 2 + 4, -height / 2 + 7, width, height, 10)
      .fill({ color: 0x051b19, alpha: 0.28 }),
  );
  const frame = new Graphics()
    .roundRect(-width / 2, -height / 2, width, height, 10)
    .fill(cardId ? paper : deep)
    .stroke({
      color: options.selected ? yellow : options.playable ? 0xeee3a6 : 0xc9c2a0,
      width: options.selected ? 4 : options.playable ? 2 : 1,
      alpha: 1,
    });
  c.addChild(frame);
  if (!cardId) {
    const tex = AssetRegistry.get('ui.deck.back');
    if (tex) {
      const sprite = new Sprite(tex);
      sprite.width = width - 16;
      sprite.height = height - 16;
      sprite.position.set(-width / 2 + 8, -height / 2 + 8);
      c.addChild(sprite);
    } else {
      c.addChild(
        new Graphics()
          .roundRect(-width / 2 + 9, -height / 2 + 9, width - 18, height - 18, 5)
          .stroke({ color: yellow, width: 1, alpha: 0.8 }),
      );
      for (let i = 0; i < 5; i++)
        c.addChild(
          new Graphics()
            .ellipse(0, 0, width * (0.13 + i * 0.045), height * 0.25)
            .stroke({ color: yellow, width: 1, alpha: 0.5 }),
        );
      const t = text('SE', 0, -19, width * 0.24, yellow);
      t.anchor.x = 0.5;
      c.addChild(t);
    }
    return c;
  }
  const d = definition(cardId),
    color = cardColor(d),
    mini = options.mini ?? false;
  c.addChild(
    new Graphics()
      .roundRect(-width / 2 + 7, -height / 2 + 7, width - 14, mini ? 24 : 27, 4)
      .fill(color),
  );
  const type = text(
    mini && width < 75
      ? 'D'
      : d.type === 'drug'
        ? 'Treatment'
        : d.type[0].toUpperCase() + d.type.slice(1),
    0,
    -height / 2 + 12,
    mini ? 12 : 12,
    paper,
    undefined,
    UI.body,
  );
  type.anchor.x = 0.5;
  c.addChild(type);
  const title = text(
    d.name,
    -width / 2 + 12,
    -height / 2 + (mini ? 38 : 46),
    mini ? Math.min(15, Math.max(10, width * 0.14)) : 20,
    color,
    width - 24,
  );
  c.addChild(title);
  const artTop = Math.max(title.y + title.height + 6, -height * 0.09);
  const artBottom = height / 2 - (mini ? 30 : 63);
  const artSize = Math.max(20, Math.min(width * 0.7, artBottom - artTop));
  const art = AssetRegistry.get(`card.${d.id}`);
  if (art) {
    const s = new Sprite(art);
    s.scale.set(Math.min(artSize / art.width, artSize / art.height));
    s.position.set(-s.width / 2, artTop);
    c.addChild(s);
  } else {
    const size = artSize;
    const art = originalArt(d.id, size, color);
    art.position.set(-size / 2, artTop);
    c.addChild(art);
  }
  if (!mini) {
    const label =
      d.type === 'drug'
        ? `Treats ${definition(d.treats[0]).name}`
        : d.type === 'disorder'
          ? 'An untreated condition'
          : d.type === 'therapy'
            ? 'Remove a condition'
            : 'Trigger a punishment';
    c.addChild(text(label, -width / 2 + 12, height / 2 - 46, 13, color, width - 24, UI.body));
    c.addChild(
      new Graphics()
        .moveTo(-width / 2 + 12, height / 2 - 58)
        .lineTo(width / 2 - 12, height / 2 - 58)
        .stroke({ color, width: 1, alpha: 0.3 }),
    );
  }
  if (options.treated) {
    c.addChild(
      new Graphics()
        .roundRect(-width / 2 + 6, height / 2 - 26, width - 12, 22, 3)
        .fill(UI.colors.drug),
    );
    const stamp = text('✓ Treated', 0, height / 2 - 23, 13, paper, undefined, UI.body);
    stamp.anchor.x = 0.5;
    c.addChild(stamp);
  }
  if (options.playable) {
    c.addChild(new Graphics().circle(width / 2 - 15, -height / 2 + 14, 5).fill(yellow));
  }
  return c;
}
