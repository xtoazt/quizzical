
'use server';
/**
 * @fileOverview AI quiz generator flow for released tests.
 *
 * - generateReleasedTestQuiz - A function that generates a quiz based on county and educational unit/subject from released tests.
 * - GenerateReleasedTestQuizInput - The input type for the function.
 * - GenerateReleasedTestQuizOutput - The return type for the function (shared with topic-based quiz).
 */

import {ai} from '@/ai/genkit';
import { GenerateQuizOutputSchema, type GenerateQuizOutput } from '@/lib/types'; // Import from lib/types
import {z} from 'genkit';

const GenerateReleasedTestQuizInputSchema = z.object({
  county: z.string().describe('The county, state, or region for which to find released tests. e.g., "Fairfax County, Virginia", "California".'),
  unit: z.string().describe('The educational unit, subject, or grade level. e.g., "Grade 5 Mathematics", "High School Chemistry", "AP Biology".'),
  numQuestions: z.number().describe('The desired number of questions for the quiz. The AI will try to match this, but the actual number may vary based on available test content.'),
});
export type GenerateReleasedTestQuizInput = z.infer<typeof GenerateReleasedTestQuizInputSchema>;

export type GenerateReleasedTestQuizOutput = GenerateQuizOutput; // Alias GenerateQuizOutput from lib/types


export async function generateReleasedTestQuiz(input: GenerateReleasedTestQuizInput): Promise<GenerateReleasedTestQuizOutput> {
  return generateReleasedTestQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReleasedTestQuizPrompt',
  input: {schema: GenerateReleasedTestQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema}, // Crucial: output structure must match, use imported schema
  prompt: `You are an expert curriculum developer and test designer. Your task is to find and adapt questions from publicly available released educational tests or past papers for a specific county/region and educational unit/subject.

County/Region: {{county}}
Educational Unit/Subject: {{unit}}
Desired number of questions: {{numQuestions}}

Instructions:
1. Search for publicly available released tests, sample questions, or past papers relevant to the specified county/region and educational unit/subject.
2. Select approximately {{numQuestions}} questions from the found materials. If exact number is not possible, get as close as possible.
3. For each question, ensure it is in a multiple-choice format. If the original question is not multiple-choice, adapt it or find a suitable multiple-choice alternative on the same concept.
4. Provide 4 distinct answer options for each question.
5. Clearly indicate the correct answer for each question.
6. Format the output as a JSON object matching the provided schema. The main key should be "quiz", containing an array of question objects. Each question object must have "question", "options" (an array of 4 strings), and "correctAnswer" (a string matching one of the options).

Example of a relevant search query you might internally use: "{{county}} {{unit}} released test questions" or "past papers {{unit}} {{county}}".

If you cannot find specific released test materials for the exact county/region and unit, try to find materials for a broader but related region (e.g., state-level if county-level is not found) or a very similar subject. If no relevant materials can be found at all, respond with an empty quiz array.

Generate the quiz:
`,
});

const generateReleasedTestQuizFlow = ai.defineFlow(
  {
    name: 'generateReleasedTestQuizFlow',
    inputSchema: GenerateReleasedTestQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema, // Use imported schema
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.quiz) {
        // If the AI returns a null/undefined output, or an object without a quiz field,
        // return an empty quiz to prevent errors.
        return { quiz: [] };
    }
    return output;
  }
);
