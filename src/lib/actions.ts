"use server";

import { generateQuiz, GenerateQuizInput, GenerateQuizOutput } from "@/ai/flows/generate-quiz";
import { explainAnswer, ExplainAnswerInput, ExplainAnswerOutput } from "@/ai/flows/explain-answer";
import { z } from "zod";

export async function handleGenerateQuizAction(
  topic: string,
  numQuestions: number
): Promise<{ success: boolean; data?: GenerateQuizOutput; error?: string }> {
  const input: GenerateQuizInput = { topic, numQuestions };
  try {
    const result = await generateQuiz(input);
    if (result && result.quiz && result.quiz.length > 0) {
      return { success: true, data: result };
    } else {
      return { success: false, error: "AI failed to generate a quiz. Please try again." };
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    return { success: false, error: "An unexpected error occurred while generating the quiz." };
  }
}

export async function handleExplainAnswerAction(
  question: string,
  userAnswer: string,
  correctAnswer: string
): Promise<{ success: boolean; data?: ExplainAnswerOutput; error?: string }> {
  // The AI flow `explainAnswer` requires an 'explanation' field.
  // Since we don't have a pre-existing explanation, we'll pass a placeholder.
  // The AI might still be able to generate a useful explanation based on other inputs.
  const input: ExplainAnswerInput = {
    question,
    answer: userAnswer,
    correctAnswer,
    explanation: `The correct answer is ${correctAnswer}. Please elaborate on this topic.`, // Placeholder explanation
  };
  try {
    const result = await explainAnswer(input);
     if (result && result.explanation) {
      return { success: true, data: result };
    } else {
      return { success: false, error: "AI failed to provide an explanation." };
    }
  } catch (error) {
    console.error("Error explaining answer:", error);
    return { success: false, error: "An unexpected error occurred while fetching the explanation." };
  }
}
