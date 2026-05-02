import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  BOWS: '@arqueria_bows',
  ROUNDS: '@arqueria_rounds',
  SHOTS: '@arqueria_shots',
};

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

let bowsCache: Bow[] = [];
let roundsCache: Round[] = [];
let shotsCache: Shot[] = [];
let initialized = false;

export async function initStorage(): Promise<void> {
  if (initialized) return;
  
  try {
    const [bowsData, roundsData, shotsData] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.BOWS),
      AsyncStorage.getItem(STORAGE_KEYS.ROUNDS),
      AsyncStorage.getItem(STORAGE_KEYS.SHOTS),
    ]);
    
    bowsCache = bowsData ? JSON.parse(bowsData) : [];
    roundsCache = roundsData ? JSON.parse(roundsData) : [];
    shotsCache = shotsData ? JSON.parse(shotsData) : [];
    initialized = true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    bowsCache = [];
    roundsCache = [];
    shotsCache = [];
    initialized = true;
  }
}

async function saveBows(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.BOWS, JSON.stringify(bowsCache));
}

async function saveRounds(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify(roundsCache));
}

async function saveShots(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.SHOTS, JSON.stringify(shotsCache));
}

export const BowStorage = {
  getAll: async (): Promise<Bow[]> => {
    await initStorage();
    return [...bowsCache].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getById: async (id: number): Promise<Bow | null> => {
    await initStorage();
    return bowsCache.find(b => b.id === id) || null;
  },

  getDefault: async (): Promise<Bow | null> => {
    await initStorage();
    return bowsCache.find(b => b.isDefault) || null;
  },

  create: async (bow: Omit<Bow, 'id' | 'createdAt'>): Promise<number> => {
    await initStorage();
    const maxId = bowsCache.reduce((max, b) => Math.max(max, b.id), 0);
    const newBow: Bow = {
      ...bow,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
    };
    bowsCache.push(newBow);
    await saveBows();
    return newBow.id;
  },

  update: async (id: number, updates: Partial<Bow>): Promise<void> => {
    await initStorage();
    const index = bowsCache.findIndex(b => b.id === id);
    if (index !== -1) {
      bowsCache[index] = { ...bowsCache[index], ...updates };
      await saveBows();
    }
  },

  delete: async (id: number): Promise<void> => {
    await initStorage();
    bowsCache = bowsCache.filter(b => b.id !== id);
    await saveBows();
  },

  setDefault: async (id: number): Promise<void> => {
    await initStorage();
    bowsCache = bowsCache.map(b => ({
      ...b,
      isDefault: b.id === id,
    }));
    await saveBows();
  },
};

export const RoundStorage = {
  getAll: async (): Promise<Round[]> => {
    await initStorage();
    return [...roundsCache].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getById: async (id: number): Promise<Round | null> => {
    await initStorage();
    return roundsCache.find(r => r.id === id) || null;
  },

  getNextRoundNumber: async (): Promise<number> => {
    await initStorage();
    const maxNum = roundsCache.reduce((max, r) => Math.max(max, r.roundNumber), 0);
    return maxNum + 1;
  },

  create: async (round: Omit<Round, 'id' | 'createdAt'>): Promise<number> => {
    await initStorage();
    const maxId = roundsCache.reduce((max, r) => Math.max(max, r.id), 0);
    const newRound: Round = {
      ...round,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
    };
    roundsCache.push(newRound);
    await saveRounds();
    return newRound.id;
  },

  update: async (id: number, updates: Partial<Round>): Promise<void> => {
    await initStorage();
    const index = roundsCache.findIndex(r => r.id === id);
    if (index !== -1) {
      roundsCache[index] = { ...roundsCache[index], ...updates };
      await saveRounds();
    }
  },

  delete: async (id: number): Promise<void> => {
    await initStorage();
    roundsCache = roundsCache.filter(r => r.id !== id);
    shotsCache = shotsCache.filter(s => s.roundId !== id);
    await saveRounds();
    await saveShots();
  },
};

export const ShotStorage = {
  getByRoundId: async (roundId: number): Promise<Shot[]> => {
    await initStorage();
    return shotsCache
      .filter(s => s.roundId === roundId)
      .sort((a, b) => a.arrowNumber - b.arrowNumber);
  },

  create: async (shot: Omit<Shot, 'id' | 'createdAt'>): Promise<number> => {
    await initStorage();
    const maxId = shotsCache.reduce((max, s) => Math.max(max, s.id), 0);
    const newShot: Shot = {
      ...shot,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
    };
    shotsCache.push(newShot);
    await saveShots();
    return newShot.id;
  },

  delete: async (id: number): Promise<void> => {
    await initStorage();
    shotsCache = shotsCache.filter(s => s.id !== id);
    await saveShots();
  },

  deleteByRoundId: async (roundId: number): Promise<void> => {
    await initStorage();
    shotsCache = shotsCache.filter(s => s.roundId !== roundId);
    await saveShots();
  },

  getAll: async (): Promise<Shot[]> => {
    await initStorage();
    return [...shotsCache].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getAverageScore: async (): Promise<number> => {
    await initStorage();
    const scoredShots = shotsCache.filter(s => s.score !== null && s.score !== undefined);
    if (scoredShots.length === 0) return 0;
    const sum = scoredShots.reduce((acc, s) => acc + s.score, 0);
    return sum / scoredShots.length;
  },

  getTotalShots: async (): Promise<number> => {
    await initStorage();
    return shotsCache.length;
  },
};