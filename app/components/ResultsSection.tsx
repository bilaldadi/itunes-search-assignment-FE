import ResultsContainer from '@/app/components/ResultsContainer';
import { searchPodcasts } from '@/lib/api';
import { Podcast, ViewMode } from '@/types/podcast';

interface ResultsSectionProps {
  searchTerm: string;
  topPodcastsView: ViewMode;
  topEpisodesView: ViewMode;
}

export default async function ResultsSection({
  searchTerm,
  topPodcastsView,
  topEpisodesView,
}: ResultsSectionProps) {
  let podcasts: Podcast[] = [];
  let error: string | null = null;

  if (searchTerm.length > 0) {
    try {
      const response = await searchPodcasts(searchTerm);
      podcasts = response.results ?? [];
    } catch (err) {
      console.error('Search error:', err);
      error = 'fetch-error';
    }
  }

  return (
    <ResultsContainer
      podcasts={podcasts}
      topPodcastsView={topPodcastsView}
      topEpisodesView={topEpisodesView}
      hasSearched={searchTerm.length > 0}
      error={error}
      searchTerm={searchTerm}
    />
  );
}

