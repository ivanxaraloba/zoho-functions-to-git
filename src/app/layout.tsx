import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import './globals.css';

import { cn } from '@/lib/utils';
import ReactQueryProvider from '@/providers/react-query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { AppSidebar } from '@/components/layout/navbar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LOBA | Z2G',
  description: 'by ivan xara',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={cn(inter.className, false && 'pb-if-overflow')}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NuqsAdapter>
              <Analytics />
              <Toaster richColors />
              {children}
            </NuqsAdapter>
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
