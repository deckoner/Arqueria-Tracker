export interface Bow {
  id: number;
  name: string;
  type: 'recurvo';
  model?: string;
  power?: number;
  drawLength?: number;
  arrows?: string;
  string?: string;
  isDefault: boolean;
  createdAt: string;
  
  // Campos especificos de recurvo
  limbs?: string;
  riser?: string;
}

export interface Round {
  id: number;
  name: string;
  distance: number;
  arrowsPerRound: number;
  bowId?: number;
  roundNumber: number;
  completed: boolean;
  createdAt: string;
}

export interface Shot {
  id: number;
  roundId: number;
  x: number;
  y: number;
  score: number;
  arrowNumber: number;
  createdAt: string;
}

export interface RoundWithBows extends Round {
  bowName?: string;
}

export interface ShotWithScore extends Shot {
  distance: number;
}