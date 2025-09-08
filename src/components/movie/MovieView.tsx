// File: components/movie/MovieView.tsx
'use client';

import { useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import type { DetailedMovie } from '@/types/movie';
import type { MovieRating } from '@/types/rating';
import { HeroSection } from './HeroSection';
import { Summary } from './Summary';
import { ReviewsSection } from './ReviewSection';

export function MovieView({
  movie,
  id,
  ratings,
  isRatingsLoading,
  refetchRatings,
}: {
  movie: DetailedMovie;
  id: string;
  ratings: MovieRating[];
  isRatingsLoading: boolean;
  refetchRatings: () => void;
}) {
  const { user } = useAuth();
  const myRating = user ? ratings.find((r) => r.username === user.username) : undefined;

  // precompute for summary (same as your working code)
  const { genres = [], director, casts = [] } = movie;
  const genreNames = useMemo(() => genres.map((g) => g.name).filter(Boolean), [genres]);
  const directorName = [director?.firstName, director?.lastName].filter(Boolean).join(' ') || '—';
  const castNames = casts
    .map((c) => [c.firstName, c.lastName].filter(Boolean).join(' '))
    .filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-indigo-950/80 backdrop-blur border-b border-white/10">
        <Header />
      </header>

      {/* Hero + Summary */}
      <HeroSection movie={movie}>
        <Summary
          movie={movie}
          movieId={id}
          ratings={ratings}
          isRatingsLoading={isRatingsLoading}
          directorName={directorName}
          castNames={castNames}
          genreNames={genreNames}
        />
      </HeroSection>

      {/* Reviews + Composer */}
      <ReviewsSection
        movieId={id}
        ratings={ratings}
        isRatingsLoading={isRatingsLoading}
        myRating={myRating}
        refetchRatings={refetchRatings}
      />

      {/* Footer */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}
