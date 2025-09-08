import { fetchApiWithAuth } from './fetchApi';
import { PaginatedWatchlists, Watchlist } from '@/types/watchlist';
import { MovieRating, SubmitRatingPayload } from '@/types/rating';
import { devMockWatchlists } from '@/lib/mock/watchlistMockData';
import { IS_DEV } from '@/lib/constants/global';
import {
  BackendMovieRating,
  BackendPaginatedRatings,
  mapMovieRating,
} from '@/types/mapper/movieMapper';
import {
  BackendPaginatedWatchlists,
  BackendWatchlist,
  mapPaginatedWatchlists,
  mapWatchlist,
} from '@/types/mapper/watchlistMapper';

const ACTIVITY_BASE = `${process.env.NEXT_PUBLIC_API_URL}/mm-activity-service/api`;

/** --- WATCHLIST API --- **/
export async function getUserWatchlists(
  username: string,
  page = 1,
  size = 10,
): Promise<PaginatedWatchlists> {
  if (IS_DEV) {
    // Mock version
    const filtered = devMockWatchlists.elements.filter((wl) => wl.username === username);
    const start = (page - 1) * size;
    const paginated = filtered.slice(start, start + size);
    return mapPaginatedWatchlists({
      pageNo: page,
      pageSize: size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      isLast: page * size >= filtered.length,
      elements: paginated,
    });
  }
  const raw = await fetchApiWithAuth<BackendPaginatedWatchlists>(
    `${ACTIVITY_BASE}/watchlist/all-by-user/${username}?page=${page}&size=${size}`,
  );
  return mapPaginatedWatchlists(raw);
}

export async function getWatchlistById(id: string): Promise<Watchlist> {
  if (IS_DEV) {
    const wl = devMockWatchlists.elements.find((wl) => wl.id === id);
    if (!wl) throw new Error(`Watchlist ${id} not found`);
    return mapWatchlist(wl);
  }
  const raw = await fetchApiWithAuth<BackendWatchlist>(`${ACTIVITY_BASE}/watchlist/${id}`);
  return mapWatchlist(raw);
}

export async function createWatchlist(
  watchlist: Omit<Watchlist, 'id' | 'updated_date'>,
): Promise<Watchlist> {
  if (IS_DEV) {
    const newWl = {
      ...watchlist,
      id: 'mock-' + Math.random().toString(36).substring(2),
      updated_date: new Date().toISOString(),
    };
    devMockWatchlists.elements.push(newWl);
    return mapWatchlist(newWl);
  }
  const raw = await fetchApiWithAuth<BackendWatchlist>(`${ACTIVITY_BASE}/watchlist/`, {
    method: 'POST',
    body: JSON.stringify(watchlist),
    headers: { 'Content-Type': 'application/json' },
  });
  return mapWatchlist(raw);
}

export async function updateWatchlist(id: string, updates: Partial<Watchlist>): Promise<Watchlist> {
  if (IS_DEV) {
    const idx = devMockWatchlists.elements.findIndex((wl) => wl.id === id);
    if (idx === -1) throw new Error('Watchlist not found');
    const updated = {
      ...devMockWatchlists.elements[idx],
      ...updates,
      updated_date: new Date().toISOString(),
    };
    devMockWatchlists.elements[idx] = updated;
    return mapWatchlist(updated);
  }
  const raw = await fetchApiWithAuth<BackendWatchlist>(`${ACTIVITY_BASE}/watchlist/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
    headers: { 'Content-Type': 'application/json' },
  });
  return mapWatchlist(raw);
}

export async function deleteWatchlist(id: string): Promise<string> {
  if (IS_DEV) {
    const idx = devMockWatchlists.elements.findIndex((wl) => wl.id === id);
    if (idx === -1) throw new Error('Watchlist not found');
    devMockWatchlists.elements.splice(idx, 1);
    return id;
  }
  await fetchApiWithAuth(`${ACTIVITY_BASE}/watchlist/${id}`, { method: 'DELETE' });
  return id;
}

/** --- RATING API --- **/
export async function submitRating(payload: SubmitRatingPayload): Promise<MovieRating> {
  if (IS_DEV) {
    return mapMovieRating({
      ...payload,
      id: 'mock-rating-' + Math.random().toString(36).slice(2),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  const raw = await fetchApiWithAuth<BackendMovieRating>(`${ACTIVITY_BASE}/rating/`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  return mapMovieRating(raw);
}

export async function updateRating(
  id: string,
  updates: Partial<Omit<SubmitRatingPayload, 'username' | 'movie_id'>>,
): Promise<MovieRating> {
  if (IS_DEV) {
    return mapMovieRating({
      id,
      movie_id: 'mock-movie-id', // Use any mock movie_id
      username: 'mock-user', // Use any mock username
      rate: updates.rate ?? 5, // Or any default
      review: updates.review ?? 'Updated review',
      tags: updates.tags ?? [],
      updated_at: new Date().toISOString(),
    });
  }
  const raw = await fetchApiWithAuth<BackendMovieRating>(`${ACTIVITY_BASE}/rating/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
    headers: { 'Content-Type': 'application/json' },
  });
  return mapMovieRating(raw);
}

export async function deleteRating(id: string): Promise<{ id: string; deleted: boolean }> {
  if (IS_DEV) return { id, deleted: true };
  await fetchApiWithAuth(`${ACTIVITY_BASE}/rating/${id}`, { method: 'DELETE' });
  return { id, deleted: true };
}

export async function getRatingByMovieId(movie_id: string): Promise<MovieRating[]> {
  if (IS_DEV) {
    // Return mock array (already normalized)
    return [
      {
        id: 'mock-rating-1',
        movie_id,
        username: 'john_doe',
        rate: 5,
        review: 'Loved it! Best movie ever.',
        tags: ['horror', 'classic'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'mock-rating-2',
        movie_id,
        username: 'alice',
        rate: 3,
        review: 'Not bad, but could be better.',
        tags: ['thriller'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
  const data = await fetchApiWithAuth<BackendPaginatedRatings>(
    `${ACTIVITY_BASE}/rating/movie/${movie_id}`,
  );
  const elements = Array.isArray(data?.elements) ? data.elements : [];
  return elements.map(mapMovieRating);
}