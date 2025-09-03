'use client';

import React, { useState } from 'react';
import { login } from '@/lib/api/authApi';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/Spinner';
import { ROUTES } from '@/lib/constants/routes';
import { getErrorMessage } from '@/lib/utils';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: doLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      const { userDetails, accessToken, refreshToken } = await login({
        identifier,
        password,
      });
      doLogin(accessToken, refreshToken, userDetails);
      router.push(ROUTES.RECOMMEND);
    } catch (err: unknown) {
      setErr(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          width="100"
          height="100"
          src="https://img.icons8.com/emoji/100/movie-camera-emoji.png"
          className="mx-auto h-10 w-auto"
          alt="MovieMate"
        />

        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-100">
              Identifier
            </label>
            <div className="mt-2">
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                autoComplete="username"
                disabled={loading}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm disabled:opacity-50"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Username or email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-100">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                disabled={loading}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm disabled:opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
          </div>

          {err && <div className="text-red-400 text-sm">{err}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50"
            >
              {loading && <Spinner className="h-4 w-4" />}
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <a href={ROUTES.REGISTER} className="text-indigo-400 underline hover:text-indigo-300">
            Don’t have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
