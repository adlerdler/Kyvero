import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { motion } from 'motion/react';
import { ImageIcon, Save } from 'lucide-react';
import { LanguageCode, Profile } from '../../../types';
import { MediaLibrarySelector } from '../MediaLibrarySelector';

export const ProfileTab: React.FC = () => {
  const { data, t, language, updateProfile } = useApp();
  const dbt = t;

  const [profileForm, setProfileForm] = useState<Profile>(data.profile);
  const [showMediaSelector, setShowMediaSelector] = useState(false);

  useEffect(() => {
    setProfileForm(data.profile);
  }, [data.profile]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  return (
    <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1">
            {t.nameLabel}
          </label>
          <input
            type="text"
            value={profileForm.name}
            onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
            className="w-full bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000] focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1">
            {t.aliasLabel}
          </label>
          <input
            type="text"
            value={profileForm.alias}
            onChange={e => setProfileForm({ ...profileForm, alias: e.target.value })}
            className="w-full bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000] focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1 flex items-center justify-between">
            <span>{t.titleLabel}</span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono font-bold">({language})</span>
          </label>
          <input
            type="text"
            value={
              typeof profileForm.title === 'string'
                ? profileForm.title
                : ((profileForm.title as Record<LanguageCode, string>)?.[language] ?? '')
            }
            onChange={e => {
              const currentObj = typeof profileForm.title === 'object' && profileForm.title !== null
                ? (profileForm.title as Record<LanguageCode, string>)
                : { 'zh-CN': String(profileForm.title || '') };
              setProfileForm({ ...profileForm, title: { ...currentObj, [language]: e.target.value } });
            }}
            className="w-full bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000] focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1 flex items-center justify-between">
            <span>Subtitle</span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono font-bold">({language})</span>
          </label>
          <input
            type="text"
            value={
              typeof profileForm.subtitle === 'string'
                ? profileForm.subtitle
                : ((profileForm.subtitle as Record<LanguageCode, string>)?.[language] ?? '')
            }
            onChange={e => {
              const currentObj = typeof profileForm.subtitle === 'object' && profileForm.subtitle !== null
                ? (profileForm.subtitle as Record<LanguageCode, string>)
                : { 'zh-CN': String(profileForm.subtitle || '') };
              setProfileForm({ ...profileForm, subtitle: { ...currentObj, [language]: e.target.value } });
            }}
            className="w-full bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000] focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1 flex items-center justify-between">
            <span>Speech Bubble Text</span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono font-bold">({language})</span>
          </label>
          <input
            type="text"
            value={
              typeof profileForm.speechBubbleText === 'string'
                ? profileForm.speechBubbleText
                : ((profileForm.speechBubbleText as Record<LanguageCode, string>)?.[language] ?? '')
            }
            onChange={e => {
              const currentObj = typeof profileForm.speechBubbleText === 'object' && profileForm.speechBubbleText !== null
                ? (profileForm.speechBubbleText as Record<LanguageCode, string>)
                : { 'zh-CN': String(profileForm.speechBubbleText || '') };
              setProfileForm({ ...profileForm, speechBubbleText: { ...currentObj, [language]: e.target.value } });
            }}
            className="w-full bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000] focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1 flex items-center justify-between">
            <span>{t.locationLabel}</span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono font-bold">({language})</span>
          </label>
          <input
            type="text"
            value={
              typeof profileForm.location === 'string'
                ? profileForm.location
                : ((profileForm.location as Record<LanguageCode, string>)?.[language] ?? '')
            }
            onChange={e => {
              const currentObj = typeof profileForm.location === 'object' && profileForm.location !== null
                ? (profileForm.location as Record<LanguageCode, string>)
                : { 'zh-CN': String(profileForm.location || '') };
              setProfileForm({ ...profileForm, location: { ...currentObj, [language]: e.target.value } });
            }}
            className="w-full bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000] focus:bg-white dark:focus:bg-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1">
          {t.avatarLabel}
        </label>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={profileForm.avatarUrl}
              onChange={e => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
              className="flex-1 bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000]"
              placeholder={dbt.avatarInputPlaceholder}
            />
            <button
              type="button"
              onClick={() => setShowMediaSelector(true)}
              className="bg-cyan-200 text-black border-2 border-black px-3.5 py-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{dbt.avatarSelectFromMedia}</span>
            </button>
          </div>
          
          <MediaLibrarySelector
            isOpen={showMediaSelector}
            onClose={() => setShowMediaSelector(false)}
            onSelect={(url) => setProfileForm({ ...profileForm, avatarUrl: url })}
            title={dbt.avatarSelectTitle}
            subtitle={dbt.avatarSelectSubtitle}
            presets={[]}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1">
          {t.statusLabel}
        </label>
        <input
          type="text"
          value={profileForm.statusText}
          onChange={e => setProfileForm({ ...profileForm, statusText: e.target.value })}
          className="w-full bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000]"
        />
      </div>

      <div>
        <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1">
          {t.skillsLabel}
        </label>
        <input
          type="text"
          value={profileForm.skills.join(', ')}
          onChange={e =>
            setProfileForm({
              ...profileForm,
              skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })
          }
          className="w-full bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000]"
        />
      </div>

      <div>
        <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1 flex items-center justify-between">
          <span>{t.bioLabel}</span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono font-bold">({language})</span>
        </label>
        <textarea
          rows={3}
          value={
            Array.isArray(profileForm.bioLines)
              ? profileForm.bioLines.join('\n')
              : ((profileForm.bioLines as Record<LanguageCode, string[]>)[language] || (profileForm.bioLines as Record<LanguageCode, string[]>)['zh-CN'] || []).join('\n')
          }
          onChange={e => {
            const newLines = e.target.value.split('\n').filter(Boolean);
            const updatedBio = Array.isArray(profileForm.bioLines)
              ? newLines
              : {
                  ...(profileForm.bioLines as Record<LanguageCode, string[]>),
                  [language]: newLines
                };
            setProfileForm({
              ...profileForm,
              bioLines: updatedBio
            });
          }}
          className="w-full bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000]"
        />
      </div>

      <div>
        <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1">
          Blog URL
        </label>
        <input
          type="text"
          value={profileForm.blogUrl}
          onChange={e => setProfileForm({ ...profileForm, blogUrl: e.target.value })}
          className="w-full bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000]"
        />
      </div>

      <div>
        <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1">
          GitHub URL
        </label>
        <input
          type="text"
          value={profileForm.githubUrl}
          onChange={e => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
          className="w-full bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000]"
        />
      </div>

      <button
        type="submit"
        className="self-start bg-black text-yellow-300 border-2 border-black px-6 py-3 rounded-xl text-xs font-black shadow-[4px_4px_0px_0px_#FFE4E6] hover:bg-zinc-800 transition-all flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        <span>{t.save}</span>
      </button>
    </form>
  );
};
