import { useState } from 'react';
import { Post as PostType, MediaTechnique } from '@/types/game';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';
import {
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathRoundedSquareIcon,
} from '@heroicons/react/24/outline';

const techniques: { label: string; value: MediaTechnique }[] = [
  { label: 'Misleading Context', value: 'misleading_context' },
  { label: 'Manipulated Media', value: 'manipulated_media' },
  { label: 'False Connection', value: 'false_connection' },
  { label: 'Fabricated Content', value: 'fabricated_content' },
  { label: 'None', value: 'none' },
];

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

interface PostProps {
  post: PostType;
  onComplete: () => void;
}

export function Post({ post, onComplete }: PostProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { gameState, updateScore, updateStreak, markPostComplete, useHint } = useGame();

  const handleAnswer = (technique: MediaTechnique) => {
    const correct = technique === post.technique;
    const basePoints = 100;
    const streakMultiplier = Math.min(3, 1 + gameState.currentStreak * 0.5);
    const hintPenalty = gameState.hintsUsed.includes(post.id) ? 0.5 : 1;
    const points = Math.floor(basePoints * streakMultiplier * hintPenalty);

    if (correct) {
      toast.success(`Correct! +${points} points`);
      updateScore(points);
      updateStreak(true);
    } else {
      toast.error('Incorrect. Try again!');
      updateStreak(false);
    }

    setAnswered(true);
    markPostComplete(post.id);
    onComplete();
  };

  const handleHint = () => {
    if (!gameState.hintsUsed.includes(post.id)) {
      useHint(post.id);
      toast('Hint: Look carefully at the media and its relationship to the claim', {
        icon: '💡',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 max-w-2xl mx-auto mb-4"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900">{post.author}</span>
            <span className="text-gray-600 text-sm">
              {new Date(post.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-2 text-gray-900">{post.content}</p>
          {post.media && (
            <div className="mt-3 relative rounded-lg overflow-hidden">
              {post.media.type === 'image' ? (
                <Image
                  src={post.media.url}
                  alt="Post media"
                  width={500}
                  height={300}
                  className="w-full object-cover"
                />
              ) : (
                <video
                  src={post.media.url}
                  controls
                  className="w-full"
                  style={{ maxHeight: '300px' }}
                />
              )}
            </div>
          )}
          
          <div className="mt-3 flex items-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span className="text-sm">{formatNumber(post.metrics.comments)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowPathRoundedSquareIcon className="h-5 w-5" />
              <span className="text-sm">{formatNumber(post.metrics.retweets)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <HeartIcon className="h-5 w-5" />
              <span className="text-sm">{formatNumber(post.metrics.likes)}</span>
            </div>
          </div>
        </div>
      </div>

      {!answered && (
        <div className="mt-4">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
          >
            Identify Technique
          </button>
          <button
            onClick={handleHint}
            className="ml-2 text-gray-600 hover:text-gray-800"
            disabled={gameState.hintsUsed.includes(post.id)}
          >
            <QuestionMarkCircleIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      {showOptions && !answered && (
        <div className="mt-4 grid grid-cols-1 gap-2">
          {techniques.map((technique) => (
            <button
              key={technique.value}
              onClick={() => handleAnswer(technique.value)}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-left transition text-gray-900"
            >
              {technique.label}
            </button>
          ))}
        </div>
      )}

      {answered && (
        <div className="mt-4 p-4 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2">
            {post.technique === post.technique ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-500" />
            )}
            <p className="text-gray-900">{post.explanation}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
} 