import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AIAssistantWidget } from '@/components/ai/AIAssistantWidget';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ApexCare | Enterprise AI-Powered Hospital Management System',
  description:
    'ApexCare Medical Center - Next-generation healthcare SaaS featuring clinical scheduling, electronic health records, AI-powered triage assistant, lab diagnostics, robotic pharmacy inventory, and real-time bed management.',
  keywords: [
    'Hospital Management System',
    'HMS',
    'Healthcare SaaS',
    'Electronic Health Records',
    'AI Hospital Assistant',
    'Clinical Dashboards',
  ],
  authors: [{ name: 'ApexCare Health Informatics' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-full flex flex-col bg-white text-zinc-950 selection:bg-zinc-900 selection:text-white">
        {children}
        {/* Floating Clinical AI Concierge Assistant */}
        <AIAssistantWidget />
      </body>
    </html>
  );
}
