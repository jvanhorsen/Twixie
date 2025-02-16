'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  maxGuesses?: number;
  wordLength?: number;
  currentPhase: 1 | 2;
  targetWord: string;
  firstSegment: string;
}

export function GameBoard({ 
  maxGuesses = 6, 
  wordLength = 5,
  currentPhase,
  targetWord,
  firstSegment
}: GameBoardProps) {
  const { gameState } = useGameStore();

  if (!gameState) return null;

  const currentTarget = currentPhase === 1 ? firstSegment : targetWord;
  const targetLength = currentPhase === 1 ? firstSegment.length : targetWord.length;

  const rows = Array.from({ length: maxGuesses }, (_, rowIndex) => {
    const guess = gameState.guesses[rowIndex] || '';
    const isCurrentGuess = rowIndex === gameState.guesses.length;
    const tiles = Array.from({ length: targetWord.length }, (_, colIndex) => {
      const letter = guess[colIndex];
      const isRevealed = guess && !isCurrentGuess;
      const isInFirstSegment = colIndex < firstSegment.length;
      let status: 'correct' | 'present' | 'absent' | 'empty' = 'empty';

      if (currentPhase === 1) {
        // In phase 1, only validate letters in the first segment
        if (isRevealed && isInFirstSegment) {
          if (letter === firstSegment[colIndex]) {
            status = 'correct';
          } else if (firstSegment.includes(letter)) {
            status = 'present';
          } else {
            status = 'absent';
          }
        }
      } else {
        // In phase 2, validate all letters
        if (isRevealed) {
          if (letter === targetWord[colIndex]) {
            status = 'correct';
          } else if (targetWord.includes(letter)) {
            status = 'present';
          } else {
            status = 'absent';
          }
        }
      }

      // Auto-populate correct letters from previous guesses in phase 1
      if (currentPhase === 1 && !letter && isInFirstSegment) {
        // Check previous guesses for correct letters at this position
        const correctLetter = gameState.guesses.find((g, idx) => {
          return idx < gameState.guesses.length && g[colIndex] === firstSegment[colIndex];
        })?.[colIndex];
        
        if (correctLetter) {
          status = 'correct';
          return (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              className={cn(
                'letter-tile letter-tile-correct',
                'opacity-50'
              )}
            >
              {correctLetter}
            </motion.div>
          );
        }
      }

      return (
        <motion.div
          key={`${rowIndex}-${colIndex}`}
          initial={{ scale: 1 }}
          animate={{
            scale: letter && isCurrentGuess ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.1 }}
          className={cn(
            'letter-tile',
            {
              'letter-tile-correct': status === 'correct',
              'letter-tile-present': status === 'present',
              'letter-tile-absent': status === 'absent',
              'letter-tile-empty': status === 'empty',
              'opacity-50': currentPhase === 1 && !isInFirstSegment,
            }
          )}
        >
          {letter}
        </motion.div>
      );
    });

    return (
      <div key={rowIndex} className="flex gap-2 justify-center">
        {tiles}
      </div>
    );
  });

  return (
    <div className="game-board">
      <div className="flex flex-col gap-2">
        {rows}
      </div>
    </div>
  );
} 