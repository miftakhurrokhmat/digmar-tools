import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'digmar-tools',
  description: 'Target Promotion Mapping & State Deal Tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}