// File: components/movie/Stars.tsx
'use client';

import { Star } from 'lucide-react';

export function renderStars(rating: number) {
  return (
    <span className="inline-flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={18}
          className={i <= rating ? 'text-yellow-400' : 'text-white/20'}
          fill={i <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  );
}

export function StarsRow({ rating }: { rating: number }) {
  return renderStars(rating);
}

export function StarsInput({
                             value,
                             hover,
                             setHover,
                             onChange,
                           }: {
  value: number;
  hover: number | null;
  setHover: (n: number | null) => void;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((val) => {
        const active = (hover ?? value) >= val;
        return (
          <label key={val} className="cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={val}
              className="sr-only"
              checked={value === val}
              onChange={() => onChange(val)}
            />
            <Star
              size={28}
              className={active ? 'text-yellow-400 drop-shadow' : 'text-white/30'}
              fill={active ? 'currentColor' : 'none'}
              onMouseEnter={() => setHover(val)}
              onMouseLeave={() => setHover(null)}
              aria-hidden="true"
            />
            <span className="sr-only">{val}</span>
          </label>
        );
      })}
    </div>
  );
}
