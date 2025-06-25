import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Paw Protection - Find Your Perfect Pet Companion',
  description: 'Discover your ideal pet companion through our intelligent matching system. Adopt, love, and give a pet a forever home.',
  keywords: 'pet adoption, dogs, cats, animal rescue, pet care, animal welfare',
  authors: [{ name: 'Paw Protection Team' }],
  openGraph: {
    title: 'Paw Protection - Find Your Perfect Pet Companion',
    description: 'Discover your ideal pet companion through our intelligent matching system.',
    type: 'website',
    url: 'https://pawprotection.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}