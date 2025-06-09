
import { z } from "zod";

// Schema for a single generated quiz question
export const GeneratedQuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('The possible answers to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
});
export type GeneratedQuizQuestion = z.infer<typeof GeneratedQuizQuestionSchema>;

// Schema for the overall output of the quiz generation AI flow
export const GenerateQuizOutputSchema = z.object({
  quiz: z.array(GeneratedQuizQuestionSchema).describe('The generated quiz questions and answers.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


// Interface for a quiz question once it's part of the active quiz state (includes user answers, etc.)
export interface QuizQuestion extends GeneratedQuizQuestion {
  userAnswer?: string;
  aiExplanation?: string;
  isCorrect?: boolean;
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
}

// For the new ReleasedTestQuizSetup form
const releasedTestQuizSetupSchema = z.object({
  county: z.string().min(3, "County must be at least 3 characters long."),
  unit: z.string().min(3, "Unit/Subject must be at least 3 characters long."),
  numQuestions: z.coerce.number().min(1, "Number of questions must be at least 1.").max(20, "Max 20 questions."),
});
export type ReleasedTestQuizSetupFormValues = z.infer<typeof releasedTestQuizSetupSchema>;
