'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Podcast, ViewMode } from '@/types/podcast';
import ViewToggle from './ViewToggle';
import { EllipsisVertical, Play, SearchIcon } from 'lucide-react';

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

  const topPodcasts = useMemo(() => podcasts.slice(0, Math.min(24, podcasts.length)), [podcasts]);
  const topEpisodes = useMemo(() => {
    if (podcasts.length > 24) {
      return podcasts.slice(24);
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
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="px-3 text-center space-y-4 text-white/70">
          <SearchIcon
            size={60}
            className="text-white mx-auto"
          />
          <div>
            <p className="text-xl font-semibold text-white">{t('initialState')}</p>
          </div>
        </div>
      </div>
    );
  }

  // No results state
  if (hasSearched && podcasts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
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
      className="rounded-md flex flex-col hover:border-white/20 transition-colors"
    >
      <div className=" rounded-md w-56 aspect-square overflow-hidden bg-white/5">
        <Image className="w-full h-full" src={getArtworkUrl(podcast)} alt={podcast.trackName|| 'podcast artwork'} width={600} height={600} />
      </div>
      <div className="mt-4 space-y-1" dir={isRTL ? 'rtl' : 'ltr'}>
        <p className="text-sm text-white truncate max-w-56">{podcast.trackName}</p>
        <p className="text-xs text-[#e3bd71] truncate max-w-56">{podcast.artistName}</p>
      </div>
    </div>
  );

  const renderListview = (podcast: Podcast, index: number) => {
    return <div
    key={`${podcast.trackId ?? podcast.collectionName ?? 'episode'}-list-${index}`}
    className="flex gap-4 py-2 hover:bg-white/5 transition-colors"
    dir={isRTL ? 'rtl' : 'ltr'}
    >

    <div className="rounded-xs overflow-hidden bg-white/10 w-25 h-25">
      <Image className="w-full h-full" src={getArtworkUrl(podcast)} alt={podcast.trackName|| 'podcast artwork'} width={100} height={100} />
    </div>

    <div className="flex-1 min-w-0 flex flex-col justify-between">
      <p className="text-base font-semibold text-white line-clamp-2">{podcast.trackName}</p>
      <p className="text-sm text-[#e3bd71] line-clamp-1">{podcast.artistName}</p>
      <p className="text-sm text-white/50 line-clamp-2">{podcast.longDescription}</p>
      <p className="flex text-xs text-white/50">{formatReleaseDate(podcast.releaseDate, locale)}</p>
    </div>
    <button className="px-4 flex flex-col gap-5 items-center justify-center">
      <Play size={16}  className="text-white/50 hover:text-white cursor-pointer" />
      <EllipsisVertical size={16} className="text-white/50 hover:text-white cursor-pointer" />
    </button>
  </div>
  }

  const renderTopPodcasts = () => {
    if (topPodcastsView === 'list') {
      return (
        <div className=" divide-y divide-white/5">
          {topPodcasts.map((podcast, index) => (
            renderListview(podcast, index)
          ))}
        </div>
      );
    }

    if (topPodcastsView === 'grid') {
      return (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(224px,1fr))] place-items-center">
          {topPodcasts.map((podcast) => renderCard(podcast))}
        </div>
      );
    }

    return (
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scroll" dir={isRTL ? 'rtl' : 'ltr'}>
        {topPodcasts.map((podcast, index) => (
          <div
            key={`${podcast.trackId ?? podcast.collectionName ?? 'podcast'}-scroll-${index}`}
            className="flex-shrink-0"
          >
            {renderCard(podcast)}
          </div>
        ))}
      </div>
    );
  };

  const renderEpisodeTile = (podcast: Podcast, index: number) => {

    return (
      <div
        key={`${podcast.trackId ?? podcast.collectionName ?? 'episode'}-tile-${index}`}
        className="w-90 bg-white/5 border border-white/5 flex flex-col rounded-md hover:border-white/10 transition-colors"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex items-start bg-gradient-to-r from-[#211627] to-[#1a1a26] rounded-md">
          <div className="w-30 h-30">
           <Image className="rounded-md w-full h-full" src={getArtworkUrl(podcast)} alt={podcast.trackName|| 'podcast artwork'} width={100} height={100} />
          </div>

          <div className="flex-1 min-w-0 p-3">
            <div className="flex items-start justify-between">
              <div className="min-w-0 space-y-4">
                <p className="text-xs text-[#e3bd71] truncate">{podcast.artistName}</p>
                <p className="text-md truncate">{podcast.trackName}</p>
                <p className="text-xs text-white/50 truncate">{formatReleaseDate(podcast.releaseDate, locale)}</p>
              </div>
              <div className="flex items-center justify-center">
               <EllipsisVertical  size={20} className="text-white/50 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTopEpisodes = () => {
    if (topEpisodesView === 'list') {
      return (
        <div className=" divide-y divide-white/5">
          {topEpisodes.map((podcast, index) => (
            renderListview(podcast, index)
          ))}
        </div>
      );
    }

    if (topEpisodesView === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 place-items-center">
          {topEpisodes.map((podcast, index) => renderEpisodeTile(podcast, index))}
        </div>
      );
    }

    return (
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scroll" dir={isRTL ? 'rtl' : 'ltr'} style={{ scrollSnapType: 'x proximity' }}>
        {topEpisodes.map((podcast, index) => (
          <div
            key={`${podcast.trackId ?? podcast.collectionName ?? 'episode'}-scroll-${index}`}
            className="flex-shrink-0"
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
          <div className="flex flex-row justify-between gap-3">
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
        <div className="flex flex-row justify-between gap-3">
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


