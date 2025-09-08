// File: components/movie/HeroSection.tsx
'use client';

import Image from 'next/image';
import type { DetailedMovie } from '@/types/movie';

export function HeroSection({
  movie,
  children,
}: {
  movie: DetailedMovie;
  children: React.ReactNode;
}) {
  const { title, posterUrl } = movie;

  return (
    <section className="relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt=""
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.25),transparent_65%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-indigo-950/60 to-slate-950" />
      </div>

      {/* Grid with poster + content */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 px-6 pb-10 pt-8 md:grid-cols-[240px_1fr] md:gap-8">
        {/* Poster */}
        <div className="relative">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl md:w-[240px]">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="240px"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-5xl">🎬</div>
            )}
          </div>
        </div>

        {/* Right column content */}
        <div>{children}</div>
      </div>
    </section>
  );
}
