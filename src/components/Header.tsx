'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants/routes';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.HOME}>
          <span className="text-2xl">🎬</span>
          <span className="font-semibold tracking-tight">MovieMate</span>
        </Link>
      </div>

      <nav className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              href={ROUTES.PROFILE}
              className="rounded-full px-4 py-2 ring-1 ring-white/10 bg-white/10 hover:bg-white/20 transition"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="rounded-full px-4 py-2 text-white bg-red-500 hover:bg-red-400 shadow-md shadow-red-500/30 transition"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              href={ROUTES.LOGIN}
              className="rounded-full px-4 py-2 ring-1 ring-white/10 bg-white/10 hover:bg-white/20 transition"
            >
              Sign in
            </Link>
            <Link
              href={ROUTES.REGISTER}
              className="rounded-full px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30 transition"
            >
              Create account
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
