
// src/ai/flows/generate-quiz.ts
'use server';

/**
 * @fileOverview AI quiz generator flow.
 *
 * - generateQuiz - A function that generates a quiz based on the given topic.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateQuizOutputSchema, type GenerateQuizOutput } from '@/lib/types';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

// GenerateQuizOutput and GenerateQuizOutputSchema are now imported from @/lib/types

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema}, // Use imported schema
  prompt: `You are a quiz generator. Generate a quiz with {{numQuestions}} questions on the topic of {{topic}}.

The quiz should be in JSON format with the following structure:

{
  "quiz": [
    {
      "question": "Question 1",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    },
    {
      "question": "Question 2",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B"
    }
  ]
}

Make sure that the options provided are relevant to the question asked, and that the correct answer is among the options.
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema, // Use imported schema
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
