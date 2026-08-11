import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, LanguageCode, TRANSLATIONS, TranslationDictionary } from '../i18n/languages';
import { motion, AnimatePresence } from 'motion/react';
import { Search, RotateCcw, Save, Globe, HelpCircle, Edit3 } from 'lucide-react';

interface KeyCategory {
  id: string;
  name: string;
  keys: (keyof TranslationDictionary)[];
}

export const LanguageManager: React.FC = () => {
  const {
    language,
    t,
    customTranslations,
    updateTranslationKey,
    resetTranslations,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedKey, setSelectedKey] = useState<keyof TranslationDictionary | null>('siteTitle');

  // Form states for the currently selected key
  const [formValues, setFormValues] = useState<Record<LanguageCode, string>>({
    'zh-CN': '',
    'zh-TW': '',
    'en': '',
    'ja': '',
    'ko': ''
  });

  // Get all keys dynamically
  const allKeys = useMemo(() => {
    return Object.keys(TRANSLATIONS['zh-CN']) as (keyof TranslationDictionary)[];
  }, []);

  // Classify keys into functional categories for better navigation
  const categories = useMemo<KeyCategory[]>(() => {
    const generalKeys: (keyof TranslationDictionary)[] = [
      'siteTitle', 'subTitle', 'adminLogin', 'adminDashboard', 'typeAdminHint',
      'languageSelect', 'close', 'save', 'cancel', 'delete', 'edit', 'add',
      'confirm', 'preview', 'resetDefault'
    ];

    const sectionKeys: (keyof TranslationDictionary)[] = [
      'profileSection', 'projectsSection', 'blogAndLinksSection', 'techStack',
      'allProjects', 'featuredProjects'
    ];

    const actionKeys: (keyof TranslationDictionary)[] = [
      'viewDemo', 'viewGithub', 'readArticle', 'contactMe', 'copyLink', 'copied'
    ];

    const adminFormKeys: (keyof TranslationDictionary)[] = [
      'adminLoginTitle', 'adminLoginSubtitle', 'passwordLabel', 'passwordPlaceholder',
      'loginButton', 'logoutButton', 'demoKeyButton', 'invalidPassword',
      'tabProfile', 'tabProjects', 'tabLinks', 'tabSystem', 'tabSkills', 'tabAnalytics', 'tabI18n', 'tabMedia',
      'nameLabel', 'aliasLabel', 'titleLabel', 'siteTitleLabel', 'avatarLabel',
      'logoUrlLabel', 'iconUrlLabel', 'speechBubbleLabel', 'bioLabel', 'locationLabel',
      'statusLabel', 'skillsLabel', 'copyrightLabel', 'copyrightSubtextLabel'
    ];

    const featureKeys: (keyof TranslationDictionary)[] = allKeys.filter(
      k => !generalKeys.includes(k) &&
           !sectionKeys.includes(k) &&
           !actionKeys.includes(k) &&
           !adminFormKeys.includes(k)
    );

    return [
      { id: 'all', name: t.langCatAll, keys: allKeys },
      { id: 'general', name: t.langCatGeneral, keys: generalKeys },
      { id: 'sections', name: t.langCatSections, keys: sectionKeys },
      { id: 'actions', name: t.langCatActions, keys: actionKeys },
      { id: 'admin', name: t.langCatAdmin, keys: adminFormKeys },
      { id: 'features', name: t.langCatFeatures, keys: featureKeys }
    ];
  }, [allKeys, t]);

  // Synchronize form values when the selected key changes
  React.useEffect(() => {
    if (selectedKey) {
      const values: Record<LanguageCode, string> = {
        'zh-CN': '',
        'zh-TW': '',
        'en': '',
        'ja': '',
        'ko': ''
      };

      LANGUAGES.forEach(lang => {
        const customVal = customTranslations[lang.code]?.[selectedKey];
        const defaultVal = TRANSLATIONS[lang.code]?.[selectedKey] || '';
        values[lang.code] = customVal !== undefined ? customVal : defaultVal;
      });

      setFormValues(values);
    }
  }, [selectedKey, customTranslations]);

  // Filter keys by selected category and search query
  const filteredKeys = useMemo(() => {
    const activeCategoryObj = categories.find(c => c.id === selectedCategory);
    const keysToFilter = activeCategoryObj ? activeCategoryObj.keys : allKeys;

    return keysToFilter.filter(key => {
      const normalizedKey = key.toLowerCase();
      const matchKey = normalizedKey.includes(searchQuery.toLowerCase());

      // Also search in any of the translations
      const matchTranslation = LANGUAGES.some(lang => {
        const customVal = customTranslations[lang.code]?.[key];
        const defaultVal = TRANSLATIONS[lang.code]?.[key] || '';
        const activeVal = customVal !== undefined ? customVal : defaultVal;
        return activeVal.toLowerCase().includes(searchQuery.toLowerCase());
      });

      return matchKey || matchTranslation;
    });
  }, [selectedCategory, searchQuery, categories, allKeys, customTranslations]);

  const handleSaveKeyTranslations = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKey) return;

    LANGUAGES.forEach(lang => {
      updateTranslationKey(selectedKey, lang.code, formValues[lang.code]);
    });

    showToast(`📝 [${selectedKey}] ${t.langToastSaved}`);
  };

  const handleResetSingleKey = () => {
    if (!selectedKey) return;

    const values: Record<LanguageCode, string> = {
      'zh-CN': '',
      'zh-TW': '',
      'en': '',
      'ja': '',
      'ko': ''
    };

    LANGUAGES.forEach(lang => {
      const defaultVal = TRANSLATIONS[lang.code]?.[selectedKey] || '';
      values[lang.code] = defaultVal;
      updateTranslationKey(selectedKey, lang.code, defaultVal);
    });

    setFormValues(values);
    showToast(`🔄 [${selectedKey}] ${t.langToastReset}`);
  };

  // Check if a specific key has any custom overridden translations
  const hasCustomOverride = (key: keyof TranslationDictionary) => {
    return LANGUAGES.some(lang => customTranslations[lang.code]?.[key] !== undefined);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Introduction Block */}
      <div className="bg-amber-50 dark:bg-slate-800 border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-black dark:text-amber-400 shrink-0" />
          <h4 className="font-black text-sm text-black dark:text-white">
            {t.langTitle}
          </h4>
        </div>

        <button
          type="button"
          onClick={resetTranslations}
          className="self-start md:self-auto bg-rose-100 hover:bg-rose-200 text-rose-800 border-2 border-black px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{t.langResetAll}</span>
        </button>
      </div>

      {/* Main Translation Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Keys Explorer (Columns 5) */}
        <div className="lg:col-span-5 flex flex-col gap-3 bg-zinc-50 dark:bg-slate-950 border-2 border-black p-3.5 rounded-xl">
          {/* Search Box */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.langSearchPlaceholder}
              className="w-full bg-white dark:bg-slate-900 border-2 border-black pl-8 pr-3 py-2 rounded-xl text-xs font-bold text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-0 transition-colors"
            />
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex flex-wrap gap-1 bg-zinc-100 dark:bg-slate-900 p-1 rounded-lg">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  // Auto-select first key of this category if keys exist
                  const filtered = cat.id === 'all'
                    ? allKeys
                    : cat.keys;
                  if (filtered.length > 0 && (!selectedKey || !filtered.includes(selectedKey))) {
                    setSelectedKey(filtered[0]);
                  }
                }}
                className={`px-2 py-1.5 rounded-md text-[10px] font-black transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-black text-yellow-300 dark:bg-amber-400 dark:text-black shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Keys Scroll Area */}
          <div className="flex flex-col gap-1 max-h-[460px] overflow-y-auto pr-1">
            {filteredKeys.length === 0 ? (
              <div className="text-center py-10 text-xs font-bold text-zinc-400">
                {t.langNoResults}
              </div>
            ) : (
              filteredKeys.map(key => {
                const overridden = hasCustomOverride(key);
                const activeVal = customTranslations[language]?.[key] !== undefined
                  ? customTranslations[language]?.[key]
                  : TRANSLATIONS[language]?.[key] || '';

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedKey(key)}
                    className={`w-full text-left p-2.5 rounded-xl border-2 transition-all flex items-center justify-between gap-2.5 ${
                      selectedKey === key
                        ? 'bg-amber-100 dark:bg-slate-800 border-black shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-white dark:bg-slate-900 border-zinc-200 dark:border-slate-800 hover:border-zinc-300 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <div className="truncate flex-grow">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-zinc-500 truncate block">
                          {key}
                        </span>
                        {overridden && (
                          <span className="bg-lime-400 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-black scale-90">
                            {t.langModified}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold truncate block mt-0.5 text-black dark:text-white">
                        {activeVal}
                      </span>
                    </div>
                    <Edit3 className={`w-3 h-3 shrink-0 ${selectedKey === key ? 'text-black dark:text-white' : 'text-zinc-400'}`} />
                  </button>
                );
              })
            )}
          </div>

          {/* Counts */}
          <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 text-right mt-1 bg-zinc-100 dark:bg-slate-900 p-1.5 px-2 rounded-lg">
            {t.langFilterResult}: {filteredKeys.length} / 共 {allKeys.length} {t.langTotalKeys}
          </div>
        </div>

        {/* Right Side: Edit Form (Columns 7) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedKey ? (
              <motion.form
                key={selectedKey}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSaveKeyTranslations}
                className="bg-zinc-50 dark:bg-slate-950 border-2 border-black p-4 rounded-xl flex flex-col gap-4"
              >
                {/* Editor Header */}
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border-2 border-black">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-extrabold text-amber-500 uppercase tracking-widest block">
                        {t.langCurrentKey}
                      </span>
                      <h4 className="font-mono text-xs md:text-sm font-black text-black dark:text-white mt-0.5 select-all">
                        {selectedKey}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetSingleKey}
                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-zinc-300 border-2 border-black px-3 py-1.5 rounded-xl text-[10px] font-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#000] transition-all shrink-0"
                    >
                      {t.langResetDefault}
                    </button>
                  </div>
                </div>

                {/* Localized inputs list - No dividers used */}
                <div className="flex flex-col gap-3.5">
                  {LANGUAGES.map(lang => {
                    const isDefault = customTranslations[lang.code]?.[selectedKey] === undefined;
                    return (
                      <div key={lang.code} className="bg-white dark:bg-slate-900 p-3 rounded-xl border-2 border-zinc-200 dark:border-slate-800 hover:border-zinc-300 transition-colors">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{lang.flag}</span>
                            <span className="text-[10px] font-black text-black dark:text-white">
                              {lang.name} ({lang.code})
                            </span>
                          </div>
                          {!isDefault && (
                            <span className="text-[8px] font-black text-lime-600 dark:text-lime-400">
                              ({t.langOverridden})
                            </span>
                          )}
                        </div>

                        <textarea
                          rows={1}
                          value={formValues[lang.code] || ''}
                          onChange={e => setFormValues({ ...formValues, [lang.code]: e.target.value })}
                          className="w-full bg-zinc-50 dark:bg-slate-950 border-2 border-black p-2 rounded-xl text-xs font-bold text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-0 resize-none overflow-hidden"
                          style={{ height: 'auto', minHeight: '38px' }}
                          onInput={e => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                          }}
                        />
                        
                        <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mt-1 flex justify-between">
                          <span>{t.langDefaultValue}: {TRANSLATIONS[lang.code]?.[selectedKey] || '无'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Form Action Controls - No divider */}
                <div className="flex items-center justify-end gap-3 mt-1.5 pt-1.5">
                  <button
                    type="submit"
                    className="bg-lime-300 hover:bg-lime-400 text-black border-2 border-black px-5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{t.langSaveChanges}</span>
                  </button>
                </div>
              </motion.form>
            ) : (
              <div className="bg-zinc-50 dark:bg-slate-950 border-2 border-dashed border-zinc-300 dark:border-slate-800 rounded-xl p-12 text-center text-zinc-400">
                <HelpCircle className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-700 mb-2" />
                <p className="text-xs font-bold">{t.langSelectKeyPrompt}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
