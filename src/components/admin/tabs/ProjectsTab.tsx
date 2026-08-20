import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { AnimatePresence, motion } from 'motion/react';
import { X, ImageIcon, Download, Plus, Edit2, Trash2 } from 'lucide-react';
import { Project, LanguageCode } from '../../../types';
import { MediaLibrarySelector } from '../MediaLibrarySelector';
import { translateTextWithDeepL } from '../../../utils/deepl';

const PROJECT_1_SVG = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800';
const PROJECT_2_SVG = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800';
const PROJECT_3_SVG = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800';

export const ProjectsTab: React.FC = () => {
  const {
    data,
    t,
    language,
    addProject,
    updateProject,
    deleteProject,
    getProjectTitle,
    getProjectSummary,
    getProjectDescription,
    getProjectCategory,
    showToast,
    startPdfExport,
    isPdfExporting
  } = useApp();

  const dbt = t;

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectMediaSelector, setShowProjectMediaSelector] = useState(false);

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

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const processFieldTranslations = async (currentVal: string, existingObj: any) => {
      const sourceText = currentVal?.trim() || '';
      if (!sourceText) return { 'zh-CN': '', 'zh-TW': '', 'en': '', 'ja': '', 'ko': '' };

      const existingMap: Record<string, string> =
        typeof existingObj === 'object' && existingObj !== null ? existingObj : {};

      const targetLangs: LanguageCode[] = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko'];

      // Check if text is unchanged and all target languages are already present
      const savedSourceText = (existingMap[language] || '').trim();
      const isUnchanged = savedSourceText === sourceText;
      const hasAllLangs = targetLangs.every(lang => existingMap[lang] && existingMap[lang].trim() !== '');

      if (isUnchanged && hasAllLangs) {
        return existingMap;
      }

      try {
        const translated = await translateTextWithDeepL(sourceText, language);
        const result: Record<string, string> = {
          ...existingMap,
          [language]: sourceText,
        };

        for (const lang of targetLangs) {
          if (lang === language) {
            result[lang] = sourceText;
          } else if (translated[lang]) {
            result[lang] = translated[lang];
          } else if (existingMap[lang]) {
            result[lang] = existingMap[lang];
          }
        }
        return result;
      } catch (err) {
        console.warn('Auto translation failed:', err);
        return {
          ...existingMap,
          [language]: sourceText
        };
      }
    };

    const finalTitle = await processFieldTranslations(projectForm.title, editingProject?.title);
    const finalSummary = await processFieldTranslations(projectForm.summary, editingProject?.summary);
    const finalDescription = await processFieldTranslations(projectForm.description, editingProject?.description);
    const finalCategory = await processFieldTranslations(projectForm.category, editingProject?.category);

    const tagArray = projectForm.tags
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingProject) {
      updateProject({
        ...editingProject,
        title: finalTitle,
        summary: finalSummary,
        description: finalDescription,
        imageUrl: projectForm.imageUrl,
        demoUrl: projectForm.demoUrl,
        githubUrl: projectForm.githubUrl,
        category: finalCategory,
        tags: tagArray,
        featured: projectForm.featured
      });
      setEditingProject(null);
      setIsAddingProject(false);
    } else {
      addProject({
        title: finalTitle,
        summary: finalSummary,
        description: finalDescription,
        imageUrl: projectForm.imageUrl || PROJECT_1_SVG,
        demoUrl: projectForm.demoUrl,
        githubUrl: projectForm.githubUrl,
        category: finalCategory,
        tags: tagArray,
        featured: projectForm.featured
      });
      setIsAddingProject(false);
    }

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

  return (
    <div className="flex flex-col gap-6">
      {/* Header Action */}
      <div className="flex items-center justify-between bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-3 rounded-2xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8]">
        <h4 className="font-black text-sm text-black dark:text-zinc-200">
          {t.projectsSection} ({data.projects.length})
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => startPdfExport()}
            disabled={isPdfExporting}
            className="bg-amber-300 dark:bg-amber-400 text-black border-2 border-black dark:border-zinc-200 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] hover:bg-amber-400 dark:hover:bg-amber-300 disabled:opacity-50 flex items-center gap-1.5 transition-all"
            title={t.pdfExportTitle}
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isPdfExporting ? dbt.pdfExportingBtn : dbt.exportPdfBtn}</span>
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
            className="bg-emerald-300 dark:bg-emerald-500 text-black border-2 border-black dark:border-zinc-200 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] hover:bg-emerald-400 dark:hover:bg-emerald-400 flex items-center gap-1.5"
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
            className="bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-4 rounded-2xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-zinc-100 dark:bg-slate-800 border border-black dark:border-zinc-500 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={getProjectTitle(p)} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-zinc-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-black text-sm text-black dark:text-zinc-200">{getProjectTitle(p)}</h5>
                  <span className="bg-cyan-200 dark:bg-cyan-600 text-black dark:text-white border border-black dark:border-zinc-500 px-1.5 py-0.2 rounded text-[10px] font-bold">
                    {getProjectCategory(p)}
                  </span>
                </div>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 line-clamp-1">{getProjectSummary(p)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => startEditProject(p)}
                className="bg-amber-200 dark:bg-amber-600 text-black dark:text-white border-2 border-black dark:border-zinc-500 p-2 rounded-xl text-xs font-black hover:bg-amber-300 dark:hover:bg-amber-500 shadow-[1.5px_1.5px_0px_0px_#000]"
                title={t.edit}
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => deleteProject(p.id)}
                className="bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 border-2 border-black dark:border-zinc-500 p-2 rounded-xl text-xs font-black hover:bg-rose-300 dark:hover:bg-rose-700 shadow-[1.5px_1.5px_0px_0px_#000]"
                title={t.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
