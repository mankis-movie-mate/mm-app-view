'use client';

import React, { useState } from 'react';
import { register, RegisterInput } from '@/lib/api/authApi';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/Spinner';
import { ROUTES } from '@/lib/constants/routes';

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterInput>({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: doLogin } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { userDetails, accessToken, refreshToken } = await register(form);
      doLogin(accessToken, refreshToken, userDetails);
      router.push(ROUTES.RECOMMEND);
    } catch (e: any) {
      setErr(e.userMessage || e.message || 'Register failed');
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
          Register your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-100">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                disabled={loading}
                autoComplete="username"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm disabled:opacity-50"
                value={form.username}
                onChange={handleChange}
                placeholder="Your username"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-100">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={loading}
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm disabled:opacity-50"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-100">
              Phone Number
            </label>
            <div className="mt-2">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                disabled={loading}
                autoComplete="tel"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm disabled:opacity-50"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+7813753801990"
              />
            </div>
          </div>

          {/* Password */}
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
                disabled={loading}
                autoComplete="new-password"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm disabled:opacity-50"
                value={form.password}
                onChange={handleChange}
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
              Register
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <a href={ROUTES.LOGIN} className="text-indigo-400 underline hover:text-indigo-300">
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
