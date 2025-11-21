export interface Podcast {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl30?: string;
  artworkUrl60?: string;
  artworkUrl100?: string;
  artworkUrl600?: string;
  collectionName?: string;
  collectionViewUrl?: string;
  trackViewUrl?: string;
  feedUrl?: string;
  releaseDate?: string;
  primaryGenreName?: string;
  genres?: string[];
  trackCount?: number;
  country?: string;
  contentAdvisoryRating?: string;
  description?: string;
}

export interface ApiResponse {
  resultCount: number;
  results: Podcast[];
}

export type ViewMode = 'scroll' | 'list' | 'grid';

