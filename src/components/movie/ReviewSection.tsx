// File: components/movie/ReviewsSection.tsx
'use client';

import { Spinner } from '@/components/Spinner';
import { StarsRow } from './Stars';
import type { MovieRating } from '@/types/rating';
import { ReviewComposer } from './ReviewComposer';

export function ReviewsSection({
  movieId,
  ratings,
  isRatingsLoading,
  myRating,
  refetchRatings,
}: {
  movieId: string;
  ratings: MovieRating[];
  isRatingsLoading: boolean;
  myRating?: MovieRating;
  refetchRatings: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-4">
      <ReviewComposer movieId={movieId} myRating={myRating} refetchRatings={refetchRatings} />

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">User Reviews</h2>

        {isRatingsLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner />
          </div>
        ) : ratings.length > 0 ? (
          <ul className="space-y-4">
            {ratings.map((r) => (
              <li key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white/90">
                    {r.username || 'Anonymous'}
                    {myRating && r.id === myRating.id && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-white/50">
                    {new Date(r.created_at || r.updated_at || Date.now()).toLocaleDateString()}
                  </div>
                </div>

                <p className="mt-2 text-sm text-white/90">{r.review}</p>

                <div className="mt-2 flex items-center gap-3 text-xs text-yellow-300">
                  <StarsRow rating={r.rate} />
                  <span className="ml-2 text-white/70">
                    {r.tags?.map((t) => (
                      <span
                        key={t}
                        className="inline-block mr-1 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            No reviews yet. Be the first to leave one!
          </div>
        )}
      </section>
    </main>
  );
}
