import { Post } from '@/types/game';
import Image from 'next/image';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathRoundedSquareIcon,
} from '@heroicons/react/24/outline';

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

interface TweetProps {
  post: Post;
  onClick: () => void;
  isCompleted: boolean;
}

export function Tweet({ post, onClick, isCompleted }: TweetProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left transition duration-200 hover:bg-gray-50 p-4 border-b border-gray-100 ${
        isCompleted ? 'opacity-60' : ''
      }`}
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
                  className="w-full object-cover rounded-xl"
                />
              ) : (
                <video
                  src={post.media.url}
                  controls
                  className="w-full rounded-xl"
                  style={{ maxHeight: '300px' }}
                />
              )}
            </div>
          )}
          
          <div className="mt-3 flex items-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2 group">
              <ChatBubbleLeftIcon className="h-5 w-5 group-hover:text-blue-500" />
              <span className="text-sm group-hover:text-blue-500">
                {formatNumber(post.metrics.comments)}
              </span>
            </div>
            <div className="flex items-center space-x-2 group">
              <ArrowPathRoundedSquareIcon className="h-5 w-5 group-hover:text-green-500" />
              <span className="text-sm group-hover:text-green-500">
                {formatNumber(post.metrics.retweets)}
              </span>
            </div>
            <div className="flex items-center space-x-2 group">
              <HeartIcon className="h-5 w-5 group-hover:text-red-500" />
              <span className="text-sm group-hover:text-red-500">
                {formatNumber(post.metrics.likes)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
} 