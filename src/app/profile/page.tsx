'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Spinner } from '@/components/Spinner';
import { createWatchlist, deleteWatchlist, getUserWatchlists } from '@/lib/api/activityApi';
import { Accordion } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WatchlistCard } from '@/components/watchlist/WatchlistCard';
import { PaginatedWatchlists, Watchlist } from '@/types/watchlist';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [openIds, setOpenIds] = useState<string[]>([]);

  const {
    data: watchlists,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['watchlists', user?.username],
    queryFn: () => getUserWatchlists(user!.username),
    retry: 0,
    enabled: !!user?.username,
    staleTime: 30_000,
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: createWatchlist,
    onSuccess: () => {
      setNewWatchlistName('');
      queryClient.invalidateQueries({ queryKey: ['watchlists', user?.username] });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteWatchlist,
    onSuccess: (data: string) => {
      const key = ['watchlists', user?.username];
      queryClient.setQueryData(key, (prev: PaginatedWatchlists | undefined) => {
        if (!prev) return prev;
        return {
          ...prev,
          elements: prev.elements.filter((wl: Watchlist) => wl.id !== data),
        };
      });
    },
  });

  // CREATE HANDLER (toast.promise)
  const handleCreateWatchlist = () => {
    const name = newWatchlistName.trim();
    if (!name) return;

    toast.promise(
      createMutation.mutateAsync({
        name,
        username: user!.username,
        movies_id: [],
      }),
      {
        loading: 'Creating watchlist...',
        success: () => {
          setNewWatchlistName('');
          queryClient.invalidateQueries({ queryKey: ['watchlists', user?.username] });
          return 'Watchlist created!';
        },
        error: 'Error creating watchlist.',
      },
    );
  };

  // DELETE HANDLER (toast.promise)
  const handleDeleteWatchlist = (id: string) => {
    toast.promise(deleteMutation.mutateAsync(id), {
      loading: 'Deleting watchlist...',
      success: () => {
        const key = ['watchlists', user?.username];
        queryClient.setQueryData(key, (prev: PaginatedWatchlists | undefined) => {
          if (!prev) return prev;
          return {
            ...prev,
            elements: prev.elements.filter((wl: Watchlist) => wl.id !== id),
          };
        });
        return 'Watchlist deleted.';
      },
      error: 'Error deleting watchlist.',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
      {/* Sticky header always on top */}
      <header className="sticky top-0 z-40 bg-indigo-950/80 backdrop-blur border-b border-white/10">
        <Header />
      </header>

      {/* Main content fills screen between header and footer */}
      <main className="flex-1 px-6 py-10">
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

          {/* Watchlists */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">🎬 Your watchlists</h2>
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
              <Input
                id="new-watchlist"
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                placeholder="Enter a new watchlist name…"
                className="bg-white/90 text-black"
                disabled={createMutation.isPending}
              />
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={createMutation.isPending || !newWatchlistName.trim()}
              >
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
                <Accordion
                  type="multiple"
                  className="w-full space-y-4"
                  value={openIds}
                  onValueChange={setOpenIds}
                >
                  {watchlists.elements.map((wl: Watchlist) => (
                    <WatchlistCard
                      key={wl.id}
                      item={wl}
                      invalidateKey={['watchlists', user?.username]}
                      onDelete={(id) => handleDeleteWatchlist(id)}
                      onToggle={() => {
                        setOpenIds((ids) =>
                          ids.includes(wl.id) ? ids.filter((id) => id !== wl.id) : [...ids, wl.id],
                        );
                      }}
                    />
                  ))}
                </Accordion>
              </Card>
            )}
          </div>
        </section>
      </main>

      {/* Add bottom gap so footer is never glued to content */}
      <div className="h-8 sm:h-16" aria-hidden="true" />

      {/* Footer always at the bottom and left-aligned */}
      <footer className="w-full text-left">
        <Footer />
      </footer>
    </div>
  );
}
