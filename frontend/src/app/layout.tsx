import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MedSim Global — Healthcare Crisis Simulation',
  description: 'A Monte Carlo-Based Healthcare & Mental Stability Simulation Platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: '#020817', color: '#E2E8F0', margin: 0 }}>{children}</body>
    </html>
  );
}
