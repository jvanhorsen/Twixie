'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { cn } from '@/lib/utils';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  usedLetters?: {
    correct: Set<string>;
    present: Set<string>;
    absent: Set<string>;
  };
}

export function Keyboard({ onKeyPress, usedLetters = { correct: new Set(), present: new Set(), absent: new Set() } }: KeyboardProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        onKeyPress(key);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {row.map((key) => {
            let status: 'correct' | 'present' | 'absent' | undefined;
            const letter = key === 'ENTER' || key === 'BACKSPACE' ? key : key.toLowerCase();

            if (usedLetters.correct.has(letter)) {
              status = 'correct';
            } else if (usedLetters.present.has(letter)) {
              status = 'present';
            } else if (usedLetters.absent.has(letter)) {
              status = 'absent';
            }

            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={cn(
                  'keyboard-key',
                  key === 'ENTER' && 'col-span-2',
                  key === 'BACKSPACE' && 'col-span-2',
                  {
                    'bg-green-500 text-white hover:bg-green-600': status === 'correct',
                    'bg-yellow-500 text-white hover:bg-yellow-600': status === 'present',
                    'bg-gray-500 text-white hover:bg-gray-600': status === 'absent',
                  }
                )}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
} 