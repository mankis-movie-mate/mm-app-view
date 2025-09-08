import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/context/AuthGuard';
import ReactQueryProvider from '@/context/QueryClientProvider';
import { Toaster } from '@/components/ui/sonner';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MovieMate',
  description: 'Personalized movie recommendations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <AuthProvider>
            <AuthGuard>{children}</AuthGuard>
            <Toaster richColors expand={true} position="top-center" />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
