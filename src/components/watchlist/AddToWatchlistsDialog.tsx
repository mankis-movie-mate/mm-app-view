'use client';

import { useAuth } from '@/context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserWatchlists, updateWatchlist } from '@/lib/api/activityApi';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/Spinner';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Watchlist } from '@/types/watchlist';
import { toast } from 'sonner';

interface Props {
  movieId: string;
}

export function AddToWatchlistsDialog({ movieId }: Props) {
  const { user } = useAuth();
  const username = user?.username;
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['watchlists', username],
    queryFn: () => getUserWatchlists(username!),
    enabled: !!username,
    staleTime: 30_000,
  });

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [allowHover, setAllowHover] = useState(false);
  const [query, setQuery] = useState('');
  const titleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setSelected([]);
      setAllowHover(false);
      setQuery('');
      requestAnimationFrame(() => titleRef.current?.focus());
    }
  }, [open]);

  const all = useMemo<Watchlist[]>(() => data?.elements ?? [], [data?.elements]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? all.filter((w) => w.name.toLowerCase().includes(q)) : all;
  }, [all, query]);

  const isAllFilteredSelected =
    filtered.length > 0 && filtered.every((w) => selected.includes(w.id));

  const toggleAllFiltered = () =>
    setSelected((prev) =>
      isAllFilteredSelected
        ? prev.filter((id) => !filtered.some((w) => w.id === id))
        : Array.from(new Set([...prev, ...filtered.map((w) => w.id)])),
    );
  const clearAll = () => setSelected([]);

  const toggleOne = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const saveMutation = useMutation({
    mutationFn: async () => {
      const ops = all.map((wl) => {
        const shouldHave = selected.includes(wl.id);
        const alreadyHas = wl.movies_id.includes(movieId);
        if (shouldHave && !alreadyHas)
          return updateWatchlist(wl.id, { ...wl, movies_id: [...wl.movies_id, movieId] });
        if (!shouldHave && alreadyHas)
          return updateWatchlist(wl.id, {
            ...wl,
            movies_id: wl.movies_id.filter((id) => id !== movieId),
          });
        return Promise.resolve();
      });
      await Promise.all(ops);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['watchlists', username] });
      setOpen(false);
    },
  });

  const handleSave = () =>
    toast.promise(saveMutation.mutateAsync(), {
      loading: 'Updating watchlists…',
      success: 'Watchlists updated!',
      error: 'Failed to update watchlists.',
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg font-semibold">
          + Add to Watchlist
        </Button>
      </DialogTrigger>
      <DialogContent
        onMouseEnter={() => !allowHover && setAllowHover(true)}
        className={[
          'rounded-[1rem] bg-gradient-to-b from-indigo-950 via-slate-950 to-black/95 text-white',
          'p-0 border border-white/20 shadow-2xl shadow-black/1000',
        ].join(' ')}
      >
        <div className="p-6">
          {/* HEADER */}
          <DialogTitle
            ref={titleRef}
            tabIndex={-1}
            className="flex items-center justify-between gap-3 text-xl sm:text-2xl font-bold tracking-tight drop-shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 via-indigo-700 to-indigo-950 shadow-md ring-1 ring-white/10">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path
                    d="M6 5.5V8.5C6 9.05228 6.44772 9.5 7 9.5H9M9 9.5V5.5M9 9.5H13C13.5523 9.5 14 9.05228 14 8.5V5.5M10 14V11M5.5 17C4.11929 17 3 15.8807 3 14.5V7.5C3 6.11929 4.11929 5 5.5 5H14.5C15.8807 5 17 6.11929 17 7.5V14.5C17 15.8807 15.8807 17 14.5 17H5.5Z"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="">Add to Watchlists</span>
            </div>
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
              {selected.length} selected
            </span>
          </DialogTitle>

          {/* CONTROLS */}
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search watchlists…"
                className="w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/50 outline-none ring-1 ring-indigo-600/15 focus:ring-2 focus:ring-fuchsia-400 transition"
              />
              <svg
                viewBox="0 0 20 20"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60"
                fill="none"
              >
                <path
                  d="M8.5 14.5a6 6 0 1 1 4.243-1.757l3.257 3.257"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <Button
              variant="ghost"
              type="button"
              className="h-9 px-3 border border-indigo-500/30 bg-indigo-700/10 hover:bg-fuchsia-700/10 text-fuchsia-100"
              onClick={toggleAllFiltered}
              disabled={filtered.length === 0}
            >
              {isAllFilteredSelected ? 'Clear Filtered' : 'Select Filtered'}
            </Button>
            <Button
              variant="ghost"
              type="button"
              className="h-9 px-3 border border-white/10 bg-white/5 hover:bg-white/10 text-white/85"
              onClick={clearAll}
              disabled={selected.length === 0}
            >
              Clear All
            </Button>
          </div>

          {/* divider */}
          <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-fuchsia-600/20 to-transparent" />

          {/* LIST */}
          {isLoading ? (
            <div className="flex items-center justify-center h-28">
              <Spinner />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-fuchsia-400/15 bg-fuchsia-700/5 p-5 text-sm text-white/70">
              No watchlists {query ? 'matching your search.' : 'yet.'}
            </div>
          ) : (
            <ul
              role="listbox"
              aria-label="Watchlists"
              className="max-h-[52vh] overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-fuchsia-500/15 scrollbar-track-transparent"
            >
              {filtered.map((wl) => {
                const checked = selected.includes(wl.id);
                return (
                  <li key={wl.id}>
                    <label
                      className={[
                        'group flex items-center justify-between gap-3',
                        'rounded-xl px-4 py-2.5 border transition-all duration-150',
                        'border-fuchsia-400/20 bg-white/[0.04] shadow-sm',
                        checked
                          ? 'ring-2 ring-fuchsia-500 border-fuchsia-500 bg-fuchsia-800/30'
                          : '',
                        allowHover
                          ? 'hover:bg-fuchsia-950/30 hover:ring-1 hover:ring-fuchsia-400/30'
                          : '',
                        'focus-within:ring-2 focus-within:ring-fuchsia-400/70',
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleOne(wl.id)}
                          className="accent-green-500"
                          aria-label={`Toggle ${wl.name}`}
                        />
                        <span className="text-sm sm:text-base text-white/90 truncate max-w-[15ch] sm:max-w-none">
                          {wl.name}
                        </span>
                      </div>
                      {wl.movies_id.includes(movieId) && !checked && (
                        <span className="text-[11px] rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-[3px] text-amber-200">
                          currently contains
                        </span>
                      )}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}

          {/* FOOTER */}
          <DialogFooter className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs text-fuchsia-100/80">
              Tip: Search, bulk-select, then save.
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="bg-fuchsia-700/10 hover:bg-fuchsia-800/20 text-fuchsia-200 border border-fuchsia-400/30"
                disabled={saveMutation.isPending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white px-6 disabled:opacity-70"
              >
                {saveMutation.isPending ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
