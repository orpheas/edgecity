export interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  media?: {
    type: "image" | "video";
    url: string;
  };
  isExample: boolean;
  metrics: {
    likes: number;
    retweets: number;
    comments: number;
  };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl?: string;
}

export interface GameState {
  score: number;
  currentStreak: number;
  highestStreak: number;
  postsCompleted: string[];
  hintsUsed: string[];
}

export interface GameContextType {
  gameState: GameState;
  updateScore: (points: number) => void;
  updateStreak: (correct: boolean) => void;
  markPostComplete: (postId: string) => void;
  addHint: (postId: string) => void;
  resetGame: () => void;
}
