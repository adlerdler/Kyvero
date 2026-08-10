import React from 'react';
import { useApp } from '../context/AppContext';
import { ExternalLink, Github, Sparkles, FolderGit2, Eye, Layers, Star } from 'lucide-react';
import { Project } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const ProjectsGrid: React.FC = () => {
  const {
    data,
    t,
    activeCategory,
    setActiveCategory,
    setSelectedProject
  } = useApp();

  const { projects } = data;

  // Extract all categories dynamically
  const categories = ['ALL', 'FEATURED', ...Array.from(new Set(projects.map(p => p.category)))];

  // Filter projects based on category
  const filteredProjects = projects.filter(p => {
    return activeCategory === 'ALL'
      ? true
      : activeCategory === 'FEATURED'
      ? p.featured
      : p.category === activeCategory;
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mt-8 mb-12"
    >
      <div className="bg-white dark:bg-slate-900 border-3 border-black dark:border-zinc-200 rounded-3xl p-6 md:p-10 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#38BDF8] relative overflow-hidden transition-colors">
        {/* Top corner badge */}
        <div className="absolute top-0 right-10 bg-black dark:bg-zinc-100 text-yellow-300 dark:text-black font-black text-[11px] tracking-wider px-4 py-1.5 rounded-b-2xl border-x-2 border-b-2 border-black dark:border-zinc-200 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] flex items-center gap-2 uppercase font-mono">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 dark:text-black fill-current animate-pulse" />
          <span>A1L // PORTFOLIO_HUB</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pt-2">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-cyan-300 dark:bg-cyan-400 border-3 border-black rounded-2xl flex items-center justify-center text-black font-black shadow-[3px_3px_0px_0px_#000]">
              <FolderGit2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white tracking-tight flex items-center gap-3 font-mono">
                <span>{t.projectsSection}</span>
                <motion.span
                  key={filteredProjects.length}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-amber-300 dark:bg-amber-400 text-black text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                >
                  {filteredProjects.length}
                </motion.span>
              </h3>
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-1">
                精选全栈工程、移动端应用及AI交互架构作品矩阵
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => {
              const isSelected = activeCategory === cat;
              const label = cat === 'ALL' ? t.allProjects : cat === 'FEATURED' ? t.featuredProjects : cat;

              return (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-black dark:border-zinc-100 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] scale-105'
                      : 'bg-zinc-100 dark:bg-slate-800 text-zinc-800 dark:text-zinc-200 border-black dark:border-zinc-300 hover:bg-zinc-200 dark:hover:bg-slate-700 shadow-[2px_2px_0px_0px_#000]'
                  }`}
                >
                  {cat === 'ALL' && <Layers className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {cat === 'FEATURED' && <Star className="w-3.5 h-3.5 stroke-[2.5] fill-yellow-400 dark:fill-black text-yellow-400 dark:text-black" />}
                  <span>{label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-50 dark:bg-slate-950 border-2 border-black dark:border-zinc-200 rounded-2xl p-12 text-center shadow-[4px_4px_0px_0px_#000]"
            >
              <p className="font-black text-sm text-zinc-700 dark:text-zinc-200">
                🔍 暂无匹配的项目内容，请尝试切回“全部项目”
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project: Project, index: number) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white dark:bg-slate-950 border-3 border-black dark:border-zinc-200 rounded-2xl shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#38BDF8] hover:shadow-[7px_7px_0px_0px_#000] dark:hover:shadow-[7px_7px_0px_0px_#38BDF8] overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Image Banner Container */}
                  <div
                    className="relative bg-zinc-100 dark:bg-slate-900 h-48 border-b-3 border-black dark:border-zinc-200 overflow-hidden cursor-pointer group/img"
                    onClick={() => setSelectedProject(project)}
                  >
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-500 ease-out"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-15 transition-opacity" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-cyan-300 dark:bg-cyan-400 text-black border-2 border-black px-3 py-1 rounded-xl text-[11px] font-black shadow-[2px_2px_0px_0px_#000] uppercase font-mono">
                      {project.category}
                    </div>

                    {/* Featured Tag */}
                    {project.featured && (
                      <div className="absolute top-3 right-3 bg-amber-300 dark:bg-amber-400 text-black border-2 border-black px-2.5 py-1 rounded-xl text-[10px] font-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1 uppercase font-mono">
                        <Sparkles className="w-3 h-3 fill-black text-black" />
                        <span>FEATURED</span>
                      </div>
                    )}

                    {/* Click preview prompt */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-black border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-2 transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
                        <Eye className="w-4 h-4 stroke-[2.5]" />
                        <span>查看项目详情</span>
                      </span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-5 flex flex-col gap-3 flex-grow">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                      <span>{project.createdAt}</span>
                      <span className="bg-zinc-100 dark:bg-slate-900 border border-black dark:border-zinc-700 px-2 py-0.5 rounded">
                        ID: #{project.id.slice(0, 6)}
                      </span>
                    </div>

                    <h4
                      className="font-black text-lg text-black dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer leading-snug"
                      onClick={() => setSelectedProject(project)}
                    >
                      {project.title}
                    </h4>

                    <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                      {project.summary}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-300 px-2.5 py-0.5 rounded-lg text-[10px] font-black font-mono text-black dark:text-zinc-100 shadow-[1.5px_1.5px_0px_0px_#000]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="p-3.5 bg-zinc-100/90 dark:bg-slate-900/90 flex items-center justify-between gap-2.5 border-t-3 border-black dark:border-zinc-200">
                    {project.demoUrl ? (
                      <motion.a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileTap={{ scale: 0.96 }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black py-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] hover:bg-zinc-800 dark:hover:bg-amber-300 transition-colors"
                      >
                        <span>{t.viewDemo}</span>
                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      </motion.a>
                    ) : (
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex-1 bg-white dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 border-2 border-black dark:border-zinc-300 py-2 rounded-xl text-xs font-black cursor-pointer hover:bg-zinc-200 dark:hover:bg-slate-700 shadow-[2px_2px_0px_0px_#000] transition-colors"
                      >
                        {t.preview}
                      </button>
                    )}

                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 bg-emerald-300 text-black border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] hover:bg-emerald-400 transition-colors"
                        title={t.viewGithub}
                      >
                        <Github className="w-4 h-4 stroke-[2.5]" />
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
