import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { TechSkill } from '../types';
import { Cpu, Terminal, Zap, Code, ShieldCheck, Layers, Sparkles } from 'lucide-react';

export const SkillProgressBar: React.FC = () => {
  const { data, t } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Fallback skills array hardcoded in TS file as required for I18N fallback
  const fallbackSkills: TechSkill[] = [
    {
      id: 'skill-1',
      name: 'React 19 & Next.js Ecosystem',
      level: 96,
      category: 'frontend',
      color: 'cyan',
      experience: '6 Yrs',
      tagline: '高并发组件架构 / Server Components / 状态流转'
    },
    {
      id: 'skill-2',
      name: 'TypeScript & Advanced Type System',
      level: 94,
      category: 'frontend',
      color: 'amber',
      experience: '5 Yrs',
      tagline: '类型拓扑建模 / 严格断言 / 零运行时开销'
    },
    {
      id: 'skill-3',
      name: 'Tailwind CSS & Cyber Line Art UI',
      level: 95,
      category: 'frontend',
      color: 'emerald',
      experience: '5 Yrs',
      tagline: '新暴力主义 (Neo-Brutalism) / 二次元高对比度线条视觉'
    },
    {
      id: 'skill-4',
      name: 'Node.js, Express & Distributed API',
      level: 90,
      category: 'backend',
      color: 'violet',
      experience: '6 Yrs',
      tagline: '高性能 REST Server / WebSocket / 代理路由转发'
    },
    {
      id: 'skill-5',
      name: 'Gemini AI SDK & AI Agents System',
      level: 88,
      category: 'ai',
      color: 'rose',
      experience: '3 Yrs',
      tagline: '多模态推理 / Function Calling / 向量与结构化输出'
    },
    {
      id: 'skill-6',
      name: 'System Architecture & Performance',
      level: 87,
      category: 'architecture',
      color: 'sky',
      experience: '6 Yrs',
      tagline: '高可用容灾 / 模块解耦 / 极致首屏与渲染流优化'
    }
  ];

  const skillsList = (data.techSkills && data.techSkills.length > 0) ? data.techSkills : fallbackSkills;

  const categories = [
    { key: 'all', label: t.skillsFilterAll || '全量矩阵', icon: Layers },
    { key: 'frontend', label: t.skillsFilterFrontend || '前端核心', icon: Code },
    { key: 'backend', label: t.skillsFilterBackend || '后端与接口', icon: Terminal },
    { key: 'ai', label: t.skillsFilterAI || 'AI 与智能体', icon: Zap },
    { key: 'architecture', label: t.skillsFilterArch || '架构与性能', icon: Cpu },
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
      className="mt-8 mb-10"
    >
      <div className="bg-white dark:bg-slate-900 border-3 border-black dark:border-zinc-200 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#38BDF8] relative overflow-hidden transition-colors">
        {/* Top manga corner badge */}
        <div className="absolute top-0 right-8 bg-black dark:bg-zinc-100 text-yellow-300 dark:text-black font-black text-[10px] tracking-wider px-3 py-1 rounded-b-xl border-x-2 border-b-2 border-black dark:border-zinc-200 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] flex items-center gap-1.5 uppercase font-mono">
          <Sparkles className="w-3 h-3 text-yellow-300 dark:text-black fill-current" />
          <span>A1L // SKILL_MATRIX</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-300 dark:bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center text-black font-black shadow-[3px_3px_0px_0px_#000]">
              <Cpu className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-black dark:text-white tracking-tight flex items-center gap-2 font-mono">
                <span>{t.skillsProficiencyTitle || '核心技术栈熟练度'}</span>
              </h3>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-black dark:border-zinc-100 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] scale-105'
                      : 'bg-zinc-100 dark:bg-slate-800 text-zinc-800 dark:text-zinc-200 border-black dark:border-zinc-300 hover:bg-zinc-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Progress Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSkills.map((skill, index) => {
            const hexColor = getSkillColorHex(skill.color);
            const rank = getRankBadge(skill.level);

            return (
              <motion.div
                key={skill.id || skill.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-zinc-50 dark:bg-slate-950 border-2 border-black dark:border-zinc-200 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] flex flex-col gap-2.5 transition-colors group hover:-translate-y-0.5"
              >
                {/* Skill Top Info Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-black dark:text-white tracking-tight font-sans">
                      {skill.name}
                    </span>
                    {skill.experience && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 bg-zinc-200 dark:bg-slate-800 text-zinc-800 dark:text-zinc-200 border border-black dark:border-zinc-300 rounded shadow-[1px_1px_0px_0px_#000]">
                        {skill.experience}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] ${rank.bg}`}>
                      {rank.rank}
                    </span>
                    <span className="text-xs font-black font-mono text-black dark:text-yellow-300 bg-white dark:bg-slate-800 border border-black dark:border-zinc-300 px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
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
                    className="h-3.5 border border-black rounded-lg transition-all duration-300 relative group-hover:brightness-105"
                  >
                    {/* Glossy line effect */}
                    <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/40 rounded-full" />
                  </motion.div>
                </div>

                {/* Skill Tagline / Highlights */}
                {skill.tagline && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-amber-500 stroke-[3] shrink-0" />
                    <span className="truncate">{skill.tagline}</span>
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
