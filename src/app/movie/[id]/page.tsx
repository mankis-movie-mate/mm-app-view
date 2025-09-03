'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getMovieById } from '@/lib/api/moviesApi';
import { Spinner } from '@/components/Spinner';
import { DetailedMovie } from '@/types/movie';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { AddToWatchlistsDialog } from '@/components/AddToWatchlistsDialog';
import { Button } from '@/components/ui/button';

export default function MoviePage() {
  const { id } = useParams();
  const [watchlisted, setWatchlisted] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<DetailedMovie>({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load movie.
      </div>
    );
  }

  const {
    title,
    genres,
    director,
    casts,
    synopsis,
    releaseDate,
    language,
    rating,
    reviews,
    posterUrl,
  } = data;

  const handleRatingClick = (value: number) => setUserRating(value);

  const handleCommentSubmit = () => {
    if (!userRating || !comment.trim()) return;
    // TODO: POST to your review endpoint
    console.log('Submitting review:', { userRating, comment });
    setComment('');
    setUserRating(null);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
      <Header />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-xl bg-black/30">
            {posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={posterUrl}
                alt={title}
                className="h-full w-full object-cover rounded-xl shadow-lg"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/30 text-3xl">
                🎬
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="text-sm text-white/70">
              {releaseDate ? new Date(releaseDate).getFullYear() : '—'} · {language} ·{' '}
              {genres.map((g) => g.name).join(', ')}
            </div>

            <p className="text-white/80">{synopsis}</p>

            <div className="text-sm text-white/80">
              <strong>Director:</strong> {director.firstName} {director.lastName}
            </div>

            <div className="text-sm text-white/80">
              <strong>Cast:</strong> {casts.map((c) => `${c.firstName} ${c.lastName}`).join(', ')}
            </div>

            <div className="text-sm text-white/80">
              <strong>Rating:</strong> {rating.average.toFixed(1)} ({rating.count} reviews)
            </div>

            <div className="mt-4 flex gap-3">
              {/* The visible button + dialog */}
              <AddToWatchlistsDialog movieId={id as string} />
            </div>
          </div>
        </div>

        {/* — Reviews — */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-2">Leave a Review</h2>
          <div className="mb-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <Star
                key={star}
                size={20}
                onClick={() => handleRatingClick(star)}
                className={`cursor-pointer ${userRating && star <= userRating ? 'text-yellow-400' : 'text-white/30'}`}
                fill={userRating && star <= userRating ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-white/10 p-2 rounded-md text-white placeholder:text-white/40"
            rows={4}
            placeholder="Write your review..."
          />
          <Button
            onClick={handleCommentSubmit}
            disabled={!userRating || !comment.trim()}
            className="mt-4 bg-fuchsia-600 hover:bg-fuchsia-700"
          >
            ✍️ Submit Review
          </Button>
        </div>

        {reviews.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
            <ul className="space-y-4">
              {reviews.map((r, i) => (
                <li key={i} className="rounded-md bg-white/5 p-4">
                  <div className="text-sm text-white/90 font-semibold">{r.user}</div>
                  <div className="text-xs text-white/50">
                    {new Date(r.dateCreated).toLocaleDateString()}
                  </div>
                  <div className="text-sm mt-1">{r.comment}</div>
                  <div className="text-xs text-yellow-400 mt-1">Rating: {r.rating}/10</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
