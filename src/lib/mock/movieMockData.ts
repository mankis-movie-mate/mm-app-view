// src/lib/mock/movieMockData.ts
import type { DetailedMovie, Genre } from '@/types/movie';

// ───────────────────────────────────────────────────────────────────────────────
// Genre catalog (source of truth for mocks)
// ───────────────────────────────────────────────────────────────────────────────

// Use stable, URL-safe ids (good for keys, filters, URLs)
const G = (id: string, name: string): Genre => ({ id, name });

export const mockGenres: Genre[] = [
    G('sci-fi', 'Sci-Fi'),
    G('thriller', 'Thriller'),
    G('action', 'Action'),
    G('animation', 'Animation'),
    G('fantasy', 'Fantasy'),
    G('drama', 'Drama'),
    G('comedy', 'Comedy'),
];

// Fast lookup maps
const genreById = new Map(mockGenres.map((g) => [g.id, g]));
const genreByName = new Map(mockGenres.map((g) => [g.name, g]));

// Helper getters (defensive: create fallback on the fly if needed)
const getGenreById = (id: string): Genre =>
    genreById.get(id) ?? { id, name: id };

const getGenreByName = (name: string): Genre =>
    genreByName.get(name) ?? { id: name.toLowerCase(), name };

// ───────────────────────────────────────────────────────────────────────────────
// Genre → movie id mapping (keys = genre ids)
// ───────────────────────────────────────────────────────────────────────────────

export const mockMovieIdsByGenre: Record<string, string[]> = {
    'sci-fi': ['m1', 'm2'],
    thriller: ['m1', 'm4'],
    action: ['m2'],
    animation: ['m3'],
    fantasy: ['m3'],
    drama: ['m4', 'm5'],
    comedy: ['m5'],
};

// For quick “top” lists in UI (cards, chips, etc.)
export const mockTopGenres: Genre[] = [
    getGenreById('sci-fi'),
    getGenreById('drama'),
    getGenreById('thriller'),
];

// ───────────────────────────────────────────────────────────────────────────────
// Detailed movies (now using Genre[] instead of string[])
// ───────────────────────────────────────────────────────────────────────────────

export function mockDetailedMovie(id: string): DetailedMovie {
    const movies: Record<string, DetailedMovie> = {
        m1: {
            id: 'm1',
            title: 'Inception',
            genres: [getGenreByName('Sci-Fi'), getGenreByName('Thriller')],
            director: { firstName: 'Christopher', lastName: 'Nolan' },
            casts: [
                { firstName: 'Leonardo', lastName: 'DiCaprio' },
                { firstName: 'Joseph', lastName: 'Gordon-Levitt' },
            ],
            synopsis:
                'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
            releaseDate: '2010-07-16',
            language: 'English',
            rating: { average: 8.8, count: 2000 },
            reviews: [
                {
                    user: 'neo',
                    comment: 'Mind-bending and brilliant!',
                    rating: 9,
                    dateCreated: '2021-10-01T10:00:00Z',
                },
                {
                    user: 'arjun',
                    comment: 'Nolan at his best. Stunning visuals.',
                    rating: 10,
                    dateCreated: '2023-06-05T15:30:00Z',
                },
            ],
            posterUrl: null,
        },

        m2: {
            id: 'm2',
            title: 'The Matrix',
            genres: [getGenreByName('Sci-Fi'), getGenreByName('Action')],
            director: { firstName: 'Lana', lastName: 'Wachowski' },
            casts: [
                { firstName: 'Keanu', lastName: 'Reeves' },
                { firstName: 'Carrie-Anne', lastName: 'Moss' },
            ],
            synopsis:
                'A hacker discovers the world is a simulation and joins a rebellion to break free from it.',
            releaseDate: '1999-03-31',
            language: 'English',
            rating: { average: 8.7, count: 3000 },
            reviews: [
                {
                    user: 'trinity',
                    comment: 'A game-changer in science fiction.',
                    rating: 10,
                    dateCreated: '2022-12-11T08:22:00Z',
                },
                {
                    user: 'morpheus',
                    comment: 'You take the red pill and go down the rabbit hole.',
                    rating: 9,
                    dateCreated: '2023-02-01T18:45:00Z',
                },
            ],
            posterUrl: null,
        },

        m3: {
            id: 'm3',
            title: 'Spirited Away',
            genres: [getGenreByName('Animation'), getGenreByName('Fantasy')],
            director: { firstName: 'Hayao', lastName: 'Miyazaki' },
            casts: [],
            synopsis:
                'A young girl enters a magical world ruled by gods, spirits, and a witch.',
            releaseDate: '2001-07-20',
            language: 'Japanese',
            rating: { average: 8.6, count: 2500 },
            reviews: [
                {
                    user: 'haku',
                    comment: 'Beautifully animated and deeply emotional.',
                    rating: 10,
                    dateCreated: '2021-05-25T14:00:00Z',
                },
            ],
            posterUrl: null,
        },

        m4: {
            id: 'm4',
            title: 'Parasite',
            genres: [getGenreByName('Drama'), getGenreByName('Thriller')],
            director: { firstName: 'Bong', lastName: 'Joon-ho' },
            casts: [
                { firstName: 'Song', lastName: 'Kang-ho' },
                { firstName: 'Choi', lastName: 'Woo-shik' },
            ],
            synopsis:
                'A poor family schemes to become employed by a wealthy family by infiltrating their household.',
            releaseDate: '2019-05-30',
            language: 'Korean',
            rating: { average: 8.6, count: 1800 },
            reviews: [
                {
                    user: 'min',
                    comment: 'Masterpiece of class commentary.',
                    rating: 9,
                    dateCreated: '2022-03-12T12:45:00Z',
                },
                {
                    user: 'sofia',
                    comment: 'Darkly funny and terrifying.',
                    rating: 9,
                    dateCreated: '2023-01-05T09:30:00Z',
                },
            ],
            posterUrl: null,
        },

        m5: {
            id: 'm5',
            title: 'The Grand Budapest Hotel',
            genres: [getGenreByName('Comedy'), getGenreByName('Drama')],
            director: { firstName: 'Wes', lastName: 'Anderson' },
            casts: [
                { firstName: 'Ralph', lastName: 'Fiennes' },
                { firstName: 'Tony', lastName: 'Revolori' },
            ],
            synopsis:
                'A hotel concierge teams up with a lobby boy to prove his innocence after being framed for murder.',
            releaseDate: '2014-03-07',
            language: 'English',
            rating: { average: 8.1, count: 1600 },
            reviews: [
                {
                    user: 'gustave',
                    comment: 'Stylish, whimsical, and full of heart.',
                    rating: 8,
                    dateCreated: '2021-08-19T20:15:00Z',
                },
            ],
            posterUrl: null,
        },
    };

    return (
        movies[id] || {
            id,
            title: 'Unknown Movie',
            genres: [], // empty Genre[]
            director: { firstName: 'Unknown', lastName: 'Director' },
            casts: [],
            synopsis: 'No synopsis available.',
            releaseDate: '',
            language: '',
            rating: { average: 0.0, count: 0 },
            reviews: [],
            posterUrl: null,
        }
    );
}

export const mockDetailedMovies: DetailedMovie[] = [
    mockDetailedMovie('m1'),
    mockDetailedMovie('m2'),
    mockDetailedMovie('m3'),
    mockDetailedMovie('m4'),
    mockDetailedMovie('m5'),
];
