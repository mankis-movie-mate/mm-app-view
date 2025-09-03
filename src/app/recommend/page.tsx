'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import RecommendationCard from '@/components/RecommendationCard';
import { Spinner } from '@/components/Spinner';
import { Skeleton } from '@/components/Skeleton';
import { getRecommendations, searchMovies } from '@/lib/api/moviesApi';
import type { DetailedMovie, RecommendationsResponse } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import { useRequireUser } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/utils';

const PAGE_SIZE = 8;

export default function RecommendPage() {
  return <PageContent />;
}

function PageContent() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebouncedValue(query, 350);
  const user = useRequireUser();

  useEffect(() => {
    setPage(1); // reset to first page when query changes
  }, [debounced]);

  const {
    data: results,
    isFetching: isSearching,
    isError: isSearchError,
    error: searchError,
  } = useQuery<DetailedMovie[]>({
    queryKey: ['movies', 'search', debounced],
    queryFn: () => searchMovies(debounced),
    enabled: debounced.trim().length > 0,
    staleTime: 30_000,
  });

  const {
    data: recResp,
    isFetching: isRecsLoading,
    isError: isRecsError,
    error: recsError,
  } = useQuery<RecommendationsResponse>({
    queryKey: ['movies', 'recommendations'],
    queryFn: () => getRecommendations(user!.id),
    staleTime: 60_000,
  });

  const recs = recResp?.recommended ?? [];

  const paginatedResults = useMemo(() => {
    if (!results) return [];
    const start = (page - 1) * PAGE_SIZE;
    return results.slice(start, start + PAGE_SIZE);
  }, [results, page]);

  const totalPages = useMemo(() => {
    return results ? Math.ceil(results.length / PAGE_SIZE) : 0;
  }, [results]);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-20%] h-[480px] w-[480px] rounded-full bg-indigo-600/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[520px] w-[520px] rounded-full bg-fuchsia-600/20 blur-3xl"
      />

      <Header />

      {/* Search */}
      <section className="mx-auto max-w-6xl px-6 pt-4">
        <div className="flex items-center gap-3">
          <div className="relative w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies"
              className="w-full rounded-2xl bg-white/10 px-5 py-3 text-base text-white placeholder:text-white/50 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-indigo-400 transition"
            />
            {isSearching && (
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <Spinner className="h-5 w-5 border-indigo-300" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main section */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-8 pt-6 md:grid-cols-[1fr_270px]">
        {/* Search Results */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-white/70">
            {debounced ? `Results for “${debounced}”` : 'Try a search to see results'}
          </h2>

          {isSearching && <ResultsSkeleton />}

          {isSearchError && (
            <ErrorBox message={getErrorMessage(searchError) ?? 'Failed to load search results.'} />
          )}

          {!isSearching && debounced && results?.length === 0 && (
            <InfoBox message="No results. Try a different query (e.g. “space drama”, “thriller 2019”)." />
          )}

          {!isSearching && results && results.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {paginatedResults.map((m: DetailedMovie) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>

              {/* Pagination */}
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
            </>
          )}
        </div>

        {/* Recommendations */}
        <aside className="md:sticky md:top-[88px]">
          <h2 className="mb-3 text-sm font-semibold text-white/70">Recommended for you</h2>

          {isRecsLoading && <RecsSkeleton />}

          {isRecsError && (
            <ErrorBox message={getErrorMessage(searchError) ?? 'Failed to load recommendations.'} />
          )}

          {!isRecsLoading && recs && recs.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {recs.slice(0, 6).map((rec) => (
                <RecommendationCard key={`rec-${rec.movie.id}`} rec={rec} />
              ))}
            </div>
          )}
        </aside>
      </section>

      <Footer />
    </main>
  );

}

/* ------------------- Utilities ------------------- */

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
