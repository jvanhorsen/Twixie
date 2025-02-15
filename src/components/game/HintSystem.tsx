'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { HintType } from '@/lib/game/types';
import { LightBulbIcon } from '@heroicons/react/24/outline';

interface HintSystemProps {
  onUseHint: (type: HintType) => void;
  hintsRemaining: number;
  isDisabled?: boolean;
}

export function HintSystem({ onUseHint, hintsRemaining, isDisabled = false }: HintSystemProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Hints Remaining: {hintsRemaining}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onUseHint('letter')}
          disabled={isDisabled || hintsRemaining <= 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg 
                     hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <LightBulbIcon className="w-5 h-5" />
          Reveal Letter
        </button>
        <button
          onClick={() => onUseHint('definition')}
          disabled={isDisabled || hintsRemaining <= 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg 
                     hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <LightBulbIcon className="w-5 h-5" />
          Show Definition
        </button>
      </div>
      {hintsRemaining <= 0 && (
        <p className="text-sm text-red-500 dark:text-red-400">
          No hints remaining for this game
        </p>
      )}
      {isDisabled && hintsRemaining > 0 && (
        <p className="text-sm text-yellow-500 dark:text-yellow-400">
          Hints are disabled during this phase
        </p>
      )}
    </div>
  );
} 