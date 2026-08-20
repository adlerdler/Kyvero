import React from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { FileDown, X, CheckCircle2, AlertCircle, RefreshCw, Sparkles, User, Mail, MapPin, Briefcase, Code2, FolderGit2, Check, ExternalLink } from 'lucide-react';
import { LanguageCode } from '../../types';
import { parseDescriptionSegments } from '../../utils/textUtils';

export const PdfExportModal: React.FC = () => {
  const {
    isPdfModalOpen,
    pdfExportProgress,
    pdfExportStatus,
    isPdfExporting,
    isPdfSuccess,
    pdfError,
    closePdfModal,
    startPdfExport,
    data,
    t,
    language,
    getProfileField,
    getProfileBioLines,
    getSkillTagline,
    getProjectTitle,
    getProjectSummary,
    getProjectCategory,
  } = useApp();

  if (!isPdfModalOpen) return null;

  const profile = data.profile;
  const bioLines = getProfileBioLines(profile.bioLines, language);
  const title = getProfileField(profile.title);
  const location = getProfileField(profile.location);

  const getLangField = (val: Record<LanguageCode, string> | string | undefined): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[language] || val['zh-CN'] || Object.values(val)[0] || '';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
        
        {/* Modal Backdrop overlay click to close */}
        <div 
          className="absolute inset-0" 
          onClick={closePdfModal} 
          aria-label="Close modal background"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-3 sm:border-4 border-black dark:border-zinc-200 rounded-2xl sm:rounded-3xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#38BDF8] p-4 sm:p-6 overflow-hidden text-black dark:text-zinc-100 z-10 flex flex-col max-h-[92vh]"
        >
          {/* Top Bar with Title and Manual Close Button */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-300 dark:bg-amber-400 border-2 border-black dark:border-zinc-200 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] text-black shrink-0">
                <FileDown className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg tracking-tight leading-none text-black dark:text-zinc-100">
                  {t.pdfExportModalTitle || '导出作品集 PDF 档案'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                  {t.pdfExportModalSubtitle || '实时预览可打印高清 A4 文本排版内容'}
                </p>
              </div>
            </div>

            {/* Manual Close Button */}
            <button
              onClick={closePdfModal}
              className="w-9 h-9 bg-zinc-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 border-2 border-black dark:border-zinc-300 rounded-xl flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] active:translate-x-[1px] active:translate-y-[1px] shrink-0"
              title="手动关闭窗口"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Real PDF Text Content Preview Container (Scrollable A4 Card view) */}
          <div className="flex-1 overflow-y-auto pr-1.5 mb-4 space-y-4 custom-scrollbar rounded-xl border-2 border-black dark:border-zinc-300 p-4 bg-zinc-50 dark:bg-slate-800/90 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.05)] text-left">
            
            {/* Stamp Badge & Header Preview */}
            <div className="relative pb-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-amber-300 text-[10px] font-black px-2 py-0.5 rounded border border-black uppercase tracking-wider">
                      CONFIDENTIAL DOSSIER
                    </span>
                    <h4 className="font-black text-lg sm:text-xl text-black dark:text-white">
                      {profile.name || 'Developer'}
                    </h4>
                  </div>
                  <p className="font-bold text-xs text-sky-600 dark:text-sky-400 mt-0.5">
                    {title || 'Full-Stack Software Engineer'}
                  </p>
                </div>

                <div className="text-right text-[10px] font-mono text-zinc-500 dark:text-zinc-400 leading-tight">
                  <div>FORMAT: A4 High-Res Vector</div>
                  <div>LANG: {language.toUpperCase()}</div>
                </div>
              </div>

              {/* Contact Information Bar */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-zinc-600 dark:text-zinc-300 font-medium bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-zinc-200 dark:border-slate-700">
                {profile.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-mono text-[11px]">{profile.email}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{location}</span>
                  </div>
                )}
                {profile.githubUrl && (
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span className="font-mono text-[11px] truncate max-w-[180px]">{profile.githubUrl}</span>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 1: Bio / Core Strengths Text */}
            {bioLines.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-black tracking-wide text-black dark:text-zinc-200 uppercase">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>个人优势与简介概要 (Bio & Core Strengths)</span>
                </div>
                <ul className="space-y-1.5 pl-2 text-xs text-zinc-700 dark:text-zinc-300">
                  {bioLines.map((line, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white dark:bg-slate-900/60 p-2 rounded border border-zinc-200 dark:border-slate-700/80 leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SECTION 2: Tech Skills Preview */}
            {data.techSkills && data.techSkills.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs font-black tracking-wide text-black dark:text-zinc-200 uppercase">
                  <Code2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>专业技术栈 (Technical Matrix)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {data.techSkills.map((skill) => {
                    const tag = getSkillTagline(skill.tagline, language);
                    return (
                      <div key={skill.id} className="bg-white dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-700 rounded-lg p-2 flex items-center justify-between gap-2">
                        <div>
                          <span className="font-black text-black dark:text-zinc-100">{skill.name}</span>
                          {tag && (
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]">
                              {tag}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-zinc-100 dark:bg-slate-800 border border-zinc-300 dark:border-slate-600 rounded text-sky-600 dark:text-sky-400">
                          {skill.proficiency}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 3: Work Experience Preview */}
            {data.experiences && data.experiences.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs font-black tracking-wide text-black dark:text-zinc-200 uppercase">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                  <span>职业经历 (Work Experience)</span>
                </div>
                <div className="space-y-2 text-xs">
                  {data.experiences.map((exp) => {
                    const company = getLangField(exp.company);
                    const role = getLangField(exp.role);
                    const desc = getLangField(exp.description);
                    return (
                      <div key={exp.id} className="bg-white dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-700 rounded-lg p-2.5 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-black dark:text-zinc-100">{role} @ <span className="text-emerald-600 dark:text-emerald-400">{company}</span></span>
                          <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                            {exp.startDate} - {exp.endDate}
                          </span>
                        </div>
                        {desc && (
                          <div className="space-y-1 pt-0.5">
                            {parseDescriptionSegments(desc).map((seg, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <span className="flex-1">{seg.replace(/^[•\-\*\>]\s*/, '')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 4: Projects Preview */}
            {data.projects && data.projects.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs font-black tracking-wide text-black dark:text-zinc-200 uppercase">
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>精选作品集 (Featured Projects)</span>
                </div>
                <div className="space-y-2 text-xs">
                  {data.projects.map((proj) => {
                    const pTitle = getProjectTitle(proj);
                    const pSummary = getProjectSummary(proj);
                    const pCat = getProjectCategory(proj);
                    return (
                      <div key={proj.id} className="bg-white dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-700 rounded-lg p-2.5">
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="text-black dark:text-zinc-100">{pTitle}</span>
                          <span className="text-[9px] uppercase font-black px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">
                            {pCat}
                          </span>
                        </div>
                        {pSummary && (
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-normal">
                            {pSummary}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Download Progress Bar Section */}
          <div className="mb-4 space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200">
                {isPdfExporting && <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-500" />}
                {isPdfSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {pdfError && <AlertCircle className="w-4 h-4 text-rose-500" />}
                <span>{pdfExportStatus || '准备生成 PDF 文件...'}</span>
              </span>
              <span className="font-mono text-sm font-black text-sky-600 dark:text-sky-400">
                {pdfExportProgress}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-4 sm:h-5 bg-zinc-200 dark:bg-slate-800 border-2 border-black dark:border-zinc-300 rounded-full overflow-hidden p-0.5 shadow-[inner_0px_2px_4px_rgba(0,0,0,0.1)] relative">
              <motion.div
                className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-amber-400 rounded-full transition-all duration-300 relative overflow-hidden"
                initial={{ width: '0%' }}
                animate={{ width: `${pdfExportProgress}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[stripe-move_1s_linear_infinite]" />
              </motion.div>
            </div>
          </div>

          {/* Success / Error Toast Message */}
          {isPdfSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-xl p-2.5 mb-3 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t.pdfExportModalDoneDesc || 'PDF 已成功处理并开始下载！如果未自动弹出下载提示，请尝试再次点击重新下载。'}</span>
            </div>
          )}

          {pdfError && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 rounded-xl p-2.5 mb-3 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2 shrink-0">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{pdfError}</span>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-end gap-3 pt-3 shrink-0">
            {isPdfExporting ? (
              <button
                onClick={closePdfModal}
                className="px-4 py-2 bg-zinc-200 dark:bg-slate-800 hover:bg-zinc-300 dark:hover:bg-slate-700 border-2 border-black dark:border-zinc-300 rounded-xl font-bold text-xs shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] transition-all"
              >
                后台生成并关闭弹窗
              </button>
            ) : (
              <>
                <button
                  onClick={startPdfExport}
                  className="px-4 py-2 bg-sky-400 hover:bg-sky-300 text-black border-2 border-black dark:border-zinc-200 rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{isPdfSuccess ? '重新生成导出' : '开始导出'}</span>
                </button>

                <button
                  onClick={closePdfModal}
                  className="px-5 py-2 bg-black dark:bg-zinc-100 text-amber-300 dark:text-black border-2 border-black dark:border-zinc-200 rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                >
                  {t.pdfExportModalClose || '手动关闭'}
                </button>
              </>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
