import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MausamGuard — Weather Observation Lab',
  description:
    'Inspect weather station readings, simulate faults and compare anomaly detection methods. SIH26073 prototype.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
