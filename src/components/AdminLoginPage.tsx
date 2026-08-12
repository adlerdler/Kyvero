import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Key, ShieldCheck, ArrowLeft, Sun, Moon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LANGUAGES, LanguageCode } from '../i18n/languages';
import { FlagIcon } from './FlagIcon';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, t, setCurrentView, theme, toggleTheme, language, setLanguage, users } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password, username);
    if (!success) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-20 flex flex-col justify-center min-h-[85vh]">
      {/* Top action bar: Back button + Theme/Lang switch */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-200 px-3.5 py-2 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          <span>{t.returnToHome}</span>
        </motion.button>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`p-2 rounded-xl border-2 transition-all flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-slate-900 text-amber-300 border-zinc-200 shadow-[2px_2px_0px_0px_#38BDF8]'
                : 'bg-amber-300 text-black border-black shadow-[2px_2px_0px_0px_#000] hover:bg-amber-400'
            }`}
            title={theme === 'dark' ? '切换至明亮模式' : '切换至暗黑模式'}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 fill-amber-300 text-amber-300 stroke-[2]" />
            ) : (
              <Sun className="w-4 h-4 fill-amber-400 text-black stroke-[2.5]" />
            )}
          </motion.button>

          {/* Language Switcher */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-200 p-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
              title={`${t.languageSelect} (${currentLangObj.name})`}
            >
              <Globe className="w-4 h-4 text-black dark:text-white shrink-0 stroke-[2.5]" />
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
                      className={`w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between transition-colors ${
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

      {/* Main Standalone Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border-4 border-black dark:border-zinc-200 rounded-3xl shadow-[12px_12px_0px_0px_#000] dark:shadow-[12px_12px_0px_0px_#38BDF8] overflow-hidden"
      >
        {/* Header Bar (No dividers) */}
        <div className="bg-rose-300 dark:bg-rose-400 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-black text-white rounded-2xl flex items-center justify-center font-black shadow-[3px_3px_0px_0px_#000]">
              <Key className="w-6 h-6 text-yellow-300 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-black text-xl text-black font-mono">
                {t.adminLoginTitle}
              </h2>
              <p className="text-xs font-bold text-black/80 mt-0.5">
                {t.adminPortalSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-2">
                {t.usernameLabel}
              </label>
              <input
                type="text"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  setErrorMsg(false);
                }}
                placeholder={t.usernamePlaceholder}
                className="w-full bg-zinc-50 dark:bg-slate-950 border-3 border-black dark:border-zinc-200 p-4 rounded-2xl text-sm font-black text-black dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-rose-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-2">
                {t.passwordLabel}
              </label>
              <input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setErrorMsg(false);
                }}
                placeholder={t.passwordPlaceholder}
                autoFocus
                className="w-full bg-zinc-50 dark:bg-slate-950 border-3 border-black dark:border-zinc-200 p-4 rounded-2xl text-sm font-black text-black dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-rose-500 transition-colors"
              />
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-rose-200 dark:bg-rose-950/80 border-2 border-black dark:border-rose-400 p-3 rounded-xl text-xs font-black text-rose-900 dark:text-rose-200 shadow-[2px_2px_0px_0px_#000]"
              >
                ⚠️ {t.invalidUsernameOrPassword || t.invalidPassword}
              </motion.div>
            )}

            <div className="pt-2">
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="w-full bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-3 border-black py-4 rounded-2xl text-sm font-black shadow-[4px_4px_0px_0px_#FFE4E6] dark:shadow-[4px_4px_0px_0px_#38BDF8] hover:bg-zinc-800 dark:hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                <span>{t.loginButton}</span>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
