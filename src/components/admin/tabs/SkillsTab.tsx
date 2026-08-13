import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { AnimatePresence, motion } from 'motion/react';
import { Cpu, Plus, Sparkles, X, Check, Palette, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import { TechSkill, LanguageCode } from '../../../types';

const ANIME_COLOR_SWATCHES = [
  { name: '赛博青蓝', hex: '#38BDF8' },
  { name: '燃魂琥珀', hex: '#F59E0B' },
  { name: '二次元绿', hex: '#10B981' },
  { name: '霓虹紫罗兰', hex: '#A855F7' },
  { name: '高热红莲', hex: '#F43F5E' },
  { name: '樱花霓虹', hex: '#EC4899' },
  { name: '电光极蓝', hex: '#6366F1' },
  { name: '薄荷冰青', hex: '#14B8A6' },
  { name: '活力赤橙', hex: '#F97316' },
  { name: '高能电黄', hex: '#EAB308' },
];

export const SkillsTab: React.FC = () => {
  const {
    data,
    t,
    language,
    addTechSkill,
    updateTechSkill,
    deleteTechSkill,
    getSkillTagline
  } = useApp();

  const dbt = t;

  const [editingSkill, setEditingSkill] = useState<TechSkill | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState<Omit<TechSkill, 'id'>>({
    name: '',
    level: 90,
    category: 'frontend',
    color: '#38BDF8',
    experience: '5 Yrs',
    tagline: {
      'zh-CN': '',
      'zh-TW': '',
      'en': '',
      'ja': '',
      'ko': ''
    }
  });

  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;

    if (editingSkill) {
      updateTechSkill({
        ...editingSkill,
        ...skillForm,
        level: Number(skillForm.level)
      });
    } else {
      addTechSkill({
        ...skillForm,
        level: Number(skillForm.level)
      });
    }
    setIsAddingSkill(false);
    setEditingSkill(null);
    setSkillForm({
      name: '',
      level: 90,
      category: 'frontend',
      color: '#38BDF8',
      experience: '5 Yrs',
      tagline: {
        'zh-CN': '',
        'zh-TW': '',
        'en': '',
        'ja': '',
        'ko': ''
      }
    });
  };

  const startEditSkill = (skill: TechSkill) => {
    setEditingSkill(skill);
    const resolvedTagline = typeof skill.tagline === 'string'
      ? { 'zh-CN': skill.tagline, 'zh-TW': skill.tagline, 'en': skill.tagline, 'ja': skill.tagline, 'ko': skill.tagline }
      : (skill.tagline || { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' });
    setSkillForm({
      name: skill.name,
      level: skill.level,
      category: skill.category,
      color: skill.color,
      experience: skill.experience || '',
      tagline: resolvedTagline
    });
    setIsAddingSkill(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 dark:bg-slate-900 border-3 border-black dark:border-zinc-500 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8]">
        <div>
          <h4 className="font-black text-base text-black dark:text-zinc-200 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-500 stroke-[2.5]" />
            <span>{t.tabSkills}</span>
            <span className="text-xs bg-black dark:bg-amber-400 text-yellow-300 dark:text-black font-mono px-2 py-0.5 rounded-full border border-black dark:border-zinc-200 shadow-[1px_1px_0px_0px_#000]">
              {(data.techSkills || []).length} ITEMS
            </span>
          </h4>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAddingSkill(true);
            setEditingSkill(null);
            setSkillForm({
              name: '',
              level: 90,
              category: 'frontend',
              color: '#38BDF8',
              experience: '5 Yrs',
              tagline: {
                'zh-CN': '',
                'zh-TW': '',
                'en': '',
                'ja': '',
                'ko': ''
              }
            });
          }}
          className="bg-amber-300 dark:bg-amber-400 text-black border-2 border-black dark:border-zinc-200 px-4 py-2 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] hover:bg-amber-400 dark:hover:bg-amber-300 active:translate-y-0.5 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t.addSkillBtn || '新增核心技能'}</span>
        </button>
      </div>

      {/* Skill Add/Edit Form Modal */}
      <AnimatePresence>
        {isAddingSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddingSkill(false);
                setEditingSkill(null);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-yellow-50 dark:bg-slate-800 border-4 border-black dark:border-zinc-300 w-full max-w-2xl rounded-2xl p-6 shadow-[8px_8px_0px_0px_#000] relative z-10 flex flex-col max-h-[85vh] overflow-y-auto"
            >
              <form
                onSubmit={handleSkillSubmit}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center justify-between pb-2">
                  <h4 className="font-black text-sm text-black dark:text-white uppercase flex items-center gap-2 font-mono">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{editingSkill ? t.editSkillBtn || '编辑技能项' : t.addSkillBtn || '新增核心技能项'}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSkill(false);
                      setEditingSkill(null);
                    }}
                    className="p-1 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-black dark:text-zinc-300 uppercase mb-1">
                      {t.skillName || '技能名称'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={skillForm.name}
                      onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                      placeholder="e.g. React 19 & Next.js"
                      className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-black dark:text-zinc-300 uppercase mb-1">
                      {t.skillCategory || '技能分类'}
                    </label>
                    <select
                      value={skillForm.category}
                      onChange={e => setSkillForm({ ...skillForm, category: e.target.value as any })}
                      className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                    >
                      <option value="frontend">Frontend {t.skillsFilterFrontendTag}</option>
                      <option value="backend">Backend {t.skillsFilterBackendTag}</option>
                      <option value="ai">AI System {t.skillsFilterAITag}</option>
                      <option value="architecture">Architecture {t.skillsFilterArchTag}</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-black text-black dark:text-zinc-300 uppercase">
                        {t.skillLevel || '熟练度数值 (0 - 100%)'}
                      </label>
                      <span className="text-xs font-black font-mono text-black bg-yellow-300 border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                        {skillForm.level}% {skillForm.level >= 95 ? '(EX-RANK)' : skillForm.level >= 90 ? '(S-RANK)' : skillForm.level >= 85 ? '(A-RANK)' : '(B-RANK)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2 rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
                      <button
                        type="button"
                        onClick={() => setSkillForm({ ...skillForm, level: Math.max(0, skillForm.level - 5) })}
                        className="bg-zinc-100 dark:bg-slate-800 text-black dark:text-white hover:bg-amber-200 border border-black dark:border-zinc-400 px-2.5 py-1 rounded-lg text-xs font-black transition-colors"
                      >
                        -5%
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={skillForm.level}
                        onChange={e => setSkillForm({ ...skillForm, level: Math.min(100, Math.max(0, Number(e.target.value))) })}
                        className="w-full bg-zinc-50 dark:bg-slate-800 border border-black dark:border-zinc-400 p-1.5 rounded-lg text-center text-xs font-black font-mono text-black dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setSkillForm({ ...skillForm, level: Math.min(100, skillForm.level + 5) })}
                        className="bg-zinc-100 dark:bg-slate-800 text-black dark:text-white hover:bg-amber-200 border border-black dark:border-zinc-400 px-2.5 py-1 rounded-lg text-xs font-black transition-colors"
                      >
                        +5%
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-black dark:text-zinc-300 uppercase mb-1">
                      {t.skillExperience || '实战年限 (如 5 Yrs)'}
                    </label>
                    <input
                      type="text"
                      value={skillForm.experience || ''}
                      onChange={e => setSkillForm({ ...skillForm, experience: e.target.value })}
                      placeholder="e.g. 5 Yrs"
                      className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-black dark:text-zinc-300 uppercase mb-1 flex items-center justify-between">
                      <span>{t.skillTagline || '亮点/实战描述标语'}</span>
                      <span className="text-[10px] text-zinc-500 font-mono font-bold">({language})</span>
                    </label>
                    <input
                      type="text"
                      value={
                        typeof skillForm.tagline === 'string'
                          ? skillForm.tagline
                          : ((skillForm.tagline as Record<LanguageCode, string>)?.[language] ?? '')
                      }
                      onChange={e => {
                        const val = e.target.value;
                        const currentTaglineObj = typeof skillForm.tagline === 'object' && skillForm.tagline !== null
                          ? (skillForm.tagline as Record<LanguageCode, string>)
                          : { 'zh-CN': String(skillForm.tagline || ''), 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' };
                        setSkillForm({
                          ...skillForm,
                          tagline: {
                            ...currentTaglineObj,
                            [language]: val
                          }
                        });
                      }}
                      placeholder="e.g. 高并发组件架构 / Server Components"
                      className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                    />
                  </div>

                  {/* Anime Style Color Swatch Palette & Custom Picker */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-black text-black dark:text-zinc-300 uppercase">
                        {t.skillColor || '主题代表色 (动漫风格选色板 & #HEX代码)'}
                      </label>
                      <span
                        className="text-[11px] font-black font-mono px-2.5 py-0.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]"
                        style={{ backgroundColor: skillForm.color, color: '#000' }}
                      >
                        {skillForm.color}
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_#000] flex flex-col gap-3">
                      {/* Anime Swatches Grid */}
                      <div className="flex flex-wrap items-center gap-2">
                        {ANIME_COLOR_SWATCHES.map((swatch) => {
                          const isSelected = skillForm.color.toLowerCase() === swatch.hex.toLowerCase();
                          return (
                            <button
                              key={swatch.hex}
                              type="button"
                              onClick={() => setSkillForm({ ...skillForm, color: swatch.hex })}
                              style={{ backgroundColor: swatch.hex }}
                              className={`w-8 h-8 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all hover:scale-105 flex items-center justify-center cursor-pointer ${
                                isSelected ? 'ring-2 ring-black scale-105' : 'opacity-90'
                              }`}
                            >
                              {isSelected && <Check className="w-5 h-5 text-black stroke-[3]" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Hex Input & Native Color Trigger */}
                      <div className="flex items-center gap-2 pt-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-black text-xs text-black/60 dark:text-zinc-400">
                            HEX #
                          </span>
                          <input
                            type="text"
                            value={skillForm.color}
                            onChange={e => setSkillForm({ ...skillForm, color: e.target.value })}
                            placeholder="#38BDF8"
                            className="w-full bg-zinc-50 dark:bg-slate-800 border-2 border-black dark:border-zinc-300 pl-14 pr-3 py-1.5 rounded-xl text-xs font-black font-mono text-black dark:text-white uppercase"
                          />
                        </div>

                        <label className="bg-amber-300 text-black border-2 border-black px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-amber-400 cursor-pointer flex items-center gap-1.5 shrink-0">
                          <Palette className="w-4 h-4 stroke-[2.5]" />
                          <span>{dbt.customColorPanel}</span>
                          <input
                            type="color"
                            value={skillForm.color.startsWith('#') ? skillForm.color : '#38BDF8'}
                            onChange={e => setSkillForm({ ...skillForm, color: e.target.value })}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="bg-black text-yellow-300 dark:bg-yellow-400 dark:text-black border-2 border-black dark:border-zinc-300 px-5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:bg-zinc-800"
                  >
                    {t.save}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSkill(false);
                      setEditingSkill(null);
                    }}
                    className="bg-white text-black border-2 border-black dark:border-zinc-300 px-4 py-2.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000]"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Skills Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(data.techSkills || []).map(skill => {
          const getRankText = (lvl: number) => {
            if (lvl >= 95) return 'EX-RANK';
            if (lvl >= 90) return 'S-RANK';
            if (lvl >= 85) return 'A-RANK';
            return 'B-RANK';
          };

          const getBarHex = (c: string) => {
            if (c && c.startsWith('#')) return c;
            switch (c) {
              case 'cyan': return '#06B6D4';
              case 'amber': return '#F59E0B';
              case 'emerald': return '#10B981';
              case 'violet': return '#8B5CF6';
              case 'rose': return '#F43F5E';
              default: return '#38BDF8';
            }
          };

          return (
            <div
              key={skill.id}
              className="bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-4 rounded-2xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] flex flex-col gap-2.5 justify-between hover:bg-zinc-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-black dark:text-zinc-200">{skill.name}</span>
                  {skill.experience && (
                    <span className="text-[10px] font-black px-1.5 py-0.2 bg-zinc-100 dark:bg-slate-800 text-black dark:text-zinc-200 border border-black dark:border-zinc-500 rounded shadow-[1px_1px_0px_0px_#000]">
                      {skill.experience}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-1.5 py-0.2 bg-yellow-300 dark:bg-amber-400 border border-black dark:border-zinc-500 rounded shadow-[1px_1px_0px_0px_#000] text-black">
                    {getRankText(skill.level)}
                  </span>
                  <span className="text-xs font-black font-mono text-black dark:text-zinc-200 bg-zinc-100 dark:bg-slate-800 border border-black dark:border-zinc-500 px-1.5 py-0.2 rounded shadow-[1px_1px_0px_0px_#000]">
                    {skill.level}%
                  </span>
                </div>
              </div>

              {/* Progress Bar Preview */}
              <div className="w-full bg-zinc-100 dark:bg-slate-800 border-1.5 border-black dark:border-zinc-500 rounded-lg p-0.5 shadow-[1px_1px_0px_0px_#000] overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(Math.max(skill.level, 0), 100)}%`,
                    backgroundColor: getBarHex(skill.color)
                  }}
                  className="h-2.5 border border-black dark:border-zinc-600 rounded transition-all"
                />
              </div>

              {skill.tagline && getSkillTagline(skill.tagline, language) && (
                <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 line-clamp-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                  <span>{getSkillTagline(skill.tagline, language)}</span>
                </p>
              )}

              <div className="flex items-center justify-between pt-1 mt-1">
                <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 font-mono">
                  CAT: {skill.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEditSkill(skill)}
                    className="bg-amber-200 dark:bg-amber-600 text-black dark:text-white border border-black dark:border-zinc-500 p-1.5 rounded-lg text-xs font-black hover:bg-amber-300 dark:hover:bg-amber-500 shadow-[1px_1px_0px_0px_#000]"
                    title={t.edit}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTechSkill(skill.id)}
                    className="bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 border border-black dark:border-zinc-500 p-1.5 rounded-lg text-xs font-black hover:bg-rose-300 dark:hover:bg-rose-700 shadow-[1px_1px_0px_0px_#000]"
                    title={t.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
