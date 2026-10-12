import { mkdirSync, writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { createState, executeAction, assertInvariants } from '../engine/GameEngine';
import { chooseBotAction } from './bot';
const batches = process.argv[2] ? [Number(process.argv[2])] : [100, 1000, 10000];
const reports = [];
for (const count of batches) {
  const start = performance.now();
  let wins = 0,
    caps = 0,
    maxTurns = 0,
    commands = 0;
  const failures: { seed: number; error: string }[] = [];
  for (let seed = 1; seed <= count; seed++) {
    try {
      let s = createState({
        seed,
        players: Array.from({ length: 2 + (seed % 7) }, (_, i) => ({
          name: `Bot ${i}`,
          bot: true,
        })),
      });
      const rng = { value: seed + 7000 };
      let steps = 0;
      while (s.phase !== 'won' && s.turn <= 2000 && steps < 30000) {
        const actor = s.pending
          ? s.pending.kind === 'tremors'
            ? s.pending.victim
            : s.pending.actor
          : s.players[s.active].id;
        const action = chooseBotAction(s, actor, rng);
        if (!action) throw new Error(`Deadlock ${s.phase}`);
        s = executeAction(s, action).state;
        assertInvariants(s);
        steps++;
      }
      commands += steps;
      maxTurns = Math.max(maxTurns, s.turn);
      if (s.phase === 'won') wins++;
      else {
        caps++;
        failures.push({ seed, error: `Diagnostic cap, turn ${s.turn}` });
      }
    } catch (e) {
      failures.push({ seed, error: String(e) });
    }
  }
  const report = {
    count,
    wins,
    caps,
    errors: failures.length - caps,
    maxTurns,
    commands,
    seconds: +((performance.now() - start) / 1000).toFixed(2),
    failures,
  };
  reports.push(report);
  console.log(JSON.stringify(report));
  mkdirSync('artifacts', { recursive: true });
  writeFileSync('artifacts/simulations.json', JSON.stringify(reports, null, 2) + '\n');
}
if (reports.some((r) => r.failures.length)) process.exitCode = 1;
