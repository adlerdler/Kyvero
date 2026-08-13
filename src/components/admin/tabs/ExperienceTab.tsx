import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Plus, Briefcase, Edit2, Trash2 } from 'lucide-react';
import { Experience, LanguageCode } from '../../../types';
import { ExperienceModal } from '../ExperienceModal';
import { translateTextWithDeepL } from '../../../utils/deepl';

export const ExperienceTab: React.FC = () => {
  const {
    data,
    t,
    language,
    addExperience,
    updateExperience,
    deleteExperience
  } = useApp();

  const [isAddingExp, setIsAddingExp] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState<{
    company: Record<LanguageCode, string>;
    role: Record<LanguageCode, string>;
    startDate: string;
    endDate: string;
    description: Record<LanguageCode, string>;
    technologies: string;
  }>({
    company: { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' },
    role: { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' },
    startDate: '',
    endDate: '',
    description: { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' },
    technologies: ''
  });

  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const processFieldTranslations = async (fieldObj: Record<LanguageCode, string>) => {
      const sourceText = fieldObj[language] || fieldObj['zh-CN'] || Object.values(fieldObj).find(v => v && v.trim() !== '') || '';
      if (!sourceText) return fieldObj;

      try {
        const translated = await translateTextWithDeepL(sourceText);
        return {
          'zh-CN': fieldObj['zh-CN'] || translated['zh-CN'] || sourceText,
          'zh-TW': fieldObj['zh-TW'] || translated['zh-TW'] || '',
          'en': fieldObj['en'] || translated['en'] || '',
          'ja': fieldObj['ja'] || translated['ja'] || '',
          'ko': fieldObj['ko'] || translated['ko'] || '',
        };
      } catch (err) {
        console.warn('Auto translation failed:', err);
        return fieldObj;
      }
    };

    const finalCompany = await processFieldTranslations(expForm.company);
    const finalRole = await processFieldTranslations(expForm.role);
    const finalDescription = await processFieldTranslations(expForm.description);
    const techArray = expForm.technologies ? expForm.technologies.split(',').map(t => t.trim()).filter(Boolean) : [];

    if (editingExp) {
      updateExperience({
        ...editingExp,
        company: finalCompany,
        role: finalRole,
        startDate: expForm.startDate,
        endDate: expForm.endDate,
        description: finalDescription,
        technologies: techArray
      });
      setEditingExp(null);
    } else {
      addExperience({
        company: finalCompany,
        role: finalRole,
        startDate: expForm.startDate,
        endDate: expForm.endDate,
        description: finalDescription,
        technologies: techArray
      });
    }

    setIsAddingExp(false);
    setExpForm({
      company: { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' },
      role: { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' },
      startDate: '',
      endDate: '',
      description: { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' },
      technologies: ''
    });
  };

  const startEditExp = (e: Experience) => {
    setEditingExp(e);
    setIsAddingExp(true);
    setExpForm({
      company: typeof e.company === 'string' ? { 'zh-CN': e.company, 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' } : e.company,
      role: typeof e.role === 'string' ? { 'zh-CN': e.role, 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' } : e.role,
      startDate: e.startDate,
      endDate: e.endDate,
      description: typeof e.description === 'string' ? { 'zh-CN': e.description, 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' } : e.description,
      technologies: e.technologies ? e.technologies.join(', ') : ''
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-3 rounded-2xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8]">
        <h4 className="font-black text-sm text-black dark:text-zinc-200">
          {t.experienceSection} ({(data.experiences || []).length})
        </h4>
        <button
          onClick={() => {
            setIsAddingExp(true);
            setEditingExp(null);
            setExpForm({
              company: { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' },
              role: { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' },
              startDate: '',
              endDate: '',
              description: { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' },
              technologies: ''
            });
          }}
          className="bg-black dark:bg-amber-400 text-white dark:text-black px-3 py-1.5 border-2 border-black dark:border-zinc-200 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#f43f5e] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_0px_#f43f5e] transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          {t.addExperienceBtn}
        </button>
      </div>

      <ExperienceModal
        isOpen={isAddingExp}
        onClose={() => {
          setIsAddingExp(false);
          setEditingExp(null);
        }}
        onSave={handleExpSubmit}
        experience={editingExp}
        form={expForm}
        setForm={setExpForm}
      />

      <div className="grid grid-cols-1 gap-4">
        {(data.experiences || []).map(exp => {
          const companyStr = typeof exp.company === 'string' ? exp.company : exp.company[language] || exp.company['zh-CN'] || '';
          const roleStr = typeof exp.role === 'string' ? exp.role : exp.role[language] || exp.role['zh-CN'] || '';
          return (
            <div key={exp.id} className="bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-500 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] flex justify-between items-center group hover:bg-zinc-50 dark:hover:bg-slate-800">
              <div>
                <div className="font-black text-base text-black dark:text-zinc-200 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  {roleStr} <span className="text-rose-500">@</span> {companyStr}
                </div>
                <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1 font-mono">
                  {exp.startDate} - {exp.endDate}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEditExp(exp)}
                  className="bg-white dark:bg-slate-800 border-2 border-black dark:border-zinc-500 p-2 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-600 shadow-[2px_2px_0px_0px_#000] dark:text-zinc-200"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteExperience(exp.id)}
                  className="bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-200 border-2 border-black dark:border-zinc-500 p-2 rounded-xl hover:bg-rose-200 dark:hover:bg-rose-700 shadow-[2px_2px_0px_0px_#000]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
