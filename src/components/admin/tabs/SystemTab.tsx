import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Globe, Shield, Plus, Save, Trash2, Edit2, Database, Loader2, RefreshCw, Download,
  Github, Twitter, Mail, Tv, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { getSupabaseCredentials, saveCustomSupabaseConfig, testSupabaseConnection, isSupabaseConfigured } from '../../../lib/supabase';
import { fetchAllSiteDataFromSupabase } from '../../../services/supabaseService';
import { MediaLibrarySelector } from '../MediaLibrarySelector';
import { FooterLink, SystemConfig } from '../../../types';

export const SystemTab: React.FC = () => {
  const {
    data,
    t,
    updateSystemConfig,
    addFooterLink,
    updateFooterLink,
    deleteFooterLink,
    showToast
  } = useApp();

  const dbt = t;

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

  // Media Library Selectors
  const [showLogoMediaSelector, setShowLogoMediaSelector] = useState(false);
  const [showIconMediaSelector, setShowIconMediaSelector] = useState(false);

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

  return (
    <div className="flex flex-col gap-6">

      {/* Site Branding & Title Settings Block */}
      <div className="bg-amber-100 dark:bg-amber-950/30 border-3 border-black dark:border-zinc-500 p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 pb-1">
          <h4 className="font-black text-base text-black dark:text-zinc-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-black dark:text-zinc-300 stroke-[2.5]" />
            <span>{dbt.systemBrandingTitle}</span>
          </h4>
        </div>

        <div>
          <label className="block text-xs font-black text-black dark:text-zinc-300 uppercase mb-1">
            {t.siteTitleLabel}
          </label>
          <input
            type="text"
            value={systemForm.siteTitle || ''}
            onChange={e => setSystemForm({ ...systemForm, siteTitle: e.target.value })}
            placeholder={dbt.systemBrandingPlaceholder}
            className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white shadow-[2px_2px_0px_0px_#000]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Logo Image URL */}
          <div>
            <label className="block text-xs font-black text-black dark:text-zinc-300 uppercase mb-1">
              {t.logoUrlLabel}
            </label>
            <div className="flex gap-2 items-center">
              <div 
                onClick={() => setShowLogoMediaSelector(true)}
                className="w-10 h-10 bg-amber-300 dark:bg-amber-500 border-2 border-black dark:border-zinc-500 rounded-lg overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] cursor-pointer hover:scale-[1.05] transition-transform active:scale-95 flex items-center justify-center"
                title={t.avatarSelectFromMedia}
              >
                {systemForm.logoUrl ? (
                  <img src={systemForm.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-black dark:text-zinc-900" />
                )}
              </div>
              <input
                type="text"
                value={systemForm.logoUrl || ''}
                onChange={e => setSystemForm({ ...systemForm, logoUrl: e.target.value })}
                placeholder="https://..."
                className="flex-1 bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          {/* Icon / Favicon URL */}
          <div>
            <label className="block text-xs font-black text-black dark:text-zinc-300 uppercase mb-1">
              {t.iconUrlLabel}
            </label>
            <div className="flex gap-2 items-center">
              <div 
                onClick={() => setShowIconMediaSelector(true)}
                className="w-10 h-10 bg-cyan-300 dark:bg-cyan-500 border-2 border-black dark:border-zinc-500 rounded-lg overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] cursor-pointer hover:scale-[1.05] transition-transform active:scale-95 flex items-center justify-center"
                title={t.avatarSelectFromMedia}
              >
                {systemForm.iconUrl ? (
                  <img src={systemForm.iconUrl} alt="Icon Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-black dark:text-zinc-900" />
                )}
              </div>
              <input
                type="text"
                value={systemForm.iconUrl || ''}
                onChange={e => setSystemForm({ ...systemForm, iconUrl: e.target.value })}
                placeholder="https://..."
                className="flex-1 bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white shadow-[2px_2px_0px_0px_#000]"
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
          className="self-start mt-1 bg-black text-yellow-300 dark:bg-amber-400 dark:text-black border-2 border-black dark:border-zinc-200 px-5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] hover:bg-zinc-800 dark:hover:bg-amber-300 flex items-center gap-2 transition-all active:scale-95"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>{t.save}</span>
        </button>
      </div>
      
      {/* Footer & Copyright Settings Block */}
      <div className="bg-cyan-100 dark:bg-cyan-950/30 border-3 border-black dark:border-zinc-500 p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] flex flex-col gap-3">
        <h4 className="font-black text-base text-black dark:text-zinc-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-black dark:text-zinc-300 stroke-[2.5]" />
          <span>{dbt.systemCopyrightTitle}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
          <div>
            <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
              {t.copyrightLabel}
            </label>
            <input
              type="text"
              value={systemForm.copyrightText || ''}
              onChange={e => setSystemForm({ ...systemForm, copyrightText: e.target.value })}
              placeholder="© 2026 Kaito Lin. All rights reserved."
              className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
              {t.copyrightSubtextLabel}
            </label>
            <input
              type="text"
              value={systemForm.copyrightSubtext || ''}
              onChange={e => setSystemForm({ ...systemForm, copyrightSubtext: e.target.value })}
              placeholder={dbt.systemSecondaryFooterPlaceholder}
              className="w-full bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-2.5 rounded-xl text-xs font-bold text-black dark:text-white shadow-[2px_2px_0px_0px_#000]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            updateSystemConfig(systemForm);
          }}
          className="self-start mt-2 bg-black text-yellow-300 dark:bg-amber-400 dark:text-black border-2 border-black dark:border-zinc-200 px-5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] hover:bg-zinc-800 dark:hover:bg-amber-300 flex items-center gap-2 transition-all active:scale-95"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>{t.save}</span>
        </button>
      </div>

      {/* 页脚独立外链管理模块 */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border-3 border-black dark:border-zinc-500 p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] flex flex-col gap-4 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <h4 className="font-black text-base text-black dark:text-zinc-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.footerLinksTabTitle}</span>
          </h4>
          <button
            type="button"
            onClick={() => {
              setIsAddingFooterLink(true);
              setEditingFooterLink(null);
              setFooterLinkForm({ name: '', url: '', iconType: 'github' });
            }}
            className="bg-emerald-300 dark:bg-emerald-500 text-black dark:text-white border-2 border-black dark:border-zinc-200 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] hover:bg-emerald-400 dark:hover:bg-emerald-400 flex items-center gap-1.5 self-start sm:self-auto transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.addFooterLinkBtn}</span>
          </button>
        </div>

        {/* 表单（新增/修改） */}
        {isAddingFooterLink && (
          <form
            onSubmit={handleFooterLinkSubmit}
            className="bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-4 rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] flex flex-col gap-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                  {t.footerLinkName}
                </label>
                <input
                  type="text"
                  required
                  value={footerLinkForm.name}
                  onChange={e => setFooterLinkForm({ ...footerLinkForm, name: e.target.value })}
                  placeholder="e.g. GitHub"
                  className="w-full bg-zinc-50 dark:bg-slate-950 border-2 border-black dark:border-zinc-500 p-2 rounded-xl text-xs font-bold text-black dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                  {t.footerLinkUrl}
                </label>
                <input
                  type="text"
                  required
                  value={footerLinkForm.url}
                  onChange={e => setFooterLinkForm({ ...footerLinkForm, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-zinc-50 dark:bg-slate-950 border-2 border-black dark:border-zinc-500 p-2 rounded-xl text-xs font-bold text-black dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-black dark:text-zinc-300 uppercase mb-1">
                  {t.footerLinkIconType}
                </label>
                <select
                  value={footerLinkForm.iconType}
                  onChange={e => setFooterLinkForm({ ...footerLinkForm, iconType: e.target.value as any })}
                  className="w-full bg-zinc-50 dark:bg-slate-950 border-2 border-black dark:border-zinc-500 p-2 rounded-xl text-xs font-bold text-black dark:text-white focus:outline-none"
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
              className="bg-white dark:bg-slate-900 border-2 border-black dark:border-zinc-500 p-3 rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] flex items-center justify-between gap-3 hover:shadow-[3px_3px_0px_0px_#000] transition-shadow"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 bg-black dark:bg-slate-800 text-yellow-300 dark:text-white rounded-lg flex items-center justify-center font-black shrink-0">
                  {fl.iconType === 'github' && <Github className="w-4 h-4" />}
                  {fl.iconType === 'twitter' && <Twitter className="w-4 h-4" />}
                  {fl.iconType === 'email' && <Mail className="w-4 h-4" />}
                  {fl.iconType === 'blog' && <Globe className="w-4 h-4" />}
                  {fl.iconType === 'bilibili' && <Tv className="w-4 h-4" />}
                  {fl.iconType === 'other' && <ExternalLink className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <h5 className="font-black text-xs text-black dark:text-zinc-200 truncate">{fl.name}</h5>
                  <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{fl.url}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => startEditFooterLink(fl)}
                  className="bg-amber-200 dark:bg-amber-600 text-black dark:text-zinc-100 border-1.5 border-black dark:border-zinc-500 p-1.5 rounded-lg text-xs font-black hover:bg-amber-300 dark:hover:bg-amber-500 shadow-[1px_1px_0px_0px_#000] transition-transform active:scale-95"
                  title={t.edit}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteFooterLink(fl.id)}
                  className="bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 border-1.5 border-black dark:border-zinc-500 p-1.5 rounded-lg text-xs font-black hover:bg-rose-300 dark:hover:bg-rose-700 shadow-[1px_1px_0px_0px_#000] transition-transform active:scale-95"
                  title={t.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {(data.footerLinks || []).length === 0 && (
            <div className="col-span-full py-6 text-center text-zinc-500 dark:text-zinc-400 text-xs font-bold bg-white/50 dark:bg-slate-900/50 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
              暂无页脚独立外链 / No links available
            </div>
          )}
        </div>
      </div>

      {/* Supabase 云端数据库配置 */}
      <div className="bg-amber-100 dark:bg-slate-800 border-3 border-black dark:border-zinc-500 p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] flex flex-col gap-4">
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
            className="bg-black text-yellow-300 dark:bg-amber-400 dark:text-black border-2 border-black dark:border-zinc-200 px-5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8] hover:bg-zinc-800 dark:hover:bg-amber-300 flex items-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
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
            className="bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-zinc-500 px-4 py-2.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#38BDF8] hover:bg-zinc-100 dark:hover:bg-slate-800 flex items-center gap-2 active:scale-95 transition-transform"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>从 Supabase 重新拉取云端全站数据</span>
          </button>
        </div>
      </div>

    </div>
  );
};
