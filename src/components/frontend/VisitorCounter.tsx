import React from 'react';
import { useApp } from '../../context/AppContext';
import { Eye } from 'lucide-react';

export const VisitorCounter: React.FC = () => {
  const { t, data } = useApp();
  
  // Get total visits from analytics
  const totalVisits = data.totalVisits || (data.analytics || []).length;

  const formatPixelNum = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div
      className="flex items-center gap-1.5 bg-black text-emerald-400 dark:bg-slate-950 dark:text-emerald-300 border-2 border-black dark:border-zinc-200 px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] font-black tracking-wider text-[11px] font-mono select-none"
      title={t.visitorTotal}
    >
      <Eye className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
      <span className="font-extrabold tracking-widest">{formatPixelNum(totalVisits)}</span>
    </div>
  );
};

