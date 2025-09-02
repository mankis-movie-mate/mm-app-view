// src/lib/api/movieApi.ts
import { fetchApi, fetchApiWithAuth } from '@/lib/api/fetchApi';
import {
    DetailedMovie,
    Movie,
    RecommendationsResponse,
    PaginatedMovies, Genre,
} from '@/types/movie';
import {
    mockDetailedMovie,
    mockMovieIdsByGenre,
    mockGenres,
    mockTopGenres, mockDetailedMovies,
} from '@/lib/mock/movieMockData';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const MOVIES_URL = `${API}/mm-movie-service/movies`;
const ENV = process.env.NEXT_PUBLIC_NODE_ENV;

export async function searchMovies(query: string): Promise<DetailedMovie[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Simple: search in title, genres, and director
    return mockDetailedMovies.filter((m) =>
        m.title.toLowerCase().includes(q) ||
        m.genres.some((g: any) =>
            typeof g === 'string'
                ? g.toLowerCase().includes(q)
                : g.name?.toLowerCase().includes(q)
        ) ||
        (m.director.firstName + ' ' + m.director.lastName).toLowerCase().includes(q)
    );
}

export async function getRecommendations(userId: string): Promise<RecommendationsResponse> {
    const url = `${API}/mm-recommendation-service/recommend/${userId}?detailed=true`;
    return fetchApiWithAuth<RecommendationsResponse>(url);
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

export async function getAllMovies(
    page = 1,
    size = 10,
    sortBy = 'title',
    order: 'ASC' | 'DESC' = 'ASC',
): Promise<PaginatedMovies> {
    if (ENV === 'development') {
        // Simple in-memory sort by title/releaseDate/… (extend as needed)
        const sorted = [...mockDetailedMovies].sort((a, b) => {
            const aKey =
                sortBy === 'releaseDate'
                    ? (a.releaseDate ?? '')
                    : sortBy in a
                        ? String((a as any)[sortBy] ?? '')
                        : a.title;
            const bKey =
                sortBy === 'releaseDate'
                    ? (b.releaseDate ?? '')
                    : sortBy in b
                        ? String((b as any)[sortBy] ?? '')
                        : b.title;
            return order === 'ASC' ? aKey.localeCompare(bKey) : bKey.localeCompare(aKey);
        });

        const start = (page - 1) * size;
        const slice = sorted.slice(start, start + size);

        return {
            pageNo: page,
            pageSize: size,
            totalElements: mockDetailedMovies.length,
            totalPages: Math.ceil(mockDetailedMovies.length / size),
            isLast: start + size >= mockDetailedMovies.length,
            elements: slice,
        };
    }

    const url = `${MOVIES_URL}?page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`;
    return fetchApiWithAuth<PaginatedMovies>(url);
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