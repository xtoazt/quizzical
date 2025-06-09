
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
  county: z.string().describe('The county, state, or region for which to find released tests. e.g., "Fairfax County, Virginia", "California", "North Carolina".'),
  unit: z.string().describe('The educational unit, subject, or grade level. e.g., "Grade 5 Mathematics EOG", "High School Chemistry", "AP Biology".'),
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
  output: {schema: GenerateQuizOutputSchema}, 
  prompt: `You are an expert curriculum developer and test designer. Your task is to find and adapt questions from publicly available released educational tests or past papers for a specific county/region and educational unit/subject.

County/Region: {{county}}
Educational Unit/Subject: {{unit}}
Desired number of questions: {{numQuestions}}

Instructions:
1. **Strictly use publicly available released tests, sample questions, or past papers** relevant to the specified county/region and educational unit/subject. Do NOT invent questions or adapt questions from other topics.
2. Select approximately {{numQuestions}} questions. If you cannot find this many *authentic* questions, provide as many as you can find. If the count is lower than requested, clearly state this in the 'scoringSystemContext' field (e.g., "Found only X questions from authentic released tests for the specified criteria.").
3. For each question, ensure it is in a multiple-choice format. If the original question is not multiple-choice, try to find an authentic multiple-choice alternative on the *exact same concept from a released test*. If not possible, skip the question.
4. Provide 4 distinct answer options for each question.
5. Clearly indicate the correct answer for each question.
6. If questions involve visual elements like charts, diagrams (e.g., triangles in geometry), or maps that are integral to understanding the question, try to find publicly accessible URLs for these images and include them in the 'imageUrl' field for that question. If a direct URL is not possible but a visual is important, provide a clear text description in the 'imageDescription' field.
7. Format the output as a JSON object matching the provided schema. The main key should be "quiz", containing an array of question objects. Each question object must have "question", "options" (an array of 4 strings), and "correctAnswer" (a string matching one of the options), and optionally "imageUrl" or "imageDescription".
8. If the source test has a known specific scoring system (e.g., 'scores range from 200-800 like the NC EOG which might report a score such as 540' or 'results are reported in proficiency levels 1-5'), please provide a brief description of this in the 'scoringSystemContext' field of the main quiz object (not per question). If no specific system is commonly known for this exact test, omit this field unless point #2 applies.
9. If you cannot find specific released test materials for the exact county/region and unit, try to find materials for a broader but related region (e.g., state-level if county-level is not found) or a very similar subject from *authentic released tests only*.
10. If no relevant authentic materials can be found at all, respond with an empty quiz array and set "scoringSystemContext" to "Could not find any relevant released test questions for the specified criteria."


Example of a relevant search query you might internally use: "{{county}} {{unit}} released test questions" or "past papers {{unit}} {{county}}".

Generate the quiz:
`,
});

const generateReleasedTestQuizFlow = ai.defineFlow(
  {
    name: 'generateReleasedTestQuizFlow',
    inputSchema: GenerateReleasedTestQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema, 
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.quiz) {
        return { quiz: [], scoringSystemContext: output?.scoringSystemContext || "Could not find any relevant released test questions for the specified criteria." };
    }
    // Ensure quiz questions have default image fields if not provided
    const processedQuiz = output.quiz.map(q => ({
        ...q,
        imageUrl: q.imageUrl || undefined,
        imageDescription: q.imageDescription || undefined,
    }));
    return { ...output, quiz: processedQuiz };
  }
);
