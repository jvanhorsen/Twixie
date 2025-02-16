export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameMode = 'daily' | 'endless';

export type GameState = {
  currentPhase: 1 | 2;
  targetWord: string;
  firstSegment: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  difficulty: Difficulty;
  hintsRemaining: number;
  startTime: number;
  endTime?: number;
};

export type GuessResult = {
  correct: boolean;
  positions: ('correct' | 'present' | 'absent')[];
  error?: string;
};

export type GameStats = {
  gamesPlayed: number;
  currentStreak: number;
  maxStreak: number;
  totalScore: number;
  averageTime: number;
  winPercentage: number;
};

export type HintType = 'letter' | 'definition';

export type GameSettings = {
  difficulty: Difficulty;
  soundEnabled: boolean;
  darkMode: boolean;
  highContrastMode: boolean;
};

export const DIFFICULTY_SETTINGS = {
  easy: {
    revealedLetters: 2,
    maxHints: 3,
  },
  medium: {
    revealedLetters: 3,
    maxHints: 2,
  },
  hard: {
    revealedLetters: 4,
    maxHints: 1,
  },
} as const; 