import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameSettings, Difficulty, GuessResult, HintType } from '../game/types';
import { DIFFICULTY_SETTINGS } from '../game/types';
import { WordBankService, CompoundWord } from '../game/wordBank';
import { supabase } from '../supabase/client';
import { calculateScore } from '../utils';

interface GameStats {
  streak: number;
  bestStreak: number;
  gamesPlayed: number;
  totalScore: number;
  totalTime: number;
  wins: number;
}

interface GameStore {
  // Game State
  gameState: GameState | null;
  settings: GameSettings;
  wordBank: WordBankService;
  currentWord: CompoundWord | null;
  stats: GameStats;
  
  // Actions
  startGame: (mode: 'daily' | 'endless') => void;
  makeGuess: (guess: string) => GuessResult;
  useHint: (type: HintType) => { letter: string; position: number } | string | null;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetGame: () => void;
  updateStats: (won: boolean, score: number, timeTaken: number) => Promise<void>;
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
      wordBank: new WordBankService(),
      currentWord: null,
      stats: {
        streak: 0,
        bestStreak: 0,
        gamesPlayed: 0,
        totalScore: 0,
        totalTime: 0,
        wins: 0,
      },

      startGame: (mode) => {
        const { settings, wordBank } = get();
        const word = mode === 'daily' 
          ? wordBank.getDailyWord() 
          : wordBank.getRandomWord(settings.difficulty);

        set({
          currentWord: word,
          gameState: {
            currentPhase: 1,
            targetWord: word.word,
            firstSegment: word.firstSegment,
            guesses: [],
            currentGuess: '',
            gameStatus: 'playing',
            difficulty: settings.difficulty,
            hintsRemaining: DIFFICULTY_SETTINGS[settings.difficulty].maxHints,
            startTime: Date.now(),
          },
        });
      },

      makeGuess: (guess) => {
        const state = get().gameState;
        const word = get().currentWord;
        if (!state || !word) throw new Error('Game not started');

        // Validate the guess length
        const target = state.currentPhase === 1 ? word.firstSegment : word.word;
        if (guess.length !== target.length) {
          return {
            correct: false,
            positions: Array(guess.length).fill('absent' as const),
            error: 'Invalid word length',
          };
        }

        // In phase 1, we only need to validate the word length
        // In phase 2, we need to validate that it's a real word
        if (state.currentPhase === 2) {
          const isValidWord = get().wordBank.validateWord(guess);
          if (!isValidWord) {
            return {
              correct: false,
              positions: Array(guess.length).fill('absent' as const),
              error: 'Invalid word',
            };
          }
        }

        const positions: ('correct' | 'present' | 'absent')[] = [];
        const targetLetters = target.toLowerCase().split('');
        const guessLetters = guess.toLowerCase().split('');
        
        // First pass: mark correct letters
        const usedTargetIndices = new Set<number>();
        guessLetters.forEach((letter, i) => {
          if (letter === targetLetters[i]) {
            positions[i] = 'correct';
            usedTargetIndices.add(i);
          }
        });

        // Second pass: mark present/absent letters
        guessLetters.forEach((letter, i) => {
          if (positions[i]) return; // Skip already marked correct letters

          const targetIndex = targetLetters.findIndex((t, idx) => 
            !usedTargetIndices.has(idx) && t === letter
          );

          if (targetIndex !== -1) {
            positions[i] = 'present';
            usedTargetIndices.add(targetIndex);
          } else {
            positions[i] = 'absent';
          }
        });

        const isCorrect = positions.every((pos) => pos === 'correct');
        const isGameOver = (isCorrect && state.currentPhase === 2) || state.guesses.length >= 5;
        const endTime = isGameOver ? Date.now() : state.endTime;

        // Move to phase 2 only if all letters in first segment are correct
        const shouldAdvancePhase = state.currentPhase === 1 && 
          positions.slice(0, word.firstSegment.length).every(pos => pos === 'correct');

        // Update game state
        set({
          gameState: {
            ...state,
            guesses: [...state.guesses, guess],
            currentGuess: '',
            currentPhase: shouldAdvancePhase ? 2 : state.currentPhase,
            gameStatus: isCorrect && state.currentPhase === 2 ? 'won' : 
                       state.guesses.length >= 5 ? 'lost' : 'playing',
            endTime,
          },
        });

        // Update stats if game is over
        if (isGameOver && endTime) {
          const won = isCorrect && state.currentPhase === 2;
          const score = won ? calculateScore(
            endTime - state.startTime,
            DIFFICULTY_SETTINGS[state.difficulty].maxHints - state.hintsRemaining,
            state.difficulty,
            state.guesses.length
          ) : 0;
          get().updateStats(won, score, endTime - state.startTime);
        }

        return {
          correct: isCorrect,
          positions,
        };
      },

      updateStats: async (won: boolean, score: number, timeTaken: number) => {
        const { stats } = get();
        const newStreak = won ? stats.streak + 1 : 0;
        const newStats = {
          streak: newStreak,
          bestStreak: Math.max(stats.bestStreak, newStreak),
          gamesPlayed: stats.gamesPlayed + 1,
          totalScore: stats.totalScore + score,
          totalTime: stats.totalTime + timeTaken,
          wins: stats.wins + (won ? 1 : 0),
        };

        // Update local state
        set({ stats: newStats });

        // Update Supabase
        const { error } = await supabase
          .from('users')
          .update({
            streak: newStreak,
            highest_streak: newStats.bestStreak,
            total_score: newStats.totalScore,
            games_played: newStats.gamesPlayed,
          })
          .eq('id', (await supabase.auth.getUser()).data.user?.id);

        if (error) {
          console.error('Failed to update stats:', error);
        }
      },

      useHint: (type) => {
        const state = get().gameState;
        const word = get().currentWord;
        if (!state || !word || state.hintsRemaining <= 0) return null;

        if (type === 'definition') {
          set({
            gameState: {
              ...state,
              hintsRemaining: state.hintsRemaining - 1,
            },
          });
          return word.definition || 'No definition available';
        }

        const target = state.currentPhase === 1 ? word.firstSegment : word.word;
        const currentGuess = state.currentGuess.split('');
        
        // Find a position that hasn't been correctly guessed yet
        const availablePositions = target.split('').map((letter, index) => ({
          letter,
          index,
          revealed: currentGuess[index]?.toLowerCase() === letter.toLowerCase(),
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
        set({ 
          gameState: null,
          currentWord: null,
        });
      },
    }),
    {
      name: 'compound-word-game',
      partialize: (state) => ({
        settings: state.settings,
        stats: state.stats,
      }),
    }
  )
); 