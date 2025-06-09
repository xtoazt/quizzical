'use server';

/**
 * @fileOverview Explains a quiz answer with AI tutoring.
 *
 * - explainAnswer - A function that provides AI tutoring for quiz questions.
 * - ExplainAnswerInput - The input type for the explainAnswer function.
 * - ExplainAnswerOutput - The return type for the explainAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainAnswerInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  answer: z.string().describe('The user\'s answer to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  explanation: z.string().describe('The explanation of the correct answer.'),
});
export type ExplainAnswerInput = z.infer<typeof ExplainAnswerInputSchema>;

const ExplainAnswerOutputSchema = z.object({
  explanation: z.string().describe('The AI tutor\'s explanation of why the user was wrong and the correct answer.'),
});
export type ExplainAnswerOutput = z.infer<typeof ExplainAnswerOutputSchema>;

export async function explainAnswer(input: ExplainAnswerInput): Promise<ExplainAnswerOutput> {
  return explainAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainAnswerPrompt',
  input: {schema: ExplainAnswerInputSchema},
  output: {schema: ExplainAnswerOutputSchema},
  prompt: `You are an AI tutor. A student answered the following question incorrectly. Explain to the student why their answer was wrong and what the correct answer is, using the provided explanation.\n\nQuestion: {{{question}}}\nStudent's Answer: {{{answer}}}\nCorrect Answer: {{{correctAnswer}}}\nExplanation: {{{explanation}}}`,
});

const explainAnswerFlow = ai.defineFlow(
  {
    name: 'explainAnswerFlow',
    inputSchema: ExplainAnswerInputSchema,
    outputSchema: ExplainAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
