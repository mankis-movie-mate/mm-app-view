// not-found.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const homeBtnRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    homeBtnRef.current?.focus();
  }, []);

  return (
    // 👇 Add overflow-x-hidden here to hide the horizontal scrollbar/line
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white overflow-x-hidden">
      <main
        className="relative flex-1 flex flex-col items-center justify-center text-center px-4"
        aria-label="Page not found"
      >
        {/* Decorative glow blobs (unchanged) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-20%] h-[480px] w-[480px] rounded-full bg-indigo-600/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 left-[-10%] h-[520px] w-[520px] rounded-full bg-fuchsia-600/25 blur-3xl"
        />

        <section
          className="relative z-10 max-w-2xl w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl"
          aria-describedby="nf-desc"
        >
          <p className="text-sm uppercase tracking-widest text-white/60">Error</p>
          <h1 className="mt-1 text-6xl font-extrabold leading-none">
            <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              404
            </span>
          </h1>
          <p id="nf-desc" className="mt-3 text-white/80">
            Oops! The page you’re looking for doesn’t exist.
          </p>
          <p className="mt-2 text-sm text-white/60">
            You tried to open:
            <code className="ml-2 rounded bg-black/40 px-2 py-1 text-white/80">{pathname}</code>
          </p>

          <div
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
            role="group"
            aria-label="Navigation options"
          >
            <Link
              href="/"
              autoFocus
              className="rounded-lg px-5 py-3 bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 font-semibold shadow-lg shadow-indigo-500/30 transition"
            >
              Go Home
            </Link>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg px-5 py-3 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-300 transition"
            >
              Go Back
            </button>
          </div>

          <ul className="mt-6 text-sm text-white/70 space-y-1">
            <li>• Check the address for typos.</li>
            <li>• If you followed a link, it may be outdated.</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
