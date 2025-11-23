import { Suspense } from 'react';
import { ViewMode } from '@/types/podcast';
import ResultsSection from '@/app/components/ResultsSection';
import { getTranslations } from 'next-intl/server';

type PageSearchParams = {
  q?: string;
  topPodcastsView?: ViewMode;
  topEpisodesView?: ViewMode;
};

type PageProps = {
  searchParams?: Promise<PageSearchParams>;
};

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await (searchParams ?? Promise.resolve<PageSearchParams>({}));
  const rawQuery = resolvedSearchParams.q ?? '';
  const searchTerm = rawQuery.trim();

  const topPodcastsView = parseViewMode(resolvedSearchParams.topPodcastsView, 'scroll');
  const topEpisodesView = parseViewMode(resolvedSearchParams.topEpisodesView, 'grid');
  const t = await getTranslations('search');

  const Loading = (
    <div className="flex items-center justify-center py-28">
      <div className="text-center space-y-4 text-white/70">
        <div className="h-14 w-14 mx-auto rounded-full border-4 border-white/20 border-t-[#7d5bff] animate-spin" />
        <p>{t('loading')}</p>
      </div>
    </div>
  );

  return (
    <Suspense
      key={searchTerm}
      fallback={Loading}
    >
      <ResultsSection
        searchTerm={searchTerm}
        topPodcastsView={topPodcastsView}
        topEpisodesView={topEpisodesView}
      />
    </Suspense>
  );
}

function parseViewMode(value: string | undefined, fallback: ViewMode): ViewMode {
  const allowed: ViewMode[] = ['scroll', 'list', 'grid'];
  if (value && allowed.includes(value as ViewMode)) {
    return value as ViewMode;
  }
  return fallback;
}

