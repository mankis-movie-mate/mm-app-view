// src/app/recommend/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import RecommendationCard from "@/components/RecommendationCard";
import { Spinner } from "@/components/Spinner";
import { Skeleton } from "@/components/Skeleton";
import { searchMovies, getRecommendations } from "@/lib/api/moviesApi";
import type { Movie, RecommendationsResponse } from "@/types/movie";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

export default function RecommendPage() {
    const [client] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={client}>
            <PageContent />
        </QueryClientProvider>
    );
}

function PageContent() {
    const [query, setQuery] = useState("");
    const debounced = useDebouncedValue(query, 350);

    // Search
    const {
        data: results,
        isFetching: isSearching,
        isError: isSearchError,
        error: searchError,
    } = useQuery({
        queryKey: ["movies", "search", debounced],
        queryFn: () => searchMovies(debounced),
        enabled: debounced.trim().length > 0,
        staleTime: 30_000,
    });

    // Recommendations (matches your payload shape)
    const {
        data: recResp,
        isFetching: isRecsLoading,
        isError: isRecsError,
        error: recsError,
    } = useQuery<RecommendationsResponse>({
        queryKey: ["movies", "recommendations"],
        queryFn: () => getRecommendations(), // pass userId if needed
        staleTime: 60_000,
    });

    const recs = recResp?.recommended ?? [];

    return (
        <main className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
            {/* Ambient blobs */}
            <div aria-hidden className="pointer-events-none absolute -top-40 right-[-20%] h-[480px] w-[480px] rounded-full bg-indigo-600/25 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 left-[-10%] h-[520px] w-[520px] rounded-full bg-fuchsia-600/20 blur-3xl" />

            <Header />

            {/* Search Bar */}
            <section className="mx-auto max-w-6xl px-6 pt-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-full">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search movies (e.g. 'cozy sci-fi from 90s')"
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

            {/* Main: results + sidebar */}
            <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-8 pt-6 md:grid-cols-[1fr_340px]">
                {/* RESULTS */}
                <div>
                    <h2 className="mb-3 text-sm font-semibold text-white/70">
                        {debounced ? `Results for “${debounced}”` : "Try a search to see results"}
                    </h2>

                    {isSearching && <ResultsSkeleton />}

                    {isSearchError && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                            {(searchError as any)?.message ?? "Failed to load search results."}
                        </div>
                    )}

                    {!isSearching && debounced && (results?.length ?? 0) === 0 && (
                        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
                            No results. Try a different query (e.g. “space drama”, “thriller 2019”).
                        </div>
                    )}

                    {!isSearching && results && results.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {results.map((m: Movie) => (
                                <MovieCard key={m.id} movie={m} />
                            ))}
                        </div>
                    )}
                </div>

                {/* SIDEBAR: Recommendations */}
                <aside className="md:sticky md:top-[88px]">
                    <h2 className="mb-3 text-sm font-semibold text-white/70">Recommended for you</h2>

                    {isRecsLoading && <RecsSkeleton />}

                    {isRecsError && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                            {(recsError as any)?.message ?? "Failed to load recommendations."}
                        </div>
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

/* ---------------- helpers & skeletons ---------------- */

function useDebouncedValue<T>(value: T, delay = 300) {
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
            {Array.from({ length: 8 }).map((_, i) => (
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
