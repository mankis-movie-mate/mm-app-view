import type { RecommendedItem } from '@/types/movie';
import MovieCard from './MovieCard';

export default function RecommendationCard({ rec }: { rec: RecommendedItem }) {
    const { movie, score, explanations } = rec;
    const pct = Math.round(score * 100); // 0..100
    const isTopMovie = pct === 0;

    return (
        <div className="rounded-xl bg-white/5 p-2 ring-1 ring-white/10 backdrop-blur-sm">

            {/* Movie tile */}
            <div className="relative">
                <MovieCard movie={movie}/>
                <span
                    className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold shadow-lg ${
                        isTopMovie
                            ? 'bg-gray-700/80 text-white/80'
                            : 'bg-indigo-600/90'
                    }`}
                >
          {isTopMovie ? 'From Top Movies' : `${pct}% match`}
        </span>
            </div>

            {/* Why this */}
            {!isTopMovie && explanations?.length > 0 && (
                <details className="mt-3 group">
                    <summary className="cursor-pointer list-none text-xs text-white/80 hover:text-white transition">
                        Why this recommendation?
                    </summary>
                    <ul className="mt-2 space-y-1">
                        {explanations.map((ex, i) => (
                            <li
                                key={`${ex.seedMovieId}-${i}`}
                                className="rounded-md bg-black/30 px-3 py-2 text-xs ring-1 ring-white/10"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{ex.seedMovieTitle}</span>
                                    <span
                                        className="rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                    {ex.activityType}
                  </span>
                                </div>
                                <div className="mt-1 text-white/70">
                                    similarity {(ex.similarity * 100).toFixed(0)}%
                                </div>
                            </li>
                        ))}
                    </ul>
                </details>
            )}
        </div>
    );
}
