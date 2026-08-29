import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { TechSkill } from '../../types';
import { Cpu, Terminal, Zap, Code, ShieldCheck, Layers, Sparkles } from 'lucide-react';

const initialTechSkills: TechSkill[] = [];

export const SkillProgressBar: React.FC = () => {
  const { data, t, language, getSkillTagline } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const skillsList = (data.techSkills && data.techSkills.length > 0) ? data.techSkills : initialTechSkills;

  const categories = [
    { key: 'all', label: t.skillsFilterAll, icon: Layers },
    { key: 'frontend', label: t.skillsFilterFrontend , icon: Code },
    { key: 'backend', label: t.skillsFilterBackend , icon: Terminal },
    { key: 'ai', label: t.skillsFilterAI , icon: Zap },
    { key: 'architecture', label: t.skillsFilterArch, icon: Cpu },
  ];

  const filteredSkills = activeCategory === 'all'
    ? skillsList
    : skillsList.filter(skill => skill.category === activeCategory);

  const getSkillColorHex = (color: string) => {
    if (color && color.startsWith('#')) return color;
    switch (color) {
      case 'cyan': return '#06B6D4';
      case 'amber': return '#F59E0B';
      case 'emerald': return '#10B981';
      case 'violet': return '#8B5CF6';
      case 'rose': return '#F43F5E';
      case 'sky': return '#0EA5E9';
      default: return '#38BDF8';
    }
  };

  const getRankBadge = (level: number) => {
    if (level >= 95) return { rank: 'EX-RANK', bg: 'bg-amber-300 dark:bg-amber-400 text-black' };
    if (level >= 90) return { rank: 'S-RANK', bg: 'bg-cyan-300 dark:bg-cyan-400 text-black' };
    if (level >= 85) return { rank: 'A-RANK', bg: 'bg-emerald-300 dark:bg-emerald-400 text-black' };
    return { rank: 'B-RANK', bg: 'bg-violet-300 dark:bg-violet-400 text-black' };
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mt-6 sm:mt-8 mb-8 sm:mb-10"
    >
      <div className="bg-white dark:bg-slate-900 border-3 border-black dark:border-zinc-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[5px_5px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#38BDF8] sm:dark:shadow-[8px_8px_0px_0px_#38BDF8] relative overflow-hidden transition-colors">
        {/* Top manga corner badge */}
        <div className="absolute top-0 right-4 sm:right-8 bg-black dark:bg-zinc-100 text-yellow-300 dark:text-black font-black text-[9px] sm:text-[10px] tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-b-xl border-x-2 border-b-2 border-black dark:border-zinc-200 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] flex items-center gap-1.5 uppercase font-mono">
          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300 dark:text-black fill-current" />
          <span>{t.skillMatrixLabel}</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4 mb-5 sm:mb-6 pt-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-300 dark:bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center text-black font-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] shrink-0">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-black dark:text-white tracking-tight flex items-center gap-2 font-mono">
                <span>{t.skillsProficiencyTitle}</span>
              </h3>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap shrink-0">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black border-2 transition-all cursor-pointer min-h-[32px] sm:min-h-[36px] shrink-0 ${
                    isActive
                      ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-black dark:border-zinc-100 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] scale-105'
                      : 'bg-zinc-100 dark:bg-slate-800 text-zinc-800 dark:text-zinc-200 border-black dark:border-zinc-300 hover:bg-zinc-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <IconComp className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Progress Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
          {filteredSkills.map((skill, index) => {
            const hexColor = getSkillColorHex(skill.color);
            const rank = getRankBadge(skill.level);
            const taglineText = getSkillTagline(skill.tagline, language);

            return (
              <motion.div
                key={skill.id || skill.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-zinc-50 dark:bg-slate-950 border-2 border-black dark:border-zinc-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] sm:dark:shadow-[4px_4px_0px_0px_#38BDF8] flex flex-col gap-2 sm:gap-2.5 transition-colors group hover:-translate-y-0.5"
              >
                {/* Skill Top Info Row */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="font-black text-xs sm:text-sm text-black dark:text-white tracking-tight font-sans truncate">
                      {skill.name}
                    </span>
                    {skill.experience && (
                      <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 sm:py-0.5 bg-zinc-200 dark:bg-slate-800 text-zinc-800 dark:text-zinc-200 border border-black dark:border-zinc-300 rounded shadow-[1px_1px_0px_0px_#000] shrink-0">
                        {skill.experience}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] ${rank.bg}`}>
                      {rank.rank}
                    </span>
                    <span className="text-[11px] sm:text-xs font-black font-mono text-black dark:text-yellow-300 bg-white dark:bg-slate-800 border border-black dark:border-zinc-300 px-1.5 sm:px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                      {skill.level}%
                    </span>
                  </div>
                </div>

                {/* Animated Progress Bar Container */}
                <div className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-200 rounded-xl p-1 shadow-[2px_2px_0px_0px_#000] relative overflow-hidden">
                  {/* Subtle Manga Halftone texture inside bar */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />

                  {/* Motion Fill Bar */}
                  <motion.div
                    initial={{ width: '0%' }}
                    whileInView={{ width: `${Math.min(Math.max(skill.level, 0), 100)}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.1,
                      ease: [0.25, 1, 0.5, 1],
                      delay: 0.15 + index * 0.08
                    }}
                    style={{ backgroundColor: hexColor }}
                    className="h-3 sm:h-3.5 border border-black rounded-lg transition-all duration-300 relative group-hover:brightness-105"
                  >
                    {/* Glossy line effect */}
                    <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/40 rounded-full" />
                  </motion.div>
                </div>

                {/* Skill Tagline / Highlights */}
                {taglineText && (
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-amber-500 stroke-[3] shrink-0" />
                    <span className="truncate">{taglineText}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};
