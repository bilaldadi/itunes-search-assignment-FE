import { ApiResponse } from '@/types/podcast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function searchPodcasts(query: string): Promise<ApiResponse> {
  if (!query.trim()) {
    return { resultCount: 0, results: [] };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/search/${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw error;
  }
}

