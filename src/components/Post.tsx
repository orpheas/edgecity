import { useState } from 'react';
import { Post as PostType, MediaTechnique } from '@/types/game';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';
import {
  QuestionMarkCircleIcon,
  CheckCircleIcon,
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

interface PostProps {
  post: PostType;
  onComplete: () => void;
}

export function Post({ post, onComplete }: PostProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { gameState, updateScore, updateStreak, markPostComplete, addHint } = useGame();

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
      setAnswered(true);
      markPostComplete(post.id);
      onComplete();
    } else {
      toast.error('Incorrect. Try again!');
      updateStreak(false);
      // Reset options to allow another attempt
      setShowOptions(false);
      setTimeout(() => setShowOptions(true), 100);
    }
  };

  const handleHint = () => {
    if (!gameState.hintsUsed.includes(post.id)) {
      addHint(post.id);
      toast('Hint: Look carefully at the media and its relationship to the claim', {
        icon: '💡',
      });
    }
  };

  // Generate a consistent avatar URL for each user
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
        answered ? 'opacity-60' : ''
      }`}
    >
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={avatarUrl}
              alt={`${post.author}'s avatar`}
              width={40}
              height={40}
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center text-sm">
            <span className="font-bold text-gray-900 hover:underline">{post.author}</span>
            <span className="text-gray-500 mx-1">·</span>
            <span className="text-gray-500">{formatDate(post.timestamp)}</span>
          </div>
          <p className="text-gray-900 mt-1 whitespace-pre-wrap break-words">{post.content}</p>
          {post.media && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-gray-100">
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
          
          <div className="mt-3 flex items-center justify-between max-w-md">
            <div className="group flex items-center text-gray-500 hover:text-blue-500 transition-colors">
              <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
              <span className="text-sm group-hover:text-blue-500">
                {formatNumber(post.metrics.comments)}
              </span>
            </div>
            <div className="group flex items-center text-gray-500 hover:text-green-500 transition-colors">
              <ArrowPathRoundedSquareIcon className="h-5 w-5 mr-2" />
              <span className="text-sm group-hover:text-green-500">
                {formatNumber(post.metrics.retweets)}
              </span>
            </div>
            <div className="group flex items-center text-gray-500 hover:text-red-500 transition-colors">
              <HeartIcon className="h-5 w-5 mr-2" />
              <span className="text-sm group-hover:text-red-500">
                {formatNumber(post.metrics.likes)}
              </span>
            </div>
            {!answered && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  Identify
                </button>
                <button
                  onClick={handleHint}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={gameState.hintsUsed.includes(post.id)}
                >
                  <QuestionMarkCircleIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {!answered && showOptions && (
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

          {/* Only show feedback when answered correctly */}
          {answered && (
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 text-green-700">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Correct!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 