'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Podcast, ViewMode } from '@/types/podcast';
import { useTranslations, useLocale } from 'next-intl';

interface PodcastCardProps {
  podcast: Podcast;
  viewMode: ViewMode;
}

export default function PodcastCard({ podcast, viewMode }: PodcastCardProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Get the best available artwork URL
  const artworkUrl = podcast.artworkUrl600 || podcast.artworkUrl100 || podcast.artworkUrl60 || '/placeholder-podcast.png';

  // Truncate description
  const description = podcast.description || '';
  const maxDescriptionLength = viewMode === 'list' ? 200 : 100;
  const truncatedDescription = description.length > maxDescriptionLength && !expanded
    ? description.slice(0, maxDescriptionLength) + '...'
    : description;

  const isRTL = locale === 'ar';

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-4">
        <div className="flex gap-4">
          {/* Artwork */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
              {!imageError ? (
                <Image
                  src={artworkUrl}
                  alt={podcast.trackName || 'Podcast Artwork'}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="128px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0" dir={isRTL ? 'rtl' : 'ltr'}>
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
              {podcast.trackName}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {podcast.artistName}
            </p>
            {description && (
              <div className="text-sm text-gray-700">
                <p>{truncatedDescription}</p>
                {description.length > maxDescriptionLength && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                  >
                    {expanded ? t('showLess') : t('showMore')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid and Scroll views use the same card style (vertical layout)
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden ${viewMode === 'scroll' ? 'flex-shrink-0 w-64' : ''}`}>
      {/* Artwork */}
      <div className="relative w-full aspect-square bg-gray-100">
        {!imageError ? (
          <Image
            src={artworkUrl}
            alt={podcast.trackName || 'Podcast Artwork'}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes={viewMode === 'scroll' ? '256px' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
          {podcast.trackName}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-1 mb-2">
          {podcast.artistName}
        </p>
        {description && (
          <div className="text-sm text-gray-700">
            <p className={expanded ? '' : 'line-clamp-3'}>{truncatedDescription}</p>
            {description.length > maxDescriptionLength && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-600 hover:text-blue-800 text-xs mt-1"
              >
                {expanded ? t('showLess') : t('showMore')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
