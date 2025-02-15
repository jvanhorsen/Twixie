'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { calculateScore } from '@/lib/utils';
import { TrophyIcon, FireIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface ScoreDisplayProps {
  score: number;
  streak: number;
  bestStreak: number;
  gamesPlayed: number;
  winPercentage: number;
  averageTime: number;
  className?: string;
}

export function ScoreDisplay({
  score,
  streak,
  bestStreak,
  gamesPlayed,
  winPercentage,
  averageTime,
  className = '',
}: ScoreDisplayProps) {
  return (
    <div className={`flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Game Stats</h2>
        <TrophyIcon className="w-6 h-6 text-yellow-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="text-sm text-gray-500 dark:text-gray-400">Current Score</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{score}</span>
        </div>

        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-1">
            <FireIcon className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Streak</span>
          </div>
          <span className="text-2xl font-bold text-red-600 dark:text-red-400">{streak}</span>
        </div>

        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="text-sm text-gray-500 dark:text-gray-400">Best Streak</span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{bestStreak}</span>
        </div>

        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-1">
            <ChartBarIcon className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Win Rate</span>
          </div>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            {winPercentage}%
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Games Played:</span>
          <span>{gamesPlayed}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Average Time:</span>
          <span>{Math.floor(averageTime / 1000)}s</span>
        </div>
      </div>
    </div>
  );
} 