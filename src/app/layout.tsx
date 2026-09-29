import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: {
    default: 'BUILTIT AI — Upload. Analyze. Build.',
    template: '%s | BUILTIT AI',
  },
  description:
    'AI-powered visual analysis, reconstruction, learning and practice platform. Upload diagram images, get AI-derived logical construction sequences, and practice rebuilding them step by step.',
  keywords: [
    'diagram analysis',
    'AI diagram reconstruction',
    'visual learning',
    'construction sequence',
    'diagram practice',
    'UML analysis',
    'flowchart learning',
    'BUILTIT AI',
  ],
  authors: [{ name: 'BUILTIT AI' }],
  creator: 'BUILTIT AI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    title: 'BUILTIT AI — Upload. Analyze. Build.',
    description:
      'AI-powered diagram analysis and reconstruction learning platform.',
    siteName: 'BUILTIT AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BUILTIT AI — Upload. Analyze. Build.',
    description: 'AI-powered diagram analysis and reconstruction learning platform.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0a12',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#13132a',
                  color: '#f9fafb',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '14px',
                },
                success: {
                  iconTheme: { primary: '#8b5cf6', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                  duration: 6000,
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
