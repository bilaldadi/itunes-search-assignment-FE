'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { debounce } from '@/lib/debounce';


interface SearchBarProps {
  onSearch: (query: string) => void;

}

export default function SearchBar({ onSearch }: SearchBarProps) {
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

  return (

      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('placeholder')}
          className={`w-full p-1.5 text-sm rounded-lg bg-[#151726] border border-white/30 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#9B7DD9] focus:border-transparent focus:bg-white/10  transition-all shadow-[0_8px_30px_rgba(0,0,0,0.35)] text-center`}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>
  );
}
