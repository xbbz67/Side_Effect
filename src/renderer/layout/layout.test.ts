import { it, expect } from 'vitest';
import { handLayout, OpponentLayoutManager } from './OpponentLayoutManager';
import { worldScale } from '../../config/layout.config';
it.each([2, 3, 4, 5, 6, 7, 8])('%i seats have distinct, nonoverlapping public bounds', (n) => {
  const slots = OpponentLayoutManager(n);
  expect(slots).toHaveLength(n - 1);
  for (let i = 0; i < slots.length; i++) {
    const b = slots[i].interactionBounds;
    expect(b.x).toBeGreaterThan(0);
    expect(b.x + b.width).toBeLessThan(1920);
    if (i)
      expect(
        slots[i - 1].interactionBounds.x + slots[i - 1].interactionBounds.width,
      ).toBeLessThanOrEqual(b.x);
  }
});
it.each([2, 5, 10, 15, 25])('fan handles %i cards inside desktop safe bounds', (n) => {
  const fan = handLayout(n);
  expect(fan).toHaveLength(n);
  expect((fan[0].x + fan.at(-1)!.x) / 2).toBe(960);
  for (const p of fan) {
    expect(p.x - 90).toBeGreaterThan(0);
    expect(p.x + 90).toBeLessThan(1920);
    expect(p.y + 125).toBeLessThanOrEqual(1080);
  }
});
it('scales uniformly and letterboxes taller desktop viewports', () => {
  expect(worldScale(1440, 900)).toBe(0.75);
  expect(worldScale(2560, 1440)).toBeCloseTo(4 / 3);
});
