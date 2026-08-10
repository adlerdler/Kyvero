import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ExternalLink, Github, Calendar, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProjectDetailModal: React.FC = () => {
  const { selectedProject, setSelectedProject, t } = useApp();

  return (
    <AnimatePresence>
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Animated Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border-4 border-black dark:border-zinc-200 rounded-3xl shadow-[12px_12px_0px_0px_#000] dark:shadow-[12px_12px_0px_0px_#38BDF8] overflow-hidden my-8 z-10 transition-colors"
          >
            {/* Modal Top Bar */}
            <div className="bg-amber-300 dark:bg-amber-400 border-b-4 border-black p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="bg-black text-white px-2.5 py-0.5 rounded text-xs font-black">
                  {selectedProject.category}
                </span>
                <h3 className="font-black text-lg text-black truncate max-w-md">
                  {selectedProject.title}
                </h3>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedProject(null)}
                className="w-9 h-9 bg-white border-2 border-black rounded-xl flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-300 transition-colors"
              >
                <X className="w-5 h-5 text-black stroke-[3]" />
              </motion.button>
            </div>

            {/* Modal Image Display */}
            <div className="relative h-64 md:h-80 bg-zinc-100 dark:bg-slate-950 border-b-4 border-black dark:border-zinc-300 overflow-hidden">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />

              {selectedProject.featured && (
                <div className="absolute top-4 right-4 bg-amber-300 text-black border-2 border-black px-3 py-1 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 fill-black text-black" />
                  <span>FEATURED PROJECT</span>
                </div>
              )}
            </div>

            {/* Modal Content Body */}
            <div className="p-6 md:p-8 flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-black text-zinc-500 dark:text-zinc-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Created: {selectedProject.createdAt}</span>
                </div>
                <p className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 leading-relaxed bg-amber-50 dark:bg-slate-800 border-2 border-black dark:border-zinc-300 p-4 rounded-2xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8]">
                  {selectedProject.summary}
                </p>
              </div>

              {selectedProject.description && (
                <div>
                  <h4 className="text-xs font-black uppercase text-zinc-600 dark:text-amber-300 tracking-wider mb-1.5">
                    Detailed Architecture & Overview
                  </h4>
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                    {selectedProject.description}
                  </p>
                </div>
              )}

              {/* Tech Tags */}
              <div>
                <h4 className="text-xs font-black uppercase text-zinc-600 dark:text-amber-300 tracking-wider mb-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{t.techStack}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="bg-cyan-100 dark:bg-slate-800 border-2 border-black dark:border-zinc-300 px-3 py-1 rounded-xl text-xs font-black text-black dark:text-zinc-100 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8]"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap gap-3 pt-4">
                {selectedProject.demoUrl && (
                  <motion.a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-yellow-300 border-2 border-black py-3 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#FFE4E6] hover:bg-zinc-800 transition-colors"
                  >
                    <span>{t.viewDemo}</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                )}

                {selectedProject.githubUrl && (
                  <motion.a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-300 text-black border-2 border-black py-3 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:bg-emerald-400 transition-colors"
                  >
                    <span>{t.viewGithub}</span>
                    <Github className="w-4 h-4 stroke-[2.5]" />
                  </motion.a>
                )}
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
