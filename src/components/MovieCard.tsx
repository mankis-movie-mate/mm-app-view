// src/components/MovieCard.tsx
import Image from "next/image";
import type { Movie } from "@/types/movie";

export default function MovieCard({ movie }: { movie: Movie }) {
    const { title, releaseYear, posterUrl, rating, genres } = movie;

    return (
        <div className="group rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10">
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
                    <div className="flex h-full w-full items-center justify-center text-white/30">
                        🎬
                    </div>
                )}
                {rating != null && (
                    <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-amber-300 ring-1 ring-white/10">
            ⭐ {rating.toFixed(1)}
          </span>
                )}
            </div>

            <div className="mt-3">
                <h3 className="line-clamp-1 text-sm font-semibold">{title}</h3>
                <p className="mt-0.5 text-xs text-white/60">
                    {releaseYear} · {genres?.slice(0, 2).join(" · ") || "Movie"}
                </p>
            </div>
        </div>
    );
}
