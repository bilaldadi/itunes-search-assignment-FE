'use client';

import { useState } from 'react';
import { Podcast, ViewMode } from '@/types/podcast';
import { searchPodcasts } from '@/lib/api';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import Header from '@/app/components/Header';
import SearchBar from '@/app/components/SearchBar';
import ResultsContainer from '@/app/components/ResultsContainer';
import Sidebar from '@/app/components/Sidebar';


export default function Home() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [topPodcastsView, setTopPodcastsView] = useState<ViewMode>('scroll');
  const [topEpisodesView, setTopEpisodesView] = useState<ViewMode>('grid');
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (query: string) => {
    setSearchTerm(query);

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
    <div className="min-h-screen text-white">
      <div className="flex min-h-screen">
        <Sidebar currentLocale={locale as 'en' | 'ar'} onLanguageChange={handleLanguageChange} />

        <div className="flex-1 flex flex-col min-w-0">
          <Header
            currentLocale={locale as 'en' | 'ar'}
            onLanguageChange={handleLanguageChange}
          >
            <SearchBar onSearch={handleSearch} isLoading={isLoading} variant="condensed" />
          </Header>

          <main className="flex-1 overflow-y-auto">
            <div className="w-full">
              <ResultsContainer
                podcasts={podcasts}
                topPodcastsView={topPodcastsView}
                onTopPodcastsViewChange={setTopPodcastsView}
                topEpisodesView={topEpisodesView}
                onTopEpisodesViewChange={setTopEpisodesView}
                isLoading={isLoading}
                hasSearched={hasSearched}
                error={error}
                searchTerm={searchTerm}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

