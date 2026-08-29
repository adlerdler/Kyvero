import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ExternalLink, Github, Calendar, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProjectDetailModal: React.FC = () => {
  const {
    selectedProject,
    setSelectedProject,
    t,
    getProjectTitle,
    getProjectSummary,
    getProjectDescription,
    getProjectCategory
  } = useApp();

  return (
    <AnimatePresence>
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-hidden">
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
            className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border-3 sm:border-4 border-black dark:border-zinc-200 rounded-2xl sm:rounded-3xl shadow-[6px_6px_0px_0px_#000] sm:shadow-[12px_12px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#38BDF8] sm:dark:shadow-[12px_12px_0px_0px_#38BDF8] overflow-hidden z-10 transition-colors max-h-[88vh] sm:max-h-[90vh] flex flex-col my-auto"
          >
            {/* Modal Top Bar */}
            <div className="bg-amber-300 dark:bg-amber-400 border-b-3 sm:border-b-4 border-black p-3 sm:p-4 flex items-center justify-between gap-2.5 sm:gap-4 shrink-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="bg-black text-white px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-black shrink-0 font-mono">
                  {getProjectCategory(selectedProject)}
                </span>
                <h3 className="font-black text-sm sm:text-lg text-black truncate min-w-0 flex-1">
                  {getProjectTitle(selectedProject)}
                </h3>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedProject(null)}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-white border-2 border-black rounded-xl flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-300 transition-colors shrink-0 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-black stroke-[3]" />
              </motion.button>
            </div>

            <div className="overflow-y-auto flex-1 scrollbar-none">
              {/* Modal Image Display */}
              <div className="relative h-36 xs:h-48 sm:h-64 md:h-80 bg-zinc-100 dark:bg-slate-950 border-b-3 sm:border-b-4 border-black dark:border-zinc-300 overflow-hidden shrink-0">
                {selectedProject.imageUrl ? (
                  <img
                    src={selectedProject.imageUrl}
                    alt={getProjectTitle(selectedProject)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-zinc-400">
                    NO IMAGE
                  </div>
                )}

                {selectedProject.featured && (
                  <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 bg-amber-300 text-black border-2 border-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] flex items-center gap-1 sm:gap-1.5">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 fill-black text-black" />
                    <span>{t.featuredProject}</span>
                  </div>
                )}
              </div>

              {/* Modal Content Body */}
              <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-5">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-zinc-500 dark:text-zinc-400 mb-1.5 sm:mb-2">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>{t.createdLabel}: {selectedProject.createdAt}</span>
                  </div>
                  <p className="text-xs sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 leading-relaxed bg-amber-50 dark:bg-slate-800 border-2 border-black dark:border-zinc-300 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] sm:dark:shadow-[3px_3px_0px_0px_#38BDF8] break-words">
                    {getProjectSummary(selectedProject)}
                  </p>
                </div>

                {getProjectDescription(selectedProject) && (
                  <div>
                    <h4 className="text-[10px] sm:text-xs font-black uppercase text-zinc-600 dark:text-amber-300 tracking-wider mb-1">
                      {t.projectDescriptionTitle}
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-200 leading-relaxed whitespace-pre-line break-words">
                      {getProjectDescription(selectedProject)}
                    </p>
                  </div>
                )}

                {/* Tech Tags */}
                <div>
                  <h4 className="text-[10px] sm:text-xs font-black uppercase text-zinc-600 dark:text-amber-300 tracking-wider mb-1.5 sm:mb-2 flex items-center gap-1">
                    <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{t.techStack}</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedProject.tags.map((tag, idx) => (
                      <motion.span
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        className="bg-cyan-100 dark:bg-slate-800 border-2 border-black dark:border-zinc-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black text-black dark:text-zinc-100 shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#38BDF8] sm:dark:shadow-[2px_2px_0px_0px_#38BDF8] break-all"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
                <div className="flex flex-col xs:flex-row gap-2.5 sm:gap-3 pt-2 sm:pt-4">
                  {selectedProject.demoUrl && (
                    <motion.a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-black text-yellow-300 border-2 border-black py-2.5 sm:py-3 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#FFE4E6] hover:bg-zinc-800 transition-colors min-h-[42px]"
                    >
                      <span className="truncate">{t.viewDemo}</span>
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    </motion.a>
                  )}

                  {selectedProject.githubUrl && (
                    <motion.a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-emerald-300 text-black border-2 border-black py-2.5 sm:py-3 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] hover:bg-emerald-400 transition-colors min-h-[42px]"
                    >
                      <span className="truncate">{t.viewGithub}</span>
                      <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
