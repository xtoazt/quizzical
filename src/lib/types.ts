
import { z } from "zod";

// Schema for a single generated quiz question
export const GeneratedQuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('The possible answers to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  imageUrl: z.string().optional().describe('Optional URL of an image relevant to the question (e.g., a chart or diagram). This may not always be a strictly valid URL if the AI provides a descriptive placeholder.'),
  imageDescription: z.string().optional().describe('Optional description of the image if URL is not available or for accessibility.'),
});
export type GeneratedQuizQuestion = z.infer<typeof GeneratedQuizQuestionSchema>;

// Schema for the overall output of the quiz generation AI flow
export const GenerateQuizOutputSchema = z.object({
  quiz: z.array(GeneratedQuizQuestionSchema).describe('The generated quiz questions and answers.'),
  scoringSystemContext: z.string().optional().describe("Optional context about the scoring system of the source test, e.g., 'Scores range from 200-800'."),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


// Interface for a quiz question once it's part of the active quiz state (includes user answers, etc.)
export interface QuizQuestion extends GeneratedQuizQuestion {
  userAnswer?: string;
  aiExplanation?: string;
  isCorrect?: boolean;
  hintUsed?: boolean;
  hintText?: string;
  userSubmittedReasoning?: string; // To store user's reasoning
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
  scoringSystemContext?: string;
}

// For the new ReleasedTestQuizSetup form
const releasedTestQuizSetupSchema = z.object({
  county: z.string().min(3, "County/Region must be at least 3 characters long."),
  unit: z.string().min(3, "Unit/Subject must be at least 3 characters long."),
  numQuestions: z.coerce.number().min(1, "Number of questions must be at least 1.").max(100, "Max 100 questions."),
});
export type ReleasedTestQuizSetupFormValues = z.infer<typeof releasedTestQuizSetupSchema>;

// Schema for the QuizSetup form by topic
export const quizSetupSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
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

// Schema for explaining an answer (updated)
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
