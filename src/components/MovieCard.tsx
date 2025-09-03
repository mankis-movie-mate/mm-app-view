'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { DetailedMovie } from '@/types/movie';
import { ROUTES } from '@/lib/constants/routes';

export default function MovieCard({ movie }: { movie: DetailedMovie }) {
  const { id, title, releaseDate, posterUrl, rating, genres, director } = movie;

  // Show year from releaseDate (YYYY-MM-DD) or fallback
  const year = releaseDate && releaseDate.length >= 4 ? releaseDate.slice(0, 4) : '—';

  // Genres: support [{name}] or string[]
  const genreNames = genres?.map((g) => g.name) ?? [];

  return (
    <Link
      href={`${ROUTES.MOVIE_DETAILS_PREFIX}/${id}`}
      className="group block rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur transition hover:bg-fuchsia-950/20 shadow-lg hover:shadow-xl"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-black/30">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 50vw, 240px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/30 text-5xl">
            🎬
          </div>
        )}

        {rating && rating.average != null && (
          <span className="absolute right-2 top-2 rounded-full bg-black/80 px-2 py-0.5 text-xs font-bold text-amber-300 ring-1 ring-amber-300/20 shadow-md">
            ⭐ {rating.average.toFixed(1)}
          </span>
        )}
      </div>

      <div className="mt-3">
        <h3 className="line-clamp-1 text-base font-semibold text-white group-hover:text-fuchsia-300 transition">
          {title}
        </h3>
        <p className="mt-0.5 text-xs text-white/60 flex gap-2 items-center">
          <span>{year}</span>
          {genreNames.length > 0 && (
            <>
              <span className="text-white/20">·</span>
              <span>
                {genreNames.slice(0, 2).join(' · ')}
                {genreNames.length > 2 ? '…' : ''}
              </span>
            </>
          )}
        </p>
        {director?.firstName && (
          <div className="mt-1 text-xs text-white/40 truncate">
            🎬{' '}
            <span>
              {director.firstName} {director.lastName}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
