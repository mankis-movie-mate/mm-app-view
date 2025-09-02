'use client';

import * as React from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMoviesByIds } from '@/lib/api/moviesApi';
import { updateWatchlist } from '@/lib/api/activityApi';
import type { DetailedMovie } from '@/types/movie';

import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/Spinner';
import { cn } from '@/lib/utils';
import { Watchlist } from '@/types/watchlist';

interface WatchlistCardProps {
    item: Watchlist;
    onDelete?: (id: string) => void;
    invalidateKey: unknown[];
    pageSize?: number;
}

export function WatchlistCard({ item, onDelete, invalidateKey, pageSize = 6 }: WatchlistCardProps) {
    const queryClient = useQueryClient();

    // Fetch movies in batch
    const { data: movies = [], isLoading, isError } = useQuery({
        queryKey: ['watchlist-movies', item.movies_id],
        queryFn: () =>
            item.movies_id.length ? getMoviesByIds(item.movies_id) : Promise.resolve([] as DetailedMovie[]),
        staleTime: 60_000,
    });

    // Local state
    const [isEditingName, setIsEditingName] = React.useState(false);
    const [nameDraft, setNameDraft] = React.useState(item.name);

    // Pagination (client-side)
    const [page, setPage] = React.useState(1);
    const totalPages = Math.max(1, Math.ceil((movies?.length ?? 0) / pageSize));
    React.useEffect(() => setPage(1), [movies, pageSize]);

    const start = (page - 1) * pageSize;
    const pageSlice = movies.slice(start, start + pageSize);

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (payload: { id: string; name: string; username: string; movies_id: string[] }) =>
            updateWatchlist(item.id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: invalidateKey });
        },
    });

    const saveName = () => {
        const trimmed = nameDraft.trim();
        if (!trimmed || trimmed === item.name) {
            setIsEditingName(false);
            return;
        }
        updateMutation.mutate({
            id: item.id,
            name: trimmed,
            username: item.username,
            movies_id: item.movies_id,
        });
        setIsEditingName(false);
    };

    const removeMovie = (movieId: string) => {
        const next = item.movies_id.filter((id) => id !== movieId);
        updateMutation.mutate({
            id: item.id,
            name: item.name,
            username: item.username,
            movies_id: next,
        });
    };

    const removeAllOnPage = () => {
        const idsOnPage = pageSlice.map((m) => m.id);
        const next = item.movies_id.filter((id) => !idsOnPage.includes(id));
        updateMutation.mutate({
            id: item.id,
            name: item.name,
            username: item.username,
            movies_id: next,
        });
    };

    const movieCount = item.movies_id.length;
    const updated = item.updated_date ? new Date(item.updated_date).toLocaleString() : '—';

    return (
        <AccordionItem
            value={item.id}
            className={cn(
                // glass card
                'group rounded-2xl ring-1 ring-white/10 bg-white/[0.035] backdrop-blur-sm',
                'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition',
                'data-[state=open]:ring-white/20 hover:ring-white/20'
            )}
        >
            <Card className="bg-transparent border-0 shadow-none rounded-2xl overflow-hidden">
                <CardHeader className="px-4 sm:px-5 py-4">
                    <div className="flex items-center gap-3 w-full">
                        {/* Left: title (lighter) + count */}
                        <AccordionTrigger className="flex-1 text-left hover:no-underline">
                            <div className="flex items-center gap-3 min-w-0">
                                {isEditingName ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={nameDraft}
                                            onChange={(e) => setNameDraft(e.target.value)}
                                            className="h-8 w-[220px] bg-white/90 text-black"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveName();
                                                if (e.key === 'Escape') {
                                                    setNameDraft(item.name);
                                                    setIsEditingName(false);
                                                }
                                            }}
                                        />
                                        <Button size="sm" onClick={saveName}>
                                            Save
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-white/10 text-white hover:bg-white/20"
                                            onClick={() => {
                                                setNameDraft(item.name);
                                                setIsEditingName(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 min-w-0">
                                        {/* lighter title */}
                                        <CardTitle
                                            className={cn(
                                                'truncate',
                                                'text-white/75 font-medium',
                                                'group-data-[state=open]:text-white/85'
                                            )}
                                        >
                                            {item.name}
                                        </CardTitle>
                                        <Badge className="bg-white/10 text-white/75">{movieCount} {movieCount === 1 ? 'movie' : 'movies'}</Badge>
                                    </div>
                                )}
                            </div>
                        </AccordionTrigger>

                        {/* Right: meta + Edit + Delete */}
                        <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline text-xs text-white/55">
                Updated: <span className="text-white/75">{updated}</span>
              </span>

                            {/* Edit moved here (to the very end group) */}
                            <Button
                                size="sm"
                                className="bg-white/10 text-white hover:bg-white/20"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsEditingName(true);
                                }}
                                title="Edit name"
                            >
                                Edit
                            </Button>

                            {onDelete && (
                                <Button
                                    size="sm"
                                    className={cn(
                                        'bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-red-100',
                                        'border border-red-400/20'
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onDelete(item.id);
                                    }}
                                    title="Delete watchlist"
                                >
                                    🗑️ Delete
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <AccordionContent>
                    <CardContent className="px-4 sm:px-5 pb-5 pt-0">
                        <div className="h-px w-full bg-white/10 mb-4" />

                        {/* Header row inside content */}
                        {!isLoading && !!movies.length && (
                            <div className="mb-3 flex items-center justify-between">
                                <div className="text-xs text-white/60">
                                    Showing <span className="text-white/80">{start + 1}</span>–
                                    <span className="text-white/80">{Math.min(start + pageSize, movies.length)}</span> of{' '}
                                    <span className="text-white/80">{movies.length}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        className="bg-white/10 text-white hover:bg-white/20"
                                        onClick={removeAllOnPage}
                                    >
                                        Remove all on this page
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex items-center gap-2 text-white/70">
                                <Spinner className="h-5 w-5" />
                                <span>Loading movies…</span>
                            </div>
                        ) : isError ? (
                            <p className="text-red-400">Failed to load movies.</p>
                        ) : !movies?.length ? (
                            <p className="text-white/60">No movies yet. Add some from the movie page.</p>
                        ) : (
                            <>
                                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {pageSlice.map((m) => (
                                        <li
                                            key={m.id}
                                            className={cn(
                                                'relative rounded-xl ring-1 ring-white/10 bg-white/[0.03] p-3',
                                                'hover:bg-white/[0.05] hover:ring-white/20 transition'
                                            )}
                                        >
                                            {/* top-right remove cross */}
                                            <button
                                                aria-label="Remove from watchlist"
                                                className={cn(
                                                    'absolute right-2 top-2 h-6 w-6 rounded-md',
                                                    'flex items-center justify-center',
                                                    'text-white/60 hover:text-red-200',
                                                    'bg-white/5 hover:bg-red-500/30',
                                                    'ring-1 ring-white/10 hover:ring-red-400/30 transition'
                                                )}
                                                onClick={() => removeMovie(m.id)}
                                                title="Remove"
                                            >
                                                {/* small cross icon (SVG, no extra deps) */}
                                                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                                                    <path d="M6.28 6.28a.75.75 0 011.06 0L10 8.94l2.66-2.66a.75.75 0 111.06 1.06L11.06 10l2.66 2.66a.75.75 0 11-1.06 1.06L10 11.06l-2.66 2.66a.75.75 0 11-1.06-1.06L8.94 10 6.28 7.34a.75.75 0 010-1.06z" />
                                                </svg>
                                            </button>

                                            <div className="flex items-start gap-3">
                                                <div className="h-16 w-12 rounded-md ring-1 ring-white/10 bg-white/10 flex-shrink-0 overflow-hidden">
                                                    {m.posterUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={m.posterUrl} alt={m.title} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-[10px] text-white/60">
                                                            🎬
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="truncate text-white/85">{m.title}</div>
                                                    <div className="mt-0.5 text-xs text-white/60 truncate">
                                                        {m.genres?.map((g) => g.name).join(' • ')}
                                                    </div>
                                                    <div className="mt-1 text-xs text-white/70">
                                                        ⭐ {m.rating?.average ?? '—'} ({m.rating?.count ?? 0})
                                                    </div>

                                                    <div className="mt-2">
                                                        <Link
                                                            href={`/movie/${m.id}`}
                                                            className="text-xs text-green-400 hover:text-green-300 underline"
                                                        >
                                                            Open details →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <Button
                                            size="sm"
                                            className="bg-white/10 text-white hover:bg-white/20"
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            ← Prev
                                        </Button>

                                        <div className="text-xs text-white/70">
                                            Page <span className="text-white/90">{page}</span> /{' '}
                                            <span className="text-white/90">{totalPages}</span>
                                        </div>

                                        <Button
                                            size="sm"
                                            className="bg-white/10 text-white hover:bg-white/20"
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            Next →
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </AccordionContent>
            </Card>
        </AccordionItem>
    );
}
