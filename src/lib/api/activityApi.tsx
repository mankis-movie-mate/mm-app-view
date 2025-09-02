// src/lib/api/activityApi.ts
import { fetchApiWithAuth } from './fetchApi';

const ACTIVITY_BASE = `${process.env.NEXT_PUBLIC_ACTIVITY_URL}/mm-activity-service`;

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
export async function submitReview(movieId: string, rating: number, comment: string): Promise<void> {
    return fetchApiWithAuth<void>(`${ACTIVITY_BASE}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
            movieId,
            rating,
            comment,
        }),
    });
}
