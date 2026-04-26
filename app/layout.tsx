import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tripl3Frame Onboarding',
  description: 'Onboarding wizard voor Tripl3Frame restaurantklanten',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
