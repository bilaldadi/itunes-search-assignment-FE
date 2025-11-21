'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Podcast, ViewMode } from '@/types/podcast';
import ViewToggle from './ViewToggle';

interface ResultsContainerProps {
  podcasts: Podcast[];
  topPodcastsView: ViewMode;
  onTopPodcastsViewChange: (view: ViewMode) => void;
  topEpisodesView: ViewMode;
  onTopEpisodesViewChange: (view: ViewMode) => void;
  isLoading: boolean;
  hasSearched: boolean;
  error: string | null;
  searchTerm: string;
}

const FALLBACK_ARTWORK = '/window.svg';

export default function ResultsContainer({
  podcasts,
  topPodcastsView,
  onTopPodcastsViewChange,
  topEpisodesView,
  onTopEpisodesViewChange,
  isLoading,
  hasSearched,
  error,
  searchTerm,
}: ResultsContainerProps) {
  const t = useTranslations('search');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const topPodcasts = useMemo(() => podcasts.slice(0, Math.min(6, podcasts.length)), [podcasts]);
  const topEpisodes = useMemo(() => {
    if (podcasts.length > 6) {
      return podcasts.slice(6);
    }
    return podcasts;
  }, [podcasts]);

  const headingFor = (type: 'podcasts' | 'episodes') => {
    if (!searchTerm.trim()) {
      return type === 'podcasts' ? t('topPodcasts') : t('topEpisodes');
    }

    return type === 'podcasts'
      ? t('topPodcastsFor', { term: searchTerm })
      : t('topEpisodesFor', { term: searchTerm });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-28">
        <div className="text-center space-y-4 text-white/70">
          <div className="h-14 w-14 mx-auto rounded-full border-4 border-white/20 border-t-[#7d5bff] animate-spin" />
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-28">
        <div className="text-center space-y-4 text-white">
          <svg className="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
          <p className="text-white/70">{t('error')}</p>
        </div>
      </div>
    );
  }

  // Initial state (no search yet)
  if (!hasSearched) {
    return (
      <div className="flex items-center justify-center py-28">
        <div className="text-center space-y-4 text-white/70" dir={isRTL ? 'rtl' : 'ltr'}>
          <svg className="w-20 h-20 text-white/20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
          </svg>
          <div>
            <p className="text-xl font-semibold text-white">{t('initialState')}</p>
            <p className="text-sm text-white/50">
              {t('resultsCount', { count: podcasts.length })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No results state
  if (hasSearched && podcasts.length === 0) {
    return (
      <div className="flex items-center justify-center py-28">
        <div className="text-center space-y-4 text-white/70" dir={isRTL ? 'rtl' : 'ltr'}>
          <svg className="w-20 h-20 text-white/20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 0 1 5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
          <p className="text-xl font-semibold text-white">{t('noResults')}</p>
        </div>
      </div>
    );
  }

  const renderCard = (podcast: Podcast) => (
    <div
      key={podcast.trackId}
      className="bg-white/5 border border-white/5 rounded-3xl p-4 h-full flex flex-col hover:border-white/20 transition-colors"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5">
        <PodcastArtwork src={getArtworkUrl(podcast)} alt={podcast.trackName} />
      </div>
      <div className="mt-4 space-y-1" dir={isRTL ? 'rtl' : 'ltr'}>
        <p className="text-sm text-white/50 line-clamp-1">{podcast.artistName}</p>
        <p className="text-base font-semibold text-white line-clamp-2">{podcast.trackName}</p>
      </div>
    </div>
  );

  const renderTopPodcasts = () => {
    if (topPodcastsView === 'list') {
      return (
        <div className="space-y-3">
          {topPodcasts.map((podcast, index) => (
            <div
              key={`${podcast.trackId ?? podcast.collectionName ?? 'podcast'}-${index}`}
              className="flex items-center gap-4 bg-white/5 rounded-2xl border border-white/5 px-4 py-3 hover:bg-white/10 transition-colors"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0">
                <PodcastArtwork src={getArtworkUrl(podcast)} alt={podcast.trackName} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/50 line-clamp-1">{podcast.artistName}</p>
                <p className="text-lg font-semibold text-white line-clamp-1">{podcast.trackName}</p>
              </div>
              {podcast.primaryGenreName && (
                <span className="text-xs uppercase tracking-widest text-white/40">{podcast.primaryGenreName}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (topPodcastsView === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {topPodcasts.map((podcast) => renderCard(podcast))}
        </div>
      );
    }

    return (
      <div className="flex gap-4 overflow-x-auto pb-4" dir={isRTL ? 'rtl' : 'ltr'} style={{ scrollSnapType: 'x proximity' }}>
        {topPodcasts.map((podcast, index) => (
          <div
            key={`${podcast.trackId ?? podcast.collectionName ?? 'podcast'}-scroll-${index}`}
            className="w-60 flex-shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            {renderCard(podcast)}
          </div>
        ))}
      </div>
    );
  };

  const renderEpisodeTile = (podcast: Podcast, index: number) => (
    <div
      key={`${podcast.trackId ?? podcast.collectionName ?? 'episode'}-tile-${index}`}
      className="bg-white/5 border border-white/5 rounded-3xl p-4 space-y-4 hover:border-white/15 transition-colors w-full"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-3 text-white/40 text-xs uppercase tracking-[0.3em]">
        <span>{String(index + 1).padStart(2, '0')}</span>
        {podcast.primaryGenreName && <span className="truncate">{podcast.primaryGenreName}</span>}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0">
          <PodcastArtwork src={getArtworkUrl(podcast)} alt={podcast.trackName} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/50 line-clamp-1">{podcast.artistName || podcast.collectionName}</p>
          <p className="text-lg font-semibold text-white line-clamp-2">{podcast.trackName || podcast.collectionName}</p>
        </div>
      </div>
      {podcast.releaseDate && (
        <p className="text-xs text-white/40">{formatReleaseDate(podcast.releaseDate, locale)}</p>
      )}
      <div className="flex items-center gap-3">
        <button className="px-4 py-1.5 rounded-full border border-white/10 text-xs sm:text-sm text-white/80 hover:bg-white/10 transition">
          {t('listenNow')}
        </button>
        <button className="h-9 w-9 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderTopEpisodes = () => {
    if (topEpisodesView === 'list') {
      return (
        <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden divide-y divide-white/5">
          {topEpisodes.map((podcast, index) => (
            <div
              key={`${podcast.trackId ?? podcast.collectionName ?? 'episode'}-list-${index}`}
              className="flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-white/5 transition-colors"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <span className="w-8 text-sm font-semibold text-white/30">{String(index + 1).padStart(2, '0')}</span>

              <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0">
                <PodcastArtwork src={getArtworkUrl(podcast)} alt={podcast.trackName} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/50 line-clamp-1">{podcast.artistName || podcast.collectionName}</p>
                <p className="text-base font-semibold text-white line-clamp-1">{podcast.trackName || podcast.collectionName}</p>
              </div>

              <div className="hidden md:flex flex-col text-xs text-white/50 text-right">
                {podcast.primaryGenreName && <span className="uppercase tracking-widest">{podcast.primaryGenreName}</span>}
                {podcast.releaseDate && <span>{formatReleaseDate(podcast.releaseDate, locale)}</span>}
              </div>

              <button className="px-4 py-1.5 rounded-full border border-white/10 text-xs sm:text-sm text-white/80 hover:bg-white/10 transition">
                {t('listenNow')}
              </button>

              <button className="h-9 w-9 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <circle cx="5" cy="12" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="19" cy="12" r="1.5" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (topEpisodesView === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topEpisodes.map((podcast, index) => renderEpisodeTile(podcast, index))}
        </div>
      );
    }

    return (
      <div className="flex gap-4 overflow-x-auto pb-4" dir={isRTL ? 'rtl' : 'ltr'} style={{ scrollSnapType: 'x proximity' }}>
        {topEpisodes.map((podcast, index) => (
          <div
            key={`${podcast.trackId ?? podcast.collectionName ?? 'episode'}-scroll-${index}`}
            className="w-72 flex-shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            {renderEpisodeTile(podcast, index)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="px-6 py-10 space-y-12">
      <section className="space-y-4">
        <div className="flex flex-col gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
          <p className="text-xs uppercase tracking-[0.4em] text-white/30">{t('resultsCount', { count: podcasts.length })}</p>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-white">{headingFor('podcasts')}</h2>
              <span className="text-sm text-white/50">
                {searchTerm ? t('searchTermLabel', { term: searchTerm }) : t('trendingNow')}
              </span>
            </div>
            <ViewToggle currentView={topPodcastsView} onViewChange={onTopPodcastsViewChange} />
          </div>
        </div>
        {renderTopPodcasts()}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
          <div>
            <h2 className="text-2xl font-semibold text-white">{headingFor('episodes')}</h2>
            <span className="text-sm text-white/50">{t('freshEpisodes')}</span>
          </div>
          <ViewToggle currentView={topEpisodesView} onViewChange={onTopEpisodesViewChange} />
        </div>

        {renderTopEpisodes()}
      </section>
    </div>
  );
}

function getArtworkUrl(podcast: Podcast) {
  return podcast.artworkUrl600 || podcast.artworkUrl100 || podcast.artworkUrl60 || FALLBACK_ARTWORK;
}

function formatReleaseDate(value: string | undefined, locale: string) {
  if (!value) return '';
  try {
    const date = new Date(value);
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

function PodcastArtwork({ src, alt }: { src: string; alt?: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center text-white/30 bg-white/5">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55A4.5 4.5 0 1 0 14.5 21V7H19V3h-7z" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || 'Podcast artwork'}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 40vw, 200px"
      onError={() => setHasError(true)}
    />
  );
}

