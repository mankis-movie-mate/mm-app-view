// File: components/movie/Summary.tsx
'use client';

import { useMemo } from 'react';
import type { DetailedMovie } from '@/types/movie';
import type { MovieRating } from '@/types/rating';
import { Spinner } from '@/components/Spinner';
import { AddToWatchlistsDialog } from '@/components/watchlist/AddToWatchlistsDialog';
import { Badge, CastRow, MetaRow } from './SummaryBits';
import { renderStars } from './Stars';

const getYear = (iso?: string) => (iso ? new Date(iso).getFullYear() : '—');

export function Summary({
                          movie,
                          movieId,
                          ratings,
                          isRatingsLoading,
                          directorName,
                          castNames,
                          genreNames,
                        }: {
  movie: DetailedMovie;
  movieId: string;
  ratings: MovieRating[];
  isRatingsLoading: boolean;
  directorName: string;
  castNames: string[];
  genreNames: string[];
}) {
  const { title, synopsis, releaseDate, language } = movie;
  const year = getYear(releaseDate);

  const averageRatingText = useMemo(() => {
    if (!ratings.length) return null;
    const avg = (ratings.reduce((sum, r) => sum + (r.rate ?? 0), 0) / ratings.length).toFixed(2);
    return avg;
  }, [ratings]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">{title}</h1>

      <div className="flex flex-wrap items-center gap-2 text-sm text-white/80">
        <Badge>{year}</Badge>
        {language && <Badge className="uppercase">{language}</Badge>}
        {genreNames.slice(0, 4).map((g) => (
          <Badge key={g}>{g}</Badge>
        ))}
        {genreNames.length > 4 && <Badge>+{genreNames.length - 4}</Badge>}
      </div>

      <p className="max-w-3xl text-white/85">{synopsis || 'No synopsis available.'}</p>

      <dl className="grid grid-cols-1 gap-2 text-white/85 sm:grid-cols-2">
        <MetaRow label="Director" value={directorName} />
        <CastRow cast={castNames} />
        <MetaRow
          label="Community Rating"
          value={
            ratings.length > 0 ? (
              <span className="inline-flex items-center gap-1">
                {renderStars(Math.round(Number(averageRatingText)))}
                <span className="ml-1 text-xs text-white/70">({ratings.length})</span>
              </span>
            ) : isRatingsLoading ? (
              <Spinner className="inline h-4 w-4" />
            ) : (
              '—'
            )
          }
        />
      </dl>

      <div className="pt-2">
        <AddToWatchlistsDialog movieId={movieId} />
      </div>
    </div>
  );
}
