
'use server';
/**
 * @fileOverview Generates a hint for a quiz question.
 *
 * - generateHint - A function that provides a hint for a specific quiz question.
 * - GenerateHintInput - The input type for the generateHint function.
 * - GenerateHintOutput - The return type for the generateHint function.
 */

import {ai} from '@/ai/genkit';
import { GenerateHintInputSchema, GenerateHintOutputSchema, type GenerateHintInput, type GenerateHintOutput } from '@/lib/types';

export async function generateHint(input: GenerateHintInput): Promise<GenerateHintOutput> {
  return generateHintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHintPrompt',
  input: {schema: GenerateHintInputSchema},
  output: {schema: GenerateHintOutputSchema},
  prompt: `You are a helpful quiz assistant. The user is stuck on the following multiple-choice question.
Provide a concise hint that helps them think about the correct answer without giving the answer away directly.
Keep the hint to 1-2 sentences.

Question: {{{question}}}

Options:
{{#each options}}
- {{{this}}}
{{/each}}

Generate a hint:`,
});

const generateHintFlow = ai.defineFlow(
  {
    name: 'generateHintFlow',
    inputSchema: GenerateHintInputSchema,
    outputSchema: GenerateHintOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.hint) {
      return { hint: "Sorry, I couldn't generate a hint for this question." };
    }
    return output;
  }
);
