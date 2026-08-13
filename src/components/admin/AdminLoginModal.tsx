import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Key, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminModalOpen, closeAdminModal, loginAdmin, t, isAdmin } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);

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

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setErrorMsg(false);
  };

  return (
    <AnimatePresence>
      {isAdminModalOpen && !isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAdminModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Animated Dialog Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border-4 border-black dark:border-zinc-200 rounded-3xl shadow-[12px_12px_0px_0px_#000] dark:shadow-[12px_12px_0px_0px_#38BDF8] overflow-hidden my-auto z-10"
          >
            {/* Header Bar */}
            <div className="bg-rose-300 dark:bg-rose-400 border-b-4 border-black dark:border-zinc-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black dark:bg-slate-950 text-white rounded-lg flex items-center justify-center font-black">
                  <Key className="w-4 h-4 text-yellow-300 stroke-[2.5]" />
                </div>
                <h3 className="font-black text-base text-black dark:text-zinc-900">
                  {t.adminLoginTitle}
                </h3>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={closeAdminModal}
                className="w-8 h-8 bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-200 rounded-xl flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] hover:bg-yellow-200 dark:hover:bg-amber-400 transition-colors"
              >
                <X className="w-4 h-4 text-black dark:text-white stroke-[3]" />
              </motion.button>
            </div>

            {/* Modal Form Content */}
            <div className="p-6 flex flex-col gap-5">
              <div className="bg-amber-100 dark:bg-amber-950/50 border-2 border-black dark:border-zinc-200 p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8]">
                <p className="text-xs font-black text-black dark:text-zinc-100 leading-relaxed flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-black dark:text-zinc-100 shrink-0 stroke-[2.5]" />
                  <span>{t.adminLoginSubtitle}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1.5">
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
                    className="w-full bg-zinc-50 dark:bg-slate-950 border-3 border-black dark:border-zinc-200 p-3 rounded-xl text-sm font-black text-black dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-rose-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1.5">
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
                    className="w-full bg-zinc-50 dark:bg-slate-950 border-3 border-black dark:border-zinc-200 p-3 rounded-xl text-sm font-black text-black dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-rose-500 transition-colors"
                  />
                </div>

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-rose-200 dark:bg-rose-950/80 border-2 border-black dark:border-rose-400 p-2.5 rounded-xl text-xs font-black text-rose-900 dark:text-rose-200 shadow-[2px_2px_0px_0px_#000]"
                  >
                    ⚠️ {t.invalidPassword}
                  </motion.div>
                )}

                <div className="flex flex-col gap-2 pt-2">
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black py-3 rounded-xl text-xs font-black shadow-[4px_4px_0px_0px_#FFE4E6] dark:shadow-[4px_4px_0px_0px_#38BDF8] hover:bg-zinc-800 dark:hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>{t.loginButton}</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={handleFillDemo}
                    className="w-full bg-cyan-200 dark:bg-cyan-600 text-black dark:text-white border-2 border-black dark:border-zinc-200 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] hover:bg-cyan-300 dark:hover:bg-cyan-500 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 fill-black dark:fill-white" />
                    <span>{t.demoKeyButton} (admin123)</span>
                  </motion.button>
                </div>
              </form>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
