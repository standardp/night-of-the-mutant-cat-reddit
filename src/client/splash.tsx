import './index.css';
import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { DailyResponse } from '../shared/api';

const Splash = () => {
  const [d, setD] = useState<DailyResponse | null>(null);
  useEffect(() => {
    fetch('/api/daily')
      .then((r) => r.json() as Promise<DailyResponse>)
      .then(setD)
      .catch(() => setD(null));
  }, []);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-3 bg-[#0d0a10] text-[#f3ead9] font-mono p-4">
      <h1 className="text-xl font-bold text-center text-[#e8b44a]">NIGHT OF THE MUTANT CAT</h1>
      <p className="text-sm text-center">
        Three humans, one freezer, one enormous cat. A new mutation and a fresh leaderboard every day.
      </p>
      {d && (
        <p className="text-xs text-center text-[#5fd0a8]">
          Today ({d.day}): {d.mutation}
        </p>
      )}
      <button
        className="bg-[#d9503f] text-white rounded-full px-5 h-10 cursor-pointer"
        onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
      >
        Play today
      </button>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
