// 'use client';

// MAP FUNCTIONALITY COMMENTED OUT

import type { Result, Party } from '@/types';

interface Props {
  results: Result[];
  parties: Party[];
  onConstituencyClick?: (id: string) => void;
}

export default function MapView({ results, parties, onConstituencyClick }: Props) {
  return (
    <div className="flex h-[500px] sm:h-[550px] lg:h-[650px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:bg-slate-800 text-sm text-gray-500 dark:text-gray-400">
      Map functionality is currently disabled
    </div>
  );
}
