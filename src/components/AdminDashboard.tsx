import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { LANGUAGES, LanguageCode } from '../i18n/languages';
import { FlagIcon } from './FlagIcon';
import {
  AdminTab,
  Profile,
  Project,
  SocialLink,
  FooterLink,
  TechSkill
} from '../types';
import {
  User,
  FolderGit2,
  Share2,
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
  Activity
} from 'lucide-react';
import { VisitorHeatmap } from './VisitorHeatmap';
import { VisitorGeoMap } from './VisitorGeoMap';
import { exportPortfolioToPDF } from '../utils/exportPdf';

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
    resetToDefaultData,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const handleExportPDF = async () => {
    try {
      setIsExportingPdf(true);
      await exportPortfolioToPDF(data, language);
      showToast('作品集 PDF 已成功生成并开始下载！');
    } catch (err) {
      console.error('Failed to export PDF:', err);
      showToast('导出 PDF 失败，请稍后重试');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Local Form States
  const [profileForm, setProfileForm] = useState<Profile>(data.profile);

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
    tagline: ''
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
      tagline: ''
    });
  };

  const startEditSkill = (skill: TechSkill) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      level: skill.level,
      category: skill.category,
      color: skill.color,
      experience: skill.experience || '',
      tagline: skill.tagline || ''
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
      updateProject({
        ...editingProject,
        title: projectForm.title,
        summary: projectForm.summary,
        description: projectForm.description,
        imageUrl: projectForm.imageUrl,
        demoUrl: projectForm.demoUrl,
        githubUrl: projectForm.githubUrl,
        category: projectForm.category,
        tags: tagArray,
        featured: projectForm.featured
      });
      setEditingProject(null);
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
      title: p.title,
      summary: p.summary,
      description: p.description || '',
      imageUrl: p.imageUrl,
      demoUrl: p.demoUrl || '',
      githubUrl: p.githubUrl || '',
      category: p.category,
      tags: p.tags.join(', '),
      featured: p.featured
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
    showToast('📥 导出的 JSON 数据已存至文件');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
      {/* Navigation Top Banner */}
      <div className="bg-amber-300 dark:bg-amber-400 border-4 border-black dark:border-white rounded-3xl p-5 md:p-6 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#38BDF8] mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-black text-yellow-300 rounded-xl flex items-center justify-center font-black shadow-[2.5px_2.5px_0px_0px_#000]">
            <Settings className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-black text-xl md:text-2xl text-black">
              {t.adminDashboard}
            </h1>
          </div>
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
            title={theme === 'dark' ? '切换至明亮模式' : '切换至暗黑模式'}
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
            title="返回前台"
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 bg-rose-400 text-black border-2 border-black px-3.5 py-2 rounded-xl text-xs font-black shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-rose-500 transition-colors"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span>{t.logoutButton}</span>
          </motion.button>
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
          <span>{t.tabSkills || '核心技术栈'} ({(data.techSkills || []).length})</span>
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
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'analytics'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-300 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t.tabAnalytics || '访客活跃热力图'}</span>
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
                  <label className="block text-xs font-black text-black uppercase mb-1">
                    {t.titleLabel}
                  </label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">
                    {t.locationLabel}
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">
                  {t.avatarLabel}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={profileForm.avatarUrl}
                    onChange={e => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                    className="flex-1 bg-zinc-50 border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                  />
                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, avatarUrl: DEFAULT_AVATAR_SVG })}
                    className="bg-cyan-200 text-black border-2 border-black px-3 py-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-cyan-300"
                  >
                    Preset SVG Avatar
                  </button>
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
                <label className="block text-xs font-black text-black uppercase mb-1">
                  {t.bioLabel}
                </label>
                <textarea
                  rows={3}
                  value={profileForm.bioLines.join('\n')}
                  onChange={e =>
                    setProfileForm({
                      ...profileForm,
                      bioLines: e.target.value.split('\n').filter(Boolean)
                    })
                  }
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
                    title="导出作品集为 PDF 离线文件"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>{isExportingPdf ? '正在生成 PDF...' : '导出作品集 PDF'}</span>
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

              {/* Project Editor Form Modal/Inline */}
              {isAddingProject && (
                <form
                  onSubmit={handleProjectSubmit}
                  className="bg-amber-50 border-3 border-black p-5 rounded-2xl shadow-[6px_6px_0px_0px_#000] flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm text-black">
                      {editingProject ? `${t.edit}: ${editingProject.title}` : `✨ ${t.add}`}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(false);
                        setEditingProject(null);
                      }}
                      className="text-xs font-bold text-zinc-600 hover:text-black"
                    >
                      {t.cancel}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black text-black uppercase mb-1">
                        {t.projectTitle}
                      </label>
                      <input
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full bg-white border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-black uppercase mb-1">
                        {t.projectCategory}
                      </label>
                      <input
                        type="text"
                        required
                        value={projectForm.category}
                        onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full bg-white border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-black uppercase mb-1">
                      {t.projectSummary}
                    </label>
                    <input
                      type="text"
                      required
                      value={projectForm.summary}
                      onChange={e => setProjectForm({ ...projectForm, summary: e.target.value })}
                      className="w-full bg-white border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-black uppercase mb-1">
                      {t.projectImageUrl}
                    </label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={projectForm.imageUrl}
                        onChange={e => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                        className="w-full bg-white border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold text-zinc-600">Preset SVG Covers:</span>
                        <button
                          type="button"
                          onClick={() => setProjectForm({ ...projectForm, imageUrl: PROJECT_1_SVG })}
                          className="bg-white border border-black px-2 py-0.5 rounded text-[10px] font-bold shadow-[1px_1px_0px_0px_#000]"
                        >
                          Cover 1
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectForm({ ...projectForm, imageUrl: PROJECT_2_SVG })}
                          className="bg-white border border-black px-2 py-0.5 rounded text-[10px] font-bold shadow-[1px_1px_0px_0px_#000]"
                        >
                          Cover 2
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectForm({ ...projectForm, imageUrl: PROJECT_3_SVG })}
                          className="bg-white border border-black px-2 py-0.5 rounded text-[10px] font-bold shadow-[1px_1px_0px_0px_#000]"
                        >
                          Cover 3
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black text-black uppercase mb-1">
                        {t.projectDemoUrl}
                      </label>
                      <input
                        type="text"
                        value={projectForm.demoUrl}
                        onChange={e => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                        className="w-full bg-white border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-black uppercase mb-1">
                        {t.projectGithubUrl}
                      </label>
                      <input
                        type="text"
                        value={projectForm.githubUrl}
                        onChange={e => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                        className="w-full bg-white border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-black uppercase mb-1">
                      {t.projectTags}
                    </label>
                    <input
                      type="text"
                      value={projectForm.tags}
                      onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })}
                      className="w-full bg-white border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
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
                    <label htmlFor="featured-check" className="text-xs font-black text-black cursor-pointer">
                      {t.projectFeatured}
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="bg-black text-yellow-300 border-2 border-black px-5 py-2 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000]"
                    >
                      {t.save}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(false);
                        setEditingProject(null);
                      }}
                      className="bg-white border-2 border-black px-4 py-2 rounded-xl text-xs font-black text-black"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </form>
              )}

              {/* Projects List */}
              <div className="flex flex-col gap-3">
                {data.projects.map(p => (
                  <div
                    key={p.id}
                    className="bg-white border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-zinc-100 border border-black rounded-lg overflow-hidden shrink-0">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-sm text-black">{p.title}</h5>
                          <span className="bg-cyan-200 text-black border border-black px-1.5 py-0.2 rounded text-[10px] font-bold">
                            {p.category}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-zinc-500 line-clamp-1">{p.summary}</p>
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
                    <span>{t.tabSkills || '核心技术栈与熟练度'}</span>
                    <span className="text-xs bg-black text-yellow-300 font-mono px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_0px_#000]">
                      {(data.techSkills || []).length} ITEMS
                    </span>
                  </h4>
                  <p className="text-xs font-bold text-zinc-600 mt-1">
                    配置首页展示的机甲风核心技术栈熟练度柱状图，实时映射实战评级与标签。
                  </p>
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
                      tagline: ''
                    });
                  }}
                  className="bg-amber-300 text-black border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:bg-amber-400 active:translate-y-0.5 flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t.addSkillBtn || '新增核心技能'}</span>
                </button>
              </div>

              {/* Skill Add/Edit Form */}
              {isAddingSkill && (
                <form
                  onSubmit={handleSkillSubmit}
                  className="bg-amber-50 border-3 border-black p-5 rounded-2xl shadow-[6px_6px_0px_0px_#000] flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between border-b-2 border-black/10 pb-2">
                    <h4 className="font-black text-sm text-black uppercase flex items-center gap-2 font-mono">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{editingSkill ? t.editSkillBtn || '编辑技能项' : t.addSkillBtn || '新增核心技能项'}</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-black uppercase mb-1">
                        {t.skillName || '技能名称'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={skillForm.name}
                        onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                        placeholder="e.g. React 19 & Next.js"
                        className="w-full bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase mb-1">
                        {t.skillCategory || '技能分类'}
                      </label>
                      <select
                        value={skillForm.category}
                        onChange={e => setSkillForm({ ...skillForm, category: e.target.value as any })}
                        className="w-full bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black"
                      >
                        <option value="frontend">Frontend (前端核心)</option>
                        <option value="backend">Backend (后端与接口)</option>
                        <option value="ai">AI System (AI 与智能体)</option>
                        <option value="architecture">Architecture (架构与性能)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-black text-black uppercase">
                          {t.skillLevel || '熟练度数值 (0 - 100%)'}
                        </label>
                        <span className="text-xs font-black font-mono text-black bg-yellow-300 border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                          {skillForm.level}% {skillForm.level >= 95 ? '(EX-RANK)' : skillForm.level >= 90 ? '(S-RANK)' : skillForm.level >= 85 ? '(A-RANK)' : '(B-RANK)'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white border-2 border-black p-2 rounded-xl shadow-[2px_2px_0px_0px_#000]">
                        <button
                          type="button"
                          onClick={() => setSkillForm({ ...skillForm, level: Math.max(0, skillForm.level - 5) })}
                          className="bg-zinc-100 hover:bg-amber-200 border border-black px-2.5 py-1 rounded-lg text-xs font-black transition-colors"
                        >
                          -5%
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={skillForm.level}
                          onChange={e => setSkillForm({ ...skillForm, level: Math.min(100, Math.max(0, Number(e.target.value))) })}
                          className="w-full bg-zinc-50 border border-black p-1.5 rounded-lg text-center text-xs font-black font-mono text-black"
                        />
                        <button
                          type="button"
                          onClick={() => setSkillForm({ ...skillForm, level: Math.min(100, skillForm.level + 5) })}
                          className="bg-zinc-100 hover:bg-amber-200 border border-black px-2.5 py-1 rounded-lg text-xs font-black transition-colors"
                        >
                          +5%
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase mb-1">
                        {t.skillExperience || '实战年限 (如 5 Yrs)'}
                      </label>
                      <input
                        type="text"
                        value={skillForm.experience || ''}
                        onChange={e => setSkillForm({ ...skillForm, experience: e.target.value })}
                        placeholder="e.g. 5 Yrs"
                        className="w-full bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-black uppercase mb-1">
                        {t.skillTagline || '亮点/实战描述标语'}
                      </label>
                      <input
                        type="text"
                        value={skillForm.tagline || ''}
                        onChange={e => setSkillForm({ ...skillForm, tagline: e.target.value })}
                        placeholder="e.g. 高并发组件架构 / Server Components"
                        className="w-full bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black"
                      />
                    </div>

                    {/* Anime Style Color Swatch Palette & Custom Picker */}
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-black text-black uppercase">
                          {t.skillColor || '主题代表色 (动漫风格选色板 & #HEX代码)'}
                        </label>
                        <span
                          className="text-[11px] font-black font-mono px-2.5 py-0.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]"
                          style={{ backgroundColor: skillForm.color, color: '#000' }}
                        >
                          {skillForm.color}
                        </span>
                      </div>

                      <div className="bg-white border-2 border-black p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_#000] flex flex-col gap-3">
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
                                className={`h-8 px-2.5 rounded-xl border-2 border-black font-black text-[10px] text-black shadow-[2px_2px_0px_0px_#000] transition-all hover:scale-105 flex items-center gap-1 cursor-pointer ${
                                  isSelected ? 'ring-2 ring-black scale-105' : 'opacity-90'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                                <span className="bg-white/85 px-1 py-0.2 rounded text-[9px] font-mono border border-black/30">
                                  {swatch.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom Hex Input & Native Color Trigger */}
                        <div className="flex items-center gap-2 pt-2 border-t-2 border-black/10">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-black text-xs text-black/60">
                              HEX #
                            </span>
                            <input
                              type="text"
                              value={skillForm.color}
                              onChange={e => setSkillForm({ ...skillForm, color: e.target.value })}
                              placeholder="#38BDF8"
                              className="w-full bg-zinc-50 border-2 border-black pl-14 pr-3 py-1.5 rounded-xl text-xs font-black font-mono text-black uppercase"
                            />
                          </div>

                          <label className="bg-amber-300 text-black border-2 border-black px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-amber-400 cursor-pointer flex items-center gap-1.5 shrink-0">
                            <Palette className="w-4 h-4 stroke-[2.5]" />
                            <span>二次元自由选色</span>
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

                  <div className="flex gap-2 pt-2 border-t border-black/10">
                    <button
                      type="submit"
                      className="bg-black text-yellow-300 border-2 border-black px-5 py-2 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:bg-zinc-800"
                    >
                      {t.save}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingSkill(false);
                        setEditingSkill(null);
                      }}
                      className="bg-white border-2 border-black px-4 py-2 rounded-xl text-xs font-black text-black shadow-[2px_2px_0px_0px_#000]"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </form>
              )}

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

                      {skill.tagline && (
                        <p className="text-[11px] font-bold text-zinc-600 line-clamp-1 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{skill.tagline}</span>
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-zinc-200 mt-1">
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

              {isAddingLink && (
                <form
                  onSubmit={handleLinkSubmit}
                  className="bg-amber-50 border-3 border-black p-5 rounded-2xl shadow-[6px_6px_0px_0px_#000] flex flex-col gap-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black text-black uppercase mb-1">
                        Link Name
                      </label>
                      <input
                        type="text"
                        required
                        value={linkForm.name}
                        onChange={e => setLinkForm({ ...linkForm, name: e.target.value })}
                        className="w-full bg-white border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-black uppercase mb-1">
                        URL Address
                      </label>
                      <input
                        type="text"
                        required
                        value={linkForm.url}
                        onChange={e => setLinkForm({ ...linkForm, url: e.target.value })}
                        className="w-full bg-white border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black text-black uppercase mb-1">
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
                        className="w-full bg-white border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
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
                      <label className="block text-[11px] font-black text-black uppercase mb-1">
                        Badge Text (Optional)
                      </label>
                      <input
                        type="text"
                        value={linkForm.badgeText}
                        onChange={e => setLinkForm({ ...linkForm, badgeText: e.target.value })}
                        className="w-full bg-white border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="bg-black text-yellow-300 border-2 border-black px-5 py-2 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000]"
                    >
                      {t.save}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingLink(false);
                        setEditingLink(null);
                      }}
                      className="bg-white border-2 border-black px-4 py-2 rounded-xl text-xs font-black text-black"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </form>
              )}

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
                <div className="flex items-center justify-between gap-3 border-b-2 border-black/10 pb-3">
                  <div>
                    <h4 className="font-black text-base text-black flex items-center gap-2">
                      <Globe className="w-5 h-5 text-black stroke-[2.5]" />
                      <span>网站标题 & Branding 标识设置 (Site Title, Logo & Icon)</span>
                    </h4>
                    <p className="text-xs font-bold text-zinc-800 mt-0.5">
                      配置网站顶部/浏览器标签页的网站标题、Logo 图片 URL 与 Icon / Favicon 图标。
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">
                    {t.siteTitleLabel}
                  </label>
                  <input
                    type="text"
                    value={profileForm.siteTitle || ''}
                    onChange={e => setProfileForm({ ...profileForm, siteTitle: e.target.value })}
                    placeholder="e.g. A1L 极客工程作品集 // MECHA CYBER PORTFOLIO"
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
                      {profileForm.logoUrl && (
                        <div className="w-10 h-10 bg-amber-300 border-2 border-black rounded-lg overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_#000]">
                          <img src={profileForm.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <input
                        type="text"
                        value={profileForm.logoUrl || ''}
                        onChange={e => setProfileForm({ ...profileForm, logoUrl: e.target.value })}
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
                      {profileForm.iconUrl && (
                        <div className="w-10 h-10 bg-cyan-300 border-2 border-black rounded-lg overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_#000]">
                          <img src={profileForm.iconUrl} alt="Icon Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <input
                        type="text"
                        value={profileForm.iconUrl || ''}
                        onChange={e => setProfileForm({ ...profileForm, iconUrl: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateProfile(profileForm);
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
                  <span>页脚与版权声明设置 (Copyright & Footer Settings)</span>
                </h4>
                <p className="text-xs font-bold text-zinc-800">
                  可在此处修改显示于网站页脚底部的版权所有声明、ICP 备案信息或系统提示字样。
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <div>
                    <label className="block text-[11px] font-black text-black uppercase mb-1">
                      {t.copyrightLabel}
                    </label>
                    <input
                      type="text"
                      value={profileForm.copyrightText || ''}
                      onChange={e => setProfileForm({ ...profileForm, copyrightText: e.target.value })}
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
                      value={profileForm.copyrightSubtext || ''}
                      onChange={e => setProfileForm({ ...profileForm, copyrightSubtext: e.target.value })}
                      placeholder="ICP 备案号 / 次要标语"
                      className="w-full bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateProfile(profileForm);
                  }}
                  className="self-start mt-2 bg-black text-yellow-300 border-2 border-black px-5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:bg-zinc-800 flex items-center gap-2"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>{t.save}</span>
                </button>
              </div>

              {/* 独立页脚外链管理模块 */}
              <div className="bg-emerald-50 border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black/10 pb-3">
                  <div>
                    <h4 className="font-black text-base text-black flex items-center gap-2">
                      <LinkIcon className="w-5 h-5 text-black stroke-[2.5]" />
                      <span>{t.footerLinksTabTitle}</span>
                    </h4>
                    <p className="text-xs font-bold text-zinc-700 mt-0.5">
                      独立配置显示于页脚处的链接（图标按钮）。可单独新增、修改或删除。
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingFooterLink(true);
                      setEditingFooterLink(null);
                      setFooterLinkForm({ name: '', url: '', iconType: 'github' });
                    }}
                    className="bg-emerald-300 text-black border-2 border-black px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-emerald-400 flex items-center gap-1.5 self-start sm:self-auto"
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
                          className="w-full bg-zinc-50 border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
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
                          className="w-full bg-zinc-50 border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-black uppercase mb-1">
                          {t.footerLinkIconType}
                        </label>
                        <select
                          value={footerLinkForm.iconType}
                          onChange={e => setFooterLinkForm({ ...footerLinkForm, iconType: e.target.value as any })}
                          className="w-full bg-zinc-50 border-2 border-black p-2 rounded-xl text-xs font-bold text-black"
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
                        className="bg-black text-yellow-300 border-2 border-black px-4 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000]"
                      >
                        {t.save}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingFooterLink(false);
                          setEditingFooterLink(null);
                        }}
                        className="bg-zinc-100 border-2 border-black px-3.5 py-1.5 rounded-xl text-xs font-black text-black"
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
                      className="bg-white border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center justify-between gap-3"
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
                          className="bg-amber-200 text-black border-1.5 border-black p-1.5 rounded-lg text-xs font-black hover:bg-amber-300 shadow-[1px_1px_0px_0px_#000]"
                          title={t.edit}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFooterLink(fl.id)}
                          className="bg-rose-200 text-rose-900 border-1.5 border-black p-1.5 rounded-lg text-xs font-black hover:bg-rose-300 shadow-[1px_1px_0px_0px_#000]"
                          title={t.delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-amber-100 border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col gap-2">
                <h4 className="font-black text-base text-black flex items-center gap-2">
                  <Download className="w-5 h-5 text-black stroke-[2.5]" />
                  <span>数据备份与导出 (JSON Export)</span>
                </h4>
                <p className="text-xs font-bold text-zinc-700">
                  一键备份包含个人资料、项目列表与社交外链在内的完整 JSON 格式数据。
                </p>
                <button
                  onClick={handleExportJSON}
                  className="self-start mt-2 bg-black text-yellow-300 border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[2.5px_2.5px_0px_0px_#FFE4E6] hover:bg-zinc-800"
                >
                  导出 JSON 备份
                </button>
              </div>

              <div className="bg-rose-100 border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col gap-2">
                <h4 className="font-black text-base text-rose-950 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-rose-900 stroke-[2.5]" />
                  <span>{t.resetDefault}</span>
                </h4>
                <p className="text-xs font-bold text-rose-900">
                  清理本地存储的自定义改动，恢复初始示例数据。
                </p>
                <button
                  onClick={resetToDefaultData}
                  className="self-start mt-2 bg-rose-600 text-white border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-rose-700"
                >
                  {t.resetDefault}
                </button>
              </div>

            </div>
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
                  <h4 className="font-black text-base text-black dark:text-white">确认退出登录？</h4>
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">退出后需要重新输入管理员口令以进入控制台</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-slate-800 text-black dark:text-white border-2 border-black dark:border-zinc-300 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-200 dark:hover:bg-slate-700 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    logoutAdmin();
                  }}
                  className="px-4 py-2 bg-rose-400 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-500 transition-colors"
                >
                  确定退出
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
