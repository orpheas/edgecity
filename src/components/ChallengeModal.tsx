import { useState } from "react";
import { Post } from "@/types/game";
import { useGame } from "@/context/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  CheckIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";

interface ChallengeModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  lessonTitle: string;
}

export function ChallengeModal({
  post,
  isOpen,
  onClose,
  onComplete,
  lessonTitle,
}: ChallengeModalProps) {
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { gameState, updateScore, updateStreak, markPostComplete, addHint } =
    useGame();

  const handleAnswer = (answer: boolean) => {
    const correct = answer === post.isExample;
    setIsCorrect(correct);
    setAnswered(true);

    if (correct) {
      const basePoints = 100;
      const streakMultiplier = Math.min(3, 1 + gameState.currentStreak * 0.5);
      const hintPenalty = gameState.hintsUsed.includes(post.id) ? 0.5 : 1;
      const points = Math.floor(basePoints * streakMultiplier * hintPenalty);
      toast.success(`Correct! +${points} points`);
      updateScore(points);
      updateStreak(true);
      markPostComplete(post.id);
      setTimeout(() => {
        onComplete();
      }, 1200);
    } else {
      toast.error("Incorrect.");
      updateStreak(false);
    }
  };

  const handleHint = () => {
    if (!gameState.hintsUsed.includes(post.id)) {
      addHint(post.id);
      toast(
        "Hint: Does this post clearly fit the definition discussed in the lesson?",
        {
          icon: "💡",
        }
      );
    }
  };

  const handleCloseAndContinue = () => {
    setAnswered(false);
    setIsCorrect(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col"
          >
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center z-10">
              <h2 className="text-lg font-semibold text-gray-900">
                Challenge: {lessonTitle}
              </h2>
              <button
                onClick={handleCloseAndContinue}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 flex-grow">
              <div className="space-y-5">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-gray-800 text-sm">
                      {post.author}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{post.content}</p>
                </div>

                {!answered && (
                  <>
                    <p className="text-gray-700 font-medium text-center">
                      Does this post demonstrate the technique:{" "}
                      <span className="font-bold">{lessonTitle}</span>?
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleAnswer(true)}
                        className="flex items-center justify-center space-x-2 bg-green-100 hover:bg-green-200 px-4 py-3 rounded-lg transition text-green-800 font-semibold"
                      >
                        <CheckIcon className="h-5 w-5" />
                        <span>Yes</span>
                      </button>
                      <button
                        onClick={() => handleAnswer(false)}
                        className="flex items-center justify-center space-x-2 bg-red-100 hover:bg-red-200 px-4 py-3 rounded-lg transition text-red-800 font-semibold"
                      >
                        <NoSymbolIcon className="h-5 w-5" />
                        <span>No</span>
                      </button>
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        onClick={handleHint}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={gameState.hintsUsed.includes(post.id)}
                      >
                        <QuestionMarkCircleIcon className="h-4 w-4" />
                        <span>Need a hint? (-50% points)</span>
                      </button>
                    </div>
                  </>
                )}

                {answered && (
                  <div className="flex flex-col items-center space-y-4 pt-4">
                    {isCorrect ? (
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">Correct!</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800">
                        <XMarkIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">Incorrect</span>
                      </div>
                    )}
                    <button
                      onClick={handleCloseAndContinue}
                      className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Continue
                    </button>
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
