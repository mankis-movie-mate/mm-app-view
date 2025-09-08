// File: components/movie/ReviewComposer.tsx
'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteRating, submitRating, updateRating } from '@/lib/api/activityApi';
import { Button } from '@/components/ui/button';
import { StarsInput } from './Stars';
import type { MovieRating, SubmitRatingPayload } from '@/types/rating';

export function ReviewComposer({
  movieId,
  myRating,
  refetchRatings,
}: {
  movieId: string;
  myRating?: MovieRating;
  refetchRatings: () => void;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const [rating, setRating] = useState<number>(myRating?.rate ?? 0);
  const [hover, setHover] = useState<number | null>(null);
  const [review, setReview] = useState(myRating?.review ?? '');
  const [tags, setTags] = useState<string[]>(myRating?.tags ?? []);
  const [submitting, setSubmitting] = useState(false);

  const queryKey = ['ratings', movieId] as const;
  const isEdit = !!myRating;

  // Keep form in sync with myRating prop
  useMemo(() => {
    setRating(myRating?.rate ?? 0);
    setReview(myRating?.review ?? '');
    setTags(myRating?.tags ?? []);
  }, [myRating]);

  const maxChars = 800;
  const remaining = maxChars - review.length;
  const canSubmit = rating > 0 && review.trim().length >= 10 && remaining >= 0 && !!user;

  // --- Submit (optimistic add) ---
  const submitMutation = useMutation({
    mutationFn: (payload: SubmitRatingPayload) => submitRating(payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey });

      const previous = qc.getQueryData<MovieRating[]>(queryKey) ?? [];
      const optimistic: MovieRating = {
        id: 'optimistic-' + crypto.randomUUID(),
        movie_id: payload.movie_id,
        username: payload.username,
        rate: payload.rate,
        review: payload.review,
        tags: payload.tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      qc.setQueryData<MovieRating[]>(queryKey, [...previous, optimistic]);
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKey, ctx.previous);
      toast.error('Error submitting review.');
    },
    onSuccess: () => {
      toast.success('Review submitted!');
    },
    onSettled: () => {
      // Ensure final truth from server (in prod); in dev mocks this won’t harm
      qc.invalidateQueries({ queryKey });
      refetchRatings();
    },
  });

  // --- Update (optimistic patch) ---
  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Omit<SubmitRatingPayload, 'username' | 'movie_id'>>) =>
      updateRating(myRating!.id, updates),
    onMutate: async (updates) => {
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData<MovieRating[]>(queryKey) ?? [];
      qc.setQueryData<MovieRating[]>(
        queryKey,
        previous.map((r) =>
          r.id === myRating!.id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKey, ctx.previous);
      toast.error('Error updating review.');
    },
    onSuccess: () => {
      toast.success('Review updated!');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
      refetchRatings();
    },
  });

  // --- Delete (optimistic remove) ---
  const deleteMutation = useMutation({
    mutationFn: () => deleteRating(myRating!.id),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData<MovieRating[]>(queryKey) ?? [];
      qc.setQueryData<MovieRating[]>(
        queryKey,
        previous.filter((r) => r.id !== myRating!.id),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKey, ctx.previous);
      toast.error('Error deleting review.');
    },
    onSuccess: () => {
      toast.success('Review deleted!');
      // clear local form
      setReview('');
      setRating(0);
      setTags([]);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
      refetchRatings();
    },
  });

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      if (isEdit && myRating) {
        await updateMutation.mutateAsync({ rate: rating, review, tags });
      } else {
        await submitMutation.mutateAsync({
          movie_id: movieId,
          username: user!.username,
          rate: rating,
          review,
          tags,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-label={isEdit ? 'Edit your review' : 'Leave a review'}>
      <h2 className="text-xl font-semibold">{isEdit ? 'Edit your review' : 'Leave a review'}</h2>

      <fieldset className="mt-3" aria-label="Rating out of 5">
        <legend className="sr-only">Your rating</legend>
        <StarsInput value={rating} hover={hover} setHover={setHover} onChange={setRating} />
        <span className="ml-2 text-sm text-white/70">{rating || '—'}/5</span>
      </fieldset>

      <div className="mt-3">
        <label htmlFor="review" className="sr-only">
          Your review
        </label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value.slice(0, maxChars))}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500"
          rows={4}
          placeholder="What did you like or dislike? Keep it constructive and spoiler-free."
        />
        <div className="mt-1 flex items-center justify-between text-xs text-white/50">
          <span>Min 10 characters • Max {maxChars}</span>
          <span className={remaining < 0 ? 'text-red-300' : ''}>{remaining}</span>
        </div>
      </div>

      <TagsInput tags={tags} setTags={setTags} />

      {!canSubmit && (
        <p className="mt-2 rounded-md border border-amber-400/30 bg-amber-900/30 px-3 py-2 text-xs text-amber-200">
          {user
            ? 'Pick a rating and write at least 10 characters.'
            : 'You must be logged in to submit a review.'}
        </p>
      )}

      <div className="flex items-center gap-2 mt-4">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60"
          aria-busy={submitting}
        >
          {isEdit
            ? submitting
              ? 'Updating…'
              : 'Update review'
            : submitting
              ? 'Submitting…'
              : '✍️ Submit review'}
        </Button>

        {isEdit && (
          <Button
            type="button"
            variant="outline"
            className="border-red-400/30 text-red-300 hover:bg-red-900/20"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        )}
      </div>
    </section>
  );
}

function TagsInput({
                     tags,
                     setTags,
                   }: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [value, setValue] = useState('');

  return (
    <div className="mt-3 flex flex-wrap gap-2 items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add tag & press Enter"
        className="rounded px-2 py-1 bg-white/10 text-xs text-white/80 outline-none focus:ring-2 focus:ring-fuchsia-400"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const v = value.trim();
            if (v) {
              setTags((prev) => Array.from(new Set([...prev, v])));
              setValue('');
            }
            e.preventDefault();
          }
        }}
      />
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow"
        >
          {tag}
          <button
            className="ml-1 text-xs text-white/70 hover:text-white"
            type="button"
            onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
            aria-label={`Remove tag ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
