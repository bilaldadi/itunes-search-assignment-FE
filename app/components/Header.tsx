'use client';

import { ReactNode } from 'react';

interface HeaderProps {
  currentLocale: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
  children?: ReactNode;
}

export default function Header({
  currentLocale,
  onLanguageChange,
  children,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0d1424]/90 backdrop-blur">
      <div className="px-6 py-4 flex items-center gap-4 text-white">
        <div className="flex items-center gap-2 text-white/60">
          <button
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Navigate back"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Navigate forward"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex-1">{children}</div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">Log in</button>
          <button className="px-4 py-2 text-sm font-semibold rounded-full bg-white text-[#0d1424] hover:opacity-90 transition">
            Sign up
          </button>
          <button
            onClick={() => onLanguageChange(currentLocale === 'en' ? 'ar' : 'en')}
            className="h-10 w-10 rounded-full border border-white/10 text-xs font-semibold uppercase tracking-wide text-white/80 hover:bg-white/10 transition"
            aria-label={currentLocale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          >
            {currentLocale === 'en' ? 'AR' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
}
