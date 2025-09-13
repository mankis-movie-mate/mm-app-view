'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MovieCard from '@/components/movie/MovieCard';
import RecommendationCard from '@/components/recommendation/RecommendationCard';
import { Spinner } from '@/components/Spinner';
import { Skeleton } from '@/components/Skeleton';
import { getAllMovies, searchMovies } from '@/lib/api/moviesApi';
import type { DetailedMovie, PaginatedMovies } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import { useRequireUser } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/utils';
import { getRecommendations } from '@/lib/api/recommendationApi';
import { RecommendationsResponse } from '@/types/recommendation';

const PAGE_SIZE = 8;

export default function RecommendPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebouncedValue(query, 350);
  const user = useRequireUser();

  useEffect(() => {
    setPage(1); // reset to first page when query changes
  }, [debounced]);

  // 1. Fetch search results (enabled only if searching)
  const {
    data: searchResults,
    isFetching: isSearching,
    isError: isSearchError,
    error: searchError,
  } = useQuery<DetailedMovie[]>({
    queryKey: ['movies', 'search', debounced],
    queryFn: () => searchMovies(debounced),
    enabled: debounced.trim().length > 0,
    staleTime: 30_000,
  });

  // 2. Fetch paginated all-movies (enabled only if NOT searching)
  const {
    data: allMovies,
    isFetching: isLoadingAllMovies,
    isError: isAllMoviesError,
    error: allMoviesError,
  } = useQuery<PaginatedMovies>({
    queryKey: ['movies', 'all', page, PAGE_SIZE],
    queryFn: () => getAllMovies(page, PAGE_SIZE),
    enabled: debounced.trim().length === 0,
    staleTime: 30_000,
  });

  // 3. Recommendations as before
  const {
    data: recResp,
    isFetching: isRecsLoading,
    isError: isRecsError,
    error: recsError,
  } = useQuery<RecommendationsResponse>({
    queryKey: ['movies', 'recommendations'],
    queryFn: () => getRecommendations(user!.username),
    staleTime: 60_000,
  });

  const recs = recResp?.recommended ?? [];

  // 4. Get movies to display: prefer searchResults if searching, otherwise allMovies.elements
  const moviesToShow = useMemo(() => {
    if (debounced.trim().length > 0) {
      return searchResults || [];
    } else {
      return allMovies?.elements || [];
    }
  }, [debounced, searchResults, allMovies]);

  // 5. Total pages logic
  const totalPages = useMemo(() => {
    if (debounced.trim().length > 0) return 1; // If searching, all results on one page (or you can implement search pagination)
    return allMovies?.totalPages ?? 0;
  }, [debounced, allMovies]);

  // 6. Loading/Error states
  const isLoading = debounced.trim().length > 0 ? isSearching : isLoadingAllMovies;
  const isError = debounced.trim().length > 0 ? isSearchError : isAllMoviesError;
  const errorMsg =
    debounced.trim().length > 0
      ? (getErrorMessage(searchError) ?? 'Failed to load search results.')
      : (getErrorMessage(allMoviesError) ?? 'Failed to load movies.');

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
      <header className="sticky top-0 z-40 bg-indigo-950/80 backdrop-blur border-b border-white/10">
        <Header />
      </header>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-20%] h-[480px] w-[480px] rounded-full bg-indigo-600/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[520px] w-[520px] rounded-full bg-fuchsia-600/20 blur-3xl"
      />
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 pb-8 pt-4">
        <section>
          <div className="flex items-center gap-3">
            <div className="relative w-full">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies"
                className="w-full rounded-2xl bg-white/10 px-5 py-3 text-base text-white placeholder:text-white/50 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-indigo-400 transition"
                aria-label="Search movies"
              />
              {isLoading && (
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <Spinner className="h-5 w-5 border-indigo-300" />
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-[1fr_270px]">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-white/70">
              {debounced ? `Results for “${debounced}”` : 'All Movies'}
            </h2>
            {isLoading && <ResultsSkeleton />}
            {isError && <ErrorBox message={errorMsg} />}
            {!isLoading && debounced && moviesToShow.length === 0 && (
              <InfoBox message="No results. Try a different query (e.g. “space drama”, “thriller 2019”)." />
            )}
            {!isLoading && moviesToShow.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {moviesToShow.map((m: DetailedMovie) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
                {/* Pagination: only for all-movies */}
                {debounced.trim().length === 0 && (
                  <div className="mt-6 flex justify-center gap-3 text-sm">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg border border-white/20 px-4 py-1.5 text-white/80 hover:bg-white/10 disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="self-center text-white/60">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="rounded-lg border border-white/20 px-4 py-1.5 text-white/80 hover:bg-white/10 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          <aside className="relative md:sticky md:top-[88px]">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                Picks
              </span>
              <h2 className="text-sm font-semibold text-white/85">Recommended for you</h2>
            </div>

            {isRecsLoading && <RecsSkeleton />}
            {isRecsError && (
              <ErrorBox message={getErrorMessage(recsError) ?? 'Failed to load recommendations.'} />
            )}

            {!isRecsLoading && recs?.length > 0 && (
              <div className="space-y-3">
                {recs.slice(0, 6).map((rec) => (
                  <div key={`rec-${rec.movie.id}`} className="relative">
                    <div
                      aria-hidden
                      className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-gradient-to-b from-fuchsia-400/70 to-indigo-400/70"
                    />
                    <div className="pl-3">
                      <RecommendationCard rec={rec} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </section>
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

/* --- Utilities and skeletons as in your code --- */
function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur">
          <Skeleton className="aspect-[2/3] w-full rounded-xl" />
          <Skeleton className="mt-3 h-4 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function RecsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur">
          <Skeleton className="aspect-[2/3] w-full rounded-xl" />
          <Skeleton className="mt-3 h-4 w-1/2" />
          <Skeleton className="mt-2 h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
      {message}
    </div>
  );
}

function InfoBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
      {message}
    </div>
  );
}
