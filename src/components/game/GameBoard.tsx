'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  maxGuesses?: number;
  wordLength?: number;
}

export function GameBoard({ maxGuesses = 6, wordLength = 5 }: GameBoardProps) {
  const { gameState } = useGameStore();

  if (!gameState) return null;

  const currentTarget = gameState.currentPhase === 1 
    ? gameState.firstSegment 
    : gameState.targetWord;

  const rows = Array.from({ length: maxGuesses }, (_, rowIndex) => {
    const guess = gameState.guesses[rowIndex] || '';
    const isCurrentGuess = rowIndex === gameState.guesses.length;
    const tiles = Array.from({ length: wordLength }, (_, colIndex) => {
      const letter = guess[colIndex];
      const isRevealed = guess && !isCurrentGuess;
      let status: 'correct' | 'present' | 'absent' | 'empty' = 'empty';

      if (isRevealed) {
        if (letter === currentTarget[colIndex]) {
          status = 'correct';
        } else if (currentTarget.includes(letter)) {
          status = 'present';
        } else {
          status = 'absent';
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
            }
          )}
        >
          {letter}
        </motion.div>
      );
    });

    return (
      <div key={rowIndex} className="flex gap-2">
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