import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Zap, ExternalLink, Sparkles, MessageSquare, Code2, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const MangaHero: React.FC = () => {
  const { data, t, language, getProfileBioLines, getProfileField } = useApp();
  const { profile } = data;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.section
      className="mb-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-zinc-200 rounded-2xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#38BDF8] p-6 md:p-8 relative overflow-hidden transition-colors">
        
        {/* Background Manga Pattern Accent with subtle pulse animation */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-64 h-64 bg-amber-100 dark:bg-amber-500/10 rounded-full blur-3xl opacity-40 pointer-events-none -mr-20 -mt-20"
        ></motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Avatar & Status Badge Frame */}
          <motion.div variants={itemVariants} className="md:col-span-5 lg:col-span-4 flex flex-col items-center">
            
            {/* Anime Avatar Box */}
            <div className="relative group w-48 h-48 md:w-56 md:h-56">
              {/* Offset Frame */}
              <div className="absolute inset-0 bg-sky-200 dark:bg-cyan-500 rounded-2xl border-3 border-black dark:border-zinc-200 translate-x-3 translate-y-3 shadow-[4px_4px_0px_0px_#000]"></div>
              
              <motion.div
                whileHover={{ y: -4, x: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-full h-full bg-white dark:bg-slate-950 border-3 border-black dark:border-zinc-200 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#000]"
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Status Tag Overlay with gentle floating animation */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-3 inset-x-2 bg-yellow-300 dark:bg-amber-400 border-2 border-black rounded-lg px-2.5 py-1 text-center shadow-[2px_2px_0px_0px_#000]"
              >
                <span className="font-extrabold text-[11px] text-black tracking-tight flex items-center justify-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-black text-black" />
                  {profile.statusText}
                </span>
              </motion.div>
            </div>

            {/* Location Tag */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mt-6 flex items-center gap-1.5 bg-zinc-100 dark:bg-slate-800 border-2 border-black dark:border-zinc-300 px-3 py-1 rounded-full text-xs font-bold text-black dark:text-zinc-200 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] cursor-default"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />
              <span>{getProfileField(profile.location)}</span>
            </motion.div>

          </motion.div>

          {/* Right Column: Manga Speech Quote, Name, Bio, Skills */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-4">
            
            {/* Manga Speech Bubble Motto */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="relative bg-amber-100 dark:bg-slate-800 border-3 border-black dark:border-zinc-200 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] transition-colors"
            >
              {/* Speech bubble arrow pointer */}
              <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-[12px] border-r-black dark:border-r-zinc-200"></div>
              <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-[10px] border-r-amber-100 dark:border-r-slate-800"></div>

              <p className="font-black text-sm md:text-base text-black dark:text-amber-300 flex items-center gap-2 italic">
                <MessageSquare className="w-5 h-5 text-black dark:text-amber-300 shrink-0 stroke-[2.5]" />
                <span>{getProfileField(profile.speechBubbleText)}</span>
              </p>
            </motion.div>

            {/* Main Name & Titles */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1.5 mt-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter uppercase font-mono">
                  {profile.name}
                </h2>
                <motion.span
                  whileHover={{ rotate: [-1, 2, -1, 0] }}
                  className="bg-cyan-300 dark:bg-cyan-400 text-black border-2 border-black px-3 py-1 rounded-lg text-xs font-black shadow-[2.5px_2.5px_0px_0px_#000] tracking-wide"
                >
                  {profile.alias}
                </motion.span>
              </div>
              <p className="text-sm md:text-base font-extrabold text-zinc-800 dark:text-zinc-200">
                {getProfileField(profile.title)}
              </p>
            </motion.div>

            {/* Multiline Bio Cards */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2 mt-1">
              {getProfileBioLines(profile.bioLines, language).map((line, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="bg-zinc-50 dark:bg-slate-950 border-2 border-black dark:border-zinc-300 p-3 rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] flex items-start gap-2.5 text-xs md:text-sm font-extrabold text-zinc-900 dark:text-zinc-100 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-300 shrink-0 mt-0.5" />
                  <span>{line}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Tech Stack Badges */}
            <motion.div variants={itemVariants} className="mt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-black dark:text-amber-300 stroke-[2.5]" />
                <span className="text-xs font-black text-black dark:text-zinc-200 uppercase tracking-wider">
                  {t.techStack}
                </span>
                <span className="bg-cyan-300 dark:bg-cyan-400 text-black text-[10px] font-black px-1.5 py-0.5 border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                  SPECS!
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white dark:bg-slate-800 border-2 border-black dark:border-zinc-300 px-3 py-1 rounded-lg text-xs font-black text-black dark:text-zinc-100 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] transition-colors cursor-default"
                  >
                    #{skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Primary Action Links */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mt-3">
              {profile.blogUrl && (
                <motion.a
                  href={profile.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, x: 1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-black text-white border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#FEF08A] hover:bg-zinc-800 transition-colors"
                >
                  <span>{t.readArticle}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.a>
              )}

              {profile.githubUrl && (
                <motion.a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, x: 1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-emerald-300 text-black border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:bg-emerald-400 transition-colors"
                >
                  <span>{t.viewGithub}</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              )}
            </motion.div>

          </div>

        </div>

      </div>
    </motion.section>
  );
};
