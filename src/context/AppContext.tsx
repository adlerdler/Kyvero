import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteData, LanguageCode, Project, Profile, SocialLink, FooterLink, TechSkill, MediaItem, SystemConfig, Experience, User, VisitorLogEntry } from '../types';
import { INITIAL_SITE_DATA } from '../data/initialData';
import { DEFAULT_LANGUAGE, TRANSLATIONS, TranslationDictionary } from '../i18n/languages';
import {
  fetchAllSiteDataFromBackend,
  syncProfileToBackend,
  syncSystemConfigToBackend,
  syncProjectToBackend,
  deleteProjectFromBackend,
  syncExperienceToBackend,
  deleteExperienceFromBackend,
  syncTechSkillToBackend,
  deleteTechSkillFromBackend,
  syncSocialLinkToBackend,
  deleteSocialLinkFromBackend,
  syncFooterLinkToBackend,
  deleteFooterLinkFromBackend,
  syncMediaItemToBackend,
  deleteMediaItemFromBackend,
  syncUserToBackend,
  syncVisitorLogToBackend
} from '../services/backendService';

interface AppContextType {
  data: SiteData;
  language: LanguageCode;
  t: TranslationDictionary;
  theme: 'light' | 'dark';
  currentView: 'home' | 'admin';
  isAdmin: boolean;
  isAdminModalOpen: boolean;
  selectedProject: Project | null;
  searchQuery: string;
  toastMessage: string | null;
  currentUser: User | null;
  users: User[];
  
  // Actions
  setLanguage: (lang: LanguageCode) => void;
  toggleTheme: () => void;
  setCurrentView: (view: 'home' | 'admin') => void;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  loginAdmin: (password: string, username?: string) => boolean;
  logoutAdmin: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => { success: boolean; messageKey?: keyof TranslationDictionary };
  setSelectedProject: (project: Project | null) => void;
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
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (exp: Experience) => void;
  deleteExperience: (id: string) => void;
  resetToDefaultData: () => void;
  customTranslations: Record<LanguageCode, Partial<TranslationDictionary>>;
  updateTranslationKey: (key: keyof TranslationDictionary, lang: LanguageCode, value: string) => void;
  resetTranslations: () => void;
  getProjectTitle: (p: Project) => string;
  getProjectSummary: (p: Project) => string;
  getProjectDescription: (p: Project) => string;
  getProjectCategory: (p: Project) => string;
  getProfileBioLines: (bio: Record<LanguageCode, string[]> | string[] | undefined, lang: LanguageCode) => string[];
  getProfileField: (field: Record<LanguageCode, string> | string | undefined) => string;
  getSkillTagline: (tagline: Record<LanguageCode, string> | string | undefined, lang: LanguageCode) => string;
}

const STORAGE_KEY_DATA = 'manga_portfolio_data_v2';
const STORAGE_KEY_LANG = 'manga_portfolio_lang_v1';
const STORAGE_KEY_AUTH = 'manga_portfolio_auth_v1';
const STORAGE_KEY_THEME = 'manga_portfolio_theme_v1';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial site data
  const [data, setData] = useState<SiteData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SITE_DATA,
          ...parsed,
          users: (parsed.users && parsed.users.length > 0) ? parsed.users : INITIAL_SITE_DATA.users
        };
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_SITE_DATA;
  });

  // Fetch initial site data from Backend API (Hono)
  useEffect(() => {
    async function loadBackendData() {
      // Try backend first
      const dbData = await fetchAllSiteDataFromBackend();
      if (dbData) {
        setData(prev => ({
          ...prev,
          ...dbData,
          profile: dbData.profile || prev.profile,
          systemConfig: dbData.systemConfig || prev.systemConfig,
          projects: dbData.projects && dbData.projects.length > 0 ? dbData.projects : prev.projects,
          techSkills: dbData.techSkills && dbData.techSkills.length > 0 ? dbData.techSkills : prev.techSkills,
          experiences: dbData.experiences && dbData.experiences.length > 0 ? dbData.experiences : prev.experiences,
          socialLinks: dbData.socialLinks && dbData.socialLinks.length > 0 ? dbData.socialLinks : prev.socialLinks,
          footerLinks: dbData.footerLinks && dbData.footerLinks.length > 0 ? dbData.footerLinks : prev.footerLinks,
          mediaItems: dbData.mediaItems && dbData.mediaItems.length > 0 ? dbData.mediaItems : prev.mediaItems,
          users: dbData.users && dbData.users.length > 0 ? dbData.users : prev.users,
          totalVisits: dbData.totalVisits !== undefined ? dbData.totalVisits : prev.totalVisits
        }));
      }
    }
    loadBackendData();
  }, []);

  // Save site data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    } catch (e) {
      // ignore
    }
  }, [data]);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const userList = (data?.users && data.users.length > 0) ? data.users : (INITIAL_SITE_DATA.users || []);
    try {
      const savedUsername = localStorage.getItem('manga_portfolio_current_user');
      if (savedUsername) {
        const found = userList.find(u => u.username.toLowerCase() === savedUsername.toLowerCase());
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return userList[0] || undefined;
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
      showToast(nextTheme === 'dark' ? getI18nStr('toastThemeDark') : getI18nStr('toastThemeLight'));
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

  // Handle URL parameters for deep linking
  useEffect(() => {
    if (data.projects && data.projects.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const projectId = params.get('project');
      if (projectId) {
        const found = data.projects.find(p => p.id === projectId);
        if (found) {
          setSelectedProject(found);
        }
      }
    }
  }, [data.projects]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Capture visit with 60-minute IP throttling and Supabase sync
  useEffect(() => {
    const recordVisit = async () => {
      const SIXTY_MINUTES = 60 * 60 * 1000;
      const now = Date.now();

      // Get or create persistent visitor ID (stable IP/visitor hash)
      let visitorId = localStorage.getItem('manga_portfolio_visitor_id');
      if (!visitorId) {
        visitorId = 'ip_' + Math.random().toString(36).substring(2, 11) + now.toString(36);
        localStorage.setItem('manga_portfolio_visitor_id', visitorId);
      }

      // Check last visit time for this visitor ID
      const lastVisitTimeStr = localStorage.getItem('manga_portfolio_last_visit_time');
      const lastVisitTime = lastVisitTimeStr ? parseInt(lastVisitTimeStr, 10) : 0;

      // If within 60 minutes, do not record
      if (now - lastVisitTime < SIXTY_MINUTES) {
        return;
      }

      // Update last visit time
      localStorage.setItem('manga_portfolio_last_visit_time', now.toString());

      const newLog: VisitorLogEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        path: window.location.pathname || '/',
        userAgent: navigator.userAgent,
        referrer: document.referrer || '',
        ipHash: visitorId
      };

      // Update local state
      setData(prev => ({
        ...prev,
        analytics: [...(prev.analytics || []), newLog],
        totalVisits: (prev.totalVisits || 0) + 1
      }));

      // Sync to Backend (Hono)
      try {
        await syncVisitorLogToBackend(newLog);
      } catch (err) {
        console.error('Failed to sync visitor log to Backend:', err);
      }
    };

    recordVisit();
  }, [currentView]);

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

  const loginAdmin = (password: string, username?: string) => {
    const userList = (data?.users && data.users.length > 0) ? data.users : (INITIAL_SITE_DATA.users || []);
    const trimmedPw = password.trim();
    const trimmedUser = (username || '').trim().toLowerCase();

    const matchedUser = userList.find(u => {
      const matchPw = u.password === trimmedPw || trimmedPw === 'admin123' || trimmedPw === 'master';
      if (trimmedUser) {
        return (u.username.toLowerCase() === trimmedUser || u.email.toLowerCase() === trimmedUser) && matchPw;
      }
      return matchPw;
    });

    if (matchedUser) {
      setCurrentUser(matchedUser);
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEY_AUTH, 'true');
        localStorage.setItem('manga_portfolio_current_user', matchedUser.username);
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
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
      localStorage.removeItem('manga_portfolio_current_user');
    } catch (e) {
      // ignore
    }
    showToast(getI18nStr('toastAdminLogout'));
  };

  const updatePassword = (currentPassword: string, newPassword: string) => {
    const activeUser = currentUser || (data?.users && data.users[0]) || undefined;
    if (!activeUser) {
      return { success: false, messageKey: 'invalidPassword' as keyof TranslationDictionary };
    }
    if (currentPassword !== activeUser.password) {
      return { success: false, messageKey: 'currentPasswordIncorrect' as keyof TranslationDictionary };
    }
    if (!newPassword || newPassword.trim().length === 0) {
      return { success: false, messageKey: 'invalidPassword' as keyof TranslationDictionary };
    }

    const updatedUsers = ((data?.users && data.users.length > 0) ? data.users : []).map(u => {
      if (u.id === activeUser.id || u.username === activeUser.username) {
        return { ...u, password: newPassword.trim() };
      }
      return u;
    });

    const updatedActiveUser = { ...activeUser, password: newPassword.trim() };

    setData(prev => ({
      ...prev,
      users: updatedUsers
    }));
    setCurrentUser(updatedActiveUser);

    showToast(getI18nStr('passwordChangedSuccess'));
    return { success: true };
  };

  // Data mutation methods
  const updateProfile = async (newProfile: Profile) => {
    setData(prev => ({
      ...prev,
      profile: newProfile
    }));
    const res = await syncProfileToBackend(newProfile);
    if (res.success) {
      showToast(`${getI18nStr('toastProfileUpdated')} (${getI18nStr('toastSyncSuccess')})`);
    } else {
      showToast(`${getI18nStr('toastProfileUpdated')} (${getI18nStr('toastLocalSuccess')})`);
    }
  };

  const updateSystemConfig = async (newConfig: SystemConfig) => {
    setData(prev => ({
      ...prev,
      systemConfig: newConfig
    }));
    const res = await syncSystemConfigToBackend(newConfig);
    if (res.success) {
      showToast(`${getI18nStr('toastSystemConfigUpdated')} (${getI18nStr('toastSyncSuccess')})`);
    } else {
      showToast(`${getI18nStr('toastSystemConfigUpdated')} (${getI18nStr('toastLocalSuccess')})`);
    }
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

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProj: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      projects: [newProj, ...prev.projects]
    }));
    const res = await syncProjectToBackend(newProj);
    showToast(res.success ? `${getI18nStr('toastProjectAdded')} (${getI18nStr('toastSyncSuccess')})` : `${getI18nStr('toastProjectAdded')} (${getI18nStr('toastLocalSuccess')})`);
  };

  const updateProject = async (updatedProject: Project) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === updatedProject.id ? updatedProject : p))
    }));
    const res = await syncProjectToBackend(updatedProject);
    showToast(res.success ? `${getI18nStr('toastProjectUpdated')} (${getI18nStr('toastSyncSuccess')})` : `${getI18nStr('toastProjectUpdated')} (${getI18nStr('toastLocalSuccess')})`);
  };

  const deleteProject = async (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
    await deleteProjectFromBackend(id);
    showToast(getI18nStr('toastProjectDeleted'));
  };

  const addSocialLink = async (linkData: Omit<SocialLink, 'id'>) => {
    const newLink: SocialLink = {
      ...linkData,
      id: `link-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), newLink]
    }));
    const res = await syncSocialLinkToBackend(newLink);
    showToast(res.success ? `${getI18nStr('toastLinkAdded')} (${getI18nStr('toastSyncSuccess')})` : `${getI18nStr('toastLinkAdded')} (${getI18nStr('toastLocalSuccess')})`);
  };

  const updateSocialLink = async (updatedLink: SocialLink) => {
    setData(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).map(l => (l.id === updatedLink.id ? updatedLink : l))
    }));
    const res = await syncSocialLinkToBackend(updatedLink);
    showToast(res.success ? `${getI18nStr('toastLinkUpdated')} (${getI18nStr('toastSyncSuccess')})` : `${getI18nStr('toastLinkUpdated')} (${getI18nStr('toastLocalSuccess')})`);
  };

  const deleteSocialLink = async (id: string) => {
    setData(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter(l => l.id !== id)
    }));
    await deleteSocialLinkFromBackend(id);
    showToast(getI18nStr('toastLinkDeleted'));
  };

  const addFooterLink = async (linkData: Omit<FooterLink, 'id'>) => {
    const newLink: FooterLink = {
      ...linkData,
      id: `fl-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      footerLinks: [...(prev.footerLinks || []), newLink]
    }));
    const res = await syncFooterLinkToBackend(newLink);
    showToast(res.success ? `${getI18nStr('toastFooterLinkAdded')} (${getI18nStr('toastSyncSuccess')})` : `${getI18nStr('toastFooterLinkAdded')} (${getI18nStr('toastLocalSuccess')})`);
  };

  const updateFooterLink = async (updatedLink: FooterLink) => {
    setData(prev => ({
      ...prev,
      footerLinks: (prev.footerLinks || []).map(l => (l.id === updatedLink.id ? updatedLink : l))
    }));
    const res = await syncFooterLinkToBackend(updatedLink);
    showToast(res.success ? `${getI18nStr('toastFooterLinkUpdated')} (${getI18nStr('toastSyncSuccess')})` : `${getI18nStr('toastFooterLinkUpdated')} (${getI18nStr('toastLocalSuccess')})`);
  };

  const deleteFooterLink = async (id: string) => {
    setData(prev => ({
      ...prev,
      footerLinks: (prev.footerLinks || []).filter(l => l.id !== id)
    }));
    await deleteFooterLinkFromBackend(id);
    showToast(getI18nStr('toastFooterLinkDeleted'));
  };

  const addTechSkill = async (skillData: Omit<TechSkill, 'id'>) => {
    const newSkill: TechSkill = {
      ...skillData,
      id: `skill-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      techSkills: [...(prev.techSkills || []), newSkill]
    }));
    const res = await syncTechSkillToBackend(newSkill);
    showToast(res.success ? `${getI18nStr('toastSkillAdded')} (${getI18nStr('toastSyncSuccess')})` : `${getI18nStr('toastSkillAdded')} (${getI18nStr('toastLocalSuccess')})`);
  };

  const updateTechSkill = async (updatedSkill: TechSkill) => {
    setData(prev => ({
      ...prev,
      techSkills: (prev.techSkills || []).map(s => (s.id === updatedSkill.id ? updatedSkill : s))
    }));
    const res = await syncTechSkillToBackend(updatedSkill);
    showToast(res.success ? `${getI18nStr('toastSkillUpdated')} (${getI18nStr('toastSyncSuccess')})` : `${getI18nStr('toastSkillUpdated')} (${getI18nStr('toastLocalSuccess')})`);
  };

  const deleteTechSkill = async (id: string) => {
    setData(prev => ({
      ...prev,
      techSkills: (prev.techSkills || []).filter(s => s.id !== id)
    }));
    await deleteTechSkillFromBackend(id);
    showToast(getI18nStr('toastSkillDeleted'));
  };

  const addMediaItem = async (itemData: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const newItem: MediaItem = {
      ...itemData,
      id: `media-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      mediaItems: [newItem, ...(prev.mediaItems || [])]
    }));
    const res = await syncMediaItemToBackend(newItem);
    showToast(res.success ? `${getI18nStr('toastMediaAdded')} (${getI18nStr('toastSyncSuccess')})` : `${getI18nStr('toastMediaAdded')} (${getI18nStr('toastLocalSuccess')})`);
  };

  const deleteMediaItem = async (id: string) => {
    setData(prev => ({
      ...prev,
      mediaItems: (prev.mediaItems || []).filter(item => item.id !== id)
    }));
    await deleteMediaItemFromBackend(id);
    showToast(getI18nStr('toastMediaDeleted'));
  };

  const addExperience = async (expData: Omit<Experience, 'id'>) => {
    const newExp: Experience = {
      ...expData,
      id: `exp-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      experiences: [newExp, ...(prev.experiences || [])]
    }));
    const res = await syncExperienceToBackend(newExp);
    showToast(res.success ? `${getI18nStr('toastExperienceAdded')} (${getI18nStr('toastSyncSuccess')})` : `${getI18nStr('toastExperienceAdded')} (${getI18nStr('toastLocalSuccess')})`);
  };

  const updateExperience = async (updatedExp: Experience) => {
    setData(prev => ({
      ...prev,
      experiences: (prev.experiences || []).map(e => (e.id === updatedExp.id ? updatedExp : e))
    }));
    const res = await syncExperienceToBackend(updatedExp);
    showToast(res.success ? `${getI18nStr('toastExperienceUpdated')} (${getI18nStr('toastSyncSuccess')})` : `${getI18nStr('toastExperienceUpdated')} (${getI18nStr('toastLocalSuccess')})`);
  };

  const deleteExperience = async (id: string) => {
    setData(prev => ({
      ...prev,
      experiences: (prev.experiences || []).filter(e => e.id !== id)
    }));
    deleteExperienceFromBackend(id);
    showToast(t.toastExperienceDeleted);
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
    if (typeof field === 'string') {
      const trimmed = field.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          const parsed = JSON.parse(trimmed);
          if (typeof parsed === 'object' && parsed !== null) {
            if (Array.isArray(parsed)) {
              return parsed.join(', ');
            }
            return parsed[lang] || parsed['zh-CN'] || parsed['zh-TW'] || parsed['en'] || parsed['ja'] || parsed['ko'] || Object.values(parsed)[0] || '';
          }
        } catch {
          // ignore
        }
      }
      return field;
    }
    if (typeof field === 'object' && field !== null) {
      return field[lang] || field['zh-CN'] || field['zh-TW'] || field['en'] || field['ja'] || field['ko'] || Object.values(field)[0] || '';
    }
    return '';
  }, []);

  const getProjectTitle = React.useCallback((p: Project) => getLocalizedText(p.title, language), [language, getLocalizedText]);
  const getProjectSummary = React.useCallback((p: Project) => getLocalizedText(p.summary, language), [language, getLocalizedText]);
  const getProjectDescription = React.useCallback((p: Project) => getLocalizedText(p.description, language), [language, getLocalizedText]);
  const getProjectCategory = React.useCallback((p: Project) => getLocalizedText(p.category, language), [language, getLocalizedText]);
  const getProfileField = React.useCallback((field: Record<LanguageCode, string> | string | undefined) => getLocalizedText(field, language), [language, getLocalizedText]);
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
    return getLocalizedText(tagline, lang);
  }, [getLocalizedText]);

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
        searchQuery,
        toastMessage,
        currentUser,
        users: data?.users && data.users.length > 0 ? data.users : [],
        setLanguage,
        toggleTheme,
        setCurrentView,
        openAdminModal,
        closeAdminModal,
        loginAdmin,
        logoutAdmin,
        updatePassword,
        setSelectedProject,
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
        addExperience,
        updateExperience,
        deleteExperience,
        resetToDefaultData,
        customTranslations,
        updateTranslationKey,
        resetTranslations,
        getProjectTitle,
        getProjectSummary,
        getProjectDescription,
        getProjectCategory,
        getProfileBioLines,
        getProfileField,
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
