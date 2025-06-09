
"use server";

import { generateQuiz, type GenerateQuizInput } from "@/ai/flows/generate-quiz";
import { explainAnswer, type ExplainAnswerInput, type ExplainAnswerOutput } from "@/ai/flows/explain-answer";
import { generateReleasedTestQuiz, type GenerateReleasedTestQuizInput } from "@/ai/flows/generate-released-test-quiz";
import { generateHint, type GenerateHintInput, type GenerateHintOutput } from "@/ai/flows/generate-hint";
import { studyChat, type StudyChatInput, type StudyChatOutput } from "@/ai/flows/study-chat-flow";
import { solveQuestion, type SolveQuestionInput, type SolveQuestionOutput } from "@/ai/flows/solve-question-flow";
import type { GenerateQuizOutput, ChatMessage } from "@/lib/types"; // Added ChatMessage
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
      return { success: false, error: result?.scoringSystemContext || "AI failed to generate a quiz for this topic. Please try a different topic or adjust the number of questions." };
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
       return { success: false, error: result?.scoringSystemContext || "AI could not find or generate a quiz from released tests. Please check your inputs or try broader terms." };
    }
  } catch (error) {
    console.error("Error generating released test quiz:", error);
    return { success: false, error: "An unexpected error occurred while generating the quiz from released tests." };
  }
}

export async function handleExplainAnswerAction(
  questionText: string, 
  userAnswer: string,
  correctAnswer: string,
  userReasoning?: string 
): Promise<{ success: boolean; data?: ExplainAnswerOutput; error?: string }> {
  const input: ExplainAnswerInput = {
    question: questionText,
    answer: userAnswer,
    correctAnswer,
    userReasoning, 
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

export async function handleStudyChatMessageAction(
  topic: string,
  currentUserMessage: string,
  chatHistory?: ChatMessage[] // Added chatHistory
): Promise<{ success: boolean; data?: StudyChatOutput; error?: string }> {
  const input: StudyChatInput = { topic, currentUserMessage, chatHistory };
  try {
    const result = await studyChat(input);
    if (result && result.aiResponseMessage) {
      return { success: true, data: result };
    } else {
      return { success: false, error: "AI tutor could not respond. Please try again." };
    }
  } catch (error) {
    console.error("Error in study chat:", error);
    return { success: false, error: "An unexpected error occurred with the AI tutor." };
  }
}

export async function handleSolveQuestionAction(
  questionText: string
): Promise<{ success: boolean; data?: SolveQuestionOutput; error?: string }> {
  const input: SolveQuestionInput = { questionText };
  try {
    const result = await solveQuestion(input);
    if (result && result.solution) {
      return { success: true, data: result };
    } else {
      return { success: false, error: "AI could not solve the question. Please ensure it's clearly phrased." };
    }
  } catch (error) {
    console.error("Error solving question:", error);
    return { success: false, error: "An unexpected error occurred while solving the question." };
  }
}

    