'use client';

import { useState, useEffect, useRef } from 'react';
import { ViewMode } from '@/types/podcast';
import { useTranslations, useLocale } from 'next-intl';
import { EllipsisVerticalIcon } from 'lucide-react';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const t = useTranslations('layout');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);


  // Close dropdown when clicking outside


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
    <div className="relative">
      {/* 3-dot Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10  text-white rounded-full hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
        aria-label="View options"
        aria-expanded={isOpen}
      >
        <EllipsisVerticalIcon className="w-5 h-5 text-white" />
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
