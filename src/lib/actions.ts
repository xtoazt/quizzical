
"use server";

import { generateQuiz, type GenerateQuizInput } from "@/ai/flows/generate-quiz";
import { explainAnswer, type ExplainAnswerInput, type ExplainAnswerOutput } from "@/ai/flows/explain-answer"; // Updated import for new schema location
import { generateReleasedTestQuiz, type GenerateReleasedTestQuizInput } from "@/ai/flows/generate-released-test-quiz";
import { generateHint, type GenerateHintInput, type GenerateHintOutput } from "@/ai/flows/generate-hint";
import type { GenerateQuizOutput } from "@/lib/types";
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
      return { success: false, error: "AI failed to generate a quiz for this topic. Please try a different topic or adjust the number of questions." };
    }
  } catch (error) {
    console.error("Error generating topic quiz:", error);
    return { success: false, error: "An unexpected error occurred while generating the topic-based quiz." };
  }
}

export async function handleGenerateReleasedTestQuizAction(
  county: string,
  unit: string,
  numQuestions: number
): Promise<{ success: boolean; data?: GenerateQuizOutput; error?: string }> {
  const input: GenerateReleasedTestQuizInput = { county, unit, numQuestions };
  try {
    const result = await generateReleasedTestQuiz(input);
    if (result && result.quiz && result.quiz.length > 0) {
      return { success: true, data: result };
    } else {
      return { success: false, error: "AI could not find or generate a quiz from released tests for the given county and unit. Please check your inputs or try broader terms." };
    }
  } catch (error) {
    console.error("Error generating released test quiz:", error);
    return { success: false, error: "An unexpected error occurred while generating the quiz from released tests." };
  }
}

export async function handleExplainAnswerAction(
  questionText: string, // Renamed for clarity
  userAnswer: string,
  correctAnswer: string,
  userReasoning?: string // Optional user reasoning
): Promise<{ success: boolean; data?: ExplainAnswerOutput; error?: string }> {
  const input: ExplainAnswerInput = {
    question: questionText,
    answer: userAnswer,
    correctAnswer,
    userReasoning, // Pass it to the AI flow
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

export async function handleGetHintAction(
  question: string,
  options: string[]
): Promise<{ success: boolean; data?: GenerateHintOutput; error?: string }> {
  const input: GenerateHintInput = { question, options };
  try {
    const result = await generateHint(input);
    if (result && result.hint) {
      return { success: true, data: result };
    } else {
      return { success: false, error: "AI failed to generate a hint for this question." };
    }
  } catch (error)
  {
    console.error("Error generating hint:", error);
    return { success: false, error: "An unexpected error occurred while generating the hint." };
  }
}
