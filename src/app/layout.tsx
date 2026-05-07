import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { DisciplineProvider } from '@/context/discipline-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { BottomNav } from '@/components/navigation/bottom-nav';

export const metadata: Metadata = {
  title: 'SportMatch AI - Elite Digital Scouting',
  description: 'Plataforma SaaS de alto rendimiento para el ecosistema del fútbol.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-[#000000] selection:bg-primary selection:text-primary-foreground">
        <FirebaseClientProvider>
          <DisciplineProvider>
            <main className="min-h-screen pb-20 md:pb-0">
              {children}
            </main>
            <BottomNav />
            <Toaster />
          </DisciplineProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
