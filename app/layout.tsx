import type { Metadata } from 'next';
import { Poppins, Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { FeedbackProvider } from '@/components/ui/FeedbackProvider';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Society of Software Engineers (SSE) | Nigeria',
    template: '%s | Society of Software Engineers (SSE)',
  },
  description:
    'The foremost professional body committed to promoting excellence in software engineering and strengthening Nigeria\'s digital ecosystem.',
  keywords: [
    'software engineering',
    'nigeria',
    'software developers',
    'professional body',
    'SSE',
    'technology',
    'coding',
    'tech nigeria',
  ],
  authors: [{ name: 'Society of Software Engineers' }],
  creator: 'Society of Software Engineers',
  publisher: 'Society of Software Engineers',
  icons: {
    icon: [
      { url: '/icon.jpeg', type: 'image/jpeg' },
      { url: '/images/sseng.jpeg', type: 'image/jpeg' },
    ],
    shortcut: '/icon.jpeg',
    apple: '/icon.jpeg',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Society of Software Engineers (SSE) | Nigeria',
    description:
      'The foremost professional body committed to promoting excellence in software engineering and strengthening Nigeria\'s digital ecosystem.',
    type: 'website',
    locale: 'en_NG',
    siteName: 'Society of Software Engineers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Society of Software Engineers (SSE) | Nigeria',
    description:
      'The foremost professional body committed to promoting excellence in software engineering and strengthening Nigeria\'s digital ecosystem.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} ${firaCode.variable}`}>
      <body>
        <FeedbackProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </FeedbackProvider>
      </body>
    </html>
  );
}
