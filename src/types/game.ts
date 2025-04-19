export type MediaTechnique = 
  | 'misleading_context'
  | 'manipulated_media'
  | 'false_connection'
  | 'fabricated_content'
  | 'none';

export interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
  technique: MediaTechnique;
  explanation: string;
  metrics: {
    likes: number;
    retweets: number;
    comments: number;
  };
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