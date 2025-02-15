'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { GameBoard } from '@/components/game/GameBoard';
import { Keyboard } from '@/components/game/Keyboard';
import { HintSystem } from '@/components/game/HintSystem';
import { Timer } from '@/components/game/Timer';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { HintType } from '@/lib/game/types';

export default function HomePage() {
  const { gameState, startGame, makeGuess, useHint } = useGameStore();

  useEffect(() => {
    // For testing, start a game with a sample word
    // In production, this would come from the daily word API
    if (!gameState) {
      startGame('sunshine', 'sun', 'medium');
    }
  }, [gameState, startGame]);

  const handleKeyPress = (key: string) => {
    if (!gameState) return;

    if (key === 'ENTER') {
      // Handle submission
      const result = makeGuess(gameState.currentGuess);
      if (result.correct) {
        // Handle phase completion or game win
      }
    } else if (key === 'BACKSPACE') {
      // Handle backspace
    } else {
      // Handle letter input
    }
  };

  const handleHint = (type: HintType) => {
    if (!gameState) return;
    const hint = useHint();
    if (hint) {
      // Handle the revealed hint
    }
  };

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-lg">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Compound Word Game</h1>
          <Timer startTime={gameState.startTime} isRunning={gameState.gameStatus === 'playing'} />
        </header>

        <div className="mb-8">
          <GameBoard maxGuesses={6} wordLength={gameState.currentPhase === 1 ? gameState.firstSegment.length : gameState.targetWord.length} />
        </div>

        <div className="mb-8">
          <HintSystem
            onUseHint={handleHint}
            hintsRemaining={gameState.hintsRemaining}
            isDisabled={gameState.gameStatus !== 'playing'}
          />
        </div>

        <div className="mb-8">
          <Keyboard
            onKeyPress={handleKeyPress}
            usedLetters={{
              correct: new Set(['s', 'u', 'n']), // Example letters
              present: new Set(['h', 'i']),
              absent: new Set(['x', 'z']),
            }}
          />
        </div>

        <div>
          <ScoreDisplay
            score={1000} // Example score
            streak={5}
            bestStreak={10}
            gamesPlayed={25}
            winPercentage={80}
            averageTime={60000} // 1 minute in milliseconds
          />
        </div>
      </div>
    </main>
  );
}
