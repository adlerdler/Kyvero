import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../i18n/languages';
import { LanguageCode } from '../types';
import { FlagIcon } from './FlagIcon';
import { Terminal, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const { language, setLanguage, t, theme, toggleTheme, setCurrentView, data } = useApp();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 bg-zinc-50/90 dark:bg-slate-950/90 backdrop-blur-md px-4 py-3 border-b-2 border-transparent dark:border-slate-800 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Anime Badge */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setCurrentView('home')}
            className="relative group cursor-pointer"
            title={data.systemConfig?.siteTitle || data.profile.siteTitle || `${data.profile.name} - 返回首页`}
          >
            <motion.div
              whileHover={{ rotate: [-2, 2, -2, 0], scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 bg-amber-300 dark:bg-amber-400 border-2 border-black dark:border-white rounded-lg flex items-center justify-center overflow-hidden font-black text-xl text-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] transition-all"
            >
              {data.systemConfig?.logoUrl || data.profile.logoUrl ? (
                <img
                  src={data.systemConfig?.logoUrl || data.profile.logoUrl}
                  alt={data.profile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to Terminal icon if image fails to load
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Terminal className="w-6 h-6 stroke-[2.5]" />
              )}
            </motion.div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-xl md:text-2xl text-black dark:text-white tracking-tighter font-mono flex items-center gap-2 transition-colors">
                <span>{data.systemConfig?.siteTitle || data.profile.siteTitle || data.profile.name}</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Action Controls: Theme Switcher & Language Switcher */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle Button (Light Anime vs Dark Anime) - Icon Only */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border-2 transition-all flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-slate-900 text-amber-300 border-zinc-200 shadow-[2.5px_2.5px_0px_0px_#38BDF8] hover:bg-slate-800'
                : 'bg-amber-300 text-black border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-amber-400'
            }`}
            title={theme === 'dark' ? '切换至明亮模式 / Light Mode' : '切换至暗黑模式 / Dark Mode'}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 fill-amber-300 text-amber-300 stroke-[2]" />
            ) : (
              <Sun className="w-4 h-4 fill-amber-400 text-black stroke-[2.5]" />
            )}
          </motion.button>

          {/* 5-Language Switcher Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-200 p-2.5 rounded-xl text-black dark:text-white shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_0px_#38BDF8] hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
              title={`${t.languageSelect} (${currentLangObj.name})`}
            >
              <FlagIcon code={language} className="w-5 h-3.5" />
            </motion.button>

            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-200 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] py-1.5 z-50"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between transition-colors ${
                        language === lang.code
                          ? 'bg-amber-200 dark:bg-amber-400/20 text-black dark:text-amber-300 font-extrabold'
                          : 'text-zinc-800 dark:text-zinc-200 hover:bg-amber-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FlagIcon code={lang.code} className="w-4 h-3" />
                        <span>{lang.name}</span>
                      </span>
                      {language === lang.code && <span className="text-xs font-black">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </motion.header>
  );
};
