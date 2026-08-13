import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { SocialLink } from '../../../types';

export const LinksTab: React.FC = () => {
  const {
    data,
    t,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink
  } = useApp();

  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [linkForm, setLinkForm] = useState({
    name: '',
    url: '',
    type: 'github' as SocialLink['type'],
    iconName: 'Github',
    badgeText: '',
    isPrimary: false
  });

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-zinc-50 dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-3 rounded-2xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8]">
        <h4 className="font-black text-sm text-black dark:text-zinc-200">
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
          className="bg-emerald-300 dark:bg-emerald-500 text-black border-2 border-black dark:border-zinc-500 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] hover:bg-emerald-400 dark:hover:bg-emerald-400 flex items-center gap-1.5"
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
            className="bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] flex items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-slate-800"
          >
            <div>
              <h5 className="font-black text-sm text-black dark:text-zinc-200 flex items-center gap-2">
                {l.name}
                <span className="bg-amber-200 dark:bg-amber-600 border border-black dark:border-zinc-600 px-1.5 py-0.2 rounded text-[10px] font-bold text-black dark:text-zinc-100">
                  {l.type}
                </span>
              </h5>
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{l.url}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => startEditLink(l)}
                className="bg-amber-200 dark:bg-amber-600 text-black dark:text-zinc-100 border-2 border-black dark:border-zinc-500 p-2 rounded-xl text-xs font-black hover:bg-amber-300 dark:hover:bg-amber-500 shadow-[1.5px_1.5px_0px_0px_#000]"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteSocialLink(l.id)}
                className="bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 border-2 border-black dark:border-zinc-500 p-2 rounded-xl text-xs font-black hover:bg-rose-300 dark:hover:bg-rose-700 shadow-[1.5px_1.5px_0px_0px_#000]"
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
