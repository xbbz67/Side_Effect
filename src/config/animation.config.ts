export const ANIMATION = {
  hover: 120,
  pickup: 210,
  play: 320,
  flip: 300,
  target: 260,
  impact: 220,
  effect: 520,
  turn: 360,
  stagger: 45,
  ease: (t: number) => 1 - Math.pow(1 - t, 3),
};
