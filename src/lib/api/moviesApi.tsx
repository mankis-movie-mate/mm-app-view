import { fetchApiWithAuth } from '@/lib/api/fetchApi';
import { DetailedMovie, Genre, RecommendationsResponse } from '@/types/movie';
import {
  mockDetailedMovie,
  mockDetailedMovies,
  mockGenres,
  mockMovieIdsByGenre,
  mockTopGenres,
} from '@/lib/mock/movieMockData';
import { IS_DEV } from '@/lib/constants/global';
import { mockRecommendations } from '@/lib/mock/mockRecommendationData';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const MOVIES_URL = `${API}/mm-movie-service/movies`;
const ENV = process.env.NEXT_PUBLIC_NODE_ENV;

export async function searchMovies(query: string): Promise<DetailedMovie[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Simple: search in title, genres, and director
  return mockDetailedMovies.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.genres.some((g: Genre) => g.name?.toLowerCase().includes(q)) ||
      (m.director.firstName + ' ' + m.director.lastName).toLowerCase().includes(q),
  );
}

export async function getRecommendations(
  userId: number | string,
): Promise<RecommendationsResponse> {
  if (IS_DEV) {
    return mockRecommendations;
  }
  if (userId) {
    const url = `${API}/mm-recommendation-service/recommend/${userId}?detailed=true`;
    return fetchApiWithAuth<RecommendationsResponse>(url);
  }
  return { recommended: [], userId: '' };
}

export async function getMovieById(id: string): Promise<DetailedMovie> {
  if (ENV === 'development') {
    return mockDetailedMovie(id);
  }
  return fetchApiWithAuth<DetailedMovie>(`${MOVIES_URL}/${id}`);
}

export async function getMoviesByIds(ids: string[]): Promise<DetailedMovie[]> {
  if (ENV === 'development') {
    return mockDetailedMovies.filter((m) => ids.includes(m.id));
  }
  return fetchApiWithAuth<DetailedMovie[]>(`${MOVIES_URL}/by-ids`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}

export async function getMovieIdsByGenres(genres: string[]): Promise<string[]> {
  if (ENV === 'development') {
    // simplistic: take the first genre; expand if you need multi-genre union/intersection
    return mockMovieIdsByGenre[genres[0]] ?? [];
  }
  return fetchApiWithAuth<string[]>(`${MOVIES_URL}/by-genres`, {
    method: 'POST',
    body: JSON.stringify({ genres }),
  });
}

export async function getAllGenres(): Promise<Genre[]> {
  if (ENV === 'development') {
    return mockGenres;
  }
  return fetchApiWithAuth<Genre[]>(`${MOVIES_URL}/genres`);
}

export async function getTopGenres(): Promise<Genre[]> {
  if (ENV === 'development') {
    return mockTopGenres;
  }
  return fetchApiWithAuth<Genre[]>(`${MOVIES_URL}/genres/top`);
}
