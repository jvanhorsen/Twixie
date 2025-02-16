'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { GameBoard } from '@/components/game/GameBoard';
import { Keyboard } from '@/components/game/Keyboard';
import { HintSystem } from '@/components/game/HintSystem';
import { Timer } from '@/components/game/Timer';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { HintType, DIFFICULTY_SETTINGS } from '@/lib/game/types';
import { calculateScore } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { Header } from '@/components/game/Header';

function GamePage() {
  const { gameState, startGame, makeGuess, useHint, stats } = useGameStore();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [usedLetters, setUsedLetters] = useState({
    correct: new Set<string>(),
    present: new Set<string>(),
    absent: new Set<string>(),
  });

  useEffect(() => {
    // Start a new game if none is in progress
    if (!gameState && user) {
      startGame('endless');
    }
  }, [gameState, startGame, user]);

  const handleKeyPress = (key: string) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    setError(null);

    if (key === 'ENTER') {
      if (gameState.currentGuess.length !== (gameState.currentPhase === 1 ? gameState.firstSegment.length : gameState.targetWord.length)) {
        setError('Word is not long enough');
        return;
      }

      const result = makeGuess(gameState.currentGuess);
      if (result.error) {
        setError(result.error);
        return;
      }

      // Update used letters
      result.positions.forEach((position, index) => {
        const letter = gameState.currentGuess[index].toLowerCase();
        if (position === 'correct') {
          setUsedLetters(prev => ({
            ...prev,
            correct: new Set([...prev.correct, letter]),
          }));
        } else if (position === 'present') {
          setUsedLetters(prev => ({
            ...prev,
            present: new Set([...prev.present, letter]),
          }));
        } else {
          setUsedLetters(prev => ({
            ...prev,
            absent: new Set([...prev.absent, letter]),
          }));
        }
      });
    } else if (key === 'BACKSPACE') {
      if (gameState.currentGuess.length > 0) {
        useGameStore.setState({
          gameState: {
            ...gameState,
            currentGuess: gameState.currentGuess.slice(0, -1),
          },
        });
      }
    } else if (/^[A-Z]$/.test(key)) {
      const maxLength = gameState.currentPhase === 1 
        ? gameState.firstSegment.length 
        : gameState.targetWord.length;

      if (gameState.currentGuess.length < maxLength) {
        useGameStore.setState({
          gameState: {
            ...gameState,
            currentGuess: gameState.currentGuess + key.toLowerCase(),
          },
        });
      }
    }
  };

  const handleHint = (type: HintType) => {
    if (!gameState) return;

    const hint = useHint(type);
    if (hint) {
      if (typeof hint === 'string') {
        // Show definition hint
        setError(hint);
      } else {
        // Add revealed letter to current guess
        const newGuess = gameState.currentGuess.split('');
        newGuess[hint.position] = hint.letter;
        useGameStore.setState({
          gameState: {
            ...gameState,
            currentGuess: newGuess.join(''),
          },
        });
      }
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

  const score = gameState.gameStatus !== 'playing' && gameState.endTime
    ? calculateScore(
        gameState.endTime - gameState.startTime,
        DIFFICULTY_SETTINGS[gameState.difficulty].maxHints - gameState.hintsRemaining,
        gameState.difficulty,
        gameState.guesses.length
      )
    : 0;

  const winPercentage = stats.gamesPlayed > 0 
    ? Math.round((stats.wins / stats.gamesPlayed) * 100) 
    : 0;

  const averageTime = stats.gamesPlayed > 0 
    ? Math.round(stats.totalTime / stats.gamesPlayed) 
    : 0;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <Header 
          startTime={gameState.startTime} 
          isPlaying={gameState.gameStatus === 'playing'} 
        />

        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-8">
          <div className="flex justify-center mb-4">
            <Timer 
              startTime={gameState.startTime} 
              isRunning={gameState.gameStatus === 'playing'} 
              className="text-lg font-mono"
            />
          </div>

          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Phase {gameState.currentPhase}: {gameState.currentPhase === 1 ? 'Guess the first segment' : 'Complete the compound word'}
            </p>
            <p className="text-lg font-mono mt-2">
              {gameState.currentGuess || '...'}
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <GameBoard 
              maxGuesses={6} 
              wordLength={gameState.currentPhase === 1 ? gameState.targetWord.length : gameState.targetWord.length} 
              currentPhase={gameState.currentPhase}
              targetWord={gameState.targetWord}
              firstSegment={gameState.firstSegment}
            />
          </div>

          <div className="mb-8">
            <HintSystem
              onUseHint={handleHint}
              hintsRemaining={gameState.hintsRemaining}
              isDisabled={gameState.gameStatus !== 'playing'}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-8">
          <Keyboard
            onKeyPress={handleKeyPress}
            usedLetters={usedLetters}
          />
        </div>

        {gameState.gameStatus !== 'playing' && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <ScoreDisplay
              score={score}
              streak={stats.streak}
              bestStreak={stats.bestStreak}
              gamesPlayed={stats.gamesPlayed}
              winPercentage={winPercentage}
              averageTime={averageTime}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <GamePage />
    </ProtectedRoute>
  );
}
