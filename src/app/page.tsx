// Remove 'use client' - this page can now be static or server-rendered
// 'use client';

// Remove unused imports
// import { GameProvider } from '@/context/GameContext';
// import { Game } from '@/components/Game';
// import { Toaster } from 'react-hot-toast';

import Link from "next/link";
import { Lesson } from "@/types/game";
import lessonsData from "@/data/lessons.json"; // Import lesson data

export default function Home() {
  const lessons = lessonsData as Lesson[]; // Type assertion

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Flashbang
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {lessons.map((lesson) => (
            <Link key={lesson.id} href={`/lessons/${lesson.id}`} passHref>
              <div className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-3 text-gray-900">
                  {lesson.title}
                </h2>
                <p className="text-gray-600 flex-grow">{lesson.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Remove GameProvider, Game, Toaster */}
        {/* <GameProvider>
          <Game />
          <Toaster position="bottom-center" />
        </GameProvider> */}
      </div>
    </main>
  );
}
