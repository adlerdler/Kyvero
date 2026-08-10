import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Eye } from 'lucide-react';

const VISITOR_STORAGE_KEY = 'manga_portfolio_visitor_stats_v2';

export const VisitorCounter: React.FC = () => {
  const { t } = useApp();
  const [totalVisits, setTotalVisits] = useState<number>(18420);

  useEffect(() => {
    let currentVisits = 18420;

    try {
      const saved = localStorage.getItem(VISITOR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.totalVisits === 'number') {
          currentVisits = parsed.totalVisits;
        }
      }
    } catch {
      // Fallback to default
    }

    const nextVisits = currentVisits + 1;
    setTotalVisits(nextVisits);

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify({
        totalVisits: nextVisits,
        todayVisits: 1,
        lastVisitDate: todayStr
      }));
    } catch {
      // Ignore
    }
  }, []);

  const formatPixelNum = (num: number) => {
    return num.toLocaleString().padStart(6, '0');
  };

  return (
    <div
      className="flex items-center gap-1.5 bg-black text-emerald-400 dark:bg-slate-950 dark:text-emerald-300 border-2 border-black dark:border-zinc-200 px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] font-black tracking-wider text-[11px] font-mono select-none"
      title={t.visitorTotal}
    >
      <Eye className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
      <span className="text-[10px] text-zinc-400 uppercase font-sans hidden sm:inline">{t.visitorTotal}:</span>
      <span className="font-extrabold tracking-widest">{formatPixelNum(totalVisits)}</span>
    </div>
  );
};

