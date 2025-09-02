'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
    // Create QueryClient only once per mount
    const [queryClient] = useState(() => new QueryClient());

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}