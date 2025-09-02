// src/types/movies.ts
export type ActivityType = "WATCHLISTED" | "RATED" | string;

export interface RecommendationExplanation {
    seedMovieId: string;
    seedMovieTitle: string;
    similarity: number; // 0..1
    activityType: ActivityType;
}

export interface Movie {
    id: string;
    title: string;
    genres: string[];
    releaseYear: number;
    rating?: number | null;
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
