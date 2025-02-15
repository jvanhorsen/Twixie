import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameSettings, Difficulty, GuessResult } from '../game/types';
import { DIFFICULTY_SETTINGS } from '../game/types';

interface GameStore {
  // Game State
  gameState: GameState | null;
  settings: GameSettings;
  
  // Actions
  startGame: (word: string, firstSegment: string, difficulty: Difficulty) => void;
  makeGuess: (guess: string) => GuessResult;
  useHint: () => { letter: string; position: number } | null;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: null,
      settings: {
        difficulty: 'medium',
        soundEnabled: true,
        darkMode: false,
        highContrastMode: false,
      },

      startGame: (word, firstSegment, difficulty) => {
        set({
          gameState: {
            currentPhase: 1,
            targetWord: word,
            firstSegment,
            guesses: [],
            currentGuess: '',
            gameStatus: 'playing',
            difficulty,
            hintsRemaining: DIFFICULTY_SETTINGS[difficulty].maxHints,
            startTime: Date.now(),
          },
        });
      },

      makeGuess: (guess) => {
        const state = get().gameState;
        if (!state) throw new Error('Game not started');

        const target = state.currentPhase === 1 ? state.firstSegment : state.targetWord;
        const positions: ('correct' | 'present' | 'absent')[] = [];

        // Check each letter
        for (let i = 0; i < guess.length; i++) {
          if (guess[i] === target[i]) {
            positions[i] = 'correct';
          } else if (target.includes(guess[i])) {
            positions[i] = 'present';
          } else {
            positions[i] = 'absent';
          }
        }

        const isCorrect = positions.every((pos) => pos === 'correct');

        // Update game state
        set({
          gameState: {
            ...state,
            guesses: [...state.guesses, guess],
            currentPhase: isCorrect && state.currentPhase === 1 ? 2 : state.currentPhase,
            gameStatus: isCorrect && state.currentPhase === 2 ? 'won' : state.gameStatus,
            endTime: isCorrect && state.currentPhase === 2 ? Date.now() : state.endTime,
          },
        });

        return {
          correct: isCorrect,
          positions,
        };
      },

      useHint: () => {
        const state = get().gameState;
        if (!state || state.hintsRemaining <= 0) return null;

        const target = state.currentPhase === 1 ? state.firstSegment : state.targetWord;
        const currentGuess = state.currentGuess.split('');
        
        // Find a position that hasn't been correctly guessed yet
        const availablePositions = target.split('').map((letter, index) => ({
          letter,
          index,
          revealed: currentGuess[index] === letter,
        })).filter(pos => !pos.revealed);

        if (availablePositions.length === 0) return null;

        // Randomly select a position to reveal
        const randomPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];

        set({
          gameState: {
            ...state,
            hintsRemaining: state.hintsRemaining - 1,
          },
        });

        return {
          letter: randomPos.letter,
          position: randomPos.index,
        };
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        }));
      },

      resetGame: () => {
        set({ gameState: null });
      },
    }),
    {
      name: 'compound-word-game',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
); 