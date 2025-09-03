import type { RecommendationsResponse } from '@/types/movie';

export const mockRecommendations: RecommendationsResponse = {
    userId: "devuser",
    recommended: [
        {
            movie: {
                id: "m1",
                title: "Inception",
                genres: ["Sci-Fi", "Thriller"],
                releaseYear: 2010,
                rating: 8.8,
                posterUrl: null,
            },
            score: 0.97,
            explanations: [
                {
                    seedMovieId: "m2",
                    seedMovieTitle: "The Matrix",
                    similarity: 0.81,
                    activityType: "WATCHLISTED",
                },
            ],
        },
        {
            movie: {
                id: "m3",
                title: "Spirited Away",
                genres: ["Animation", "Fantasy"],
                releaseYear: 2001,
                rating: 8.6,
                posterUrl: null,
            },
            score: 0.79,
            explanations: [
                {
                    seedMovieId: "m4",
                    seedMovieTitle: "Parasite",
                    similarity: 0.63,
                    activityType: "RATED",
                },
            ],
        },
    ],
};