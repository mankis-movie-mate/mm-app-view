import { fetchApiWithAuth } from '@/lib/api/fetchApi';
import { DetailedMovie, Genre, PaginatedMovies } from '@/types/movie';
import {
  mockDetailedMovie,
  mockDetailedMovies,
  mockGenres,
  mockTopGenres,
} from '@/lib/mock/movieMockData';
import { IS_DEV } from '@/lib/constants/global';
import {
  BackendMovie,
  BackendPaginatedMovies,
  mapBackendMovie,
  mapBackendMovies,
} from '@/types/mapper/movieMapper';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const MOVIES_URL = `${API}/mm-movie-service/api`;


export async function getAllMovies(page = 1, pageSize = 8): Promise<PaginatedMovies> {
  const res = await fetchApiWithAuth<BackendPaginatedMovies>(
    `${MOVIES_URL}/all?page=${page}&pageSize=${pageSize}`,
    { method: 'GET' },

  );
  return {
    pageNo: res.pageNo ?? 1,
    pageSize: res.pageSize ?? pageSize,
    totalElements: res.totalElements ?? res.elements?.length ?? 0,
    totalPages: res.totalPages ?? 1,
    isLast: res.isLast ?? true,
    elements: mapBackendMovies(res.elements),
  };
}


interface SearchMoviesOptions {
    page?: number;
    limit?: number;
}

export async function searchMovies(
    query: string,
    opts: SearchMoviesOptions = {}
): Promise<PaginatedMovies> {
    const q = query.trim();
    if (q.length < 2) {
        return {
            pageNo: 1,
            pageSize: opts.limit || 5,
            totalElements: 0,
            totalPages: 1,
            isLast: true,
            elements: [],
        };
    }

    const page = opts.page || 1;
    const limit = opts.limit || 20;
    const url = `${MOVIES_URL}/search/movie?query=${encodeURIComponent(q)}&page=${page}&limit=${limit}`;

    const res = await fetchApiWithAuth<BackendPaginatedMovies>(url, { method: 'GET' });

    return {
        pageNo: res.pageNo ?? 1,
        pageSize: res.pageSize ?? limit,
        totalElements: res.totalElements ?? res.elements?.length ?? 0,
        totalPages: res.totalPages ?? 1,
        isLast: res.isLast ?? true,
        elements: mapBackendMovies(res.elements || []),
    };
}


export async function getMoviesByIds(ids: string[]): Promise<DetailedMovie[]> {
  if (IS_DEV) {
    return mockDetailedMovies.filter((m) => ids.includes(m.id));
  }
  if (!ids?.length) return [];

  const res = await fetchApiWithAuth<BackendMovie[]>(`${MOVIES_URL}/all-by-ids`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
    headers: { 'Content-Type': 'application/json' },
  });

  return mapBackendMovies(res);
}


export async function getMovieById(id: string): Promise<DetailedMovie> {
  if (IS_DEV) {
    return mockDetailedMovie(id);

  }
  const res = await fetchApiWithAuth<BackendMovie>(`${MOVIES_URL}/${id}`);
  return mapBackendMovie(res);
}

export async function getAllGenres(): Promise<Genre[]> {
  if (IS_DEV) {
    return mockGenres;
  }
  return fetchApiWithAuth<Genre[]>(`${MOVIES_URL}/genres`);
}

export async function getTopGenres(): Promise<Genre[]> {
  if (IS_DEV) {
    return mockTopGenres;
  }
  return fetchApiWithAuth<Genre[]>(`${MOVIES_URL}/genres/top`);
}
