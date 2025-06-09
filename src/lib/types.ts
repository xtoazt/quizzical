export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  aiExplanation?: string; // For AI tutor's explanation from the flow
  isCorrect?: boolean;
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
}

// This type aligns with the output of generateQuiz AI flow
export interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface GeneratedQuiz {
  quiz: GeneratedQuizQuestion[];
}
