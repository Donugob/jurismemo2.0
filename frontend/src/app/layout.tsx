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
  metadataBase: new URL('https://jurismemo.vercel.app'),
  title: {
    default: 'JurisMemo — Nigerian Law Resources & Lecture Notes',
    template: '%s | JurisMemo',
  },
  description: 'Master your legal studies with JurisMemo. The definitive arsenal for law students in Nigeria, providing verified lecture notes, past questions, and case summaries.',
  applicationName: 'JurisMemo',
  authors: [{ name: 'JurisMemo Team', url: 'https://jurismemo.vercel.app' }],
  keywords: ['Law students', 'Nigeria', 'Lecture notes', 'Past questions', 'Imo State University', 'IMSU Law', 'Law notes', 'Legal resources', 'Constitutional Law', 'Criminal Law'],
  creator: 'JurisMemo',
  publisher: 'JurisMemo',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://jurismemo.vercel.app',
    title: 'JurisMemo — Master Your Nigerian Legal Studies',
    description: 'The definitive arsenal for law students. Access verified lecture notes, past questions, and cases tailored for ivory tower excellence.',
    siteName: 'JurisMemo',
    images: [
      {
        url: 'https://i.postimg.cc/RhfGPFn4/Gemini-Generated-Image-vxa4wsvxa4wsvxa4.webp',
        width: 1200,
        height: 630,
        alt: 'JurisMemo — Premium Law Resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Don_ugob',
    creator: '@Don_ugob',
    title: 'JurisMemo — Master Your Nigerian Legal Studies',
    description: 'The definitive arsenal for law students. Access verified lecture notes, past questions, and cases tailored for ivory tower excellence.',
    images: ['https://i.postimg.cc/RhfGPFn4/Gemini-Generated-Image-vxa4wsvxa4wsvxa4.webp'],
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
