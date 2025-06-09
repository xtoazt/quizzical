
'use server';
/**
 * @fileOverview AI Question Solver flow.
 *
 * - solveQuestion - A function that takes a question string and returns a solution.
 * - SolveQuestionInput - The input type for the solveQuestion function.
 * - SolveQuestionOutput - The return type for the solveQuestion function.
 */

import {ai} from '@/ai/genkit';
import { SolveQuestionInputSchema, SolveQuestionOutputSchema, type SolveQuestionInput, type SolveQuestionOutput } from '@/lib/types';

export async function solveQuestion(input: SolveQuestionInput): Promise<SolveQuestionOutput> {
  return solveQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveQuestionPrompt',
  input: {schema: SolveQuestionInputSchema},
  output: {schema: SolveQuestionOutputSchema},
  prompt: `You are an expert problem solver and explainer.
The user has provided the following question:
---
{{{questionText}}}
---

Your task is to:
1.  Analyze the question carefully.
2.  Provide a clear, step-by-step solution to the question. Break down complex problems into smaller, understandable parts.
3.  If appropriate, provide a concise explanation of the underlying concepts or methods used in the solution.
4.  Format your response according to the output schema, ensuring the main solution steps are in the "solution" field and any broader explanation is in the "explanation" field.
5.  If the question is ambiguous, very poorly phrased, or seems to require external knowledge you don't have (e.g., real-time data, specific non-public document context), state that you cannot solve it as posed and suggest how the user might rephrase it or what information is missing. In such a case, use the "solution" field to state this.

Provide the solution and explanation:
`,
});

const solveQuestionFlow = ai.defineFlow(
  {
    name: 'solveQuestionFlow',
    inputSchema: SolveQuestionInputSchema,
    outputSchema: SolveQuestionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
     if (!output || !output.solution) {
      return { solution: "I'm sorry, I was unable to generate a solution for this question at the moment. Please try rephrasing or ensure it's a solvable problem." };
    }
    return output;
  }
);
