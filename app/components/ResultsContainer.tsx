'use client';

import { Podcast, ViewMode } from '@/types/podcast';
import PodcastCard from './PodcastCard';
import { useTranslations, useLocale } from 'next-intl';

interface ResultsContainerProps {
  podcasts: Podcast[];
  viewMode: ViewMode;
  isLoading: boolean;
  hasSearched: boolean;
  error: string | null;
}

export default function ResultsContainer({
  podcasts,
  viewMode,
  isLoading,
  hasSearched,
  error,
}: ResultsContainerProps) {
  const t = useTranslations('search');
  const locale = useLocale();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-700">{t('error')}</p>
        </div>
      </div>
    );
  }

  // No results state
  if (hasSearched && podcasts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-700">{t('noResults')}</p>
        </div>
      </div>
    );
  }

  // Initial state (no search yet)
  if (!hasSearched) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-gray-600" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {t('initialState')}
          </p>
        </div>
      </div>
    );
  }

  // Render results based on view mode
  if (viewMode === 'scroll') {
    return (
      <div className="w-full overflow-x-auto pb-4">
        <div className="flex gap-4 px-4" style={{ scrollSnapType: 'x mandatory' }}>
          {podcasts.map((podcast) => (
            <div style={{ scrollSnapAlign: 'start' }}>
              <PodcastCard key={podcast.trackId} podcast={podcast} viewMode={viewMode} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="max-w-5xl mx-auto px-4">
        <div className="space-y-4">
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.trackId} podcast={podcast} viewMode={viewMode} />
          ))}
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {podcasts.map((podcast) => (
          <PodcastCard key={podcast.trackId} podcast={podcast} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}
