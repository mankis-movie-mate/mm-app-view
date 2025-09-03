// src/lib/api/activityApi.ts
import { fetchApiWithAuth } from './fetchApi';
import { PaginatedWatchlists, Watchlist } from '@/types/watchlist';
import { devMockWatchlists } from '@/lib/mock/watchlistMockData';

const ACTIVITY_BASE = `${process.env.NEXT_PUBLIC_ACTIVITY_URL}/mm-activity-service`;
const isDev = process.env.NEXT_PUBLIC_NODE_ENV === 'development';

/**
 * Adds a movie to the user's watchlist
 */
export async function addToWatchlist(movieId: string): Promise<void> {
  return fetchApiWithAuth<void>(`${ACTIVITY_BASE}/watchlist`, {
    method: 'POST',
    body: JSON.stringify({ movieId }),
  });
}

/**
 * Submits a user review (rating + comment) for a movie
 */
export async function submitReview(
  movieId: string,
  rating: number,
  comment: string,
): Promise<void> {
  return fetchApiWithAuth<void>(`${ACTIVITY_BASE}/reviews`, {
    method: 'POST',
    body: JSON.stringify({
      movieId,
      rating,
      comment,
    }),
  });
}

/**
 * ✅ Get all watchlists for a user (paginated)
 */
export async function getUserWatchlists(
  username: string,
  page = 1,
  size = 10,
): Promise<PaginatedWatchlists> {
  if (isDev) {
    const elements = devMockWatchlists.elements.filter((wl) => wl.username === username);
    const start = (page - 1) * size;
    const paginated = elements.slice(start, start + size);

    return {
      pageNo: page,
      pageSize: size,
      totalElements: elements.length,
      totalPages: Math.ceil(elements.length / size),
      isLast: page * size >= elements.length,
      elements: paginated,
    };
  }

  // const res = await fetchApiWithAuth(
  //   `${ACTIVITY_BASE}/watchlist/all-by-user/${username}?page=${page}&size=${size}`,
  // );
  // if (!res.ok) throw new Error('Failed to fetch watchlists');
  // const data = await res.json();
    return {elements: [], isLast: false, pageNo: 0, pageSize: 0, totalElements: 0, totalPages: 0}
}

/**
 * ✅ Get one watchlist by its ID
 */
export async function getWatchlistById(id: string): Promise<Watchlist> {
  if (isDev) {
    const watchlist = devMockWatchlists.elements.find((wl) => wl.id === id);
    if (!watchlist) throw new Error(`Watchlist ${id} not found`);
    return watchlist;
  }

  // const res = await fetchApiWithAuth(`${ACTIVITY_BASE}/watchlist/${id}`);
  // if (!res.ok) throw new Error('Failed to fetch watchlist');
  // const data = await res.json();
    return {id: "", movies_id: [], name: "", updated_date: "", username: ""};

}

/**
 * ✅ Create new watchlist
 */
export async function createWatchlist(
  watchlist: Omit<Watchlist, 'id' | 'updated_date'>,
): Promise<Watchlist> {
  if (isDev) {
    const newWatchlist: Watchlist = {
      ...watchlist,
      id: 'mock-' + Math.random().toString(36).substring(2),
      updated_date: new Date().toISOString(),
    };
    devMockWatchlists.elements.push(newWatchlist);
    return newWatchlist;
  }

  // const res = await fetchApiWithAuth(`${ACTIVITY_BASE}/watchlist`, {
  //   method: 'POST',
  //   body: JSON.stringify(watchlist),
  // });
  // const data = await res.json();
  return {id: "", movies_id: [], name: "", updated_date: "", username: ""};
}

/**
 * ✅ Update an existing watchlist
 */
export async function updateWatchlist(id: string, updates: Partial<Watchlist>): Promise<Watchlist> {
  if (isDev) {
    const idx = devMockWatchlists.elements.findIndex((wl) => wl.id === id);
    if (idx === -1) throw new Error('Watchlist not found');
    const updated = {
      ...devMockWatchlists.elements[idx],
      ...updates,
      updated_date: new Date().toISOString(),
    };
    devMockWatchlists.elements[idx] = updated;
    return updated;
  }

  // const res = await fetchApiWithAuth(`${ACTIVITY_BASE}/watchlist/${id}`, {
  //   method: 'PATCH',
  //   body: JSON.stringify(updates),
  // });
  // const data = await res.json();
    return {id: "", movies_id: [], name: "", updated_date: "", username: ""};

}

/**
 * ✅ Delete watchlist
 */
export async function deleteWatchlist(id: string): Promise<void> {
  if (isDev) {
    const idx = devMockWatchlists.elements.findIndex((wl) => wl.id === id);
    if (idx === -1) throw new Error('Watchlist not found');
    devMockWatchlists.elements.splice(idx, 1);
    return;
  }

  // const res = await fetchApiWithAuth(`${ACTIVITY_BASE}/watchlist/${id}`, {
  //   method: 'DELETE',
  // });
  //
  // if (!res.ok) {
  //   const err = await res.text();
  //   throw new Error(err || 'Failed to delete watchlist');
  // }
}
