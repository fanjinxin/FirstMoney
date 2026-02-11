import React, { useEffect, useState } from 'react';
import { themes, Theme } from '../styles/themes';

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : '0 0 0';
};

export const ThemeSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState('summer-mint');

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--xia-${key}`, hexToRgb(value));
    });
    setCurrentThemeId(theme.id);
    localStorage.setItem('app-theme-id', theme.id);
  };

  useEffect(() => {
    const savedId = localStorage.getItem('app-theme-id');
    const theme = themes.find(t => t.id === savedId) || themes.find(t => t.id === 'summer-mint');
    if (theme) {
      applyTheme(theme);
    }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 print:hidden">
      {isOpen && (
        <div className="mb-4 max-h-[80vh] w-72 overflow-y-auto rounded-2xl border border-xia-haze/50 bg-white/90 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-xia-deep">选择主题 (Select Theme)</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-xia-deep/50 hover:bg-xia-deep/5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => applyTheme(theme)}
                className={`group relative flex w-full items-center gap-3 rounded-xl border p-2 transition-all hover:scale-[1.02] active:scale-95 ${
                  currentThemeId === theme.id 
                    ? 'border-xia-teal bg-xia-teal/5 ring-1 ring-xia-teal' 
                    : 'border-transparent hover:border-xia-haze hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-black/5 shadow-sm">
                  <div className="h-full w-1/2" style={{ backgroundColor: theme.colors.sky }} />
                  <div className="flex h-full w-1/2 flex-col">
                    <div className="h-1/2 w-full" style={{ backgroundColor: theme.colors.aqua }} />
                    <div className="h-1/2 w-full" style={{ backgroundColor: theme.colors.cream }} />
                  </div>
                </div>
                <div className="text-left">
                  <div className={`text-sm font-bold ${currentThemeId === theme.id ? 'text-xia-teal' : 'text-xia-deep'}`}>
                    {theme.name}
                  </div>
                  <div className="text-[10px] text-xia-deep/40 opacity-0 transition-opacity group-hover:opacity-100">
                    点击应用 (Click to apply)
                  </div>
                </div>
                {currentThemeId === theme.id && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-xia-teal p-1 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg shadow-xia-deep/10 transition-all hover:scale-110 hover:shadow-xl active:scale-95"
        title="Change Theme"
      >
        <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow-sm ring-2 ring-xia-haze transition-all group-hover:ring-xia-sky">
          <div className="absolute inset-0 bg-gradient-to-tr from-xia-sky via-xia-aqua to-xia-mint" />
        </div>
      </button>
    </div>
  );
};
