'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Spinner } from '@/components/Spinner';
import { cn } from '@/lib/utils';

import {
    createWatchlist,
    deleteWatchlist,
    getUserWatchlists,
} from '@/lib/api/activityApi';

// shadcn/ui
import { Accordion } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { WatchlistCard } from '@/components/WatchlistCard';

export default function ProfilePage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [newWatchlistName, setNewWatchlistName] = useState('');

    const {
        data: watchlists,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['watchlists', user?.username],
        queryFn: () => getUserWatchlists(user!.username),
        enabled: !!user?.username,
        staleTime: 30_000,
    });

    const createMutation = useMutation({
        mutationFn: createWatchlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlists', user?.username] });
            setNewWatchlistName('');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteWatchlist,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlists', user?.username] }),
    });

    const handleCreateWatchlist = () => {
        const name = newWatchlistName.trim();
        if (!name) return;
        createMutation.mutate({ name, username: user!.username, movies_id: [] });
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white px-6 py-10">
            <Header />
            <section className="max-w-5xl mx-auto">
                {/* 👤 User Profile Card */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 shadow-lg">
                    <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gradient-to-br from-fuchsia-700 to-purple-700 flex items-center justify-center text-4xl font-bold text-white shadow-md">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>

                    <div className="flex-1 space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">{user?.username}</h1>
                        <p className="text-sm text-white/60">📧 {user?.email}</p>
                        <p className="text-sm text-white/60">
                            🛡️ Roles:{' '}
                            <span className="font-medium text-white">
                {Array.isArray(user?.roles) ? user?.roles.join(', ') : user?.roles}
              </span>
                        </p>
                    </div>
                </div>

                {/* 🎬 Watchlists */}
                <div className="mb-16">
                    <h2 className="text-2xl font-semibold mb-4">🎬 Your Watchlists</h2>

                    <form
                        className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 shadow-md mb-6 backdrop-blur"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateWatchlist();
                        }}
                    >
                        <label htmlFor="new-watchlist" className="sr-only">
                            Watchlist Name
                        </label>

                        {/* shadcn input */}
                        <Input
                            id="new-watchlist"
                            value={newWatchlistName}
                            onChange={(e) => setNewWatchlistName(e.target.value)}
                            placeholder="Enter a new watchlist name…"
                            className="bg-white/90 text-black"
                        />

                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            ➕ Create
                        </Button>
                    </form>

                    {isLoading ? (
                        <Spinner className="h-6 w-6" />
                    ) : isError || !watchlists?.elements?.length ? (
                        <p className="text-white/60">No watchlists found.</p>
                    ) : (
                        <Card className="border border-white/10 bg-white/5 p-2">
                            {/* Expandable watchlists (shadcn Accordion) */}
                            <Accordion type="multiple" className="w-full space-y-4">
                                {watchlists.elements.map((wl: any) => (
                                    <WatchlistCard
                                        key={wl.id}
                                        item={wl}
                                        onDelete={(id) => deleteMutation.mutate(id)}
                                    />
                                ))}
                            </Accordion>
                        </Card>
                    )}
                </div>
            </section>
            <Footer />
        </main>
    );
}
