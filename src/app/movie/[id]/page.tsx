// File: app/movie/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getMovieById } from '@/lib/api/moviesApi';
import { getRatingByMovieId } from '@/lib/api/activityApi';
import type { DetailedMovie } from '@/types/movie';
import { MovieView } from '@/components/movie/MovieView';
import { ErrorFrame, LoadingFrame } from '@/components/movie/Frames';
import { MovieRating } from '@/types/rating';

export default function MoviePage() {
  const { id } = useParams();

  // Movie detail query
  const {
    data: movie,
    isLoading: isLoadingMovie,
    isError: isMovieError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id as string),
    enabled: !!id,
    staleTime: 60_000,
    retry: 1,
  });

  // Ratings for this movie
  const {
    data: ratingsRaw,
    isLoading: isLoadingRatings,
    refetch: refetchRatings,
  } = useQuery({
    queryKey: ['ratings', id],
    queryFn: () => getRatingByMovieId(id as string),
    enabled: !!id,
    staleTime: 60_000,
    retry: 1,
  });

  // Defensive: always array
  const ratings: MovieRating[] = Array.isArray(ratingsRaw) ? ratingsRaw : [];

  if (isLoadingMovie) return <LoadingFrame />;
  if (isMovieError || !movie) return <ErrorFrame error={error} onRetry={() => refetch()} />;

  return (
    <MovieView
      movie={movie as DetailedMovie}
      id={id as string}
      ratings={ratings}
      isRatingsLoading={isLoadingRatings}
      refetchRatings={refetchRatings}
    />
  );
}
