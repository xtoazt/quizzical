
'use server';

/**
 * @fileOverview Explains a quiz answer with AI tutoring, potentially incorporating user reasoning.
 *
 * - explainAnswer - A function that provides AI tutoring for quiz questions.
 * - ExplainAnswerInput - The input type for the explainAnswer function.
 * - ExplainAnswerOutput - The return type for the explainAnswer function.
 */

import {ai} from '@/ai/genkit';
import { ExplainAnswerInputSchema, ExplainAnswerOutputSchema, type ExplainAnswerInput, type ExplainAnswerOutput } from '@/lib/types'; // Import from lib/types

export async function explainAnswer(input: ExplainAnswerInput): Promise<ExplainAnswerOutput> {
  return explainAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainAnswerPrompt',
  input: {schema: ExplainAnswerInputSchema},
  output: {schema: ExplainAnswerOutputSchema},
  prompt: `You are an AI tutor. A student has answered a quiz question incorrectly.

Question: {{{question}}}
Student's Answer: {{{answer}}}
Correct Answer: {{{correctAnswer}}}

{{#if userReasoning}}
The student provided the following reasoning for their answer:
"{{{userReasoning}}}"

Your task is to:
1. Analyze the student's reasoning.
2. Explain why their chosen answer is incorrect, specifically addressing any misconceptions evident in their reasoning.
3. Clearly explain why the correct answer is right.
4. Provide the explanation in a helpful, encouraging, and easy-to-understand manner.
{{else}}
The student did not provide specific reasoning.
Your task is to:
1. Explain why the student's answer is incorrect.
2. Clearly explain why the correct answer is right.
3. Provide the explanation in a helpful, encouraging, and easy-to-understand manner.
{{/if}}

Provide your explanation:`,
});

const explainAnswerFlow = ai.defineFlow(
  {
    name: 'explainAnswerFlow',
    inputSchema: ExplainAnswerInputSchema, // Use imported schema
    outputSchema: ExplainAnswerOutputSchema, // Use imported schema
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
