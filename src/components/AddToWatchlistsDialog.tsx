'use client';

import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserWatchlists, updateWatchlist } from '@/lib/api/activityApi';
import {Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/Spinner';
import {useEffect, useState} from "react";

export function AddToWatchlistsDialog({ movieId }: { movieId: string }) {
    const { user } = useAuth();
    const username = user?.username;
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['watchlists', username],
        queryFn: () => getUserWatchlists(username),
        enabled: !!username,
    });

    // State: which watchlists have this movie
    const [selected, setSelected] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open && data?.elements) {
            setSelected(data.elements.filter((wl: any) => wl.movies_id.includes(movieId)).map((wl: any) => wl.id));
        }
    }, [open, data, movieId]);

    const handleToggle = (id: string) => {
        setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    };

    const mutation = useMutation({
        mutationFn: async () => {
            // only update lists that actually change
            const ops = (data?.elements ?? []).map((wl: any) => {
                const shouldHave = selected.includes(wl.id);
                const alreadyHas = wl.movies_id.includes(movieId);
                if (shouldHave && !alreadyHas) {
                    return updateWatchlist(wl.id, { ...wl, movies_id: [...wl.movies_id, movieId] });
                }
                if (!shouldHave && alreadyHas) {
                    return updateWatchlist(wl.id, { ...wl, movies_id: wl.movies_id.filter((id: string) => id !== movieId) });
                }
                return Promise.resolve();
            });
            await Promise.all(ops);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlists', username] });
            setOpen(false);
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    + Add to Watchlist
                </Button>
            </DialogTrigger>
            <DialogContent
                className=" bg-gradient-to-b from-indigo-950 via-slate-950 to-black/90 border border-white/15 text-white max-w-md rounded-2xl shadow-2xl max-w-md animate-in shadow-[0_6px_64px_0_rgba(180,60,220,0.16),0_2px_8px_0_rgba(100,50,180,0.11)]"
            >
                <DialogTitle className="flex items-center gap-3 text-2xl font-extrabold text-white/90 drop-shadow mb-3 tracking-tight">
    <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-fuchsia-500 via-indigo-700 to-indigo-950 rounded-full shadow-lg">
      <svg width="24" height="24" fill="none" viewBox="0 0 20 20"><path d="M6 5.5V8.5C6 9.05228 6.44772 9.5 7 9.5H9M9 9.5V5.5M9 9.5H13C13.5523 9.5 14 9.05228 14 8.5V5.5M10 14V11M5.5 17C4.11929 17 3 15.8807 3 14.5V7.5C3 6.11929 4.11929 5 5.5 5H14.5C15.8807 5 17 6.11929 17 7.5V14.5C17 15.8807 15.8807 17 14.5 17H5.5Z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </span>
                    Add to Watchlists
                </DialogTitle>
                {isLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Spinner />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {(data?.elements ?? []).length === 0 ? (
                            <div className="text-white/70">No watchlists found.</div>
                        ) : (
                            (data?.elements ?? []).map((wl: any) => (
                                <label
                                    key={wl.id}
                                    className={`
              group w-full flex items-center justify-between gap-2
              rounded-xl px-4 py-2
              border border-transparent
              bg-white/5
              hover:bg-fuchsia-900/20 hover:border-fuchsia-700/40
              focus-within:bg-fuchsia-900/30 focus-within:border-fuchsia-500/60
              cursor-pointer
              transition-all duration-150
              shadow-sm
              ${selected.includes(wl.id)
                                        ? "ring-2 ring-fuchsia-400/80 border-fuchsia-400/60 bg-fuchsia-950/40"
                                        : ""
                                    }
            `}
                                >
                                    <Checkbox
                                        checked={selected.includes(wl.id)}
                                        onCheckedChange={() => handleToggle(wl.id)}
                                        className="accent-green-500"
                                    />
                                    <span className="text-base">{wl.name}</span>
                                </label>
                            ))
                        )}
                    </div>
                )}
                <DialogFooter className="pt-6">
                    <Button
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white px-6"
                    >
                        {mutation.isPending ? 'Saving…' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
