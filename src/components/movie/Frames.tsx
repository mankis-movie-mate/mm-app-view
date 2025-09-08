// File: components/movie/Frames.tsx
'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export function LoadingFrame() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
      <header className="sticky top-0 z-40 bg-indigo-950/80 backdrop-blur border-b border-white/10">
        <Header />
      </header>
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="grid grid-cols-[160px_1fr] gap-6 md:grid-cols-[220px_1fr]">
          <div className="aspect-[2/3] w-full rounded-xl bg-white/5 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-white/5 animate-pulse" />
            <div className="h-24 w-full rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-white/5 animate-pulse" />
          </div>
        </div>
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

export function ErrorFrame({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
      <header className="sticky top-0 z-40 bg-indigo-950/80 backdrop-blur border-b border-white/10">
        <Header />
      </header>
      <main className="mx-auto max-w-3xl px-6 py-20">
        <div className="rounded-2xl border border-red-400/30 bg-red-950/30 p-6 text-red-200">
          <p className="font-semibold">Failed to load movie.</p>
          <p className="mt-1 text-sm opacity-80" aria-live="polite">
            {(error as Error)?.message || 'Please try again.'}
          </p>
          <button
            className="mt-4 rounded bg-fuchsia-600 px-4 py-2 text-white hover:bg-fuchsia-700"
            onClick={onRetry}
          >
            Try again
          </button>
        </div>
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}
