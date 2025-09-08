'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Feature from '@/components/home/Feature';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import React, { useEffect, useMemo, useRef, useState } from 'react';

function AnimatedStat({ k, v }: { k: string; v: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const prefersReduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { target, suffix, isNumeric } = useMemo(() => {
    const m = k.match(/^(\d+(?:\.\d+)?)(%?)$/);
    if (m) return { target: parseFloat(m[1]), suffix: m[2], isNumeric: true };
    return { target: NaN, suffix: '', isNumeric: false };
  }, [k]);

  useEffect(() => {
    if (!ref.current || prefersReduceMotion) return setVisible(true);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.4 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [prefersReduceMotion]);

  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible || !isNumeric || prefersReduceMotion) return;
    const duration = 900;
    const start = performance.now();
    const startVal = 0;
    let raf: number;

    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setCount(Number((startVal + (target - startVal) * eased).toFixed(0)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible, isNumeric, target, prefersReduceMotion]);

  const display = isNumeric && visible && !prefersReduceMotion ? `${count}${suffix}` : k;

  return (
    <div
      ref={ref}
      className="rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm transition duration-500 data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 translate-y-2 opacity-0"
      data-visible={visible}
      aria-label={`${display}: ${v}`}
    >
      <dl>
        <dt className="text-2xl font-extrabold">{display}</dt>
        <dd className="mt-1 text-sm text-white/70">{v}</dd>
      </dl>
    </div>
  );
}

export default function Home() {
  return (
    <main
      id="main"
      className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white"
      aria-label="Home page"
    >
      {/* Decorative glow blobs (kept) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-20%] h-[480px] w-[480px] rounded-full bg-indigo-600/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[520px] w-[520px] rounded-full bg-fuchsia-600/25 blur-3xl"
      />

      <Header />

      <section id="content" className="relative mx-auto max-w-6xl px-6 pb-10 pt-2 sm:pb-16">
        {/* Hero */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Discover movies you’ll
            <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              {' '}
              actually love
            </span>
            .
          </h1>

          <p id="hero-desc" className="mt-4 text-lg text-white/80">
            Kill the endless scroll. MovieMate learns your taste and serves spot-on picks and
            curated lists.
          </p>

          {/* CTAs — centered text; no keyboard hints; strong focus rings */}
          <div
            className="mt-6 flex flex-wrap items-center gap-3"
            role="group"
            aria-label="Primary actions"
            aria-describedby="hero-desc"
          >
            <Link
              href={ROUTES.REGISTER}
              aria-label="Create an account and get started"
              className="inline-flex items-center justify-center text-center rounded-lg px-5 py-3 bg-indigo-500 hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 font-medium shadow-lg shadow-indigo-500/30 transition"
            >
              Get started
            </Link>

            <Link
              href={ROUTES.LOGIN}
              aria-label="I already have an account — sign in"
              className="inline-flex items-center justify-center text-center rounded-lg px-5 py-3 bg-white/10 hover:bg-white/20 ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-300 transition"
            >
              I already have an account
            </Link>

            <Link
              href={ROUTES.RECOMMEND}
              aria-label="Explore recommendations without signing in"
              className="inline-flex items-center justify-center text-center rounded-lg px-5 py-3 bg-white/10 hover:bg-white/20 ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-300 transition"
            >
              Explore
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Feature
            emoji="⭐"
            title="Personalized picks"
            text="Recommendations tuned to your history, mood, and pace."
          />
          <Feature
            emoji="📊"
            title="Watchlists"
            text="Track what you’ve watched and what’s next — beautifully."
          />
          <Feature
            emoji="🤝"
            title="Community reviews"
            text="See what your friends and the world think about a movie."
          />
        </div>

        {/* Stats — animated, motion-safe, accessible */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <AnimatedStat k="<1s" v="Avg. response" />
          <AnimatedStat k="0" v="Ad noise" />
          <AnimatedStat k="∞" v="Fun to explore" />
          <AnimatedStat k="100%" v="Users satisfied :)" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
