import definitions from '../../../data/cards/base.json';
export type CardType = 'disorder' | 'drug' | 'therapy' | 'episode';
export interface CardDefinition {
  id: string;
  name: string;
  type: CardType;
  copies: number;
  effect: string;
  sideEffects: string[];
  treats: string[];
  therapyAllowed: boolean;
  episode: string | null;
}
export const cards = definitions as CardDefinition[];
export const CardRegistry = new Map(cards.map((c) => [c.id, c]));
export const definition = (id: string) => {
  const c = CardRegistry.get(id.split(':')[0]);
  if (!c) throw new Error(`Unknown card ${id}`);
  return c;
};
