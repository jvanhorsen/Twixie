import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function calculateScore(
  timeMs: number,
  hintsUsed: number,
  difficulty: 'easy' | 'medium' | 'hard',
  guesses: number
): number {
  // Base score based on difficulty
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  };

  // Time bonus (faster = more points)
  const maxTimeBonus = 1000;
  const timeBonus = Math.max(0, maxTimeBonus - Math.floor(timeMs / 1000) * 10);

  // Hint penalty
  const hintPenalty = hintsUsed * 100;

  // Guess efficiency bonus
  const maxGuessBonus = 500;
  const guessBonus = Math.max(0, maxGuessBonus - (guesses * 50));

  const baseScore = 1000;
  const finalScore = Math.max(0, Math.floor(
    (baseScore + timeBonus + guessBonus - hintPenalty) * difficultyMultiplier[difficulty]
  ));

  return finalScore;
}

export function generateShareText(
  gameState: {
    guesses: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    hintsUsed: number;
    startTime: number;
    endTime?: number;
  },
  includeTime = true
): string {
  const difficultyEmoji = {
    easy: '😊',
    medium: '😎',
    hard: '🤯',
  };

  const timeText = gameState.endTime 
    ? formatTime(gameState.endTime - gameState.startTime)
    : '';

  const guessGrid = gameState.guesses
    .map(guess => '⬛'.repeat(guess.length))
    .join('\n');

  return `Compound Word Game ${difficultyEmoji[gameState.difficulty]}\n` +
    `Difficulty: ${gameState.difficulty.toUpperCase()}\n` +
    `Guesses: ${gameState.guesses.length}\n` +
    (includeTime ? `Time: ${timeText}\n` : '') +
    `Hints Used: ${gameState.hintsUsed}\n\n` +
    guessGrid;
} 