import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, Zap, Code2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AnimeLoaderProps {
  isLoading: boolean;
  onFinished?: () => void;
}

export const AnimeLoader: React.FC<AnimeLoaderProps> = ({ isLoading }) => {
  const { t } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 18) + 12;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="anime-global-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-[#FDFDFC] dark:bg-[#090D16] flex flex-col items-center justify-center p-4 selection:bg-amber-300"
        >
          {/* Subtle manga grid background accent */}
          <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Loader Card */}
          <motion.div
            initial={{ scale: 0.85, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 border-4 border-black dark:border-zinc-100 rounded-3xl p-6 shadow-[10px_10px_0px_0px_#000] dark:shadow-[10px_10px_0px_0px_#38BDF8] flex flex-col items-center text-center overflow-hidden z-10"
          >
            {/* Top decorative badge */}
            <div className="absolute -top-1 right-6 bg-cyan-300 dark:bg-cyan-400 text-black border-2 border-black px-3 py-0.5 rounded-b-xl text-[10px] font-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-black text-black" />
              <span>A1L MECHA SYSTEM</span>
            </div>

            {/* Pulsing Avatar/Icon Badge */}
            <div className="relative mt-2 mb-4">
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 bg-amber-300 dark:bg-amber-400 border-3 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000] text-black"
              >
                <Terminal className="w-10 h-10 stroke-[2.5]" />
              </motion.div>

              <motion.div
                animate={{ scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="absolute -bottom-2 -right-2 bg-cyan-300 dark:bg-cyan-400 text-black border-2 border-black p-1.5 rounded-lg shadow-[2px_2px_0px_0px_#000]"
              >
                <Zap className="w-4 h-4 fill-black text-black" />
              </motion.div>
            </div>

            {/* Title & Status */}
            <h3 className="font-black text-lg text-black dark:text-white tracking-tight flex items-center justify-center gap-2">
              <span>{t.loaderSystemInitializing}</span>
              <Code2 className="w-4 h-4 text-amber-500 stroke-[3]" />
            </h3>

            <p className="text-xs font-extrabold text-zinc-600 dark:text-zinc-300 mt-1 mb-4">
              {t.loaderLoadingStatus}
            </p>

            {/* Progress Bar Container */}
            <div className="w-full bg-zinc-100 dark:bg-slate-950 border-3 border-black dark:border-zinc-200 rounded-xl p-1 shadow-[3px_3px_0px_0px_#000] relative">
              <motion.div
                className="h-4 bg-amber-300 dark:bg-amber-400 border-2 border-black rounded-lg transition-all duration-150"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            {/* Percentage & Footer hint */}
            <div className="w-full flex items-center justify-between mt-2.5 px-1">
              <span className="text-[11px] font-black text-black dark:text-zinc-200">
                LOADING DATA...
              </span>
              <span className="text-xs font-black text-black dark:text-amber-300 bg-amber-100 dark:bg-slate-800 border border-black dark:border-zinc-300 px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#000]">
                {Math.min(progress, 100)}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
