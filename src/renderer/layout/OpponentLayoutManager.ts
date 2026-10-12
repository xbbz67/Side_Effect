import { LAYOUT } from '../../config/layout.config';
export function OpponentLayoutManager(
  playerCount: number,
  viewportWidth = LAYOUT.width,
  viewportHeight = LAYOUT.height,
) {
  const count = playerCount - 1;
  const spacing = Math.min(520, LAYOUT.opponentSpan / count);
  const scale = Math.min(viewportWidth / LAYOUT.width, viewportHeight / LAYOUT.height);
  return Array.from({ length: count }, (_, i) => {
    const offset = i - (count - 1) / 2;
    const x = LAYOUT.width / 2 + offset * spacing;
    const y = LAYOUT.opponentY + Math.abs(offset) * 12;
    const width = Math.min(440, spacing - 18);
    return {
      x,
      y,
      width,
      scale,
      avatarBounds: { x: x - width / 2, y: y - 72, width, height: 52 },
      psycheBounds: { x: x - width / 2, y, width, height: 155 },
      interactionBounds: { x: x - width / 2, y: y - 72, width, height: 230 },
    };
  });
}
export function handLayout(n: number) {
  const spacing = Math.min(190, LAYOUT.handSpan / Math.max(n - 1, 1));
  const fan = Math.min(LAYOUT.maxFanAngle, Math.max(0, n - 2) * 1.1);
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : (i - (n - 1) / 2) / ((n - 1) / 2);
    return {
      x: LAYOUT.width / 2 + (i - (n - 1) / 2) * spacing,
      y: LAYOUT.handY + Math.abs(t) * 22,
      rotation: (t * fan * Math.PI) / 180,
    };
  });
}
