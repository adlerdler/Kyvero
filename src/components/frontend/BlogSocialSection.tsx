import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Github,
  Twitter,
  Tv,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Sparkles,
  Radio
} from 'lucide-react';
import { SocialLink } from '../../types';
import { motion } from 'motion/react';

export const BlogSocialSection: React.FC = () => {
  const { data, t, showToast } = useApp();
  const { socialLinks } = data;

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <Github className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />;
      case 'blog':
        return <BookOpen className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-sky-600 dark:text-sky-300 stroke-[2.5]" />;
      case 'bilibili':
        return <Tv className="w-5 h-5 text-rose-500 dark:text-rose-300 stroke-[2.5]" />;
      case 'email':
        return <Mail className="w-5 h-5 text-amber-600 dark:text-amber-300 stroke-[2.5]" />;
      default:
        return <Share2 className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />;
    }
  };

  const getChannelBadgeTheme = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-amber-300 text-black border-black dark:bg-amber-400';
      case 'github':
        return 'bg-zinc-800 text-white border-black dark:bg-zinc-200 dark:text-black';
      case 'twitter':
        return 'bg-sky-400 text-black border-black dark:bg-sky-300';
      case 'bilibili':
        return 'bg-rose-400 text-black border-black dark:bg-rose-300';
      case 'email':
        return 'bg-emerald-300 text-black border-black dark:bg-emerald-400';
      default:
        return 'bg-cyan-300 text-black border-black dark:bg-cyan-400';
    }
  };

  const handleCopy = (url: string, id: string, name: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast(`📋 ${t.copied}: ${name}`);
    setTimeout(() => {
      setCopiedId(prev => (prev === id ? null : prev));
    }, 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mt-8 mb-12"
    >
      {/* Same Parent Container Style as Project Section */}
      <div className="bg-white dark:bg-slate-900 border-3 border-black dark:border-zinc-200 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#38BDF8] relative overflow-hidden transition-colors">
        {/* Top manga corner badge */}
        <div className="absolute top-0 right-8 bg-black dark:bg-zinc-100 text-yellow-300 dark:text-black font-black text-[10px] tracking-wider px-3 py-1 rounded-b-xl border-x-2 border-b-2 border-black dark:border-zinc-200 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] flex items-center gap-1.5 uppercase font-mono">
          <Radio className="w-3 h-3 text-yellow-300 dark:text-black animate-pulse" />
          <span>{t.cyberCommChannels}</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-300 dark:bg-cyan-400 border-2 border-black rounded-xl flex items-center justify-center text-black font-black shadow-[3px_3px_0px_0px_#000]">
              <Share2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-black dark:text-white tracking-tight flex items-center gap-2 font-mono">
                <span>{t.blogAndLinksSection}</span>
                <span className="bg-amber-300 dark:bg-amber-400 text-black text-xs font-black px-2.5 py-0.5 rounded-full border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                  {socialLinks.length} {t.channelsLabel}
                </span>
              </h3>
            </div>
          </div>

          {/* Real-time Link Matrix Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-zinc-100 dark:bg-slate-800 border-2 border-black dark:border-zinc-300 px-3 py-1.5 rounded-2xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black font-mono text-black dark:text-zinc-200">
              {t.matrixStatusActive}
            </span>
          </div>
        </div>

        {/* Differentiated Cyber Comm Channel Strip Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-zinc-50 dark:bg-slate-950 border-2 border-black dark:border-zinc-300 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] animate-pulse flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 flex-1">
                  <div className="w-12 h-12 bg-zinc-200 dark:bg-slate-800 rounded-xl border-2 border-black shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="w-1/2 h-4 bg-zinc-200 dark:bg-slate-800 rounded border border-black" />
                    <div className="w-3/4 h-3 bg-zinc-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="w-20 h-8 bg-cyan-200 dark:bg-cyan-900 rounded-xl border border-black shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {socialLinks.map((link: SocialLink, index: number) => {
              const isCopied = copiedId === link.id;

              return (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className={`group relative bg-zinc-50 dark:bg-slate-950 border-2 border-black dark:border-zinc-200 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#38BDF8] transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    link.isPrimary ? 'ring-2 ring-amber-400/80 dark:ring-amber-400/50' : ''
                  }`}
                >
                {/* Left: Icon & Detail */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000] transition-transform group-hover:scale-105 ${getChannelBadgeTheme(link.type)}`}>
                    {getIcon(link.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h4 className="font-black text-sm md:text-base text-black dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors truncate">
                        {link.name}
                      </h4>

                      {link.isPrimary && (
                        <span className="bg-amber-300 dark:bg-amber-400 text-black border border-black px-1.5 py-0.2 text-[9px] font-black rounded shadow-[1px_1px_0px_0px_#000] flex items-center gap-1 shrink-0">
                          <Sparkles className="w-2.5 h-2.5 fill-black" />
                          <span>{t.recommendedLabel}</span>
                        </span>
                      )}

                      {link.badgeText && (
                        <span className="bg-cyan-200 dark:bg-cyan-400 text-black border border-black px-1.5 py-0.2 text-[9px] font-black rounded shadow-[1px_1px_0px_0px_#000] shrink-0">
                          {link.badgeText}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-mono font-extrabold text-zinc-500 dark:text-zinc-400 truncate max-w-[280px] sm:max-w-[240px] md:max-w-[280px]">
                      {link.url}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200 dark:border-zinc-800">
                  <motion.a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-black dark:bg-amber-400 text-white dark:text-black border-2 border-black px-3.5 py-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] hover:bg-zinc-800 dark:hover:bg-amber-300 transition-colors"
                  >
                    <span>{t.visitLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                  </motion.a>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCopy(link.url, link.id, link.name)}
                    className="bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black dark:border-zinc-300 p-2 rounded-xl shadow-[2px_2px_0px_0px_#000] hover:bg-amber-200 dark:hover:bg-slate-700 transition-colors"
                    title={t.copyLink || '复制链接'}
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                    ) : (
                      <Copy className="w-4 h-4 text-black dark:text-white stroke-[2.5]" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
    </motion.section>
  );
};

