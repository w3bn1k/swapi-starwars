import type { Metadata } from 'next';
import { Orbitron } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { QueryProvider } from '@/components/QueryProvider';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Star Wars Characters',
  description: 'Explore the galaxy far, far away with detailed character information and local editing capabilities',
  manifest: '/manifest.json',
  themeColor: '#FFD700',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={orbitron.className}>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <ServiceWorkerRegistration />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
