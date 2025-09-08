import type { DetailedMovie, Genre } from '@/types/movie';
import { Movie } from '@/types/recommendation';
import { MovieRating } from '@/types/rating';
import { parseMongoDate, parseMongoId } from '@/types/mapper/mongoDbHelper';

export interface BackendMovie {
  _id?: { $oid: string } | string;
  id?: string;
  title: string;
  genres: string[]; // If backend sends array of string genres
  director: { firstName: string; lastName: string };
  casts: { firstName: string; lastName: string }[];
  synopsis: string;
  timestamp?: { $date: string } | string; // Mongo/ISO date
  releaseDate?: string;
  language: string;
  rating: { average: number; count: number };
  reviews: []; // You can type this further if you know the shape
  posterUrl?: string | null;
}

export interface BackendPaginatedMovies {
  pageNo?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  isLast?: boolean;
  elements: BackendMovie[];
}

export interface BackendMovieRating {
  _id?: { $oid: string } | string;
  id?: string;
  movie_id: string;
  username: string;
  rate: number;
  review_text?: string;
  review?: string;
  tags?: string[];
  timestamp?: { $date: string } | string;
  created_at?: string;
  update_date?: { $date: string } | string;
  updated_at?: string;
}

export interface BackendPaginatedRatings {
  pageNo?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  isLast?: boolean;
  elements: BackendMovieRating[];
}

export function mapBackendMovie(movie: BackendMovie): DetailedMovie {
  return {
    id: parseMongoId(movie._id ?? movie.id),
    title: movie.title,
    genres: Array.isArray(movie.genres)
      ? movie.genres.map(
          (g: string): Genre => ({
            id: g.toLowerCase().replace(/\s+/g, '-'),
            name: g,
          }),
        )
      : [],
    director: movie.director,
    // Fix: Convert string[] to Cast[]
    casts: Array.isArray(movie.casts)
      ? movie.casts.map(({ firstName, lastName }) => ({ firstName, lastName }))
      : [],
    synopsis: movie.synopsis,
    releaseDate: parseMongoDate(movie.timestamp ?? movie.releaseDate),
    language: movie.language,
    rating: movie.rating,
    reviews: movie.reviews,
    posterUrl: movie.posterUrl || null,
  };
}

export function mapBackendMovies(arr: BackendMovie[]): DetailedMovie[] {
  return Array.isArray(arr) ? arr.map(mapBackendMovie) : [];
}

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

export function mapMovieRating(raw: BackendMovieRating): MovieRating {
  return {
    id: parseMongoId(raw._id ?? raw.id),
    movie_id: raw.movie_id,
    username: raw.username,
    rate: raw.rate,
    review: raw.review_text ?? raw.review ?? '',
    tags: raw.tags ?? [],
    created_at: parseMongoDate(raw.timestamp ?? raw.created_at),
    updated_at: parseMongoDate(raw.update_date ?? raw.updated_at),
  };
}