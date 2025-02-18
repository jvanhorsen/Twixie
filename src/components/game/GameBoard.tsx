'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Difficulty } from '@/lib/game/types';

interface GameBoardProps {
  maxGuesses?: number;
  wordLength?: number;
  currentPhase: 1 | 2;
  targetWord: string;
  firstSegment: string;
}

function DifficultyChip({ difficulty }: { difficulty: Difficulty }) {
  const colors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const labels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  };

  return (
    <div className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      colors[difficulty]
    )}>
      {labels[difficulty]}
    </div>
  );
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
  const secondSegment = targetWord.slice(firstSegment.length);

  const rows = Array.from({ length: maxGuesses }, (_, rowIndex) => {
    const guess = gameState.guesses[rowIndex] || '';
    const isCurrentGuess = rowIndex === gameState.guesses.length;
    const tiles = Array.from({ length: targetWord.length }, (_, colIndex) => {
      const letter = guess[colIndex];
      const isRevealed = guess && !isCurrentGuess;
      const isInFirstSegment = colIndex < firstSegment.length;
      let status: 'correct' | 'present' | 'absent' | 'empty' = 'empty';

      if (currentPhase === 1) {
        if (isRevealed) {
          // Check if the letter matches anywhere in the target word
          const letterToCheck = letter?.toLowerCase();
          if (!letterToCheck) {
            status = 'empty';
          } else if (isInFirstSegment) {
            // For first segment, check exact position and presence
            if (letterToCheck === firstSegment[colIndex].toLowerCase()) {
              status = 'correct';
            } else if (firstSegment.toLowerCase().includes(letterToCheck)) {
              status = 'present';
            } else {
              status = 'absent';
            }
          } else {
            // For second segment positions, check if any letters from the guess match
            const guessLetters = guess.toLowerCase().split('');
            const secondSegmentLetters = secondSegment.toLowerCase().split('');
            const secondSegmentPosition = colIndex - firstSegment.length;
            
            if (secondSegmentPosition < secondSegmentLetters.length && 
                guessLetters.some(l => l === secondSegmentLetters[secondSegmentPosition])) {
              status = 'correct';
            } else {
              status = 'empty';
            }
          }
        }
      } else {
        // Phase 2 logic remains the same
        if (isRevealed) {
          if (letter?.toLowerCase() === targetWord[colIndex].toLowerCase()) {
            status = 'correct';
          } else if (targetWord.toLowerCase().includes(letter?.toLowerCase() || '')) {
            status = 'present';
          } else {
            status = 'absent';
          }
        }
      }

      // Auto-populate correct letters from previous guesses in phase 1
      if (currentPhase === 1 && !letter && isInFirstSegment) {
        const correctLetter = gameState.guesses.find((g, idx) => {
          return idx < gameState.guesses.length && 
                 g[colIndex]?.toLowerCase() === firstSegment[colIndex].toLowerCase();
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
          {/* Show letters for first segment or phase 2, show ? for matches in second segment during phase 1 */}
          {(isInFirstSegment || currentPhase === 2) ? letter : 
           (status === 'correct') ? '?' : ''}
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
      <div className="flex justify-center mt-4">
        <DifficultyChip difficulty={gameState.difficulty} />
      </div>
    </div>
  );
} 