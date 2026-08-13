import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const GlobalAdminShortcutListener: React.FC = () => {
  const { setCurrentView, showToast, t, currentView } = useApp();
  const bufferRef = useRef<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when user is actively typing inside an input/textarea/select
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement ||
        (activeElement as HTMLElement)?.isContentEditable;

      if (isInput) return;

      const char = e.key.toLowerCase();
      if (char.length === 1 && char >= 'a' && char <= 'z') {
        bufferRef.current = (bufferRef.current + char).slice(-5);
        if (bufferRef.current === 'admin') {
          bufferRef.current = '';
          if (currentView !== 'admin') {
            showToast(t.easterEggToast);
            setCurrentView('admin');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentView, showToast, t, currentView]);

  return null;
};

