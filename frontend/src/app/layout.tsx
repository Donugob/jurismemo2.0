import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Solid SEO configuration for the root layout
export const metadata: Metadata = {
  title: {
    default: 'JurisMemo - Nigerian Law Resources & Lecture Notes',
    template: '%s | JurisMemo',
  },
  description: 'High-quality lecture notes, past questions, and resources for law students in Nigeria. We are dedicated to helping you excel in your studies at Imo State University and beyond.',
  applicationName: 'JurisMemo',
  authors: [{ name: 'JurisMemo Team', url: 'https://jurismemo.com' }],
  keywords: ['Law students', 'Nigeria', 'Lecture notes', 'Past questions', 'Imo State University', 'IMSU Law', 'Law notes', 'Legal resources'],
  creator: 'JurisMemo',
  publisher: 'JurisMemo',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://jurismemo.com',
    title: 'JurisMemo - Your Trusted Source for Law Lecture Notes',
    description: 'Find and download free law lecture notes and other resources for law students in Nigeria.',
    siteName: 'JurisMemo',
    images: [
      {
        url: 'https://jurismemo.com/images/default-og.jpg',
        width: 1200,
        height: 630,
        alt: 'JurisMemo Hero Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Don_ugob',
    creator: '@Don_ugob',
    title: 'JurisMemo - Nigerian Law Resources',
    description: 'Find and download free law lecture notes and other resources for law students in Nigeria.',
    images: ['https://jurismemo.com/images/default-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification-id",
  },
};

import { AuthProvider } from '@/components/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body className={`font-sans antialiased text-primary bg-light flex flex-col min-h-screen`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
