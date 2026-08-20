import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, 
  Copy, 
  ArrowUp, 
  Moon, 
  Sun, 
  Globe, 
  Sparkles, 
  X, 
  QrCode, 
  Check, 
  Radio, 
  Terminal, 
  Send,
  ExternalLink,
  Zap,
  FileDown,
  Loader2
} from 'lucide-react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { LANGUAGES, LanguageCode } from '../../i18n/languages';
import { exportPortfolioToPDF } from '../../utils/exportPdf';

interface MenuPosition {
  x: number;
  y: number;
}

export const CyberContextMenu: React.FC = () => {
  const { 
    t, 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    showToast, 
    data,
    startPdfExport,
    isPdfExporting
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [showLanguageSubmenu, setShowLanguageSubmenu] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const touchTimerRef = useRef<number | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Generate QR Code when share modal opens
  useEffect(() => {
    if (isShareModalOpen) {
      const currentUrl = window.location.origin;
      QRCode.toDataURL(currentUrl, {
        width: 260,
        margin: 1.5,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code', err));
    }
  }, [isShareModalOpen]);

  // Helper to check if an element is an interactive control
  const isInteractiveElement = (element: Element | null): boolean => {
    if (!element) return false;
    return !!element.closest(
      'button, a, input, textarea, select, [role="button"], [data-interactive="true"], form, [contenteditable="true"], .interactive-click'
    );
  };

  // Clamp menu coordinates within viewport
  const calculateMenuPosition = useCallback((clientX: number, clientY: number): MenuPosition => {
    const menuWidth = 260;
    const menuHeight = 340;
    const padding = 16;

    let x = clientX;
    let y = clientY;

    if (x + menuWidth > window.innerWidth - padding) {
      x = window.innerWidth - menuWidth - padding;
    }
    if (x < padding) {
      x = padding;
    }

    if (y + menuHeight > window.innerHeight - padding) {
      y = window.innerHeight - menuHeight - padding;
    }
    if (y < padding) {
      y = padding;
    }

    return { x, y };
  }, []);

  // Global Mouse & Touch Handlers
  useEffect(() => {
    // 1. PC: Mouse Left-Click outside menu should close the menu if open (standard behavior)
    const handleMouseDown = (e: MouseEvent) => {
      // If clicking inside our custom menu or share modal, don't close
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }

      if (isShareModalOpen) {
        return;
      }

      // If user clicks left mouse button anywhere outside when menu is open, close menu
      if (isOpen) {
        setIsOpen(false);
        setShowLanguageSubmenu(false);
      }
    };

    // 2. PC: Mouse Right-Click (contextmenu) opens the custom cyber menu
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as Element;
      // Allow default browser context menu on inputs/textareas for editing convenience
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      e.preventDefault();
      const pos = calculateMenuPosition(e.clientX, e.clientY);
      setPosition(pos);
      setIsOpen(true);
      setShowLanguageSubmenu(false);
    };

    // 2. Mobile: Touch Long Press (500ms)
    const handleTouchStart = (e: TouchEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }
      if (isShareModalOpen) {
        return;
      }

      const touch = e.touches[0];
      if (!touch) return;

      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };

      if (touchTimerRef.current) {
        window.clearTimeout(touchTimerRef.current);
      }

      touchTimerRef.current = window.setTimeout(() => {
        // Trigger haptic vibration if available on mobile
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate(40);
          } catch {
            // ignore haptic error
          }
        }

        const pos = calculateMenuPosition(touch.clientX, touch.clientY);
        setPosition(pos);
        setIsOpen(true);
        setShowLanguageSubmenu(false);
      }, 450);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      const deltaX = Math.abs(touch.clientX - touchStartPosRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartPosRef.current.y);

      // Cancel long press if user is scrolling
      if (deltaX > 10 || deltaY > 10) {
        if (touchTimerRef.current) {
          window.clearTimeout(touchTimerRef.current);
          touchTimerRef.current = null;
        }
      }
    };

    const handleTouchEnd = () => {
      if (touchTimerRef.current) {
        window.clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
    };

    // Dismiss on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsShareModalOpen(false);
        setShowLanguageSubmenu(false);
      }
    };

    // Add event listeners
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (touchTimerRef.current) {
        window.clearTimeout(touchTimerRef.current);
      }
    };
  }, [isOpen, isShareModalOpen, calculateMenuPosition]);

  // Actions
  const handleOpenShare = () => {
    setIsOpen(false);
    setIsShareModalOpen(true);
  };

  const handleNativeShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = data.systemConfig?.siteTitle || data.profile.siteTitle || t.siteTitle;
    const shareText = data.profile.bio || t.subTitle;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        showToast(t.cyberMenuShareCopied);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    showToast(t.cyberMenuShareCopied);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleBackToTop = () => {
    setIsOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setIsOpen(false);
  };

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setShowLanguageSubmenu(false);
    setIsOpen(false);
  };

  const triggerEasterEgg = () => {
    setIsOpen(false);
    setEasterEggActive(true);
    showToast(`⚡ [KYVERO PROTOCOL] ${t.easterEggToast}`);
    setTimeout(() => setEasterEggActive(false), 3000);
  };

  // Social Share URLs
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitleEncoded = encodeURIComponent(data.systemConfig?.siteTitle || data.profile.siteTitle || t.siteTitle);
  const shareUrlEncoded = encodeURIComponent(currentUrl);

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareTitleEncoded}&url=${shareUrlEncoded}`;
  const telegramShareUrl = `https://t.me/share/url?url=${shareUrlEncoded}&text=${shareTitleEncoded}`;
  const weiboShareUrl = `https://service.weibo.com/share/share.php?url=${shareUrlEncoded}&title=${shareTitleEncoded}`;

  return (
    <>
      {/* 1. Cyber Floating Context Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.88, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            style={{
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 9999,
            }}
            className="w-64 bg-white dark:bg-slate-900 border-3 border-black dark:border-zinc-200 rounded-2xl shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#38BDF8] p-2.5 flex flex-col gap-1.5 select-none font-sans"
          >
            {/* Header Manga Bar */}
            <div className="bg-black dark:bg-amber-400 text-yellow-300 dark:text-black px-3 py-1.5 rounded-xl flex items-center justify-between font-mono font-black text-xs shadow-[2px_2px_0px_0px_#000] mb-1">
              <div className="flex items-center gap-1.5 truncate">
                <Radio className="w-3.5 h-3.5 animate-pulse text-yellow-300 dark:text-black shrink-0" />
                <span className="truncate uppercase text-[10px] tracking-wider">
                  {t.cyberMenuTitle}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:scale-110 active:scale-95 transition-transform"
                title={t.close}
              >
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>

            {/* ACTION 1: Share Space (Primary Neon Highlight) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenShare}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-200 dark:from-amber-400 dark:to-yellow-300 text-black border-2 border-black font-black text-xs shadow-[2.5px_2.5px_0px_0px_#000] cursor-pointer group transition-transform"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-black text-yellow-300 rounded-lg flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_#000]">
                  <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-xs leading-none">
                    {t.cyberMenuShare}
                  </span>
                  <span className="text-[9px] font-bold text-black/70 font-mono">
                    SHARE & QR MATRIX
                  </span>
                </div>
              </div>
              <QrCode className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
            </motion.button>

            {/* ACTION 2: Copy Link */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 hover:bg-cyan-100 dark:hover:bg-slate-700 border-2 border-black dark:border-zinc-300 font-bold text-xs shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-cyan-300 text-black rounded-md flex items-center justify-center border border-black shrink-0">
                  <Copy className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>{t.cyberMenuCopyLink}</span>
              </div>
              {isCopied && (
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </motion.button>

            {/* ACTION 3: Toggle Theme */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleThemeToggle}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 hover:bg-amber-100 dark:hover:bg-slate-700 border-2 border-black dark:border-zinc-300 font-bold text-xs shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-300 text-black rounded-md flex items-center justify-center border border-black shrink-0">
                  {theme === 'dark' ? (
                    <Sun className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    <Moon className="w-3 h-3 stroke-[2.5]" />
                  )}
                </div>
                <span>{t.cyberMenuTheme}</span>
              </div>
              <span className="text-[9px] font-black font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                {theme === 'dark' ? t.cyberMenuThemeLight : t.cyberMenuThemeDark}
              </span>
            </motion.button>

            {/* ACTION 4: Language Switch Submenu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowLanguageSubmenu(!showLanguageSubmenu)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 hover:bg-emerald-100 dark:hover:bg-slate-700 border-2 border-black dark:border-zinc-300 font-bold text-xs shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-300 text-black rounded-md flex items-center justify-center border border-black shrink-0">
                    <Globe className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>{t.cyberMenuLanguage}</span>
                </div>
                <span className="text-[10px] font-black font-mono uppercase bg-emerald-200 dark:bg-emerald-800/60 text-black dark:text-white px-1.5 py-0.5 rounded border border-black">
                  {language}
                </span>
              </motion.button>

              {/* Language Submenu Flyout */}
              <AnimatePresence>
                {showLanguageSubmenu && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 p-1.5 bg-amber-50 dark:bg-slate-950 border-2 border-black dark:border-zinc-300 rounded-xl shadow-[3px_3px_0px_0px_#000] grid grid-cols-2 gap-1 overflow-hidden"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                          language === lang.code
                            ? 'bg-black text-yellow-300 border-black shadow-[1px_1px_0px_0px_#000]'
                            : 'bg-white dark:bg-slate-800 text-zinc-800 dark:text-zinc-200 border-zinc-400 hover:bg-yellow-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span className="truncate">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACTION 6: Back to Top */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBackToTop}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 hover:bg-rose-100 dark:hover:bg-slate-700 border-2 border-black dark:border-zinc-300 font-bold text-xs shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-rose-300 text-black rounded-md flex items-center justify-center border border-black shrink-0">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>{t.cyberMenuBackToTop}</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 font-bold">
                TOP
              </span>
            </motion.button>

            {/* ACTION 7: Cyber Easter Egg */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={triggerEasterEgg}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 hover:bg-purple-100 dark:hover:bg-slate-700 border-2 border-black dark:border-zinc-300 font-bold text-xs shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-300 text-black rounded-md flex items-center justify-center border border-black shrink-0">
                  <Sparkles className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>{t.cyberMenuEasterEgg}</span>
              </div>
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Cyber Share & QR Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border-3 sm:border-4 border-black dark:border-zinc-200 rounded-2xl sm:rounded-3xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#38BDF8] p-5 sm:p-6 z-10 my-4 flex flex-col gap-4 font-sans"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-amber-300 dark:bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center text-black font-black shadow-[2px_2px_0px_0px_#000]">
                    <Share2 className="w-4.5 h-4.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-black dark:text-white font-mono leading-tight">
                      {t.cyberMenuShareTitle}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                      {t.cyberMenuShareSubtitle}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsShareModalOpen(false)}
                  className="w-8 h-8 bg-zinc-100 dark:bg-slate-800 border-2 border-black dark:border-zinc-300 rounded-xl flex items-center justify-center text-black dark:text-white hover:bg-rose-300 transition-colors shadow-[2px_2px_0px_0px_#000]"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </motion.button>
              </div>

              {/* QR Code Container */}
              <div className="bg-amber-50 dark:bg-slate-950 border-2 border-black dark:border-zinc-300 rounded-2xl p-4 flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#38BDF8]">
                {qrCodeDataUrl ? (
                  <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] mb-3">
                    <img
                      src={qrCodeDataUrl}
                      alt="Cyber QR Code"
                      className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-44 h-44 sm:w-48 sm:h-48 bg-zinc-200 animate-pulse rounded-xl mb-3 flex items-center justify-center font-mono text-xs">
                    GENERATING MATRIX...
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs font-black text-zinc-700 dark:text-zinc-300 font-mono">
                  <QrCode className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.cyberMenuQrCodeScan}</span>
                </div>
              </div>

              {/* Copy URL Field */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-zinc-100 dark:bg-slate-800 border-2 border-black dark:border-zinc-300 rounded-xl px-3 py-2 text-xs font-mono text-zinc-800 dark:text-zinc-200 truncate font-bold shadow-[2px_2px_0px_0px_#000]">
                  {currentUrl}
                </div>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleCopyLink}
                  className="bg-black dark:bg-amber-400 text-yellow-300 dark:text-black border-2 border-black px-3.5 py-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 shrink-0 hover:bg-zinc-800 dark:hover:bg-amber-300 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{t.copyLink}</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Quick Social Dispatch Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <a
                  href={twitterShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 bg-zinc-100 dark:bg-slate-800 hover:bg-cyan-200 dark:hover:bg-cyan-800/50 text-black dark:text-white border-2 border-black rounded-xl text-[11px] font-black shadow-[2px_2px_0px_0px_#000] transition-colors"
                >
                  <Send className="w-3 h-3 text-sky-500 rotate-45" />
                  <span>X / Twitter</span>
                </a>

                <a
                  href={telegramShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 bg-zinc-100 dark:bg-slate-800 hover:bg-sky-200 dark:hover:bg-sky-800/50 text-black dark:text-white border-2 border-black rounded-xl text-[11px] font-black shadow-[2px_2px_0px_0px_#000] transition-colors"
                >
                  <Send className="w-3 h-3 text-cyan-500" />
                  <span>Telegram</span>
                </a>

                <a
                  href={weiboShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 bg-zinc-100 dark:bg-slate-800 hover:bg-rose-200 dark:hover:bg-rose-800/50 text-black dark:text-white border-2 border-black rounded-xl text-[11px] font-black shadow-[2px_2px_0px_0px_#000] transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-rose-500" />
                  <span>微博</span>
                </a>
              </div>

              {/* Native System Share Trigger if available */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNativeShare}
                  className="w-full py-2.5 bg-cyan-300 dark:bg-cyan-400 text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2 hover:bg-cyan-200 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{t.cyberMenuShare}</span>
                </motion.button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Screen Easter Egg Animation Overlay */}
      <AnimatePresence>
        {easterEggActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
              animate={{ scale: [0.5, 1.2, 1], rotate: [ -15, 5, 0 ], opacity: [0, 1, 1] }}
              exit={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-yellow-300 text-black border-4 border-black px-8 py-6 rounded-3xl shadow-[12px_12px_0px_0px_#000] flex flex-col items-center gap-2 font-mono font-black"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 fill-black text-black animate-spin" />
                <span className="text-3xl tracking-tight">KYVERO OVERDRIVE!</span>
                <Zap className="w-8 h-8 fill-black text-black" />
              </div>
              <p className="text-sm font-sans tracking-wide">
                CYBERNETIC MECHA MATRIX ONLINE
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
