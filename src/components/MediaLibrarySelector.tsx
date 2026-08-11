import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageIcon, Upload, Loader2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { uploadToCloudinary, isCloudinaryConfigured } from '../lib/cloudinary';

export interface MediaPreset {
  name: string;
  url: string;
}

export interface MediaLibrarySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title: string;
  subtitle: string;
  presets?: MediaPreset[];
  showUpload?: boolean;
}

export const MediaLibrarySelector: React.FC<MediaLibrarySelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  title,
  subtitle,
  presets = [],
  showUpload = true
}) => {
  const { data, addMediaItem, showToast, t } = useApp();
  const [uploading, setUploading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
      // Demo fallback
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
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with fade-in and click outside to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal container with retro-neo-brutalism design and pop animation */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-yellow-50 dark:bg-slate-800 border-4 border-black dark:border-zinc-300 w-full max-w-2xl rounded-2xl p-6 shadow-[8px_8px_0px_0px_#000] relative z-10 flex flex-col max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-300 border-2 border-black rounded-lg">
                  <ImageIcon className="w-5 h-5 text-black" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wide">
                    {title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                    {subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                {showUpload && (
                  <label className={`cursor-pointer bg-lime-300 text-black border-2 border-black px-3 py-1.5 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-lime-400 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-1.5 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploading ? t.avatarUploadingBtn : t.avatarUploadBtn}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleMediaUpload} 
                      className="hidden" 
                      disabled={uploading}
                    />
                  </label>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Grid Content */}
            <div className="overflow-y-auto pr-1 flex-1 min-h-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-1">
                
                {/* Option 1: Render Custom Presets */}
                {presets.map((preset, index) => {
                  const isSvg = preset.url.startsWith('data:image/svg+xml');
                  return (
                    <button
                      key={`preset-${index}`}
                      type="button"
                      onClick={() => {
                        onSelect(preset.url);
                        onClose();
                        showToast(t.avatarDefaultLoadToast);
                      }}
                      className="aspect-square bg-zinc-100 dark:bg-slate-900 border-3 border-black dark:border-zinc-500 rounded-xl flex flex-col items-center justify-center gap-2.5 hover:bg-zinc-200 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all shadow-[4px_4px_0px_0px_#000]"
                    >
                      <div className="w-12 h-12 bg-zinc-200 dark:bg-slate-700 border-2 border-black rounded-xl flex items-center justify-center overflow-hidden">
                        {isSvg ? (
                          <div className="w-full h-full flex items-center justify-center text-xs font-black text-black dark:text-white bg-zinc-200 dark:bg-slate-700">
                            <img src={preset.url} className="w-full h-full object-cover" alt={preset.name} />
                          </div>
                        ) : (
                          <img src={preset.url} className="w-full h-full object-cover" alt={preset.name} />
                        )}
                      </div>
                      <span className="text-[11px] font-black text-zinc-700 dark:text-zinc-300 truncate max-w-[90%]">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}

                {/* Option 2: Render Media Items from Database */}
                {(data.mediaItems || []).map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item.url);
                      onClose();
                      showToast(`${t.avatarSelectedToast}: ${item.name}`);
                    }}
                    className="group aspect-square bg-white dark:bg-slate-900 border-3 border-black dark:border-zinc-500 rounded-xl overflow-hidden relative flex flex-col hover:scale-[1.02] active:scale-95 transition-all shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8]"
                    title={item.name}
                  >
                    {/* Thumbnail Wrapper */}
                    <div className="w-full h-full relative">
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Selection Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-black text-white bg-black/80 px-2.5 py-1.5 rounded border border-white/20">
                          {t.avatarChooseImage}
                        </span>
                      </div>
                    </div>
                    {/* Title Label */}
                    <div className="absolute bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 p-1.5 text-center">
                      <span className="text-[10px] font-black text-black dark:text-white block truncate">
                        {item.name}
                      </span>
                    </div>
                  </button>
                ))}

              </div>

              {/* Empty State inside Library selector */}
              {(!data.mediaItems || data.mediaItems.length === 0) && presets.length === 0 && (
                <div className="text-center py-12 bg-zinc-50 dark:bg-slate-900/40 border-2 border-black border-dashed rounded-xl">
                  <p className="text-xs font-bold text-zinc-500">{t.avatarEmptyLibrary}</p>
                  <p className="text-[10px] text-zinc-400 mt-1">{t.avatarEmptyLibraryHint}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 mt-4 flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500">
                {t.avatarTotalAssets}: {((data.mediaItems || []).length + presets.length)}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
