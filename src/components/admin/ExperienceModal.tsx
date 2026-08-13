import React from 'react';
import { X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Experience, LanguageCode } from '../../types';
import { useApp } from '../../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  experience: Experience | null;
  form: any;
  setForm: (form: any) => void;
}

export const ExperienceModal: React.FC<Props> = ({ isOpen, onClose, onSave, experience, form, setForm }) => {
  const { t, language } = useApp();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_#000] p-6 z-10"
          >
            <div className="flex items-center justify-between pb-2 mb-2">
              <h3 className="font-black text-xl text-black flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-rose-500" />
                {experience ? t.editExperienceBtn : t.addExperienceBtn}
              </h3>
              <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={onSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1 flex justify-between">
                    <span>{t.companyLabel}</span>
                    <span className="text-[10px] text-zinc-500 font-mono font-bold">({language})</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.company[language] || ''}
                    onChange={e => setForm({ ...form, company: { ...form.company, [language]: e.target.value } })}
                    className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1 flex justify-between">
                    <span>{t.roleLabel}</span>
                    <span className="text-[10px] text-zinc-500 font-mono font-bold">({language})</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.role[language] || ''}
                    onChange={e => setForm({ ...form, role: { ...form.role, [language]: e.target.value } })}
                    className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">{t.startDateLabel}</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 2022-01"
                    value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">{t.endDateLabel}</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Present"
                    value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase mb-1 flex justify-between">
                  <span>{t.descriptionLabel}</span>
                  <span className="text-[10px] text-zinc-500 font-mono font-bold">({language})</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description[language] || ''}
                  onChange={e => setForm({ ...form, description: { ...form.description, [language]: e.target.value } })}
                  className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">{t.technologiesLabel}</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Docker"
                  value={form.technologies}
                  onChange={e => setForm({ ...form, technologies: e.target.value })}
                  className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white border-2 border-black text-black px-4 py-2.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-rose-500 border-2 border-black text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-400"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
