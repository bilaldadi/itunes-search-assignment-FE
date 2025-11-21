'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { debounce } from '@/lib/debounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  variant?: 'standalone' | 'condensed';
}

export default function SearchBar({ onSearch, isLoading, variant = 'standalone' }: SearchBarProps) {
  const t = useTranslations('search');
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const debouncedSearchRef = useRef(
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
    }, 300)
  );

  useEffect(() => {
    debouncedSearchRef.current(query);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const isCondensed = variant === 'condensed';
  const iconPositionClass = locale === 'ar' ? 'right-0 pr-5' : 'left-0 pl-5';
  const clearPositionClass = locale === 'ar' ? 'left-0 pl-5' : 'right-0 pr-5';
  const paddingClass = locale === 'ar' ? 'pr-14 pl-16' : 'pl-14 pr-16';
  const inputVerticalPadding = isCondensed ? 'py-3.5' : 'py-4';

  const containerClass = isCondensed ? 'w-full' : 'w-full max-w-4xl mx-auto px-6 py-8';

  return (
    <div className={containerClass}>
      <div className="relative w-full">
        {/* Search Icon */}
        <div className={`absolute inset-y-0 flex items-center pointer-events-none text-white/50 ${iconPositionClass}`}>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('placeholder')}
          className={`w-full ${paddingClass} ${inputVerticalPadding} text-base sm:text-lg rounded-2xl bg-[#111a2e] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#7d5bff] focus:border-transparent transition-all shadow-[0_8px_30px_rgba(0,0,0,0.35)]`}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />

        {/* Clear Button & Loading Indicator */}
        <div className={`absolute inset-y-0 flex items-center ${clearPositionClass}`}>
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-[#7d5bff] rounded-full" />
          ) : query ? (
            <button
              onClick={handleClear}
              className="text-white/40 hover:text-white/80 transition-colors"
              aria-label={t('clear')}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
