import { useState } from 'react';
import { Tweet } from './Tweet';
import { ChallengeModal } from './ChallengeModal';
import { useGame } from '@/context/GameContext';
import { Post } from '@/types/game';
import postsData from '@/data/posts.json';
import { motion } from 'framer-motion';

export function Game() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const { gameState, resetGame } = useGame();
  const posts = postsData.posts as Post[];

  const handlePostComplete = () => {
    if (gameState.postsCompleted.length === posts.length - 1) {
      setTimeout(() => {
        setSelectedPost(null);
        setShowSummary(true);
      }, 1500);
    }
  };

  const handleRestart = () => {
    resetGame();
    setShowSummary(false);
  };

  if (showSummary) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto p-6"
      >
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Game Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-900">Final Score:</span>
              <span className="font-bold text-xl text-gray-900">{gameState.score}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-900">Highest Streak:</span>
              <span className="font-bold text-gray-900">{gameState.highestStreak}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-900">Hints Used:</span>
              <span className="font-bold text-gray-900">{gameState.hintsUsed.length}</span>
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={handleRestart}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Play Again
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 z-10">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold text-gray-900">Score: {gameState.score}</span>
              <span className="ml-4 text-sm text-gray-600">
                Streak: {gameState.currentStreak}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {gameState.postsCompleted.length} of {posts.length} completed
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {posts.map((post) => (
            <Tweet
              key={post.id}
              post={post}
              onClick={() => setSelectedPost(post)}
              isCompleted={gameState.postsCompleted.includes(post.id)}
            />
          ))}
        </div>
      </div>

      {selectedPost && (
        <ChallengeModal
          post={selectedPost}
          isOpen={true}
          onClose={() => setSelectedPost(null)}
          onComplete={handlePostComplete}
        />
      )}
    </>
  );
} 