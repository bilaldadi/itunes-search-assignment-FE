'use client';

import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { debounce } from '@/lib/debounce';

export default function SearchBar() {
  const t = useTranslations('search');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(queryFromUrl);
  const lastSyncedQueryRef = useRef(queryFromUrl);

  const navigateWithQuery = useCallback(
    (nextQuery: string, paramsSnapshot: string) => {
      const trimmed = nextQuery.trim();
      const params = new URLSearchParams(paramsSnapshot);

      if (trimmed) {
        params.set('q', trimmed);
      } else {
        params.delete('q');
      }

      const targetPath = trimmed ? '/search' : '/';
      const queryString = params.toString();
      const href = queryString ? `${targetPath}?${queryString}` : targetPath;
      router.replace(href);
    },
    [router]
  );

  const debouncedNavigate = useMemo(
    () => debounce(navigateWithQuery, 500),
    [navigateWithQuery]
  );

  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    if (lastSyncedQueryRef.current === queryFromUrl) {
      return;
    }
    lastSyncedQueryRef.current = queryFromUrl;
    startTransition(() => {
      setQuery(queryFromUrl);
    });
  }, [queryFromUrl]);

  useEffect(() => {
    debouncedNavigate(query, searchParamsString);
  }, [query, searchParamsString, debouncedNavigate]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('placeholder')}
        className="w-full p-1.5 text-sm rounded-lg bg-[#151726] border border-white/30 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#9B7DD9] focus:border-transparent focus:bg-white/10  transition-all shadow-[0_8px_30px_rgba(0,0,0,0.35)] text-center"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      />
    </div>
  );
}
