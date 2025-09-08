'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { register, RegisterInput } from '@/lib/api/authApi';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/Spinner';
import { ROUTES } from '@/lib/constants/routes';
import { getErrorMessage } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';


const RegisterPage: React.FC = () => {
  const [form, setForm] = useState<RegisterInput>({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const errorRef = useRef<HTMLDivElement | null>(null);

  const { login: doLogin } = useAuth();
  const router = useRouter();

  // a11y: focus error region when it appears
  useEffect(() => {
    if (errMsg && errorRef.current) errorRef.current.focus();
  }, [errMsg]);

  // single change handler (DRY)
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      // Allow leading spaces only for password (avoid accidental spaces elsewhere)
      [name]: name === 'password' ? value : value.trimStart(),
    }));
  }, []);

  // Basic client-side validation (backend must re-validate)
  const validate = useCallback((f: RegisterInput): string | null => {
    if (!f.username.trim() || f.username.length < 3)
      return 'Username must be at least 3 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return 'Enter a valid email address.';
    if (!/^\+?[1-9]\d{6,14}$/.test(f.phoneNumber))
      return 'Enter a valid phone number in international format.';
    if (f.password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrMsg('');

      const validationError = validate(form);
      if (validationError) {
        setErrMsg(validationError);
        return;
      }

      setLoading(true);
      try {
        const { userDetails, accessToken, refreshToken } = await register({
          username: form.username.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
          password: form.password, // do not trim passwords
        });
        doLogin(accessToken, refreshToken, userDetails);
        router.push(ROUTES.RECOMMEND);
      } catch (err: unknown) {
        setErrMsg(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [form, doLogin, router, validate],
  );

  const cardClass =
    'relative z-10 w-[92%] max-w-md p-8 sm:p-10 rounded-2xl shadow-2xl ' +
    'bg-white/10 backdrop-blur-lg border border-white/10 ' +
    (errMsg ? 'animate-shake motion-reduce:animate-none' : '');

  return (
    <main
      className="relative min-h-screen flex items-center justify-center
                 bg-gradient-to-br from-indigo-900 via-slate-900 to-black overflow-hidden
                 selection:bg-indigo-500/30 selection:text-white"
      aria-label="Register page"
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.18) 0%, transparent 60%),' +
            'radial-gradient(circle at 80% 80%, rgba(67,56,202,0.14) 0%, transparent 50%)',
        }}
      />

      {/* Glass card */}
      <section className={cardClass} aria-label="Register card">
        <header className="flex flex-col items-center">
          {/* Keep your logo as is (local asset is fine) */}
          <Image
            src="https://img.icons8.com/emoji/100/movie-camera-emoji.png"
            width={72}
            height={72}
            alt="MovieMate"
            className="mb-3"
            priority
          />
          <h1 className="text-3xl font-bold text-white tracking-tight text-center">
            Create your account ✨
          </h1>
          <p className="mt-2 text-sm text-gray-300 text-center max-w-sm leading-6">
            Join MovieMate to discover what to watch next.
          </p>
        </header>

        <form onSubmit={handleSubmit} autoComplete="on" className="mt-6 space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-sm font-medium text-gray-100">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              disabled={loading}
              autoComplete="username"
              minLength={3}
              maxLength={32}
              inputMode="text"
              spellCheck={false}
              autoCapitalize="off"
              className="block w-full rounded-lg border border-white/10 bg-white/10
                         px-3 py-2 text-base text-white placeholder:text-gray-400 outline-none
                         focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/60
                         transition disabled:opacity-60"
              value={form.username}
              onChange={handleChange}
              placeholder="Your username"
              aria-required="true"
              aria-invalid={!!errMsg}
              aria-describedby={errMsg ? 'register-error' : undefined}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-100">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={loading}
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              className="block w-full rounded-lg border border-white/10 bg-white/10
                         px-3 py-2 text-base text-white placeholder:text-gray-400 outline-none
                         focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/60
                         transition disabled:opacity-60"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              aria-required="true"
              aria-invalid={!!errMsg}
              aria-describedby={errMsg ? 'register-error' : undefined}
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-100">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              disabled={loading}
              autoComplete="tel"
              inputMode="tel"
              maxLength={16}
              // IMPORTANT: use String.raw to avoid invalid escape errors in TSX
              pattern={String.raw`^\+?[1-9]\d{6,14}$`}
              title="Use international format, e.g. +123456789"
              className="block w-full rounded-lg border border-white/10 bg-white/10
                         px-3 py-2 text-base text-white placeholder:text-gray-400 outline-none
                         focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/60
                         transition disabled:opacity-60"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="+123456789"
              aria-required="true"
              aria-invalid={!!errMsg}
              aria-describedby={errMsg ? 'register-error' : undefined}
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
                disabled={loading}
                autoComplete="new-password"
                minLength={6}
                maxLength={72}
                className="block w-full rounded-lg border border-white/10 bg-white/10
                           px-3 py-2 pr-10 text-base text-white placeholder:text-gray-400 outline-none
                           focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/60
                           transition disabled:opacity-60"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                aria-required="true"
                aria-invalid={!!errMsg}
                aria-describedby={errMsg ? 'register-error' : undefined}
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
              id="register-error"
              ref={errorRef}
              className="text-red-300 text-sm rounded-md bg-red-950/40 border border-red-400/30 px-3 py-2"
              role="alert"
              aria-live="polite"
              tabIndex={-1}
            >
              {errMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center items-center gap-2 rounded-lg
                       bg-indigo-600 px-4 py-2 text-base font-semibold text-white
                       hover:bg-indigo-500 active:bg-indigo-700 transition
                       focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400
                       disabled:opacity-50"
            aria-busy={loading}
            aria-disabled={loading}
          >
            {/* subtle sheen */}
            <span className="pointer-events-none absolute inset-0 rounded-lg overflow-hidden">
              <span
                className="absolute -inset-[120%] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.25),transparent)]
                           translate-x-[-100%] group-hover:translate-x-[100%]
                           transition-transform duration-700 ease-out"
              />
            </span>
            {loading && <Spinner className="h-5 w-5" />}
            <span className="relative">Register</span>
          </button>
        </form>

        <footer className="mt-6 border-t border-white/10 pt-4 text-center">
          <span className="text-gray-300 mr-1">Already have an account?</span>
          <Link
            href={ROUTES.LOGIN}
            className="text-indigo-400 underline hover:text-indigo-200 font-medium"
          >
            Sign in
          </Link>
        </footer>
      </section>
    </main>

  );
};

export default RegisterPage;
