'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center bg-black text-white px-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-md font-semibold text-sm"
      >
        Go Back Home
      </Link>
    </main>
  );
}
