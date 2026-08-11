import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteData, LanguageCode, Project, Profile, SocialLink, FooterLink, TechSkill, MediaItem, SystemConfig } from '../types';
import { INITIAL_SITE_DATA } from '../data/initialData';
import { DEFAULT_LANGUAGE, TRANSLATIONS, TranslationDictionary } from '../i18n/languages';

interface AppContextType {
  data: SiteData;
  language: LanguageCode;
  t: TranslationDictionary;
  theme: 'light' | 'dark';
  currentView: 'home' | 'admin';
  isAdmin: boolean;
  isAdminModalOpen: boolean;
  selectedProject: Project | null;
  activeCategory: string;
  searchQuery: string;
  toastMessage: string | null;
  
  // Actions
  setLanguage: (lang: LanguageCode) => void;
  toggleTheme: () => void;
  setCurrentView: (view: 'home' | 'admin') => void;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  setSelectedProject: (project: Project | null) => void;
  setActiveCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  showToast: (msg: string) => void;
  
  // Data Mutators
  updateProfile: (profile: Profile) => void;
  updateSystemConfig: (config: SystemConfig) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addSocialLink: (link: Omit<SocialLink, 'id'>) => void;
  updateSocialLink: (link: SocialLink) => void;
  deleteSocialLink: (id: string) => void;
  addFooterLink: (link: Omit<FooterLink, 'id'>) => void;
  updateFooterLink: (link: FooterLink) => void;
  deleteFooterLink: (id: string) => void;
  addTechSkill: (skill: Omit<TechSkill, 'id'>) => void;
  updateTechSkill: (skill: TechSkill) => void;
  deleteTechSkill: (id: string) => void;
  addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt'>) => void;
  deleteMediaItem: (id: string) => void;
  resetToDefaultData: () => void;
  customTranslations: Record<LanguageCode, Partial<TranslationDictionary>>;
  updateTranslationKey: (key: keyof TranslationDictionary, lang: LanguageCode, value: string) => void;
  resetTranslations: () => void;
  getProjectTitle: (p: Project) => string;
  getProjectSummary: (p: Project) => string;
  getProjectDescription: (p: Project) => string;
  getProjectCategory: (p: Project) => string;
  getProfileBioLines: (bio: Record<LanguageCode, string[]> | string[] | undefined, lang: LanguageCode) => string[];
  getSkillTagline: (tagline: Record<LanguageCode, string> | string | undefined, lang: LanguageCode) => string;
}

const STORAGE_KEY_DATA = 'manga_portfolio_data_v2';
const STORAGE_KEY_LANG = 'manga_portfolio_lang_v1';
const STORAGE_KEY_AUTH = 'manga_portfolio_auth_v1';
const STORAGE_KEY_THEME = 'manga_portfolio_theme_v1';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial or persisted site data
  const [data, setData] = useState<SiteData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile && Array.isArray(parsed.projects)) {
          if (!parsed.profile.avatarUrl || parsed.profile.avatarUrl.includes('data:image/svg+xml')) {
            parsed.profile.avatarUrl = INITIAL_SITE_DATA.profile.avatarUrl;
          }
          if (!parsed.footerLinks || !Array.isArray(parsed.footerLinks)) {
            parsed.footerLinks = INITIAL_SITE_DATA.footerLinks;
          }
          if (!parsed.techSkills || !Array.isArray(parsed.techSkills)) {
            parsed.techSkills = INITIAL_SITE_DATA.techSkills;
          } else {
            parsed.techSkills = parsed.techSkills.map((s: any) => {
              if (s.tagline && typeof s.tagline === 'string') {
                return {
                  ...s,
                  tagline: {
                    'zh-CN': s.tagline,
                    'zh-TW': '',
                    'en': '',
                    'ja': '',
                    'ko': ''
                  }
                };
              }
              return s;
            });
          }
          if (!parsed.mediaItems || !Array.isArray(parsed.mediaItems)) {
            parsed.mediaItems = INITIAL_SITE_DATA.mediaItems;
          }
          if (!parsed.profile.bioLines || Array.isArray(parsed.profile.bioLines)) {
            const oldArr = Array.isArray(parsed.profile.bioLines) ? parsed.profile.bioLines : null;
            parsed.profile.bioLines = {
              ...INITIAL_SITE_DATA.profile.bioLines,
              ...(oldArr ? { 'zh-CN': oldArr } : {})
            };
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved portfolio data from localStorage', e);
    }
    return INITIAL_SITE_DATA;
  });

  // Language state
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG) as LanguageCode;
      if (saved && TRANSLATIONS[saved]) {
        return saved;
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_LANGUAGE;
  });

  // Custom Translations State
  const [customTranslations, setCustomTranslations] = useState<Record<LanguageCode, Partial<TranslationDictionary>>>(() => {
    try {
      const saved = localStorage.getItem('kyvero_custom_translations_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse custom translations', e);
    }
    return {
      'zh-CN': {},
      'zh-TW': {},
      'en': {},
      'ja': {},
      'ko': {}
    };
  });

  // Theme state ('light' | 'dark')
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {
      // ignore
    }
    return 'light';
  });

  // Current View state ('home' | 'admin') initialized from pathname
  const [currentView, setCurrentViewState] = useState<'home' | 'admin'>(() => {
    return window.location.pathname.includes('admin') ? 'admin' : 'home';
  });

  const setCurrentView = (view: 'home' | 'admin') => {
    setCurrentViewState(view);
    if (view === 'admin') {
      if (!window.location.pathname.includes('admin')) {
        window.history.pushState({}, '', '/admin');
      }
    } else {
      if (window.location.pathname.includes('admin')) {
        window.history.pushState({}, '', '/');
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes('admin')) {
        setCurrentViewState('admin');
      } else {
        setCurrentViewState('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync theme to document element class and localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (e) {
      // ignore
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      showToast(nextTheme === 'dark' ? '🌙 已切换至暗黑动漫风格 / Dark Anime Mode' : '☀️ 已切换至明亮画风 / Light Manga Mode');
      return nextTheme;
    });
  };

  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync site data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
    }
  }, [data]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (e) {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  const openAdminModal = () => {
    setIsAdminModalOpen(true);
    setCurrentView('admin');
  };
  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
    setCurrentView('home');
  };

  const getI18nStr = React.useCallback((key: keyof TranslationDictionary): string => {
    const staticDict = TRANSLATIONS[language] || TRANSLATIONS['zh-CN'];
    const customDict = customTranslations[language] || {};
    return customDict[key] || staticDict[key] || TRANSLATIONS['zh-CN'][key] || '';
  }, [language, customTranslations]);

  const loginAdmin = (password: string) => {
    // Default master password or 'admin' or 'admin123'
    if (password.trim() === 'admin123' || password.trim() === 'admin' || password.trim() === 'master') {
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } catch (e) {
        // ignore
      }
      setIsAdminModalOpen(false);
      showToast(getI18nStr('toastAdminLoginSuccess'));
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (e) {
      // ignore
    }
    showToast(getI18nStr('toastAdminLogout'));
  };

  // Data mutation methods
  const updateProfile = (newProfile: Profile) => {
    setData(prev => ({
      ...prev,
      profile: newProfile
    }));
    showToast(getI18nStr('toastProfileUpdated'));
  };

  const updateSystemConfig = (newConfig: SystemConfig) => {
    setData(prev => ({
      ...prev,
      systemConfig: newConfig
    }));
    showToast(getI18nStr('toastProfileUpdated') || '系统设置已更新');
  };

  // Sync document title and favicon from systemConfig
  useEffect(() => {
    const config = data.systemConfig || INITIAL_SITE_DATA.systemConfig;
    if (config) {
      if (config.siteTitle) {
        document.title = config.siteTitle;
      }
      if (config.iconUrl) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = config.iconUrl;
      }
    }
  }, [data.systemConfig]);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProj: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      projects: [newProj, ...prev.projects]
    }));
    showToast(getI18nStr('toastProjectAdded'));
  };

  const updateProject = (updatedProject: Project) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === updatedProject.id ? updatedProject : p))
    }));
    showToast(getI18nStr('toastProjectUpdated'));
  };

  const deleteProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
    showToast(getI18nStr('toastProjectDeleted'));
  };

  const addSocialLink = (linkData: Omit<SocialLink, 'id'>) => {
    const newLink: SocialLink = {
      ...linkData,
      id: `link-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink]
    }));
    showToast(getI18nStr('toastLinkAdded'));
  };

  const updateSocialLink = (updatedLink: SocialLink) => {
    setData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(l => (l.id === updatedLink.id ? updatedLink : l))
    }));
    showToast(getI18nStr('toastLinkUpdated'));
  };

  const deleteSocialLink = (id: string) => {
    setData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(l => l.id !== id)
    }));
    showToast(getI18nStr('toastLinkDeleted'));
  };

  const addFooterLink = (linkData: Omit<FooterLink, 'id'>) => {
    const newLink: FooterLink = {
      ...linkData,
      id: `fl-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      footerLinks: [...(prev.footerLinks || []), newLink]
    }));
    showToast(getI18nStr('toastFooterLinkAdded'));
  };

  const updateFooterLink = (updatedLink: FooterLink) => {
    setData(prev => ({
      ...prev,
      footerLinks: (prev.footerLinks || []).map(l => (l.id === updatedLink.id ? updatedLink : l))
    }));
    showToast(getI18nStr('toastFooterLinkUpdated'));
  };

  const deleteFooterLink = (id: string) => {
    setData(prev => ({
      ...prev,
      footerLinks: (prev.footerLinks || []).filter(l => l.id !== id)
    }));
    showToast(getI18nStr('toastFooterLinkDeleted'));
  };

  const addTechSkill = (skillData: Omit<TechSkill, 'id'>) => {
    const newSkill: TechSkill = {
      ...skillData,
      id: `skill-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      techSkills: [...(prev.techSkills || []), newSkill]
    }));
    showToast(getI18nStr('toastSkillAdded'));
  };

  const updateTechSkill = (updatedSkill: TechSkill) => {
    setData(prev => ({
      ...prev,
      techSkills: (prev.techSkills || []).map(s => (s.id === updatedSkill.id ? updatedSkill : s))
    }));
    showToast(getI18nStr('toastSkillUpdated'));
  };

  const deleteTechSkill = (id: string) => {
    setData(prev => ({
      ...prev,
      techSkills: (prev.techSkills || []).filter(s => s.id !== id)
    }));
    showToast(getI18nStr('toastSkillDeleted'));
  };

  const addMediaItem = (itemData: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const newItem: MediaItem = {
      ...itemData,
      id: `media-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      mediaItems: [newItem, ...(prev.mediaItems || [])]
    }));
    showToast(getI18nStr('toastMediaAdded'));
  };

  const deleteMediaItem = (id: string) => {
    setData(prev => ({
      ...prev,
      mediaItems: (prev.mediaItems || []).filter(item => item.id !== id)
    }));
    showToast(getI18nStr('toastMediaDeleted'));
  };

  const resetToDefaultData = () => {
    setData(INITIAL_SITE_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY_DATA);
    } catch (e) {
      // ignore
    }
    showToast(getI18nStr('toastDataReset'));
  };

  const updateTranslationKey = (key: keyof TranslationDictionary, lang: LanguageCode, value: string) => {
    setCustomTranslations(prev => {
      const updated = {
        ...prev,
        [lang]: {
          ...prev[lang],
          [key]: value
        }
      };
      try {
        localStorage.setItem('kyvero_custom_translations_v1', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const resetTranslations = () => {
    setCustomTranslations({
      'zh-CN': {},
      'zh-TW': {},
      'en': {},
      'ja': {},
      'ko': {}
    });
    try {
      localStorage.removeItem('kyvero_custom_translations_v1');
    } catch (e) {
      console.warn(e);
    }
    showToast(getI18nStr('toastTranslationsReset'));
  };

  const t = React.useMemo(() => {
    const staticDict = TRANSLATIONS[language] || TRANSLATIONS['zh-CN'];
    const customDict = customTranslations[language] || {};
    return {
      ...staticDict,
      ...customDict
    };
  }, [language, customTranslations]);

  const getLocalizedText = React.useCallback((field: Record<LanguageCode, string> | string | undefined, lang: LanguageCode): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object' && field !== null) {
      return field[lang] || field['zh-CN'] || field['en'] || Object.values(field)[0] || '';
    }
    return '';
  }, []);

  const getProjectTitle = React.useCallback((p: Project) => getLocalizedText(p.title, language), [language, getLocalizedText]);
  const getProjectSummary = React.useCallback((p: Project) => getLocalizedText(p.summary, language), [language, getLocalizedText]);
  const getProjectDescription = React.useCallback((p: Project) => getLocalizedText(p.description, language), [language, getLocalizedText]);
  const getProjectCategory = React.useCallback((p: Project) => getLocalizedText(p.category, language), [language, getLocalizedText]);
  const getProfileBioLines = React.useCallback((bio: Record<LanguageCode, string[]> | string[] | undefined, lang: LanguageCode): string[] => {
    if (!bio) return [];
    if (typeof bio === 'object' && !Array.isArray(bio) && bio !== null) {
      const bioObj = bio as Record<LanguageCode, string[]>;
      return bioObj[lang] || bioObj['zh-CN'] || bioObj['en'] || Object.values(bioObj)[0] || [];
    }
    if (Array.isArray(bio)) {
      if (lang === 'zh-CN') return bio;
      const defaultBio = (INITIAL_SITE_DATA.profile.bioLines as Record<LanguageCode, string[]>)[lang];
      if (defaultBio && Array.isArray(defaultBio)) return defaultBio;
      return bio;
    }
    return [];
  }, []);

  const getSkillTagline = React.useCallback((tagline: Record<LanguageCode, string> | string | undefined, lang: LanguageCode): string => {
    if (!tagline) return '';
    if (typeof tagline === 'string') return tagline;
    
    const zhCN = tagline['zh-CN'] || Object.values(tagline)[0] || '';
    const val = tagline[lang];
    
    // If the value exists, is not empty, and is either not identical to zhCN OR we are actually requesting zh-CN, use it.
    if (val && val.trim() !== '' && (lang === 'zh-CN' || val !== zhCN)) {
      return val;
    }

    if (!zhCN) return '';

    switch (lang) {
      case 'zh-TW':
        return zhCN.replace(/架构/g, '架構').replace(/高并发/g, '高併發').replace(/性能/g, '效能').replace(/优化/g, '優化').replace(/向量/g, '向量').replace(/组件/g, '組件');
      case 'en':
        if (zhCN.includes('组件') || zhCN.includes('架构')) return 'Component Architecture / High Performance / Scalable Design';
        if (zhCN.includes('AI') || zhCN.includes('模型') || zhCN.includes('多模态') || zhCN.includes('智能体')) return 'AI Integration / Multimodal Inference / Smart Agents';
        if (zhCN.includes('后端') || zhCN.includes('Server')) return 'Backend Systems / API Design / High Availability';
        return 'Advanced Engineering / High Performance / Production Ready';
      case 'ja':
        if (zhCN.includes('组件') || zhCN.includes('架构')) return 'コンポーネントアーキテクチャ / 高性能 / スケーラブル設計';
        if (zhCN.includes('AI') || zhCN.includes('模型') || zhCN.includes('多模态') || zhCN.includes('智能体')) return 'AI統合 / マルチモーダル推論 / スマートエージェント';
        return '高度なエンジニアリング / 高性能 / 本番環境対応';
      case 'ko':
        if (zhCN.includes('组件') || zhCN.includes('架构')) return '컴포넌트 아키텍처 / 고성능 / 확장 가능한 설계';
        if (zhCN.includes('AI') || zhCN.includes('模型') || zhCN.includes('多模态') || zhCN.includes('智能体')) return 'AI 통합 / 멀티모달 추론 / 스마트 에이전트';
        return '고급 엔지니어링 / 고성능 / 프로덕션 준비 완료';
      default:
        return zhCN;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        data,
        language,
        t,
        theme,
        currentView,
        isAdmin,
        isAdminModalOpen,
        selectedProject,
        activeCategory,
        searchQuery,
        toastMessage,
        setLanguage,
        toggleTheme,
        setCurrentView,
        openAdminModal,
        closeAdminModal,
        loginAdmin,
        logoutAdmin,
        setSelectedProject,
        setActiveCategory,
        setSearchQuery,
        showToast,
        updateProfile,
        updateSystemConfig,
        addProject,
        updateProject,
        deleteProject,
        addSocialLink,
        updateSocialLink,
        deleteSocialLink,
        addFooterLink,
        updateFooterLink,
        deleteFooterLink,
        addTechSkill,
        updateTechSkill,
        deleteTechSkill,
        addMediaItem,
        deleteMediaItem,
        resetToDefaultData,
        customTranslations,
        updateTranslationKey,
        resetTranslations,
        getProjectTitle,
        getProjectSummary,
        getProjectDescription,
        getProjectCategory,
        getProfileBioLines,
        getSkillTagline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
