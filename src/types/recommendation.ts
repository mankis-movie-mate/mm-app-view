import { ActivityType } from '@/types/movie';

export interface RecommendedItem {
  movie: Movie;
  score: number;
  explanations: RecommendationExplanation[] | null;
}

export interface RecommendationExplanation {
  seedMovieId: string;
  seedMovieTitle: string;
  similarity: number; // 0..1
  activityType: ActivityType;
}

export interface RecommendationsResponse {
  userId: string;
  recommended: RecommendedItem[];
}

/**
 * Lightweight movie for lists/search. Now uses Genre[] instead of string[].
 */
export interface Movie {
  id: string;
  title: string;

  genres: string[];
  releaseYear: number;
  rating?: number | null;
  posterUrl?: string | null;
}