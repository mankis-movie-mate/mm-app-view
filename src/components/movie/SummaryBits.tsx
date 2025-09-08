// File: components/movie/SummaryBits.tsx
'use client';

import { useState } from 'react';

export function Badge({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10 ${className}`}
    >
      {children}
    </span>
  );
}

export function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <dt className="text-white/60">{label}:</dt>
      <dd className="font-medium">{value || '—'}</dd>
    </div>
  );
}

export function CastRow({ cast }: { cast: string[] }) {
  const MAX = 6;
  const [open, setOpen] = useState(false);
  const shown = open ? cast : cast.slice(0, MAX);
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <dt className="text-white/60">Cast:</dt>
      <dd className="font-medium">
        {shown.join(', ') || '—'}
        {cast.length > MAX && (
          <>
            {!open && <span className="text-white/50">, …</span>}{' '}
            <button
              type="button"
              onClick={() => setOpen((s) => !s)}
              className="rounded px-2 py-0.5 text-xs text-indigo-300 hover:bg-white/10"
              aria-expanded={open}
            >
              {open ? 'Show less' : 'Show more'}
            </button>
          </>
        )}
      </dd>
    </div>
  );
}
