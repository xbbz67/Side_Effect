export function nextRandom(state: number) {
  let x = state >>> 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}
export function shuffle<T>(list: T[], rng: { rng: number }): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    rng.rng = nextRandom(rng.rng);
    const j = rng.rng % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
