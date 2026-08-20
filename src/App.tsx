import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/frontend/Header';
import { MangaHero } from './components/frontend/MangaHero';
import { SkillProgressBar } from './components/frontend/SkillProgressBar';
import { ExperienceTimeline } from './components/frontend/ExperienceTimeline';
import { ProjectsGrid } from './components/frontend/ProjectsGrid';
import { BlogSocialSection } from './components/frontend/BlogSocialSection';
import { ProjectDetailModal } from './components/frontend/ProjectDetailModal';
import { PdfExportModal } from './components/frontend/PdfExportModal';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { GlobalAdminShortcutListener } from './components/GlobalAdminShortcutListener';
import { AnimeLoader } from './components/frontend/AnimeLoader';
import { VisitorCounter } from './components/frontend/VisitorCounter';
import { CyberContextMenu } from './components/frontend/CyberContextMenu';
import { Sparkles, Terminal, Shield, ChevronDown, Github, Twitter, Mail, Globe, Tv, Share2, ExternalLink, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function getFooterIcon(type: string, name?: string) {
  const key = `${type || ''} ${name || ''}`.toLowerCase();
  if (key.includes('github')) return <Github className="w-4 h-4 stroke-[2.5]" />;
  if (key.includes('twitter') || key.includes('x')) return <Twitter className="w-4 h-4 stroke-[2.5]" />;
  if (key.includes('email') || key.includes('mail')) return <Mail className="w-4 h-4 stroke-[2.5]" />;
  if (key.includes('blog') || key.includes('site') || key.includes('web')) return <Globe className="w-4 h-4 stroke-[2.5]" />;
  if (key.includes('bilibili') || key.includes('video') || key.includes('tv')) return <Tv className="w-4 h-4 stroke-[2.5]" />;
  return <Share2 className="w-4 h-4 stroke-[2.5]" />;
}

function MainLayout() {
  const { toastMessage, data, t, currentView, setCurrentView, isAdmin, getProfileField } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<number>(0);

  useEffect(() => {
    // Initial loading delay for anime startup sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update site title dynamically
    const config = data?.systemConfig;
    if (config?.siteTitle) {
      document.title = config.siteTitle;
    } else if (data?.profile?.siteTitle) {
      document.title = data.profile.siteTitle;
    } else if (data?.profile?.name) {
      const displayTitle = getProfileField(data.profile.title) || 'Portfolio';
      document.title = `${data.profile.name} - ${displayTitle}`;
    }

    // Update site icon/favicon dynamically
    const iconToUse = config?.iconUrl || data?.profile?.iconUrl;
    if (iconToUse) {
      let faviconLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'shortcut icon';
        document.head.appendChild(faviconLink);
      }
      faviconLink.href = iconToUse;
    }
  }, [data?.systemConfig, data?.profile?.siteTitle, data?.profile?.iconUrl, data?.profile?.name, data?.profile?.title]);

  const sections = [
    { id: 'section-hero', title: '01 / HERO', name: '个人主页' },
    { id: 'section-skills', title: '02 / SKILLS', name: '技能矩阵' },
    { id: 'section-projects', title: '03 / PROJECTS', name: '精选作品' },
    { id: 'section-social', title: '04 / CONNECT', name: '动态与社交' },
  ];

  const scrollToSection = (id: string, index: number) => {
    setActiveSection(index);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#090D16] text-black dark:text-zinc-100 font-sans selection:bg-amber-300 selection:text-black relative transition-colors duration-300">
      {/* Global Anime Style Loader */}
      <AnimeLoader isLoading={isLoading} />

      {/* Global Shortcut Listener */}
      <GlobalAdminShortcutListener />

      {/* Page Smooth Entrance wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 12 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {/* Header (仅在前台展示，使用吸顶毛玻璃效果) */}
        {currentView !== 'admin' && <Header />}

        {/* Main Content View Switcher */}
        <AnimatePresence mode="wait">
          {currentView === 'admin' ? (
            <motion.main
              key="admin-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="transition-all duration-300 flex-1"
            >
              {isAdmin ? <AdminDashboard /> : <AdminLoginPage />}
            </motion.main>
          ) : (
            <motion.main
              key="home-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-8 sm:space-y-12 md:space-y-16 transition-all duration-300 flex-1 relative"
            >
              {/* SECTION 1: MangaHero */}
              <section id="section-hero">
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ amount: 0.2, once: false }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <MangaHero />
                </motion.div>
              </section>

              {/* SECTION 2: SkillProgressBar */}
              <section id="section-skills">
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ amount: 0.2, once: false }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SkillProgressBar />
                </motion.div>
              </section>

              {/* SECTION 2.5: ExperienceTimeline */}
              <section id="section-experience">
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ amount: 0.2, once: false }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ExperienceTimeline />
                </motion.div>
              </section>

              {/* SECTION 3: ProjectsGrid */}
              <section id="section-projects">
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ amount: 0.15, once: false }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectsGrid />
                </motion.div>
              </section>

              {/* SECTION 4: BlogSocialSection */}
              <section id="section-social" className="space-y-10">
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ amount: 0.15, once: false }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <BlogSocialSection />
                </motion.div>

                {/* Footer Component */}
                <footer className="w-full pt-2 sm:pt-4">
                  <div className="bg-amber-100 dark:bg-slate-900 border-3 border-black dark:border-zinc-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] sm:dark:shadow-[6px_6px_0px_0px_#38BDF8] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5 transition-colors">
                    
                    {/* Left Info & Social Links Group */}
                    <div className="flex flex-col gap-2.5 sm:gap-3 w-full md:w-auto">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black text-yellow-300 rounded-xl flex items-center justify-center font-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
                          <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                        </div>
                        <div>
                          <p className="font-black text-xs sm:text-sm text-black dark:text-white">
                            {data.systemConfig?.siteTitle || data.profile.siteTitle || t.siteTitle || data.profile.name}
                          </p>
                        </div>
                      </div>

                      {/* Icon-Only Dedicated Footer Links (Configured in Footer Links Settings) */}
                      {(() => {
                        const linksToUse = data.footerLinks || [];
                        return linksToUse.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2">
                            {linksToUse.map(link => (
                              <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={link.name}
                                aria-label={link.name}
                                className="w-8 h-8 sm:w-8.5 sm:h-8.5 bg-white dark:bg-slate-800 border-2 border-black dark:border-zinc-300 rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] hover:bg-yellow-300 dark:hover:bg-amber-400 hover:scale-105 active:scale-95 text-black dark:text-zinc-100 transition-all flex items-center justify-center"
                              >
                                {getFooterIcon(link.iconType, link.name)}
                              </a>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Copyright Information */}
                      <div className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-bold text-zinc-600 dark:text-zinc-400 flex flex-wrap items-center gap-x-2 gap-y-0.5 leading-relaxed">
                        <span>{data.systemConfig?.copyrightText || data.profile.copyrightText || `© 2026 ${data.profile.name}. ${t.copyrightReserved}`}</span>
                        {(data.systemConfig?.copyrightSubtext || data.profile.copyrightSubtext) && (
                          <>
                            <span className="text-zinc-400 dark:text-zinc-600">•</span>
                            <span className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-500 font-mono">
                              {data.systemConfig?.copyrightSubtext || data.profile.copyrightSubtext}
                            </span>
                          </>
                        )}
                      </div>

                    </div>

                    {/* Right Action Zone */}
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 md:gap-4 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-black/10 dark:border-white/10 w-full md:w-auto justify-between md:justify-end">
                      <a 
                        href="https://github.com/adlerdler/Kyvero" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 opacity-60 hover:opacity-100 transition-opacity italic"
                      >
                        {t.poweredByKyvero}
                      </a>
                      <VisitorCounter />
                    </div>

                  </div>
                </footer>
              </section>
            </motion.main>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-black text-yellow-300 border-3 border-black dark:border-zinc-200 px-5 py-3 rounded-2xl font-black text-xs shadow-[5px_5px_0px_0px_#FFE4E6] dark:shadow-[5px_5px_0px_0px_#38BDF8] flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 fill-yellow-300 text-yellow-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      <ProjectDetailModal />

      {/* PDF Export Progress Modal */}
      <PdfExportModal />

      {/* Cyber Context Menu (Mobile Long Press & PC Left Click / Context Action) */}
      <CyberContextMenu />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

