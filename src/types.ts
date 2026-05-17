import { Rune } from './constants/runes';

export type PlayerColor = 'black' | 'white';

export enum GameStage {
  Setup = 'SETUP',
  Round1 = 'ROUND1',
  Round2 = 'ROUND2',
  Finished = 'FINISHED'
}

export interface GameState {
  stage: GameStage;
  playerColor: PlayerColor | null;
  turn: PlayerColor;
  outerChips: (PlayerColor | null)[];
  innerChips: (PlayerColor | null)[];
  middleChips: (PlayerColor | null)[];
  lastRoll: {
    player: Rune[];
    ai: Rune[];
  };
  isRolling: boolean;
  message: string;
  failedRolls: {
    black: number;
    white: number;
  };
}
