'use client';

import { useState } from 'react';
import { Podcast, ViewMode } from '@/types/podcast';
import { searchPodcasts } from '@/lib/api';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import Header from '@/app/components/Header';
import SearchBar from '@/app/components/SearchBar';
import ViewToggle from '@/app/components/ViewToggle';
import ResultsContainer from '@/app/components/ResultsContainer';

export default function Home() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setPodcasts([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchPodcasts(query);
      setPodcasts(response.results || []);
    } catch (err) {
      setError('Failed to fetch results');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    router.push(pathname, { locale: lang });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        currentLocale={locale as 'en' | 'ar'} 
        onLanguageChange={handleLanguageChange} 
      />

      {/* Main Content */}
      <main className="pb-12">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* View Toggle and Results Count */}
        {(hasSearched || podcasts.length > 0) && (
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                {podcasts.length > 0 && (
                  <span>
                    {podcasts.length} {locale === 'ar' ? 'نتيجة' : podcasts.length === 1 ? 'result' : 'results'}
                  </span>
                )}
              </div>
              <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            </div>
          </div>
        )}

        {/* Results */}
        <ResultsContainer
          podcasts={podcasts}
          viewMode={viewMode}
          isLoading={isLoading}
          hasSearched={hasSearched}
          error={error}
        />
      </main>
    </div>
  );
}

