import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { motion } from 'motion/react';
import { ImageIcon, Save, Loader2 } from 'lucide-react';
import { LanguageCode, Profile } from '../../../types';
import { MediaLibrarySelector } from '../MediaLibrarySelector';
import { translateTextWithDeepL } from '../../../utils/deepl';

export const ProfileTab: React.FC = () => {
  const { data, t, language, updateProfile } = useApp();
  const dbt = t;

  const [profileForm, setProfileForm] = useState<Profile>(data.profile);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setProfileForm(data.profile);
  }, [data.profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const processFieldTranslations = async (currentVal: string, originalObj: any, currentObj: any) => {
        const sourceText = currentVal?.trim() || '';
        if (!sourceText) return { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' };

        const originalMap: Record<string, string> =
          typeof originalObj === 'object' && originalObj !== null ? originalObj : {};
        const currentMap: Record<string, string> =
          typeof currentObj === 'object' && currentObj !== null ? currentObj : {};

        const targetLangs: LanguageCode[] = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko'];

        // Compare current input against original DB value before form edits
        const savedSourceText = (originalMap[language] || '').trim();
        const isUnchanged = savedSourceText === sourceText;
        const hasAllLangs = targetLangs.every(lang => originalMap[lang] && originalMap[lang].trim() !== '');

        if (isUnchanged && hasAllLangs) {
          return { ...originalMap, ...currentMap };
        }

        try {
          const translated = await translateTextWithDeepL(currentVal, language);
          const result: Record<string, string> = {
            ...currentMap,
            [language]: currentVal,
          };

          for (const lang of targetLangs) {
            if (lang === language) {
              result[lang] = currentVal;
            } else if (translated[lang]) {
              result[lang] = translated[lang];
            } else if (currentMap[lang]) {
              result[lang] = currentMap[lang];
            }
          }
          return result;
        } catch (err) {
          console.warn('Auto translation failed:', err);
          return {
            ...currentMap,
            [language]: currentVal
          };
        }
      };

      const processBioTranslations = async (currentLines: string[], originalBio: any, currentBio: any) => {
        const sourceText = currentLines.join('\n').trim();
        const originalMap: Record<string, string[]> =
          typeof originalBio === 'object' && !Array.isArray(originalBio) && originalBio !== null ? originalBio : {};
        const currentMap: Record<string, string[]> =
          typeof currentBio === 'object' && !Array.isArray(currentBio) && currentBio !== null ? currentBio : {};

        if (!sourceText) return { 'zh-CN': [], 'zh-TW': [], 'en': [], 'ja': [], 'ko': [] };

        const targetLangs: LanguageCode[] = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko'];

        // Compare current bio against original DB bio before form edits
        const savedLines = originalMap[language] || [];
        const savedText = savedLines.join('\n').trim();
        const isUnchanged = savedText === sourceText;
        const hasAllLangs = targetLangs.every(lang => originalMap[lang] && originalMap[lang].length > 0);

        if (isUnchanged && hasAllLangs) {
          return { ...originalMap, ...currentMap };
        }

        try {
          const translated = await translateTextWithDeepL(sourceText, language);
          const splitLines = (text: string) => text ? text.split('\n').filter(Boolean) : [];

          const result: Record<string, string[]> = {
            ...currentMap,
            [language]: currentLines,
          };

          for (const lang of targetLangs) {
            if (lang === language) {
              result[lang] = currentLines;
            } else if (translated[lang]) {
              result[lang] = splitLines(translated[lang]);
            } else if (currentMap[lang]) {
              result[lang] = currentMap[lang];
            }
          }
          return result;
        } catch (err) {
          console.warn('Auto translation failed for bio:', err);
          return {
            ...currentMap,
            [language]: currentLines
          };
        }
      };

      const parseFieldToObj = (field: any): Record<string, any> => {
        if (typeof field === 'string') {
          const trimmed = field.trim();
          if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
            try {
              return JSON.parse(trimmed);
            } catch {
              return { 'zh-CN': field };
            }
          }
          return { 'zh-CN': field };
        }
        if (typeof field === 'object' && field !== null) {
          return field;
        }
        return {};
      };

      const currentTitle = typeof profileForm.title === 'string' ? profileForm.title : (profileForm.title as Record<LanguageCode, string>)[language] || '';
      const currentSubtitle = typeof profileForm.subtitle === 'string' ? profileForm.subtitle : (profileForm.subtitle as Record<LanguageCode, string>)[language] || '';
      const currentSpeech = typeof profileForm.speechBubbleText === 'string' ? profileForm.speechBubbleText : (profileForm.speechBubbleText as Record<LanguageCode, string>)[language] || '';
      const currentLocation = typeof profileForm.location === 'string' ? profileForm.location : (profileForm.location as Record<LanguageCode, string>)[language] || '';
      const statusObj = parseFieldToObj(profileForm.statusText);
      const currentStatus = statusObj[language] || statusObj['zh-CN'] || '';
      const currentBioLines = Array.isArray(profileForm.bioLines) ? profileForm.bioLines : (profileForm.bioLines as Record<LanguageCode, string[]>)[language] || [];

      const finalTitle = await processFieldTranslations(currentTitle, data.profile.title, profileForm.title);
      const finalSubtitle = await processFieldTranslations(currentSubtitle, data.profile.subtitle, profileForm.subtitle);
      const finalSpeech = await processFieldTranslations(currentSpeech, data.profile.speechBubbleText, profileForm.speechBubbleText);
      const finalLocation = await processFieldTranslations(currentLocation, data.profile.location, profileForm.location);
      const finalStatus = await processFieldTranslations(currentStatus, data.profile.statusText, statusObj);
      const finalBio = await processBioTranslations(currentBioLines, data.profile.bioLines, profileForm.bioLines);

      await updateProfile({
        ...profileForm,
        title: finalTitle,
        subtitle: finalSubtitle,
        speechBubbleText: finalSpeech,
        location: finalLocation,
        statusText: finalStatus,
        bioLines: finalBio
      });
    } finally {
      setIsSaving(false);
    }
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
        <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1 flex items-center justify-between">
          <span>{t.statusLabel}</span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono font-bold">({language})</span>
        </label>
        <input
          type="text"
          value={(() => {
            if (typeof profileForm.statusText === 'string') {
              const trimmed = profileForm.statusText.trim();
              if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
                try {
                  const parsed = JSON.parse(trimmed);
                  return parsed[language] || parsed['zh-CN'] || '';
                } catch {
                  return profileForm.statusText;
                }
              }
              return profileForm.statusText;
            }
            if (typeof profileForm.statusText === 'object' && profileForm.statusText !== null) {
              const obj = profileForm.statusText as Record<LanguageCode, string>;
              return obj[language] || obj['zh-CN'] || '';
            }
            return '';
          })()}
          onChange={e => {
            let currentObj: Record<LanguageCode, string> = { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' };
            if (typeof profileForm.statusText === 'object' && profileForm.statusText !== null) {
              currentObj = { ...currentObj, ...(profileForm.statusText as Record<LanguageCode, string>) };
            }
            if (typeof profileForm.statusText === 'string') {
              const trimmed = profileForm.statusText.trim();
              if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
                try {
                  currentObj = { ...currentObj, ...JSON.parse(trimmed) };
                } catch {
                  currentObj['zh-CN'] = profileForm.statusText;
                }
              } else {
                currentObj['zh-CN'] = profileForm.statusText;
              }
            }
            setProfileForm({ ...profileForm, statusText: { ...currentObj, [language]: e.target.value } });
          }}
          className="w-full bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000] focus:bg-white dark:focus:bg-slate-800"
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
        disabled={isSaving}
        className="self-start bg-black text-yellow-300 border-2 border-black px-6 py-3 rounded-xl text-xs font-black shadow-[4px_4px_0px_0px_#FFE4E6] hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center gap-2"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        <span>{isSaving ? `${t.save}...` : t.save}</span>
      </button>
    </form>
  );
};
