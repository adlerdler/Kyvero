import { LanguageCode, TRANSLATIONS, DEFAULT_LANGUAGE, TranslationDictionary } from '../i18n/languages';

export function getCurrentLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem('manga_portfolio_lang_v1');
    if (saved && ['zh-CN', 'zh-TW', 'en', 'ja', 'ko'].includes(saved)) {
      return saved as LanguageCode;
    }
  } catch (e) {
    // ignore
  }
  return DEFAULT_LANGUAGE;
}

export function t(key: keyof TranslationDictionary): string {
  const lang = getCurrentLanguage();
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS[DEFAULT_LANGUAGE][key] || key;
}
