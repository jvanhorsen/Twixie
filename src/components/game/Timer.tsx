'use client';

import { useEffect, useState } from 'react';
import { formatTime } from '@/lib/utils';
import { ClockIcon } from '@heroicons/react/24/outline';

interface TimerProps {
  startTime: number;
  isRunning?: boolean;
  className?: string;
}

export function Timer({ startTime, isRunning = true, className = '' }: TimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  return (
    <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-300 ${className}`}>
      <ClockIcon className="w-5 h-5" />
      <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
    </div>
  );
} 