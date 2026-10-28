import { GameProgress, PlayerUpgrades, getUnlockedRecipesForLevel } from '@/types/game';

const STORAGE_KEY = 'azucar_rush_save_data_v1';

const DEFAULT_UPGRADES: PlayerUpgrades = {
  fasterOven: 0,
  fasterWalkSpeed: 0,
  extraLives: 0,
  extraTime: 0,
  trayCapacity: 0,
};

const DEFAULT_PROGRESS: GameProgress = {
  unlockedLevel: 1,
  unlockedRecipes: getUnlockedRecipesForLevel(1),
  highScore: 0,
  totalCoins: 0,
  starsPerLevel: {},
  upgrades: DEFAULT_UPGRADES,
  introSeen: false,
  tutorialSeen: false,
};

export const loadGameProgress = (): GameProgress => {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    const lvl = parsed.unlockedLevel || 1;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      unlockedLevel: lvl,
      unlockedRecipes: parsed.unlockedRecipes && parsed.unlockedRecipes.length > 0
        ? parsed.unlockedRecipes
        : getUnlockedRecipesForLevel(lvl),
      upgrades: { ...DEFAULT_UPGRADES, ...(parsed.upgrades || {}) },
      starsPerLevel: parsed.starsPerLevel || {},
    };
  } catch (err) {
    console.error('Failed to load progress from localStorage', err);
    return DEFAULT_PROGRESS;
  }
};

export const saveGameProgress = (progress: GameProgress): void => {
  if (typeof window === 'undefined') return;
  try {
    const lvl = progress.unlockedLevel || 1;
    const toSave: GameProgress = {
      ...progress,
      unlockedRecipes: progress.unlockedRecipes || getUnlockedRecipesForLevel(lvl),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
};

export const resetGameProgress = (): GameProgress => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_PROGRESS;
};
