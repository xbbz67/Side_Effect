export const LAYOUT = {
  width: 1920,
  height: 1080,
  safeMargin: 42,
  cardWidth: 170,
  cardHeight: 250,
  cardGap: 20,
  deck: { x: 830, y: 450 },
  discard: { x: 1090, y: 450 },
  handY: 922,
  handSpan: 1260,
  psycheY: 668,
  opponentY: 210,
  opponentSpan: 1740,
  hoverLift: 20,
  hoverScale: 1.07,
  maxFanAngle: 12,
};
export const worldScale = (width: number, height: number) =>
  Math.min(width / LAYOUT.width, height / LAYOUT.height);
