import type { Command, GameState } from '../engine/GameState';
import { getLegalActions } from '../engine/GameEngine';
import { nextRandom } from '../engine/SeededRandom';
export function chooseBotAction(
  s: GameState,
  playerId: string,
  rng: { value: number },
): Command | undefined {
  const legal = getLegalActions(s, playerId);
  rng.value = nextRandom(rng.value);
  const pick = (a: Command[]) => a[rng.value % a.length];
  const urgent = legal.filter((a) => ['START_TURN', 'READY', 'RESOLVE'].includes(a.type));
  if (urgent.length) return pick(urgent);
  const plays = legal.filter((a) => a.type === 'PLAY_CARD');
  if (plays.length) return pick(plays);
  const end = legal.find((a) => a.type === 'END_TURN');
  if (end) return end;
  return pick(legal.filter((a) => a.type === 'DISCARD_CARD'));
}
