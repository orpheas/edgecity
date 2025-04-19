'use client';

import { GameProvider } from '@/context/GameContext';
import { Game } from '@/components/Game';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Media Literacy Challenge
        </h1>
        <GameProvider>
          <Game />
          <Toaster position="bottom-center" />
        </GameProvider>
      </div>
    </main>
  );
}
