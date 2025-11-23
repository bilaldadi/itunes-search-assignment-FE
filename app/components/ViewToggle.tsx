'use client';

import { useState, useEffect, useRef } from 'react';
import { ViewMode } from '@/types/podcast';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { EllipsisVerticalIcon } from 'lucide-react';

interface ViewToggleProps {
  currentView: ViewMode;
  paramKey: 'topPodcastsView' | 'topEpisodesView';
}

export default function ViewToggle({ currentView, paramKey }: ViewToggleProps) {
  const t = useTranslations('layout');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, view);
    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(href);
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
        className="h-10 w-10 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
        aria-label="View options"
        aria-expanded={isOpen}
      >
        <EllipsisVerticalIcon className="w-5 h-5 text-white" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute ${locale === 'ar' ? 'left-0' : 'right-0'} mt-2 w-45 rounded-xl bg-gradient-to-bl from-[#404080] to-[#6B4080] z-50 shadow-xl`}>
          {/* Arrow pointing up */}
          {/* <div className={`absolute -top-1.5 ${locale === 'ar' ? 'left-3.5' : 'right-3.5'} w-3 h-3 bg-[#404080] rotate-45`}></div>
           */}
          {viewOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleViewChange(option.value)}
              className={`w-full text-center p-2 text-sm transition-colors relative ${
                currentView === option.value
                  ? 'bg-white/20 text-white rounded-lg'
                  : 'text-white/90 hover:text-white rounded-lg'
              } ${index < viewOptions.length - 1 ? '' : ''}`}
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
