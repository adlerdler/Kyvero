import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Image as ImageIcon, Upload, Trash2 } from 'lucide-react';
import { uploadToCloudinary, isCloudinaryConfigured, isSignedConfigured, deleteFromCloudinary } from '../../../lib/cloudinary';

export const MediaTab: React.FC = () => {
  const {
    data,
    t,
    addMediaItem,
    deleteMediaItem,
    updateProfile,
    showToast
  } = useApp();

  const dbt = t;

  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null);
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    setMediaUploadError(null);

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
      const sandboxImages = [
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1541562232579-512a21360020?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60'
      ];
      const randomUrl = sandboxImages[Math.floor(Math.random() * sandboxImages.length)];
      
      addMediaItem({
        name: `${file.name.replace(/\.[^/.]+$/, "")} ${t.demoSimulationTag}`,
        url: randomUrl,
        size: sizeStr
      });
      
      showToast(t.demoImageLoadedToast);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleMediaDelete = async (id: string, url: string) => {
    setDeletingMediaId(id);
    try {
      const isCloudinary = url.includes('res.cloudinary.com');
      if (isCloudinary) {
        showToast(t.mediaDestroyRequestToast);
        const released = await deleteFromCloudinary(url);
        if (released) {
          showToast(t.mediaCloudReleasedToast);
        } else {
          showToast(t.mediaCloudPartialReleasedToast);
        }
      } else {
        showToast(t.mediaLocalDemoRemovedToast);
      }
      deleteMediaItem(id);
    } catch (err) {
      console.error(err);
      showToast(t.mediaPhysicalDeleteFailedToast);
      deleteMediaItem(id);
    } finally {
      setDeletingMediaId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Media Status and Configuration Summary */}
      <div className="bg-lime-50 dark:bg-slate-800 border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-black text-base text-black dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />
            <span>{dbt.mediaTitle}</span>
          </h4>
        </div>
        <div className="bg-white dark:bg-slate-900 border-2 border-black px-3 py-1.5 rounded-lg text-[10px] font-black shadow-[2px_2px_0px_0px_#000] text-black dark:text-white">
          {isSignedConfigured 
            ? `🟢 ${dbt.mediaStatusSigned}` 
            : isCloudinaryConfigured 
              ? `🟡 ${dbt.mediaStatusUnsigned}` 
              : `🔴 ${dbt.mediaStatusNone}`}
        </div>
      </div>

      {/* Upload Drag & Drop Sandbox Box */}
      <div className="bg-zinc-50 dark:bg-slate-900 border-3 border-dashed border-black dark:border-zinc-500 p-8 rounded-2xl text-center flex flex-col items-center justify-center gap-4 transition-colors relative hover:bg-zinc-100/50 dark:hover:bg-slate-800/50">
        <div className="p-3 bg-cyan-200 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000]">
          <Upload className="w-6 h-6 text-black stroke-[3]" />
        </div>
        <div>
          <p className="text-xs font-black text-black dark:text-white">
            {uploadingMedia ? dbt.mediaUploading : dbt.mediaDragPrompt}
          </p>
          <p className="text-[10px] font-bold text-zinc-500 mt-1">
            {dbt.mediaFormatHint}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <label className={`cursor-pointer bg-amber-300 text-black border-2 border-black px-4.5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:bg-amber-400 active:translate-y-0.5 active:shadow-[1.5px_1.5px_0px_0px_#000] transition-all flex items-center gap-1.5 ${uploadingMedia ? 'opacity-50 pointer-events-none' : ''}`}>
            <span>{uploadingMedia ? dbt.mediaUploadingBtn : dbt.mediaSelectBtn}</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleMediaUpload} 
              className="hidden" 
              disabled={uploadingMedia}
            />
          </label>
        </div>

        {mediaUploadError && (
          <div className="text-[10px] font-bold text-rose-600 bg-rose-50 border-2 border-rose-600 p-2 rounded-lg mt-2">
            错误提示: {mediaUploadError}
          </div>
        )}
      </div>

      {/* Grid Layout of Media Library */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-black text-black dark:text-white uppercase">
            {dbt.mediaListTitle} ({(data.mediaItems || []).length})
          </span>
        </div>

        {!(data.mediaItems && data.mediaItems.length > 0) ? (
          <div className="text-center py-12 bg-zinc-50 dark:bg-slate-800/30 border-2 border-black border-dashed rounded-xl">
            <span className="text-xs font-bold text-zinc-500">
              {dbt.mediaEmpty}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {(data.mediaItems || []).map(item => {
              const isDeleting = deletingMediaId === item.id;
              return (
                <div 
                  key={item.id} 
                  className="bg-white dark:bg-slate-900 border-3 border-black dark:border-zinc-300 rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#38BDF8] overflow-hidden flex flex-col transition-transform hover:-translate-y-0.5"
                >
                  {/* Image Box */}
                  <div className="aspect-video bg-zinc-100 relative group overflow-hidden">
                    {item.url ? (
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-xs text-zinc-400">
                        NO URL
                      </div>
                    )}
                    {/* Copy Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(item.url);
                          showToast(dbt.mediaCopiedToast);
                        }}
                        className="bg-yellow-300 text-black border-2 border-black p-2 rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-yellow-400"
                        title={dbt.mediaBtnCopy}
                      >
                        <span className="text-[10px]">{dbt.mediaBtnCopy}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateProfile({ ...data.profile, avatarUrl: item.url });
                          showToast(dbt.mediaAvatarChangeToast);
                        }}
                        className="bg-cyan-300 text-black border-2 border-black p-2 rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-cyan-400"
                        title={dbt.mediaBtnAvatar}
                      >
                        <span className="text-[10px]">{dbt.mediaBtnAvatar}</span>
                      </button>
                    </div>
                  </div>

                  {/* Info Column */}
                  <div className="p-3.5 flex flex-col gap-2 flex-grow justify-between">
                    <div>
                      <span className="text-xs font-black text-black dark:text-white block truncate" title={item.name}>
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-black/10">
                          {item.size || dbt.mediaSizeUnknown}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400">
                          {item.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(item.url);
                          showToast(dbt.mediaUrlCopiedToast);
                        }}
                        className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 hover:underline flex items-center gap-1"
                      >
                        <span className="truncate max-w-[120px]">{item.url}</span>
                      </button>
                      
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleMediaDelete(item.id, item.url)}
                        className={`bg-rose-200 text-rose-900 border-2 border-black px-2 py-1.5 rounded-lg text-[10px] font-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-300 transition-all flex items-center gap-1 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{isDeleting ? dbt.mediaDeletingBtn : dbt.mediaDeleteBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
