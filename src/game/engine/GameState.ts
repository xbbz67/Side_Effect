export interface Condition {
  card: string;
  drug?: string;
}
export interface Player {
  id: string;
  name: string;
  bot: boolean;
  hand: string[];
  psyche: Condition[];
  penalties: { skip: boolean; draw: boolean; play: boolean };
}
export interface Setup {
  seed: number;
  players: { name: string; bot: boolean }[];
}
export interface Pending {
  kind: 'tremors' | 'gambling' | 'anxiety';
  actor: string;
  victim: string;
  episode: string;
  required: number;
  deadline?: number;
}
export interface GameState {
  version: 1;
  profile: 'digital-1';
  players: Player[];
  deck: string[];
  discard: string[];
  active: number;
  turn: number;
  phase: 'draw' | 'main' | 'pending' | 'won';
  plays: number;
  rng: number;
  clock: number;
  blocked: { draw: boolean; play: boolean };
  pending?: Pending;
  winner?: string;
  revision: number;
}
export type Command =
  | { type: 'START_TURN' | 'END_TURN'; playerId: string }
  | {
      type: 'PLAY_CARD';
      playerId: string;
      cardId: string;
      targetPlayer: string;
      targetCard?: string;
    }
  | { type: 'DISCARD_CARD'; playerId: string; cardId: string }
  | { type: 'GIFT_CARD'; playerId: string; cardId: string; targetPlayer: string }
  | { type: 'READY'; playerId: string; now: number }
  | { type: 'RESOLVE'; playerId: string; cards?: string[]; take?: boolean; now: number }
  | { type: 'TIMEOUT'; playerId: string; now: number };
export interface GameEvent {
  type: string;
  playerId?: string;
  targetPlayer?: string;
  cardId?: string;
  targetCard?: string;
  text: string;
  privateTo?: string[];
}
export interface Projection {
  version: number;
  players: (Omit<Player, 'hand'> & { handCount: number; hand?: string[] })[];
  deckCount: number;
  discardTop?: string;
  discardCount: number;
  active: number;
  turn: number;
  phase: GameState['phase'];
  plays: number;
  pending?: Pending;
  winner?: string;
  viewer: string;
  clock: number;
  blocked: GameState['blocked'];
}
