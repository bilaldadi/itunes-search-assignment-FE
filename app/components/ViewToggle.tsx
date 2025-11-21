'use client';

import { useState, useEffect, useRef } from 'react';
import { ViewMode } from '@/types/podcast';
import { useTranslations, useLocale } from 'next-intl';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const t = useTranslations('layout');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewChange = (view: ViewMode) => {
    onViewChange(view);
    setIsOpen(false);
  };

  const viewOptions: { value: ViewMode; labelKey: 'switchToGrid' | 'switchToList' | 'switchToScroll' }[] = [
    { value: 'grid', labelKey: 'switchToGrid' },
    { value: 'list', labelKey: 'switchToList' },
    { value: 'scroll', labelKey: 'switchToScroll' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 3-dot Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
        aria-label="View options"
        aria-expanded={isOpen}
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#11182b] border border-white/10 py-1 z-50 shadow-xl">
          {viewOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleViewChange(option.value)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                currentView === option.value
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5'
              }`}
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
