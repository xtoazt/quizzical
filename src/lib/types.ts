
import { z } from "zod";

// Schema for a single generated quiz question
export const GeneratedQuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('The possible answers to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  imageUrl: z.string().nullable().optional().describe('Optional URL of an image relevant to the question. Can be null or missing.'),
  imageDescription: z.string().nullable().optional().describe('Optional description of the image. Can be null or missing.'),
});
export type GeneratedQuizQuestion = z.infer<typeof GeneratedQuizQuestionSchema>;

// Schema for the overall output of the quiz generation AI flow
export const GenerateQuizOutputSchema = z.object({
  quiz: z.array(GeneratedQuizQuestionSchema).describe('The generated quiz questions and answers.'),
  scoringSystemContext: z.string().nullable().optional().describe("Optional context about the scoring system. Can be null or missing."),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


// Interface for a quiz question once it's part of the active quiz state (includes user answers, etc.)
export interface QuizQuestion extends GeneratedQuizQuestion {
  userAnswer?: string;
  aiExplanation?: string;
  isCorrect?: boolean;
  hintUsed?: boolean;
  hintText?: string;
  userSubmittedReasoning?: string; 
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
  scoringSystemContext?: string | null; // Allow null from AI
}

// For the new ReleasedTestQuizSetup form
export const releasedTestQuizSetupSchema = z.object({
  county: z.string().min(3, "County/Region must be at least 3 characters long."),
  unit: z.string().min(3, "Unit/Subject must be at least 3 characters long."),
  numQuestions: z.coerce.number().min(1, "Number of questions must be at least 1.").max(100, "Max 100 questions."),
});
export type ReleasedTestQuizSetupFormValues = z.infer<typeof releasedTestQuizSetupSchema>;

// Schema for the QuizSetup form by topic
export const quizSetupSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long.").max(100, "Topic cannot exceed 100 characters."),
  numQuestions: z.coerce.number().min(1, "Number of questions must be at least 1.").max(100, "Max 100 questions."),
});
export type QuizSetupFormValues = z.infer<typeof quizSetupSchema>;

// Schema for hint generation
export const GenerateHintInputSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
});
export type GenerateHintInput = z.infer<typeof GenerateHintInputSchema>;

export const GenerateHintOutputSchema = z.object({
  hint: z.string(),
});
export type GenerateHintOutput = z.infer<typeof GenerateHintOutputSchema>;

// Schema for explaining an answer
export const ExplainAnswerInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  answer: z.string().describe('The user\'s answer to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  userReasoning: z.string().optional().describe('The user\'s reasoning for their incorrect answer.'),
});
export type ExplainAnswerInput = z.infer<typeof ExplainAnswerInputSchema>;

export const ExplainAnswerOutputSchema = z.object({
  explanation: z.string().describe('The AI tutor\'s explanation.'),
});
export type ExplainAnswerOutput = z.infer<typeof ExplainAnswerOutputSchema>;

// Schema for a single chat message
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Schema for Study Chatbot
export const StudyChatInputSchema = z.object({
  topic: z.string().describe('The topic the user wants to study.'),
  chatHistory: z.array(ChatMessageSchema).optional().describe('The history of the conversation so far. The last message is the current user message.'),
  currentUserMessage: z.string().describe('The latest message from the user (also included as the last message in chatHistory if history is provided).'),
});
export type StudyChatInput = z.infer<typeof StudyChatInputSchema>;

export const StudyChatOutputSchema = z.object({
  aiResponseMessage: z.string().describe('The AI tutor\'s response message.'),
});
export type StudyChatOutput = z.infer<typeof StudyChatOutputSchema>;

// Schema for Question Solver
export const SolveQuestionInputSchema = z.object({
  questionText: z.string().describe('The question text pasted by the user.'),
});
export type SolveQuestionInput = z.infer<typeof SolveQuestionInputSchema>;

export const SolveQuestionOutputSchema = z.object({
  solution: z.string().describe('The step-by-step solution to the question.'),
  explanation: z.string().optional().describe('An optional additional explanation or context for the solution.'),
});
export type SolveQuestionOutput = z.infer<typeof SolveQuestionOutputSchema>;

// Types for Dashboard
export interface RecentActivityItem {
  id: string;
  type: 'quiz' | 'study' | 'solve';
  description: string;
  timestamp: number;
  icon?: React.ElementType; // For Lucide icons
}

export const StudyGoalSchema = z.object({
  text: z.string().max(200, "Goal should be concise (max 200 chars).").optional(),
  lastUpdated: z.number().optional(),
});
export type StudyGoal = z.infer<typeof StudyGoalSchema>;
