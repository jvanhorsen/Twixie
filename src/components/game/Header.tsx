'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { LogoutButton } from '@/components/auth/LogoutButton';

interface HeaderProps {
  startTime: number;
  isPlaying: boolean;
}

export function Header({ startTime, isPlaying }: HeaderProps) {
  const { user } = useAuth();
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Player';

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Twixie
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            The Compound Word Game
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Playing as</span>
            <span className="font-medium text-primary">{username}</span>
          </div>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
} 