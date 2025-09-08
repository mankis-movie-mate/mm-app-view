'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { login as apiLogin } from '@/lib/api/authApi';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/Spinner';
import { ROUTES } from '@/lib/constants/routes';
import { getErrorMessage } from '@/lib/utils';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);

  const { login: authLogin } = useAuth();
  const router = useRouter();

  // a11y: focus error region when it appears
  const errorRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (errMsg && errorRef.current) errorRef.current.focus();
  }, [errMsg]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrMsg('');
      setLoading(true);

      if (!identifier.trim() || !password.trim()) {
        setErrMsg('Please enter your identifier and password.');
        setLoading(false);
        return;
      }

      try {
        const { userDetails, accessToken, refreshToken } = await apiLogin({
          identifier: identifier.trim(),
          password, // do not trim passwords
        });
        authLogin(accessToken, refreshToken, userDetails);
        router.push(ROUTES.RECOMMEND);
      } catch (err: unknown) {
        setErrMsg(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [identifier, password, authLogin, router],
  );

  return (
    <main
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black overflow-hidden selection:bg-indigo-500/30 selection:text-white"
      aria-label="Login page"
    >
      {/* keep EXACT same background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.18) 0%, transparent 60%),' +
            'radial-gradient(circle at 80% 80%, rgba(67,56,202,0.14) 0%, transparent 50%)',
        }}
      />

      {/* Card layout tweaks: tighter vertical rhythm, better readability */}
      <section
        className="relative z-10 w-[92%] max-w-md p-8 sm:p-10 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/10"
        aria-label="Login card"
      >
        {/* header */}
        <header className="flex flex-col items-center">
          <Image
            src="https://img.icons8.com/emoji/100/movie-camera-emoji.png"
            width={72}
            height={72}
            alt="MovieMate"
            className="mb-3"
            priority
          />
          <h1 className="text-3xl font-bold text-white tracking-tight text-center">
            Welcome back 👋
          </h1>
          <p className="mt-2 text-sm text-gray-300 text-center max-w-sm leading-6">
            Sign in to continue discovering new movies.
          </p>
        </header>

        {/* form */}
        <form onSubmit={handleSubmit} autoComplete="on" className="mt-6 space-y-5">
          {/* Identifier */}
          <div className="space-y-1.5">
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-100">
              Identifier
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              autoComplete="username"
              disabled={loading}
              minLength={3}
              maxLength={64}
              inputMode="text"
              spellCheck={false}
              autoCapitalize="off"
              className="block w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-base text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/60 transition disabled:opacity-60"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Username or email"
              aria-required="true"
              aria-invalid={!!errMsg}
              aria-describedby={errMsg ? 'login-error' : undefined}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-100">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                disabled={loading}
                minLength={6}
                maxLength={72}
                className="block w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 pr-10 text-base text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/60 transition disabled:opacity-60"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-required="true"
                aria-invalid={!!errMsg}
                aria-describedby={errMsg ? 'login-error' : undefined}
                onKeyUp={(e) => {
                  const native = e.nativeEvent as KeyboardEvent;
                  setCapsOn(native.getModifierState?.('CapsLock') ?? false);
                }}
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-2 flex items-center p-1 text-gray-400 hover:text-white transition"
                onClick={() => setShowPassword((v) => !v)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {capsOn && (
              <p className="text-xs text-amber-300/90" role="status">
                Caps Lock is ON
              </p>
            )}
          </div>

          {/* Error Message */}
          {errMsg && (
            <div
              id="login-error"
              ref={errorRef}
              className="text-red-300 text-sm rounded-md bg-red-950/40 border border-red-400/30 px-3 py-2"
              role="alert"
              aria-live="polite"
              tabIndex={-1}
            >
              {errMsg}
            </div>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-base font-semibold text-white hover:bg-indigo-500 active:bg-indigo-700 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 disabled:opacity-50"
            aria-busy={loading}
            aria-disabled={loading}
          >
            {/* subtle sheen on hover for nicer feel */}
            <span className="pointer-events-none absolute inset-0 rounded-lg overflow-hidden">
              <span className="absolute -inset-[120%] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.25),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </span>
            {loading && <Spinner className="h-5 w-5" />}
            <span className="relative">Sign in</span>
          </button>
        </form>

        {/* footer */}
        <div className="mt-6 border-t border-white/10 pt-4 text-center">
          <span className="text-gray-300 mr-1">Don’t have an account?</span>
          <Link
            href={ROUTES.REGISTER}
            className="text-indigo-400 underline hover:text-indigo-200 font-medium"
          >
            Sign up
          </Link>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
