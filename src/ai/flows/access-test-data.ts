'use server';

/**
 * @fileOverview A flow to access and utilize previous test data for quiz generation.
 *
 * - accessTestData - A function that retrieves and processes test data.
 * - AccessTestInput - The input type for the accessTestData function.
 * - AccessTestOutput - The return type for the accessTestData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccessTestInputSchema = z.object({
  topic: z.string().describe('The topic for which test data is to be accessed.'),
  difficulty: z
    .string()
    .describe('The difficulty level of the test data to be accessed.'),
});

export type AccessTestInput = z.infer<typeof AccessTestInputSchema>;

const AccessTestOutputSchema = z.object({
  testData: z
    .string()
    .describe('Relevant test data based on topic and difficulty.'),
});

export type AccessTestOutput = z.infer<typeof AccessTestOutputSchema>;

export async function accessTestData(input: AccessTestInput): Promise<AccessTestOutput> {
  return accessTestDataFlow(input);
}

const accessTestDataPrompt = ai.definePrompt({
  name: 'accessTestDataPrompt',
  input: {schema: AccessTestInputSchema},
  output: {schema: AccessTestOutputSchema},
  prompt: `You are an expert at retrieving test data.

  Based on the topic and difficulty specified, retrieve relevant test data.

  Topic: {{{topic}}}
  Difficulty: {{{difficulty}}}

  Return the test data.`,
});

const accessTestDataFlow = ai.defineFlow(
  {
    name: 'accessTestDataFlow',
    inputSchema: AccessTestInputSchema,
    outputSchema: AccessTestOutputSchema,
  },
  async input => {
    const {output} = await accessTestDataPrompt(input);
    return output!;
  }
);
