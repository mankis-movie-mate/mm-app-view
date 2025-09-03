import type { DetailedMovie, Movie } from '@/types/movie';

// Converts a Movie to a DetailedMovie with reasonable defaults for missing fields
export function detailedMovieFromMovie(movie: Movie): DetailedMovie {
  return {
    id: movie.id,
    title: movie.title,
    genres: (movie.genres ?? []).map((name, i) => ({ id: `${i}`, name })), // Fakes id
    director: { firstName: '', lastName: '' }, // Dummy
    casts: [],
    synopsis: '',
    releaseDate: movie.releaseYear ? `${movie.releaseYear}-01-01` : '',
    language: '',
    rating: { average: typeof movie.rating === 'number' ? movie.rating : 0, count: 0 },
    reviews: [],
    posterUrl: movie.posterUrl ?? null,
  };
}
