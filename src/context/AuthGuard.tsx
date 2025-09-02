// src/context/AuthGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { fetchApi } from '@/lib/api/fetchApi';
import { ROUTES } from '@/lib/constants/routes';

const PUBLIC_PATHS = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.HOME];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, isInitialized } = useAuth();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) return; // ⏳ Wait for localStorage to be read

    const ensureAuth = async () => {
      if (PUBLIC_PATHS.includes(pathname)) {
        setLoading(false);
        return;
      }

      if (token) {
        setLoading(false);
        return;
      }

      router.push(ROUTES.LOGIN);
    };

    ensureAuth();
  }, [pathname, isInitialized, token]);

  if (!isInitialized || isLoading) return <FullScreenLoader />;
  return <>{children}</>;
}
