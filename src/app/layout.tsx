import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'ZÊNITE — Produtividade Gamificada',
  description: 'Transforme suas tarefas em uma jornada RPG',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex bg-zinc-950 text-zinc-100">
        <Sidebar />
        <main id="view" className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
