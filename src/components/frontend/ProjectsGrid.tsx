import React from 'react';
import { useApp } from '../../context/AppContext';
import { ExternalLink, Github, Sparkles, FolderGit2, Eye, Layers, Star } from 'lucide-react';
import { Project } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

export const ProjectsGrid: React.FC = () => {
  const {
    data,
    t,
    setSelectedProject,
    getProjectTitle,
    getProjectSummary,
    getProjectCategory
  } = useApp();

  const { projects } = data;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.01, once: true }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="mt-4 mb-8"
    >
      <div className="relative overflow-hidden transition-colors">
        {/* Top corner badge - keeping it but making it subtle if needed, or removing if requested. 
            User said remove parent style, so I'll remove the big container box styles. */}
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-10 pt-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-cyan-400 dark:bg-cyan-500 rounded-xl flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000] border-2 border-black shrink-0">
              <FolderGit2 className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black dark:text-white tracking-tight flex items-center gap-2.5 sm:gap-3 font-mono">
                <span>{t.projectsSection}</span>
                <motion.span
                  key={projects.length}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-amber-400 dark:bg-amber-500 text-black text-[11px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 rounded-full border-2 border-black"
                >
                  {projects.length}
                </motion.span>
              </h3>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {projects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-50 dark:bg-slate-950 border-2 border-black dark:border-zinc-800 rounded-2xl p-8 sm:p-12 text-center"
            >
              <p className="font-black text-sm text-zinc-700 dark:text-zinc-200">
                {t.noProjectsFound}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8"
            >
              {projects.map((project: Project, index: number) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.01, once: true }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.15) }}
                  onClick={() => setSelectedProject(project)}
                  className="bg-white dark:bg-slate-950 border-2 border-black dark:border-zinc-800 rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#38BDF8] overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                >
                  {/* Image Banner Container */}
                  <div className="relative bg-zinc-100 dark:bg-slate-900 h-40 xs:h-48 sm:h-52 border-b-2 border-black dark:border-zinc-800 overflow-hidden group/img">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={getProjectTitle(project)}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-200 dark:bg-slate-800 flex items-center justify-center font-mono text-xs text-zinc-400">
                        NO IMAGE
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />

                    {/* Category Badge */}
                    <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 bg-cyan-400 text-black border-2 border-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-black shadow-[1.5px_1.5px_0px_0px_#000] uppercase font-mono z-10 pointer-events-none">
                      {getProjectCategory(project)}
                    </div>

                    {/* Featured Tag */}
                    {project.featured && (
                      <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 bg-amber-400 text-black border-2 border-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[8px] sm:text-[9px] font-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 uppercase font-mono z-10 pointer-events-none">
                        <Sparkles className="w-2.5 h-2.5 fill-black text-black" />
                        <span>{t.featuredLabel}</span>
                      </div>
                    )}

                    {/* Click preview prompt */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <div className="bg-white text-black border-2 border-black px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-[11px] font-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-2 transform translate-y-4 group-hover/img:translate-y-0 transition-all duration-300">
                        <Eye className="w-4 h-4 stroke-[2.5]" />
                        <span>{t.viewProjectDetails}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-4 sm:p-6 flex flex-col gap-2.5 sm:gap-3.5 flex-grow">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <FolderGit2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{project.createdAt}</span>
                      </span>
                      <span className="opacity-60 shrink-0">#{project.id.slice(0, 6)}</span>
                    </div>

                    <h4 className="font-black text-base sm:text-xl text-black dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors cursor-pointer leading-tight break-words">
                      {getProjectTitle(project)}
                    </h4>

                    <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed break-words">
                      {getProjectSummary(project)}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                      {project.tags.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                          className="bg-zinc-100 dark:bg-slate-900 text-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded text-[9px] font-bold font-mono border border-black/10 dark:border-white/10 break-all"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="text-[9px] font-bold text-zinc-400 font-mono self-center">
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-1 sm:pt-2 flex items-center gap-2 sm:gap-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-100 dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-700 py-2 sm:py-2.5 rounded-xl text-xs font-black cursor-pointer hover:bg-zinc-200 dark:hover:bg-slate-800 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] transition-all min-h-[38px] sm:min-h-[40px]"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span className="truncate">{t.preview}</span>
                    </button>

                    {project.demoUrl && (
                      <motion.a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        whileTap={{ scale: 0.96 }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black py-2 sm:py-2.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] hover:bg-zinc-800 dark:hover:bg-amber-300 transition-all min-h-[38px] sm:min-h-[40px]"
                      >
                        <span className="truncate">{t.viewDemo}</span>
                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                      </motion.a>
                    )}

                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-400 text-black border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] hover:bg-emerald-500 transition-all shrink-0"
                        title={t.viewGithub}
                      >
                        <Github className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
