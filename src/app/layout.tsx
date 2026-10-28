import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Azúcar Rush — Pastelería',
  description: 'Juego 3D de gestión y rapidez en primera persona. Hornea, decora y levanta tu pastelería hasta la Gran Apertura.',
  icons: {
    icon: './img/icon.ico',
    shortcut: './img/icon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="./img/icon.ico" />
        {/* Outfit font via Google Fonts – works in both browser and Electron (online) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased overflow-hidden select-none bg-pink-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
