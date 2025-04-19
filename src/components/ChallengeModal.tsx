import { useState } from 'react';
import { Post, MediaTechnique } from '@/types/game';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const techniques: { label: string; value: MediaTechnique }[] = [
  { label: 'Misleading Context', value: 'misleading_context' },
  { label: 'Manipulated Media', value: 'manipulated_media' },
  { label: 'False Connection', value: 'false_connection' },
  { label: 'Fabricated Content', value: 'fabricated_content' },
  { label: 'None', value: 'none' },
];

interface ChallengeModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function ChallengeModal({ post, isOpen, onClose, onComplete }: ChallengeModalProps) {
  const [answered, setAnswered] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<MediaTechnique | null>(null);
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
      setSelectedTechnique(technique);
      markPostComplete(post.id);
      onComplete();
    } else {
      toast.error('Incorrect. Try again!');
      updateStreak(false);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Identify the Technique</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {!answered && (
                  <>
                    <p className="text-gray-600">
                      What manipulation technique is being used in this post?
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {techniques.map((technique) => (
                        <button
                          key={technique.value}
                          onClick={() => handleAnswer(technique.value)}
                          className="bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg text-left transition text-gray-900 flex justify-between items-center"
                        >
                          <span>{technique.label}</span>
                          <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" />
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleHint}
                        className="text-blue-500 hover:text-blue-600 flex items-center space-x-2"
                        disabled={gameState.hintsUsed.includes(post.id)}
                      >
                        <QuestionMarkCircleIcon className="h-5 w-5" />
                        <span>Need a hint?</span>
                      </button>
                    </div>
                  </>
                )}

                {answered && selectedTechnique && (
                  <div className="flex justify-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 text-green-700">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">Correct!</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 