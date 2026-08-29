import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { LANGUAGES, LanguageCode } from '../../i18n/languages';
import { FlagIcon } from '../shared/FlagIcon';
import { AdminTab } from '../../types';
import {
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  Share2,
  Image as ImageIcon,
  Activity,
  Settings,
  Languages,
  Moon,
  Sun,
  Home,
  ChevronDown,
  Key,
  LogOut,
  X,
  Save
} from 'lucide-react';

// Modular Tab Components
import { ProfileTab } from './tabs/ProfileTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { SkillsTab } from './tabs/SkillsTab';
import { ExperienceTab } from './tabs/ExperienceTab';
import { LinksTab } from './tabs/LinksTab';
import { MediaTab } from './tabs/MediaTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { SystemTab } from './tabs/SystemTab';
import { I18nTab } from './tabs/I18nTab';

export const AdminDashboard: React.FC = () => {
  const {
    data,
    t,
    theme,
    toggleTheme,
    language,
    setLanguage,
    logoutAdmin,
    currentUser,
    users,
    updatePassword,
    setCurrentView
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

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const adminUser = currentUser || (data?.users && data.users[0]) || users[0];
  const adminDisplayName = adminUser?.name === '超级管理员' ? t.superAdmin : (adminUser?.name || 'Admin');
  const adminDisplayRole = adminUser?.role === 'Administrator' ? t.adminRole : (adminUser?.role || 'Administrator');

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6" id="admin-dashboard-container">
      {/* Navigation Top Banner */}
      <div className="bg-amber-300 dark:bg-slate-800 border-2 border-black dark:border-zinc-700 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all" id="admin-top-banner">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-black dark:text-zinc-200 stroke-[2.5]" />
          <h1 className="font-black text-base md:text-lg text-black dark:text-zinc-200 uppercase tracking-wider">
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
                ? 'bg-slate-900 text-amber-300 border-black dark:border-zinc-500 shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black border-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-100'
            }`}
            title={theme === 'dark' ? t.switchToLightMode : t.switchToDarkMode}
            id="admin-theme-toggle"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 fill-amber-300 text-amber-300 stroke-[2]" />
            ) : (
              <Sun className="w-4 h-4 fill-amber-400 text-black stroke-[2.5]" />
            )}
          </motion.button>

          {/* Language Switcher Dropdown */}
          <div className="relative" id="admin-lang-switcher-dropdown">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 bg-white dark:bg-slate-900 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-500 p-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
              title={`${t.languageSelect} (${currentLangObj.name})`}
              id="admin-lang-button"
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
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border-2 border-black dark:border-zinc-500 rounded-xl shadow-[4px_4px_0px_0px_#000] py-1.5 z-50"
                  id="admin-lang-menu-list"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      id={`admin-lang-option-${lang.code}`}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between transition-colors ${
                        language === lang.code
                          ? 'bg-amber-200 dark:bg-amber-700 text-black dark:text-white font-extrabold'
                          : 'text-zinc-800 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-slate-700'
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
            className="p-2.5 bg-white dark:bg-slate-900 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-500 rounded-xl shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
            title={t.returnToSite}
            id="admin-return-home-btn"
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
          </motion.button>

          {/* User Avatar & Menu */}
          <div className="relative" id="admin-user-profile-menu">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-200 p-1.5 pr-3 rounded-xl shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_0px_#38BDF8] hover:bg-amber-100 dark:hover:bg-slate-800 transition-colors"
              title={dbt.userAvatarMenu}
              id="admin-user-menu-btn"
            >
              <img
                src={adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={adminDisplayName}
                className="w-7 h-7 rounded-lg object-cover border border-black dark:border-zinc-300 shrink-0"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-black text-black dark:text-white leading-tight">
                  {adminDisplayName}
                </p>
                <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 leading-tight">
                  @{adminUser?.username || 'admin'}
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
                  id="admin-user-menu-dropdown"
                >
                  <div className="px-2.5 py-2 bg-amber-50 dark:bg-slate-800 rounded-lg border border-black/10 dark:border-white/10 mb-0.5">
                    <p className="text-xs font-black text-black dark:text-white">
                      {adminDisplayName}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                      {adminDisplayRole}
                    </p>
                  </div>

                  <button
                    id="admin-menu-change-pw"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setShowChangePasswordModal(true);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs font-black rounded-lg flex items-center gap-2 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Key className="w-4 h-4 text-amber-500 stroke-[2.5]" />
                    <span>{dbt.changePassword}</span>
                  </button>

                  <button
                    id="admin-menu-logout"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs font-black rounded-lg flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500 stroke-[2.5]" />
                    <span>{dbt.logoutButton}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Standalone Console Navigation Tabs Row */}
      <div className="bg-transparent flex items-center gap-2 overflow-x-auto pb-2.5 mb-4 md:mb-6 scrollbar-none sm:flex-wrap transition-colors shrink-0" id="admin-tabs-row">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'profile'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black dark:border-zinc-500 shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-500 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
          id="tab-btn-profile"
        >
          <User className="w-4 h-4" />
          <span>{t.tabProfile}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'projects'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black dark:border-zinc-500 shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-500 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
          id="tab-btn-projects"
        >
          <FolderGit2 className="w-4 h-4" />
          <span>{t.tabProjects} ({(data.projects || []).length})</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'skills'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black dark:border-zinc-500 shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-500 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
          id="tab-btn-skills"
        >
          <Cpu className="w-4 h-4" />
          <span>{t.tabSkills} ({(data.techSkills || []).length})</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'experience'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black dark:border-zinc-500 shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-500 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
          id="tab-btn-experience"
        >
          <Briefcase className="w-4 h-4" />
          <span>{t.tabExperience} ({(data.experiences || []).length})</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'links'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black dark:border-zinc-500 shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-500 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
          id="tab-btn-links"
        >
          <Share2 className="w-4 h-4" />
          <span>{t.tabLinks} ({(data.socialLinks || []).length})</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'media'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black dark:border-zinc-500 shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-500 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
          id="tab-btn-media"
        >
          <ImageIcon className="w-4 h-4" />
          <span>{t.tabMedia} ({(data.mediaItems || []).length})</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black dark:border-zinc-500 shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-500 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
          id="tab-btn-analytics"
        >
          <Activity className="w-4 h-4" />
          <span>{t.tabAnalytics}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'system'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black dark:border-zinc-500 shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-500 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
          id="tab-btn-system"
        >
          <Settings className="w-4 h-4" />
          <span>{t.tabSystem}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('i18n')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'i18n'
              ? 'bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black dark:border-zinc-500 shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-500 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
          id="tab-btn-i18n"
        >
          <Languages className="w-4 h-4" />
          <span>{t.tabI18n}</span>
        </motion.button>
      </div>

      {/* Main Dashboard Panel Content Box */}
      <div className="bg-white dark:bg-slate-900 border-3 sm:border-4 border-black dark:border-zinc-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[6px_6px_0px_0px_#000] sm:shadow-[12px_12px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#38BDF8] sm:dark:shadow-[12px_12px_0px_0px_#38BDF8] overflow-hidden flex flex-col transition-colors" id="admin-panel-content-box">
        <div className="overflow-y-auto flex-grow bg-white dark:bg-slate-900">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'skills' && <SkillsTab />}
          {activeTab === 'experience' && <ExperienceTab />}
          {activeTab === 'links' && <LinksTab />}
          {activeTab === 'media' && <MediaTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'system' && <SystemTab />}
          {activeTab === 'i18n' && <I18nTab />}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" id="logout-confirm-modal">
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
                  id="logout-cancel-btn"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-slate-800 text-black dark:text-white border-2 border-black dark:border-zinc-300 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {dbt.cancelBtn}
                </button>
                <button
                  id="logout-confirm-btn"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="change-pw-modal-container">
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
              id="change-pw-backdrop"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border-4 border-black dark:border-zinc-200 rounded-3xl shadow-[12px_12px_0px_0px_#000] dark:shadow-[12px_12px_0px_0px_#38BDF8] overflow-hidden my-auto z-10"
              id="change-pw-modal-content"
            >
              <div className="bg-amber-300 dark:bg-amber-400 border-b-4 border-black p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black text-amber-300 rounded-lg flex items-center justify-center font-black">
                    <Key className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h3 className="font-black text-base text-black">
                    {dbt.changePasswordTitle}
                  </h3>
                </div>
                <button
                  id="change-pw-close-btn"
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
                id="change-pw-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (newPwInput !== confirmPwInput) {
                    setPwError(dbt.passwordsDoNotMatch);
                    return;
                  }
                  const res = await updatePassword(currentPwInput, newPwInput);
                  if (!res.success) {
                    let errorMsg = dbt.invalidPassword;
                    if (res.messageKey) {
                      errorMsg = dbt[res.messageKey as keyof typeof dbt];
                    }
                    setPwError(errorMsg);
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
                    {dbt.currentPassword}
                  </label>
                  <input
                    type="password"
                    required
                    id="current-pw-input"
                    value={currentPwInput}
                    onChange={e => {
                      setCurrentPwInput(e.target.value);
                      setPwError(null);
                    }}
                    placeholder={dbt.currentPasswordPlaceholder}
                    className="w-full bg-zinc-50 dark:bg-slate-950 border-3 border-black dark:border-zinc-200 p-3 rounded-xl text-sm font-black text-black dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1.5">
                    {dbt.newPassword}
                  </label>
                  <input
                    type="password"
                    required
                    id="new-pw-input"
                    value={newPwInput}
                    onChange={e => {
                      setNewPwInput(e.target.value);
                      setPwError(null);
                    }}
                    placeholder={dbt.newPasswordPlaceholder}
                    className="w-full bg-zinc-50 dark:bg-slate-950 border-3 border-black dark:border-zinc-200 p-3 rounded-xl text-sm font-black text-black dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black dark:text-zinc-200 uppercase mb-1.5">
                    {dbt.confirmPassword}
                  </label>
                  <input
                    type="password"
                    required
                    id="confirm-pw-input"
                    value={confirmPwInput}
                    onChange={e => {
                      setConfirmPwInput(e.target.value);
                      setPwError(null);
                    }}
                    placeholder={dbt.confirmPasswordPlaceholder}
                    className="w-full bg-zinc-50 dark:bg-slate-950 border-3 border-black dark:border-zinc-200 p-3 rounded-xl text-sm font-black text-black dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] focus:outline-none focus:border-amber-500"
                  />
                </div>

                {pwError && (
                  <div className="bg-rose-200 dark:bg-rose-950/80 border-2 border-black dark:border-rose-400 p-2.5 rounded-xl text-xs font-black text-rose-900 dark:text-rose-200 shadow-[2px_2px_0px_0px_#000]" id="change-pw-error-msg">
                    ⚠️ {pwError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    id="change-pw-cancel-btn"
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
                    id="change-pw-save-btn"
                    className="px-5 py-2.5 bg-amber-300 dark:bg-amber-400 text-black border-2 border-black dark:border-zinc-500 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] hover:bg-amber-400 dark:hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
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
