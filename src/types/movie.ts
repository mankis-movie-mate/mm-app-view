// src/types/movies.ts
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

export interface Movie { id: string; title: string; genres: string[]; releaseYear: number; rating?: number | null; posterUrl?: string | null; }

export interface DetailedMovie {
  id: string;
  title: string;
  genres: string[];
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
  movie: Movie;
  score: number; // 0..1
  explanations: RecommendationExplanation[] | null;
}

export interface RecommendationsResponse {
  userId: string;
  recommended: RecommendedItem[];
}
