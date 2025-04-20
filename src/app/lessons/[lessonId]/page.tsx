"use client"; // Required because GameProvider/Game use hooks and localStorage

import { GameProvider } from "@/context/GameContext";
import { Game } from "@/components/Game";
import { Toaster } from "react-hot-toast";
import { Lesson, Post } from "@/types/game";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import ReactPlayer from "react-player/youtube"; // Import ReactPlayer (specifically for YouTube)

// Helper function to fetch data (replace with actual API call or file read if needed)
// For simplicity, we'll import directly, but this could be async
import lessonsData from "@/data/lessons.json";

async function getLessonData(
  lessonId: string
): Promise<{ lesson: Lesson | null; posts: Post[] | null }> {
  const lesson =
    (lessonsData as Lesson[]).find((l) => l.id === lessonId) || null;
  if (!lesson) {
    return { lesson: null, posts: null };
  }

  try {
    // Dynamically import posts based on lessonId
    const postModule = await import(`@/data/posts/${lessonId}.json`);
    const posts = postModule.default.posts as Post[]; // Access default export
    return { lesson, posts };
  } catch (error) {
    console.error(`Failed to load posts for lesson ${lessonId}:`, error);
    return { lesson, posts: null }; // Return lesson but indicate posts failed
  }
}

interface LessonPageProps {
  params: { lessonId: string };
}

export default function LessonPage({ params }: LessonPageProps) {
  const lessonId = params.lessonId;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State to manage the current phase
  const [isVideoPhaseComplete, setIsVideoPhaseComplete] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getLessonData(lessonId);
        if (!data.lesson) {
          notFound(); // Trigger 404 if lesson doesn't exist
          return;
        }
        if (!data.posts) {
          setError(
            `Posts for lesson "${data.lesson.title}" could not be loaded.`
          );
          setLesson(data.lesson);
          setPosts([]); // Set empty array to avoid breaking Game component
        } else {
          setLesson(data.lesson);
          setPosts(data.posts);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load lesson data.");
        // Potentially call notFound() here too, depending on desired behavior
      }
      setIsLoading(false);
    }

    loadData();
    // Reset video phase when lessonId changes
    setIsVideoPhaseComplete(false);
  }, [lessonId]);

  // Handler for when the video ends
  const handleVideoEnded = () => {
    console.log("Video ended, proceeding to challenge.");
    setIsVideoPhaseComplete(true);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading Lesson...</div>
      </main>
    );
  }

  if (error || !lesson || !posts) {
    return (
      <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 text-center">
          {error || "Lesson data could not be loaded."}
        </p>
        {lesson && <p className="text-gray-600 mt-2">Lesson: {lesson.title}</p>}
        {/* Add a link back home? */}
      </main>
    );
  }

  // Determine if the current lesson *has* a video defined
  const hasVideo = !!lesson.youtubeUrl;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          {lesson.title}
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          {lesson.description}
        </p>

        {/* Phase 1: Video Player (only if URL exists and phase not complete) */}
        {hasVideo && !isVideoPhaseComplete && (
          <div className="max-w-3xl mx-auto mb-8 bg-black rounded-lg overflow-hidden shadow-lg">
            <p className="text-center text-white bg-gray-800 py-2 text-sm">
              Please watch the video below to continue.
            </p>
            {/* Responsive Wrapper for ReactPlayer */}
            <div
              style={{
                position: "relative",
                paddingTop: "56.25%" /* 16:9 Aspect Ratio */,
              }}
            >
              <ReactPlayer
                url={lesson.youtubeUrl}
                controls={true} // Show native controls
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
                onEnded={handleVideoEnded} // Trigger phase change on end
                // Optional: Add onPlay, onError, etc. handlers if needed
                // muted={true} // Consider if autoplay is desired (requires muted)
                // playing={true} // Enable autoplay (if muted)
              />
            </div>
          </div>
        )}

        {/* Phase 2: Challenge (shown if no video URL OR if video phase is complete) */}
        {(!hasVideo || isVideoPhaseComplete) && (
          <GameProvider lessonId={lesson.id}>
            <Game posts={posts} lessonTitle={lesson.title} />
            <Toaster position="bottom-center" />
          </GameProvider>
        )}
      </div>
    </main>
  );
}
