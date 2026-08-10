import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteData, LanguageCode, Project, Profile, SocialLink, FooterLink, TechSkill } from '../types';
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
  resetToDefaultData: () => void;
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
      showToast('⚡ 管理员登录成功！/ Authenticated Successfully!');
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
    showToast('👋 已安全退出控制台');
  };

  // Data mutation methods
  const updateProfile = (newProfile: Profile) => {
    setData(prev => ({
      ...prev,
      profile: newProfile
    }));
    showToast('✨ 个人资料更新成功');
  };

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
    showToast('📁 新增项目添加成功');
  };

  const updateProject = (updatedProject: Project) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === updatedProject.id ? updatedProject : p))
    }));
    showToast('📝 项目数据更新成功');
  };

  const deleteProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
    showToast('🗑️ 项目已移除');
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
    showToast('🔗 新增外链保存成功');
  };

  const updateSocialLink = (updatedLink: SocialLink) => {
    setData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(l => (l.id === updatedLink.id ? updatedLink : l))
    }));
    showToast('📝 链接修改已生效');
  };

  const deleteSocialLink = (id: string) => {
    setData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(l => l.id !== id)
    }));
    showToast('🗑️ 链接已成功删除');
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
    showToast('🔗 页脚独立链接保存成功');
  };

  const updateFooterLink = (updatedLink: FooterLink) => {
    setData(prev => ({
      ...prev,
      footerLinks: (prev.footerLinks || []).map(l => (l.id === updatedLink.id ? updatedLink : l))
    }));
    showToast('📝 页脚链接更新已生效');
  };

  const deleteFooterLink = (id: string) => {
    setData(prev => ({
      ...prev,
      footerLinks: (prev.footerLinks || []).filter(l => l.id !== id)
    }));
    showToast('🗑️ 页脚链接已移除');
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
    showToast('⚡ 新增核心技术栈保存成功');
  };

  const updateTechSkill = (updatedSkill: TechSkill) => {
    setData(prev => ({
      ...prev,
      techSkills: (prev.techSkills || []).map(s => (s.id === updatedSkill.id ? updatedSkill : s))
    }));
    showToast('📝 技术栈熟练度更新成功');
  };

  const deleteTechSkill = (id: string) => {
    setData(prev => ({
      ...prev,
      techSkills: (prev.techSkills || []).filter(s => s.id !== id)
    }));
    showToast('🗑️ 技术栈技能项已移除');
  };

  const resetToDefaultData = () => {
    setData(INITIAL_SITE_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY_DATA);
    } catch (e) {
      // ignore
    }
    showToast('🔄 已恢复为官方初始数据');
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS['zh-CN'];

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
        resetToDefaultData
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
