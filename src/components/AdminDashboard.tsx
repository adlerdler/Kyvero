import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { LANGUAGES, LanguageCode } from '../i18n/languages';
import { FlagIcon } from './FlagIcon';
import { uploadToCloudinary, isCloudinaryConfigured, isSignedConfigured, deleteFromCloudinary } from '../lib/cloudinary';
import {
  AdminTab,
  Profile,
  Project,
  SocialLink,
  FooterLink,
  TechSkill,
  Experience,
  SystemConfig
} from '../types';
import {
  User,
  FolderGit2,
  Share2,
  Briefcase,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
  CheckCircle,
  Image as ImageIcon,
  ArrowLeft,
  Home,
  LogOut,
  Shield,
  Sun,
  Moon,
  Globe,
  Github,
  Twitter,
  Mail,
  Tv,
  ExternalLink,
  Link as LinkIcon,
  Cpu,
  Zap,
  Code,
  Terminal as TerminalIcon,
  Layers,
  ShieldCheck,
  Check,
  Palette,
  Activity,
  X,
  Loader2,
  Languages,
  ChevronDown,
  Key,
  Database,
  RefreshCw
} from 'lucide-react';
import { getSupabaseCredentials, saveCustomSupabaseConfig, testSupabaseConnection, isSupabaseConfigured } from '../lib/supabase';
import { fetchAllSiteDataFromSupabase } from '../services/supabaseService';
import { VisitorHeatmap } from './VisitorHeatmap';
import { VisitorGeoMap } from './VisitorGeoMap';
import { LanguageManager } from './LanguageManager';
import { MediaLibrarySelector } from './MediaLibrarySelector';
import { exportPortfolioToPDF } from '../utils/exportPdf';
import { ExperienceModal } from './ExperienceModal';

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

import {
  DEFAULT_AVATAR_SVG,
  PROJECT_1_SVG,
  PROJECT_2_SVG,
  PROJECT_3_SVG
} from '../data/initialData';

export const AdminDashboard: React.FC = () => {
  const {
    data,
    t,
    theme,
    toggleTheme,
    language,
    setLanguage,
    isAdmin,
    setCurrentView,
    logoutAdmin,
    currentUser,
    updatePassword,
    users,
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
    addExperience,
    updateExperience,
    deleteExperience,
    resetToDefaultData,
    showToast,
    getProjectTitle,
    getProjectSummary,
    getProjectDescription,
    getProjectCategory,
    getSkillTagline
  } = useApp();

  const dbt = t;

  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPwInput, setCurrentPwInput] = useState('');
  const [newPwInput, setNewPwInput] = useState('');
  const [confirmPwInput, setConfirmPwInput] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const handleExportPDF = async () => {
    try {
      setIsExportingPdf(true);
      await exportPortfolioToPDF(data, language);
      showToast(t.pdfExportSuccessToast);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      showToast(t.pdfExportFailedToast);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Local Form States
  const [profileForm, setProfileForm] = useState<Profile>(data.profile);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Supabase Configuration Form States
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => getSupabaseCredentials().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => getSupabaseCredentials().key);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState<string | null>(null);

  const handleTestAndSaveSupabase = async () => {
    setTestingSupabase(true);
    setSupabaseStatusMsg(null);
    saveCustomSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
    const result = await testSupabaseConnection();
    setTestingSupabase(false);
    if (result.connected) {
      setSupabaseStatusMsg('🟢 ' + result.message);
      showToast('Supabase 数据库连接成功！数据同步引擎已接通。');
    } else {
      setSupabaseStatusMsg('🔴 ' + result.message);
      showToast('Supabase 连接测试未通过，请检查凭据');
    }
  };

  const [systemForm, setSystemForm] = useState<SystemConfig>(() => {
    return data.systemConfig || {
      siteTitle: 'MECHA SYSTEM',
      logoUrl: '',
      iconUrl: '',
      copyrightText: '© 2026',
      copyrightSubtext: '',
      version: 'v2.5.0-RELEASE',
      buildChannel: 'PRODUCTION-STABLE-CHANNEL'
    };
  });

  useEffect(() => {
    if (data.systemConfig) {
      setSystemForm(data.systemConfig);
    }
  }, [data.systemConfig]);

  const { addMediaItem, deleteMediaItem } = useApp();
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [showProjectMediaSelector, setShowProjectMediaSelector] = useState(false);
  const [showLogoMediaSelector, setShowLogoMediaSelector] = useState(false);
  const [showIconMediaSelector, setShowIconMediaSelector] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null);
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    setMediaUploadError(null);

    const sizeStr = formatFileSize(file.size);

    try {
      if (!isCloudinaryConfigured) {
        throw new Error(t.cloudinaryNotConfigured);
      }
      const url = await uploadToCloudinary(file);
      addMediaItem({
        name: file.name,
        url: url,
        size: sizeStr
      });
      showToast(t.cloudinaryUploadSuccessToast);
    } catch (err: any) {
      console.warn('Cloudinary 实机上传不可用，已为您启用二次元演示降级逻辑：', err);
      // 演示降级
      const sandboxImages = [
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=60', // Anime Room
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=60', // Neon Anime character
        'https://images.unsplash.com/photo-1541562232579-512a21360020?w=800&auto=format&fit=crop&q=60', // Cyber Cyberpunk
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60', // Digital tech
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60'  // Mecha lines
      ];
      const randomUrl = sandboxImages[Math.floor(Math.random() * sandboxImages.length)];
      
      addMediaItem({
        name: `${file.name.replace(/\.[^/.]+$/, "")} ${t.demoSimulationTag}`,
        url: randomUrl,
        size: sizeStr
      });
      
      showToast(t.demoImageLoadedToast);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleMediaDelete = async (id: string, url: string) => {
    setDeletingMediaId(id);
    try {
      const isCloudinary = url.includes('res.cloudinary.com');
      if (isCloudinary) {
        showToast(t.mediaDestroyRequestToast);
        const released = await deleteFromCloudinary(url);
        if (released) {
          showToast(t.mediaCloudReleasedToast);
        } else {
          showToast(t.mediaCloudPartialReleasedToast);
        }
      } else {
        showToast(t.mediaLocalDemoRemovedToast);
      }
      deleteMediaItem(id);
    } catch (err) {
      console.error(err);
      showToast(t.mediaPhysicalDeleteFailedToast);
      deleteMediaItem(id);
    } finally {
      setDeletingMediaId(null);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setUploadError(null);

    try {
      const url = await uploadToCloudinary(file);
      setProfileForm(prev => ({ ...prev, avatarUrl: url }));
      showToast(t.avatarCloudinaryUploadSuccessToast);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || '上传失败，请检查配置');
      const failMsg = t.uploadFailedPrefix;
      showToast(failMsg + (err.message || 'Error'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    setProfileForm(data.profile);
  }, [data.profile]);

  // Skill Form State
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

  // Footer Link Form State
  const [editingFooterLink, setEditingFooterLink] = useState<FooterLink | null>(null);
  const [isAddingFooterLink, setIsAddingFooterLink] = useState(false);
  const [footerLinkForm, setFooterLinkForm] = useState<Omit<FooterLink, 'id'>>({
    name: '',
    url: '',
    iconType: 'github'
  });

  const handleFooterLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerLinkForm.name.trim() || !footerLinkForm.url.trim()) return;

    if (editingFooterLink) {
      updateFooterLink({
        ...editingFooterLink,
        ...footerLinkForm
      });
    } else {
      addFooterLink(footerLinkForm);
    }

    setIsAddingFooterLink(false);
    setEditingFooterLink(null);
    setFooterLinkForm({ name: '', url: '', iconType: 'github' });
  };

  const startEditFooterLink = (fl: FooterLink) => {
    setEditingFooterLink(fl);
    setFooterLinkForm({
      name: fl.name,
      url: fl.url,
      iconType: fl.iconType
    });
    setIsAddingFooterLink(true);
  };

  // Project Form State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    summary: '',
    description: '',
    imageUrl: PROJECT_1_SVG,
    demoUrl: '',
    githubUrl: '',
    category: 'Web App',
    tags: 'React, TypeScript, Tailwind',
    featured: false
  });

  // Experience Form State
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isAddingExp, setIsAddingExp] = useState(false);
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

  // Social Link Form State
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkForm, setLinkForm] = useState({
    name: '',
    url: '',
    type: 'github' as SocialLink['type'],
    iconName: 'Github',
    badgeText: '',
    isPrimary: false
  });

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  // Project Submit
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = projectForm.tags
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingProject) {
      const newTitle = typeof editingProject.title === 'object' && editingProject.title !== null
        ? { ...editingProject.title, [language]: projectForm.title }
        : projectForm.title;
      const newSummary = typeof editingProject.summary === 'object' && editingProject.summary !== null
        ? { ...editingProject.summary, [language]: projectForm.summary }
        : projectForm.summary;
      const newDesc = typeof editingProject.description === 'object' && editingProject.description !== null
        ? { ...editingProject.description, [language]: projectForm.description }
        : projectForm.description;
      const newCat = typeof editingProject.category === 'object' && editingProject.category !== null
        ? { ...editingProject.category, [language]: projectForm.category }
        : projectForm.category;

      updateProject({
        ...editingProject,
        title: newTitle,
        summary: newSummary,
        description: newDesc,
        imageUrl: projectForm.imageUrl,
        demoUrl: projectForm.demoUrl,
        githubUrl: projectForm.githubUrl,
        category: newCat,
        tags: tagArray,
        featured: projectForm.featured
      });
      setEditingProject(null);
      setIsAddingProject(false);
    } else {
      addProject({
        title: projectForm.title,
        summary: projectForm.summary,
        description: projectForm.description,
        imageUrl: projectForm.imageUrl || PROJECT_1_SVG,
        demoUrl: projectForm.demoUrl,
        githubUrl: projectForm.githubUrl,
        category: projectForm.category,
        tags: tagArray,
        featured: projectForm.featured
      });
      setIsAddingProject(false);
    }

    // reset project form
    setProjectForm({
      title: '',
      summary: '',
      description: '',
      imageUrl: PROJECT_1_SVG,
      demoUrl: '',
      githubUrl: '',
      category: 'Web App',
      tags: 'React, TypeScript, Tailwind',
      featured: false
    });
  };

  const startEditProject = (p: Project) => {
    setEditingProject(p);
    setIsAddingProject(true);
    setProjectForm({
      title: getProjectTitle(p),
      summary: getProjectSummary(p),
      description: getProjectDescription(p),
      imageUrl: p.imageUrl,
      demoUrl: p.demoUrl || '',
      githubUrl: p.githubUrl || '',
      category: getProjectCategory(p),
      tags: p.tags.join(', '),
      featured: p.featured
    });
  };

  // Experience Submit
  const handleExpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExp) {
      updateExperience({
        ...editingExp,
        company: expForm.company,
        role: expForm.role,
        startDate: expForm.startDate,
        endDate: expForm.endDate,
        description: expForm.description,
        technologies: expForm.technologies ? expForm.technologies.split(',').map(t => t.trim()).filter(Boolean) : []
      });
      setEditingExp(null);
    } else {
      addExperience({
        company: expForm.company,
        role: expForm.role,
        startDate: expForm.startDate,
        endDate: expForm.endDate,
        description: expForm.description,
        technologies: expForm.technologies ? expForm.technologies.split(',').map(t => t.trim()).filter(Boolean) : []
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

  // Social Link Submit
  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLink) {
      updateSocialLink({
        ...editingLink,
        name: linkForm.name,
        url: linkForm.url,
        type: linkForm.type,
        iconName: linkForm.iconName,
        badgeText: linkForm.badgeText,
        isPrimary: linkForm.isPrimary
      });
      setEditingLink(null);
      setIsAddingLink(false);
    } else {
      addSocialLink({
        name: linkForm.name,
        url: linkForm.url,
        type: linkForm.type,
        iconName: linkForm.iconName,
        badgeText: linkForm.badgeText,
        isPrimary: linkForm.isPrimary
      });
      setIsAddingLink(false);
    }

    setLinkForm({
      name: '',
      url: '',
      type: 'github',
      iconName: 'Github',
      badgeText: '',
      isPrimary: false
    });
  };

  const startEditLink = (l: SocialLink) => {
    setEditingLink(l);
    setIsAddingLink(true);
    setLinkForm({
      name: l.name,
      url: l.url,
      type: l.type,
      iconName: l.iconName,
      badgeText: l.badgeText || '',
      isPrimary: !!l.isPrimary
    });
  };

  // Export JSON
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-data-${Date.now()}.json`;
    a.click();
    showToast(t.exportSuccessToast);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
      {/* Navigation Top Banner */}
      <div className="bg-amber-300 dark:bg-amber-400 border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-black stroke-[2.5]" />
          <h1 className="font-black text-base md:text-lg text-black uppercase tracking-wider">
            {t.adminDashboard}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-center">
          {/* Theme Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`p-2 rounded-xl border-2 transition-all flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-slate-900 text-amber-300 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black border-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-100'
            }`}
            title={theme === 'dark' ? t.switchToLightMode : t.switchToDarkMode}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 fill-amber-300 text-amber-300 stroke-[2]" />
            ) : (
              <Sun className="w-4 h-4 fill-amber-400 text-black stroke-[2.5]" />
            )}
          </motion.button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 bg-white text-black border-2 border-black p-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-100 transition-colors"
              title={`${t.languageSelect} (${currentLangObj.name})`}
            >
              <FlagIcon code={language} className="w-5 h-3.5" />
            </motion.button>

            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-40 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] py-1.5 z-50"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between transition-colors ${
                        language === lang.code
                          ? 'bg-amber-200 text-black font-extrabold'
                          : 'text-zinc-800 hover:bg-amber-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FlagIcon code={lang.code} className="w-4 h-3" />
                        <span>{lang.name}</span>
                      </span>
                      {language === lang.code && <span className="text-xs font-black">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('home')}
            className="p-2.5 bg-white text-black border-2 border-black rounded-xl shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-zinc-100 transition-colors flex items-center justify-center"
            title={t.returnToSite}
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
          </motion.button>

          {/* User Avatar & Menu */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-200 p-1.5 pr-3 rounded-xl shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_0px_#38BDF8] hover:bg-amber-100 dark:hover:bg-slate-800 transition-colors"
              title={dbt.userAvatarMenu || '管理员菜单'}
            >
              <img
                src={(currentUser || (data?.users && data.users[0]) || users[0])?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={(currentUser || (data?.users && data.users[0]) || users[0])?.name || 'Admin'}
                className="w-7 h-7 rounded-lg object-cover border border-black dark:border-zinc-300 shrink-0"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-black text-black dark:text-white leading-tight">
                  {(currentUser || (data?.users && data.users[0]) || users[0])?.name || '管理员'}
                </p>
                <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 leading-tight">
                  @{(currentUser || (data?.users && data.users[0]) || users[0])?.username || 'admin'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-black dark:text-white stroke-[2.5]" />
            </motion.button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-200 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] p-1.5 z-50 flex flex-col gap-1"
                >
                  <div className="px-2.5 py-2 bg-amber-50 dark:bg-slate-800 rounded-lg border border-black/10 dark:border-white/10 mb-0.5">
                    <p className="text-xs font-black text-black dark:text-white">
                      {(currentUser || (data?.users && data.users[0]) || users[0])?.name || '管理员'}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                      {(currentUser || (data?.users && data.users[0]) || users[0])?.role || 'Administrator'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setShowChangePasswordModal(true);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs font-black rounded-lg flex items-center gap-2 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Key className="w-4 h-4 text-amber-500 stroke-[2.5]" />
                    <span>{dbt.changePassword || '修改密码'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs font-black rounded-lg flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500 stroke-[2.5]" />
                    <span>{dbt.logoutButton || '退出登录'}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Standalone Console Navigation Tabs Row */}
      <div className="bg-transparent flex flex-wrap gap-2 mb-6 transition-colors">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'profile'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-300 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t.tabProfile}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'projects'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-300 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>{t.tabProjects} ({data.projects.length})</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'skills'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-300 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{t.tabSkills} ({(data.techSkills || []).length})</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'experience'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-300 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Experience ({(data.experiences || []).length})</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'links'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-300 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>{t.tabLinks} ({data.socialLinks.length})</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'media'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-300 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{t.tabMedia} ({(data.mediaItems || []).length})</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'analytics'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-300 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t.tabAnalytics}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'system'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-300 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t.tabSystem}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('i18n')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'i18n'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-300 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>{t.tabI18n}</span>
        </motion.button>
      </div>

      {/* Main Dashboard Panel Content Box */}
      <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-zinc-200 rounded-3xl p-6 md:p-8 shadow-[12px_12px_0px_0px_#000] dark:shadow-[12px_12px_0px_0px_#38BDF8] overflow-hidden flex flex-col transition-colors">
        <div className="overflow-y-auto flex-grow bg-white dark:bg-slate-900">
          
          {/* 1. Profile Editing Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">
                    {t.aliasLabel}
                  </label>
                  <input
                    type="text"
                    value={profileForm.alias}
                    onChange={e => setProfileForm({ ...profileForm, alias: e.target.value })}
                    className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1 flex items-center justify-between">
                    <span>{t.titleLabel}</span>
                    <span className="text-[10px] text-zinc-500 font-mono font-bold">({language})</span>
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
                    className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1 flex items-center justify-between">
                    <span>Subtitle</span>
                    <span className="text-[10px] text-zinc-500 font-mono font-bold">({language})</span>
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
                    className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1 flex items-center justify-between">
                    <span>Speech Bubble Text</span>
                    <span className="text-[10px] text-zinc-500 font-mono font-bold">({language})</span>
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
                    className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1 flex items-center justify-between">
                    <span>{t.locationLabel}</span>
                    <span className="text-[10px] text-zinc-500 font-mono font-bold">({language})</span>
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
                    className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">
                  {t.avatarLabel}
                </label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={profileForm.avatarUrl}
                      onChange={e => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                      className="flex-1 bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
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
                    presets={[{ name: dbt.avatarDefaultSvg, url: DEFAULT_AVATAR_SVG }]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">
                  {t.statusLabel}
                </label>
                <input
                  type="text"
                  value={profileForm.statusText}
                  onChange={e => setProfileForm({ ...profileForm, statusText: e.target.value })}
                  className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">
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
                  className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase mb-1 flex items-center justify-between">
                  <span>{t.bioLabel}</span>
                  <span className="text-[10px] text-zinc-500 font-mono font-bold">({language})</span>
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
                  className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                />
              </div>



              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">
                  Blog URL
                </label>
                <input
                  type="text"
                  value={profileForm.blogUrl}
                  onChange={e => setProfileForm({ ...profileForm, blogUrl: e.target.value })}
                  className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={profileForm.githubUrl}
                  onChange={e => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                  className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
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
          )}

          {/* 2. Projects Management Tab */}
          {activeTab === 'projects' && (
            <div className="flex flex-col gap-6">
              
              {/* Header Action */}
              <div className="flex items-center justify-between bg-zinc-50 border-2 border-black p-3 rounded-2xl shadow-[3px_3px_0px_0px_#000]">
                <h4 className="font-black text-sm text-black">
                  {t.projectsSection} ({data.projects.length})
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportPDF}
                    disabled={isExportingPdf}
                    className="bg-amber-300 text-black border-2 border-black px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-amber-400 disabled:opacity-50 flex items-center gap-1.5 transition-all"
                    title={t.pdfExportTitle}
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>{isExportingPdf ? dbt.pdfExportingBtn : dbt.exportPdfBtn}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAddingProject(true);
                      setEditingProject(null);
                      setProjectForm({
                        title: '',
                        summary: '',
                        description: '',
                        imageUrl: PROJECT_1_SVG,
                        demoUrl: '',
                        githubUrl: '',
                        category: 'Web App',
                        tags: 'React, TypeScript, Tailwind',
                        featured: false
                      });
                    }}
                    className="bg-emerald-300 text-black border-2 border-black px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-emerald-400 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{t.add}</span>
                  </button>
                </div>
              </div>

              {/* Project Editor Form Modal */}
              <AnimatePresence>
                {isAddingProject && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        setIsAddingProject(false);
                        setEditingProject(null);
                      }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                    />

                    {/* Modal container with retro-neo-brutalism design and pop animation */}
                    <motion.div
                      initial={{ scale: 0.95, y: 15, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      exit={{ scale: 0.95, y: 15, opacity: 0 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      className="bg-yellow-50 dark:bg-slate-800 border-4 border-black dark:border-zinc-300 w-full max-w-2xl rounded-2xl p-6 shadow-[8px_8px_0px_0px_#000] relative z-10 flex flex-col max-h-[85vh] overflow-y-auto"
                    >
                      <form
                        onSubmit={handleProjectSubmit}
                        className="flex flex-col gap-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-sm text-black dark:text-white">
                            {editingProject ? `✨ ${t.edit}: ${getProjectTitle(editingProject)}` : `✨ ${t.add}`}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingProject(false);
                              setEditingProject(null);
                            }}
                            className="p-1 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5 stroke-[2.5]" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                              {t.projectTitle}
                            </label>
                            <input
                              type="text"
                              required
                              value={projectForm.title}
                              onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                              className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                              {t.projectCategory}
                            </label>
                            <input
                              type="text"
                              required
                              value={projectForm.category}
                              onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                              className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                            {t.projectSummary}
                          </label>
                          <input
                            type="text"
                            required
                            value={projectForm.summary}
                            onChange={e => setProjectForm({ ...projectForm, summary: e.target.value })}
                            className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                            {t.projectImageUrl}
                          </label>
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={projectForm.imageUrl}
                                onChange={e => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                                className="flex-1 bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                                placeholder={dbt.avatarInputPlaceholder}
                              />
                              <button
                                type="button"
                                onClick={() => setShowProjectMediaSelector(true)}
                                className="bg-cyan-200 text-black border-2 border-black px-3.5 py-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shrink-0"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>{dbt.avatarSelectFromMedia}</span>
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-extrabold text-zinc-600 dark:text-zinc-400">Preset SVG Covers:</span>
                              <button
                                type="button"
                                onClick={() => setProjectForm({ ...projectForm, imageUrl: PROJECT_1_SVG })}
                                className="bg-white dark:bg-slate-900 text-black dark:text-white border border-black dark:border-zinc-400 px-2 py-0.5 rounded text-[10px] font-bold shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#fff]"
                              >
                                Cover 1
                              </button>
                              <button
                                type="button"
                                onClick={() => setProjectForm({ ...projectForm, imageUrl: PROJECT_2_SVG })}
                                className="bg-white dark:bg-slate-900 text-black dark:text-white border border-black dark:border-zinc-400 px-2 py-0.5 rounded text-[10px] font-bold shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#fff]"
                              >
                                Cover 2
                              </button>
                              <button
                                type="button"
                                onClick={() => setProjectForm({ ...projectForm, imageUrl: PROJECT_3_SVG })}
                                className="bg-white dark:bg-slate-900 text-black dark:text-white border border-black dark:border-zinc-400 px-2 py-0.5 rounded text-[10px] font-bold shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#fff]"
                              >
                                Cover 3
                              </button>
                            </div>
                          </div>
                        </div>

                        <MediaLibrarySelector
                          isOpen={showProjectMediaSelector}
                          onClose={() => setShowProjectMediaSelector(false)}
                          onSelect={(url) => setProjectForm({ ...projectForm, imageUrl: url })}
                          title={t.selectProjectCoverTitle}
                          subtitle={t.selectProjectCoverSubtitle}
                          presets={[
                            { name: 'Preset Cover 1', url: PROJECT_1_SVG },
                            { name: 'Preset Cover 2', url: PROJECT_2_SVG },
                            { name: 'Preset Cover 3', url: PROJECT_3_SVG }
                          ]}
                          showUpload={true}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                              {t.projectDemoUrl}
                            </label>
                            <input
                              type="text"
                              value={projectForm.demoUrl}
                              onChange={e => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                              className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                              {t.projectGithubUrl}
                            </label>
                            <input
                              type="text"
                              value={projectForm.githubUrl}
                              onChange={e => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                              className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                            {t.projectTags}
                          </label>
                          <input
                            type="text"
                            value={projectForm.tags}
                            onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })}
                            className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="featured-check"
                            checked={projectForm.featured}
                            onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })}
                            className="w-4 h-4 accent-black"
                          />
                          <label htmlFor="featured-check" className="text-xs font-black text-black dark:text-white cursor-pointer">
                            {t.projectFeatured}
                          </label>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            className="bg-black text-yellow-300 dark:bg-yellow-400 dark:text-black border-2 border-black dark:border-zinc-300 px-5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
                          >
                            {t.save}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingProject(false);
                              setEditingProject(null);
                            }}
                            className="bg-white text-black border-2 border-black dark:border-zinc-300 px-4 py-2.5 rounded-xl text-xs font-black"
                          >
                            {t.cancel}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Projects List */}
              <div className="flex flex-col gap-3">
                {data.projects.map(p => (
                  <div
                    key={p.id}
                    className="bg-white border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-zinc-100 border border-black rounded-lg overflow-hidden shrink-0">
                        <img src={p.imageUrl} alt={getProjectTitle(p)} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-sm text-black">{getProjectTitle(p)}</h5>
                          <span className="bg-cyan-200 text-black border border-black px-1.5 py-0.2 rounded text-[10px] font-bold">
                            {getProjectCategory(p)}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-zinc-500 line-clamp-1">{getProjectSummary(p)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => startEditProject(p)}
                        className="bg-amber-200 text-black border-2 border-black p-2 rounded-xl text-xs font-black hover:bg-amber-300 shadow-[1.5px_1.5px_0px_0px_#000]"
                        title={t.edit}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteProject(p.id)}
                        className="bg-rose-200 text-rose-900 border-2 border-black p-2 rounded-xl text-xs font-black hover:bg-rose-300 shadow-[1.5px_1.5px_0px_0px_#000]"
                        title={t.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 3. Core Skills & Proficiency Tab */}
          {activeTab === 'skills' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 border-3 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
                <div>
                  <h4 className="font-black text-base text-black flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-amber-500 stroke-[2.5]" />
                    <span>{t.tabSkills}</span>
                    <span className="text-xs bg-black text-yellow-300 font-mono px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_0px_#000]">
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
                      color: 'cyan',
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
                  className="bg-amber-300 text-black border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:bg-amber-400 active:translate-y-0.5 flex items-center gap-2 self-start sm:self-auto"
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
                      className="bg-white border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_#000] flex flex-col gap-2.5 justify-between"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-black">{skill.name}</span>
                          {skill.experience && (
                            <span className="text-[10px] font-black px-1.5 py-0.2 bg-zinc-100 text-black border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                              {skill.experience}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black px-1.5 py-0.2 bg-yellow-300 border border-black rounded shadow-[1px_1px_0px_0px_#000] text-black">
                            {getRankText(skill.level)}
                          </span>
                          <span className="text-xs font-black font-mono text-black bg-zinc-100 border border-black px-1.5 py-0.2 rounded shadow-[1px_1px_0px_0px_#000]">
                            {skill.level}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar Preview */}
                      <div className="w-full bg-zinc-100 border-1.5 border-black rounded-lg p-0.5 shadow-[1px_1px_0px_0px_#000] overflow-hidden">
                        <div
                          style={{
                            width: `${Math.min(Math.max(skill.level, 0), 100)}%`,
                            backgroundColor: getBarHex(skill.color)
                          }}
                          className="h-2.5 border border-black rounded transition-all"
                        />
                      </div>

                      {skill.tagline && getSkillTagline(skill.tagline, language) && (
                        <p className="text-[11px] font-bold text-zinc-600 line-clamp-1 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{getSkillTagline(skill.tagline, language)}</span>
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 mt-1">
                        <span className="text-[10px] font-bold uppercase text-zinc-500 font-mono">
                          CAT: {skill.category}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditSkill(skill)}
                            className="bg-amber-200 text-black border border-black p-1.5 rounded-lg text-xs font-black hover:bg-amber-300 shadow-[1px_1px_0px_0px_#000]"
                            title={t.edit}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTechSkill(skill.id)}
                            className="bg-rose-200 text-rose-900 border border-black p-1.5 rounded-lg text-xs font-black hover:bg-rose-300 shadow-[1px_1px_0px_0px_#000]"
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
          )}

          {/* 3.5 Experience Management Tab */}
          {activeTab === 'experience' && (
            <div className="flex flex-col gap-6">
              
              <div className="flex items-center justify-between bg-zinc-50 border-2 border-black p-3 rounded-2xl shadow-[3px_3px_0px_0px_#000]">
                <h4 className="font-black text-sm text-black">
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
                  className="bg-black text-white px-3 py-1.5 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#f43f5e] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_0px_#f43f5e] transition-all flex items-center gap-1.5"
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
                    <div key={exp.id} className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] flex justify-between items-center group hover:bg-zinc-50">
                      <div>
                        <div className="font-black text-base text-black flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-zinc-500" />
                          {roleStr} <span className="text-rose-500">@</span> {companyStr}
                        </div>
                        <div className="text-xs font-bold text-zinc-600 mt-1 font-mono">
                          {exp.startDate} - {exp.endDate}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditExp(exp)}
                          className="bg-white border-2 border-black p-2 rounded-xl hover:bg-amber-100 shadow-[2px_2px_0px_0px_#000]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteExperience(exp.id)}
                          className="bg-rose-100 text-rose-600 border-2 border-black p-2 rounded-xl hover:bg-rose-200 shadow-[2px_2px_0px_0px_#000]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Links Management Tab */}
          {activeTab === 'links' && (
            <div className="flex flex-col gap-6">
              
              <div className="flex items-center justify-between bg-zinc-50 border-2 border-black p-3 rounded-2xl shadow-[3px_3px_0px_0px_#000]">
                <h4 className="font-black text-sm text-black">
                  {t.tabLinks} ({data.socialLinks.length})
                </h4>
                <button
                  onClick={() => {
                    setIsAddingLink(true);
                    setEditingLink(null);
                    setLinkForm({
                      name: '',
                      url: '',
                      type: 'github',
                      iconName: 'Github',
                      badgeText: '',
                      isPrimary: false
                    });
                  }}
                  className="bg-emerald-300 text-black border-2 border-black px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-emerald-400 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t.add}</span>
                </button>
              </div>

              {/* Social Link Editor Form Modal */}
              <AnimatePresence>
                {isAddingLink && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        setIsAddingLink(false);
                        setEditingLink(null);
                      }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                    />

                    {/* Modal Container */}
                    <motion.div
                      initial={{ scale: 0.95, y: 15, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      exit={{ scale: 0.95, y: 15, opacity: 0 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      className="bg-yellow-50 dark:bg-slate-800 border-4 border-black dark:border-zinc-300 w-full max-w-xl rounded-2xl p-6 shadow-[8px_8px_0px_0px_#000] relative z-10 flex flex-col max-h-[85vh] overflow-y-auto"
                    >
                      <form
                        onSubmit={handleLinkSubmit}
                        className="flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-sm text-black dark:text-white uppercase">
                            {editingLink ? `${t.edit || '编辑'}: ${editingLink.name}` : `✨ ${t.add || '新增链接'}`}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingLink(false);
                              setEditingLink(null);
                            }}
                            className="p-1 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5 stroke-[2.5]" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                              Link Name
                            </label>
                            <input
                              type="text"
                              required
                              value={linkForm.name}
                              onChange={e => setLinkForm({ ...linkForm, name: e.target.value })}
                              className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                              URL Address
                            </label>
                            <input
                              type="text"
                              required
                              value={linkForm.url}
                              onChange={e => setLinkForm({ ...linkForm, url: e.target.value })}
                              className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                              Type / Platform
                            </label>
                            <select
                              value={linkForm.type}
                              onChange={e =>
                                setLinkForm({
                                  ...linkForm,
                                  type: e.target.value as SocialLink['type']
                                })
                              }
                              className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                            >
                              <option value="github">GitHub</option>
                              <option value="blog">Technical Blog</option>
                              <option value="twitter">Twitter / X</option>
                              <option value="bilibili">Bilibili</option>
                              <option value="email">Email</option>
                              <option value="other">Other Link</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                              Badge Text (Optional)
                            </label>
                            <input
                              type="text"
                              value={linkForm.badgeText}
                              onChange={e => setLinkForm({ ...linkForm, badgeText: e.target.value })}
                              className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-300 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            className="bg-black text-yellow-300 dark:bg-yellow-400 dark:text-black border-2 border-black dark:border-zinc-300 px-5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
                          >
                            {t.save}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingLink(false);
                              setEditingLink(null);
                            }}
                            className="bg-white text-black border-2 border-black dark:border-zinc-300 px-4 py-2.5 rounded-xl text-xs font-black"
                          >
                            {t.cancel}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-3">
                {data.socialLinks.map(l => (
                  <div
                    key={l.id}
                    className="bg-white border-2 border-black p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="font-black text-sm text-black flex items-center gap-2">
                        {l.name}
                        <span className="bg-amber-200 border border-black px-1.5 py-0.2 rounded text-[10px] font-bold">
                          {l.type}
                        </span>
                      </h5>
                      <p className="text-xs font-bold text-zinc-500">{l.url}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditLink(l)}
                        className="bg-amber-200 text-black border-2 border-black p-2 rounded-xl text-xs font-black hover:bg-amber-300 shadow-[1.5px_1.5px_0px_0px_#000]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSocialLink(l.id)}
                        className="bg-rose-200 text-rose-900 border-2 border-black p-2 rounded-xl text-xs font-black hover:bg-rose-300 shadow-[1.5px_1.5px_0px_0px_#000]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 4.5 Media Library Tab */}
          {activeTab === 'media' && (
            <div className="flex flex-col gap-6">
              
              {/* Media Status and Configuration Summary */}
              <div className="bg-lime-50 dark:bg-slate-800 border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-black text-base text-black dark:text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />
                    <span>{dbt.mediaTitle}</span>
                  </h4>
                </div>
                <div className="bg-white dark:bg-slate-900 border-2 border-black px-3 py-1.5 rounded-lg text-[10px] font-black shadow-[2px_2px_0px_0px_#000] text-black dark:text-white">
                  {isSignedConfigured 
                    ? `🟢 ${dbt.mediaStatusSigned}` 
                    : isCloudinaryConfigured 
                      ? `🟡 ${dbt.mediaStatusUnsigned}` 
                      : `🔴 ${dbt.mediaStatusNone}`}
                </div>
              </div>

              {/* Upload Drag & Drop Sandbox Box */}
              <div className="bg-zinc-50 dark:bg-slate-900 border-3 border-dashed border-black dark:border-zinc-500 p-8 rounded-2xl text-center flex flex-col items-center justify-center gap-4 transition-colors relative hover:bg-zinc-100/50 dark:hover:bg-slate-800/50">
                <div className="p-3 bg-cyan-200 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000]">
                  <Upload className="w-6 h-6 text-black stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-black text-black dark:text-white">
                    {uploadingMedia ? dbt.mediaUploading : dbt.mediaDragPrompt}
                  </p>
                  <p className="text-[10px] font-bold text-zinc-500 mt-1">
                    {dbt.mediaFormatHint}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <label className={`cursor-pointer bg-amber-300 text-black border-2 border-black px-4.5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:bg-amber-400 active:translate-y-0.5 active:shadow-[1.5px_1.5px_0px_0px_#000] transition-all flex items-center gap-1.5 ${uploadingMedia ? 'opacity-50 pointer-events-none' : ''}`}>
                    <span>{uploadingMedia ? dbt.mediaUploadingBtn : dbt.mediaSelectBtn}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleMediaUpload} 
                      className="hidden" 
                      disabled={uploadingMedia}
                    />
                  </label>
                </div>

                {mediaUploadError && (
                  <div className="text-[10px] font-bold text-rose-600 bg-rose-50 border-2 border-rose-600 p-2 rounded-lg mt-2">
                    错误提示: {mediaUploadError}
                  </div>
                )}
              </div>

              {/* Grid Layout of Media Library */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-black text-black dark:text-white uppercase">
                    {dbt.mediaListTitle} ({(data.mediaItems || []).length})
                  </span>
                </div>

                {!(data.mediaItems && data.mediaItems.length > 0) ? (
                  <div className="text-center py-12 bg-zinc-50 dark:bg-slate-800/30 border-2 border-black border-dashed rounded-xl">
                    <span className="text-xs font-bold text-zinc-500">
                      {dbt.mediaEmpty}
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {(data.mediaItems || []).map(item => {
                      const isDeleting = deletingMediaId === item.id;
                      return (
                        <div 
                          key={item.id} 
                          className="bg-white dark:bg-slate-900 border-3 border-black dark:border-zinc-300 rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] overflow-hidden flex flex-col transition-transform hover:-translate-y-0.5"
                        >
                          {/* Image Box */}
                          <div className="aspect-video bg-zinc-100 relative group overflow-hidden">
                            <img 
                              src={item.url} 
                              alt={item.name} 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            {/* Copy Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.url);
                                  showToast(dbt.mediaCopiedToast);
                                }}
                                className="bg-yellow-300 text-black border-2 border-black p-2 rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-yellow-400"
                                title={dbt.mediaBtnCopy}
                              >
                                <span className="text-[10px]">{dbt.mediaBtnCopy}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setProfileForm(prev => ({ ...prev, avatarUrl: item.url }));
                                  showToast(dbt.mediaAvatarChangeToast);
                                }}
                                className="bg-cyan-300 text-black border-2 border-black p-2 rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-cyan-400"
                                title={dbt.mediaBtnAvatar}
                              >
                                <span className="text-[10px]">{dbt.mediaBtnAvatar}</span>
                              </button>
                            </div>
                          </div>

                          {/* Info Column */}
                          <div className="p-3.5 flex flex-col gap-2 flex-grow justify-between">
                            <div>
                              <span className="text-xs font-black text-black dark:text-white block truncate" title={item.name}>
                                {item.name}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-black/10">
                                  {item.size || dbt.mediaSizeUnknown}
                                </span>
                                <span className="text-[9px] font-bold text-zinc-400">
                                  {item.createdAt}
                                </span>
                              </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="pt-2 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.url);
                                  showToast(dbt.mediaUrlCopiedToast);
                                }}
                                className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 hover:underline flex items-center gap-1"
                              >
                                <span className="truncate max-w-[120px]">{item.url}</span>
                              </button>
                              
                              <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => handleMediaDelete(item.id, item.url)}
                                className={`bg-rose-200 text-rose-900 border-2 border-black px-2 py-1.5 rounded-lg text-[10px] font-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-300 transition-all flex items-center gap-1 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                              >
                                <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>{isDeleting ? dbt.mediaDeletingBtn : dbt.mediaDeleteBtn}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 4. Visitor Analytics Heatmap & Geographic Map Tab */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-8">
              <VisitorHeatmap />
              <VisitorGeoMap />
            </div>
          )}

          {/* 5. System Settings Tab */}
          {activeTab === 'system' && (
            <div className="flex flex-col gap-6">

              {/* Site Branding & Title Settings Block */}
              <div className="bg-amber-100 border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3 pb-1">
                  <h4 className="font-black text-base text-black flex items-center gap-2">
                    <Globe className="w-5 h-5 text-black stroke-[2.5]" />
                    <span>{dbt.systemBrandingTitle}</span>
                  </h4>
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">
                    {t.siteTitleLabel}
                  </label>
                  <input
                    type="text"
                    value={systemForm.siteTitle || ''}
                    onChange={e => setSystemForm({ ...systemForm, siteTitle: e.target.value })}
                    placeholder={dbt.systemBrandingPlaceholder}
                    className="w-full bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Logo Image URL */}
                  <div>
                    <label className="block text-xs font-black text-black uppercase mb-1">
                      {t.logoUrlLabel}
                    </label>
                    <div className="flex gap-2 items-center">
                      <div 
                        onClick={() => setShowLogoMediaSelector(true)}
                        className="w-10 h-10 bg-amber-300 border-2 border-black rounded-lg overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:scale-[1.05] transition-transform active:scale-95 flex items-center justify-center"
                        title={t.avatarSelectFromMedia}
                      >
                        {systemForm.logoUrl ? (
                          <img src={systemForm.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-black" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={systemForm.logoUrl || ''}
                        onChange={e => setSystemForm({ ...systemForm, logoUrl: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                      />
                    </div>
                  </div>

                  {/* Icon / Favicon URL */}
                  <div>
                    <label className="block text-xs font-black text-black uppercase mb-1">
                      {t.iconUrlLabel}
                    </label>
                    <div className="flex gap-2 items-center">
                      <div 
                        onClick={() => setShowIconMediaSelector(true)}
                        className="w-10 h-10 bg-cyan-300 border-2 border-black rounded-lg overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:scale-[1.05] transition-transform active:scale-95 flex items-center justify-center"
                        title={t.avatarSelectFromMedia}
                      >
                        {systemForm.iconUrl ? (
                          <img src={systemForm.iconUrl} alt="Icon Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-black" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={systemForm.iconUrl || ''}
                        onChange={e => setSystemForm({ ...systemForm, iconUrl: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                      />
                    </div>
                  </div>
                </div>

                <MediaLibrarySelector
                  isOpen={showLogoMediaSelector}
                  onClose={() => setShowLogoMediaSelector(false)}
                  onSelect={(url) => setSystemForm({ ...systemForm, logoUrl: url })}
                  title={t.selectLogoTitle}
                  subtitle={t.selectLogoSubtitle}
                />

                <MediaLibrarySelector
                  isOpen={showIconMediaSelector}
                  onClose={() => setShowIconMediaSelector(false)}
                  onSelect={(url) => setSystemForm({ ...systemForm, iconUrl: url })}
                  title={t.selectIconTitle}
                  subtitle={t.selectIconSubtitle}
                />

                <button
                  type="button"
                  onClick={() => {
                    updateSystemConfig(systemForm);
                  }}
                  className="self-start mt-1 bg-black text-yellow-300 border-2 border-black px-5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:bg-zinc-800 flex items-center gap-2"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>{t.save}</span>
                </button>
              </div>
              
              {/* Footer & Copyright Settings Block */}
              <div className="bg-cyan-100 border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col gap-3">
                <h4 className="font-black text-base text-black flex items-center gap-2">
                  <Shield className="w-5 h-5 text-black stroke-[2.5]" />
                  <span>{dbt.systemCopyrightTitle}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <div>
                    <label className="block text-[11px] font-black text-black uppercase mb-1">
                      {t.copyrightLabel}
                    </label>
                    <input
                      type="text"
                      value={systemForm.copyrightText || ''}
                      onChange={e => setSystemForm({ ...systemForm, copyrightText: e.target.value })}
                      placeholder="© 2026 Kaito Lin. All rights reserved."
                      className="w-full bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-black uppercase mb-1">
                      {t.copyrightSubtextLabel}
                    </label>
                    <input
                      type="text"
                      value={systemForm.copyrightSubtext || ''}
                      onChange={e => setSystemForm({ ...systemForm, copyrightSubtext: e.target.value })}
                      placeholder={dbt.systemSecondaryFooterPlaceholder}
                      className="w-full bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateSystemConfig(systemForm);
                  }}
                  className="self-start mt-2 bg-black text-yellow-300 border-2 border-black px-5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:bg-zinc-800 flex items-center gap-2"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>{t.save}</span>
                </button>
              </div>

              {/* 页脚独立外链管理模块 */}
              <div className="bg-emerald-50 border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col gap-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                  <h4 className="font-black text-base text-black flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-600" />
                    <span>{t.footerLinksTabTitle}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingFooterLink(true);
                      setEditingFooterLink(null);
                      setFooterLinkForm({ name: '', url: '', iconType: 'github' });
                    }}
                    className="bg-emerald-300 text-black border-2 border-black px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-emerald-400 flex items-center gap-1.5 self-start sm:self-auto transition-transform active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{t.addFooterLinkBtn}</span>
                  </button>
                </div>

                {/* 表单（新增/修改） */}
                {isAddingFooterLink && (
                  <form
                    onSubmit={handleFooterLinkSubmit}
                    className="bg-white border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_0px_#000] flex flex-col gap-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-black text-black uppercase mb-1">
                          {t.footerLinkName}
                        </label>
                        <input
                          type="text"
                          required
                          value={footerLinkForm.name}
                          onChange={e => setFooterLinkForm({ ...footerLinkForm, name: e.target.value })}
                          placeholder="e.g. GitHub"
                          className="w-full bg-zinc-50 border-2 border-black p-2 rounded-xl text-xs font-bold text-black focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-black uppercase mb-1">
                          {t.footerLinkUrl}
                        </label>
                        <input
                          type="text"
                          required
                          value={footerLinkForm.url}
                          onChange={e => setFooterLinkForm({ ...footerLinkForm, url: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-zinc-50 border-2 border-black p-2 rounded-xl text-xs font-bold text-black focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-black uppercase mb-1">
                          {t.footerLinkIconType}
                        </label>
                        <select
                          value={footerLinkForm.iconType}
                          onChange={e => setFooterLinkForm({ ...footerLinkForm, iconType: e.target.value as any })}
                          className="w-full bg-zinc-50 border-2 border-black p-2 rounded-xl text-xs font-bold text-black focus:outline-none"
                        >
                          <option value="github">GitHub</option>
                          <option value="twitter">X / Twitter</option>
                          <option value="email">Email / Mail</option>
                          <option value="blog">Personal Blog / Web</option>
                          <option value="bilibili">Bilibili / Video</option>
                          <option value="other">Other Link</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="bg-black text-yellow-300 border-2 border-black px-4 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-800 transition-colors"
                      >
                        {t.save}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingFooterLink(false);
                          setEditingFooterLink(null);
                        }}
                        className="bg-zinc-100 border-2 border-black px-3.5 py-1.5 rounded-xl text-xs font-black text-black hover:bg-zinc-200 transition-colors"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </form>
                )}

                {/* 列表显示 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {(data.footerLinks || []).map(fl => (
                    <div
                      key={fl.id}
                      className="bg-white border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center justify-between gap-3 hover:shadow-[3px_3px_0px_0px_#000] transition-shadow"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 bg-black text-yellow-300 rounded-lg flex items-center justify-center font-black shrink-0">
                          {fl.iconType === 'github' && <Github className="w-4 h-4" />}
                          {fl.iconType === 'twitter' && <Twitter className="w-4 h-4" />}
                          {fl.iconType === 'email' && <Mail className="w-4 h-4" />}
                          {fl.iconType === 'blog' && <Globe className="w-4 h-4" />}
                          {fl.iconType === 'bilibili' && <Tv className="w-4 h-4" />}
                          {fl.iconType === 'other' && <ExternalLink className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-black text-xs text-black truncate">{fl.name}</h5>
                          <p className="text-[10px] font-bold text-zinc-500 truncate">{fl.url}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditFooterLink(fl)}
                          className="bg-amber-200 text-black border-1.5 border-black p-1.5 rounded-lg text-xs font-black hover:bg-amber-300 shadow-[1px_1px_0px_0px_#000] transition-transform active:scale-95"
                          title={t.edit}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFooterLink(fl.id)}
                          className="bg-rose-200 text-rose-900 border-1.5 border-black p-1.5 rounded-lg text-xs font-black hover:bg-rose-300 shadow-[1px_1px_0px_0px_#000] transition-transform active:scale-95"
                          title={t.delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(data.footerLinks || []).length === 0 && (
                    <div className="col-span-full py-6 text-center text-zinc-500 text-xs font-bold bg-white/50 border-2 border-dashed border-zinc-300 rounded-xl">
                      暂无页脚独立外链 / No links available
                    </div>
                  )}
                </div>
              </div>

              {/* Supabase 云端数据库配置 */}
              <div className="bg-amber-100 dark:bg-slate-800 border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-600 dark:text-amber-400 stroke-[2.5]" />
                    <h4 className="font-black text-base text-black dark:text-white uppercase tracking-wider">
                      Supabase 云端数据库配置
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black border-2 border-black shadow-[1px_1px_0px_0px_#000] ${
                      isSupabaseConfigured()
                        ? 'bg-emerald-400 text-black'
                        : 'bg-rose-400 text-white'
                    }`}>
                      {isSupabaseConfigured() ? '🟢 已配置 Supabase 实例' : '🔴 未配置 / 纯本地模式'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-black dark:text-zinc-200 uppercase mb-1">
                      Supabase Project URL
                    </label>
                    <input
                      type="text"
                      value={supabaseUrlInput}
                      onChange={e => setSupabaseUrlInput(e.target.value)}
                      placeholder="https://your-project.supabase.co"
                      className="w-full bg-white dark:bg-slate-900 border-2 border-black p-2.5 rounded-xl text-xs font-mono font-bold text-black dark:text-white shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-black dark:text-zinc-200 uppercase mb-1">
                      Supabase Key
                    </label>
                    <input
                      type="password"
                      value={supabaseKeyInput}
                      onChange={e => setSupabaseKeyInput(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      className="w-full bg-white dark:bg-slate-900 border-2 border-black p-2.5 rounded-xl text-xs font-mono font-bold text-black dark:text-white shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>
                </div>

                {supabaseStatusMsg && (
                  <div className="p-3 bg-white dark:bg-slate-900 border-2 border-black rounded-xl text-xs font-bold text-black dark:text-white font-mono shadow-[2px_2px_0px_0px_#000]">
                    {supabaseStatusMsg}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleTestAndSaveSupabase}
                    disabled={testingSupabase}
                    className="bg-black text-yellow-300 dark:bg-amber-400 dark:text-black border-2 border-black px-5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:bg-zinc-800 flex items-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                  >
                    {testingSupabase ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 stroke-[2.5]" />}
                    <span>保存并测试 Supabase 连接</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      showToast('正在从 Supabase 云端拉取最新数据...');
                      const cloudData = await fetchAllSiteDataFromSupabase();
                      if (cloudData) {
                        showToast('成功拉取 Supabase 云端全站数据！刷新即可同步显示。');
                        setTimeout(() => window.location.reload(), 1000);
                      } else {
                        showToast('从 Supabase 拉取数据失败，请确认数据库配置与网络连接。');
                      }
                    }}
                    className="bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black px-4 py-2.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-100 flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>从 Supabase 重新拉取云端全站数据</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* 6. Multi-language dictionary manager */}
          {activeTab === 'i18n' && (
            <LanguageManager />
          )}

        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-white dark:bg-slate-900 border-4 border-black dark:border-zinc-200 rounded-2xl p-6 max-w-sm w-full shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#38BDF8] flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-400 border-2 border-black rounded-xl flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000]">
                  <LogOut className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-base text-black dark:text-white">{dbt.logoutTitle}</h4>
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">{dbt.logoutSubtitle}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-slate-800 text-black dark:text-white border-2 border-black dark:border-zinc-300 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {dbt.cancelBtn}
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    logoutAdmin();
                  }}
                  className="px-4 py-2 bg-rose-400 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-500 transition-colors"
                >
                  {dbt.logoutConfirmBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowChangePasswordModal(false);
                setPwError(null);
                setCurrentPwInput('');
                setNewPwInput('');
                setConfirmPwInput('');
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border-4 border-black dark:border-zinc-200 rounded-3xl shadow-[12px_12px_0px_0px_#000] dark:shadow-[12px_12px_0px_0px_#38BDF8] overflow-hidden my-auto z-10"
            >
              <div className="bg-amber-300 dark:bg-amber-400 border-b-4 border-black p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black text-amber-300 rounded-lg flex items-center justify-center font-black">
                    <Key className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h3 className="font-black text-base text-black">
                    {dbt.changePasswordTitle || dbt.changePassword || '修改管理员密码'}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setPwError(null);
                    setCurrentPwInput('');
                    setNewPwInput('');
                    setConfirmPwInput('');
                  }}
                  className="w-8 h-8 bg-white border-2 border-black rounded-xl flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-200 transition-colors"
                >
                  <X className="w-4 h-4 text-black stroke-[3]" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newPwInput !== confirmPwInput) {
                    setPwError(dbt.passwordsDoNotMatch || '两次输入的新密码不一致');
                    return;
                  }
                  const res = updatePassword(currentPwInput, newPwInput);
                  if (!res.success) {
                    setPwError(res.messageKey ? (dbt[res.messageKey] || '密码错误') : '修改失败');
                  } else {
                    setPwError(null);
                    setCurrentPwInput('');
                    setNewPwInput('');
                    setConfirmPwInput('');
                    setShowChangePasswordModal(false);
                  }
                }}
                className="p-6 flex flex-col gap-4"
              >
                <div>
                  <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1.5">
                    {dbt.currentPassword || '当前密码'}
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPwInput}
                    onChange={e => {
                      setCurrentPwInput(e.target.value);
                      setPwError(null);
                    }}
                    placeholder={dbt.currentPasswordPlaceholder || '请输入当前密码'}
                    className="w-full bg-zinc-50 dark:bg-slate-950 border-3 border-black dark:border-zinc-200 p-3 rounded-xl text-sm font-black text-black dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1.5">
                    {dbt.newPassword || '新密码'}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPwInput}
                    onChange={e => {
                      setNewPwInput(e.target.value);
                      setPwError(null);
                    }}
                    placeholder={dbt.newPasswordPlaceholder || '请输入新密码'}
                    className="w-full bg-zinc-50 dark:bg-slate-950 border-3 border-black dark:border-zinc-200 p-3 rounded-xl text-sm font-black text-black dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1.5">
                    {dbt.confirmPassword || '确认新密码'}
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPwInput}
                    onChange={e => {
                      setConfirmPwInput(e.target.value);
                      setPwError(null);
                    }}
                    placeholder={dbt.confirmPasswordPlaceholder || '请再次输入新密码'}
                    className="w-full bg-zinc-50 dark:bg-slate-950 border-3 border-black dark:border-zinc-200 p-3 rounded-xl text-sm font-black text-black dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] focus:outline-none focus:border-amber-500"
                  />
                </div>

                {pwError && (
                  <div className="bg-rose-200 dark:bg-rose-950/80 border-2 border-black dark:border-rose-400 p-2.5 rounded-xl text-xs font-black text-rose-900 dark:text-rose-200 shadow-[2px_2px_0px_0px_#000]">
                    ⚠️ {pwError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePasswordModal(false);
                      setPwError(null);
                      setCurrentPwInput('');
                      setNewPwInput('');
                      setConfirmPwInput('');
                    }}
                    className="px-4 py-2.5 bg-zinc-100 dark:bg-slate-800 text-black dark:text-white border-2 border-black dark:border-zinc-300 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {dbt.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-300 text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:bg-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4 stroke-[2.5]" />
                    <span>{dbt.save}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
