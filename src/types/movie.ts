// ───────────────────────────────────────────────────────────────────────────────
// Core domain types
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Frontend-friendly Genre.
 * Use this in your app state and UI. Prefer `id` over Mongo `_id`.
 */
export interface Genre {
  id: string; // mapped from Mongo _id
  name: string;
}

export type ActivityType = 'WATCHLISTED' | 'RATED' | string;

export interface RecommendationExplanation {
  seedMovieId: string;
  seedMovieTitle: string;
  similarity: number; // 0..1
  activityType: ActivityType;
}

export interface Cast {
  firstName: string;
  lastName: string;
}

export interface Director {
  firstName: string;
  lastName: string;
}

export interface Review {
  user: string;
  comment: string;
  rating: number;
  dateCreated: string; // ISO string
}

export interface Rating {
  average: number;
  count: number;
}

/**
 * Lightweight movie for lists/search. Now uses Genre[] instead of string[].
 */
export interface Movie {
  id: string;
  title: string;

  genres: string[]; // <── was string[]
  releaseYear: number;
  rating?: number | null;
  posterUrl?: string | null;
}

/**
 * Full movie detail. Now uses Genre[] instead of string[].
 */
export interface DetailedMovie {
  id: string;
  title: string;
  genres: Genre[];
  director: Director;
  casts: Cast[];
  synopsis?: string;
  releaseDate?: string;
  language?: string;
  rating: Rating;
  reviews: Review[];
  posterUrl?: string | null;
}

export interface RecommendedItem {
  movie: Movie; // keep as Movie; upgrade to DetailedMovie if you want richer cards

  score: number; // 0..1
  explanations: RecommendationExplanation[] | null;
}

export interface RecommendationsResponse {
  userId: string;
  recommended: RecommendedItem[];
}

/**
 * Pagination wrapper for DetailedMovie lists.
 */
export interface PaginatedMovies {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
  elements: DetailedMovie[];
}
