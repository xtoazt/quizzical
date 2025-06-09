
'use server';
/**
 * @fileOverview AI quiz generator flow for released tests.
 *
 * - generateReleasedTestQuiz - A function that generates a quiz based on county and educational unit/subject from released tests.
 * - GenerateReleasedTestQuizInput - The input type for the function.
 * - GenerateReleasedTestQuizOutput - The return type for the function (shared with topic-based quiz).
 */

import {ai} from '@/ai/genkit';
import { GenerateQuizOutputSchema, type GenerateQuizOutput } from '@/lib/types'; 
import {z} from 'genkit';

const GenerateReleasedTestQuizInputSchema = z.object({
  county: z.string().describe('The county, state, or region for which to find released tests. e.g., "Fairfax County, Virginia", "California", "North Carolina".'),
  unit: z.string().describe('The educational unit, subject, or grade level. e.g., "Grade 5 Mathematics EOG", "High School Chemistry", "AP Biology".'),
  numQuestions: z.number().describe('The desired number of questions for the quiz. The AI will try to match this, but the actual number may vary based on available test content.'),
});
export type GenerateReleasedTestQuizInput = z.infer<typeof GenerateReleasedTestQuizInputSchema>;

export type GenerateReleasedTestQuizOutput = GenerateQuizOutput; 


export async function generateReleasedTestQuiz(input: GenerateReleasedTestQuizInput): Promise<GenerateReleasedTestQuizOutput> {
  return generateReleasedTestQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReleasedTestQuizPrompt',
  input: {schema: GenerateReleasedTestQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema}, 
  prompt: `You are an expert curriculum developer and test designer. Your task is to find and adapt questions from *publicly available, authentic, released educational tests or past papers* for a specific county/region and educational unit/subject.

County/Region: {{county}}
Educational Unit/Subject: {{unit}}
Desired number of questions: {{numQuestions}}

Instructions:
1.  **Accuracy and Authenticity are CRITICAL.** You MUST use questions sourced *directly* from publicly available released tests, official sample questions, or past papers relevant to the specified county/region and educational unit/subject.
2.  **Do NOT invent questions.** Do not create "similar" questions or adapt questions from unrelated topics or generic question banks. If you cannot find authentic material, state so.
3.  Select approximately {{numQuestions}} questions. If you cannot find this many *authentic* questions, provide as many as you can locate. If the count is lower than requested, clearly state this in the 'scoringSystemContext' field (e.g., "Found only X questions from authentic released tests for the specified criteria.").
4.  For each question, ensure it is in a multiple-choice format with 4 distinct answer options. If the original question is not multiple-choice (e.g., open-ended), try to find an *authentic multiple-choice alternative on the exact same concept from a released test for that unit/region*. If not possible, skip that question.
5.  Clearly indicate the correct answer for each question.
6.  **Image Handling:** If questions involve visual elements (charts, diagrams, maps, geometric figures like triangles) that are integral to understanding, attempt to find *publicly accessible direct URLs* for these images (e.g., from educational websites, archives) and include them in the 'imageUrl' field. If a direct URL is not possible but a visual is essential, provide a clear, concise text description in the 'imageDescription' field (e.g., "A bar graph showing population growth over 5 years," or "A right-angled triangle with labels A, B, C"). Avoid generic placeholders if a specific description is possible.
7.  Format the output as a JSON object matching the provided schema. The main key should be "quiz", containing an array of question objects. Each question object must have "question", "options" (an array of 4 strings), "correctAnswer", and optionally "imageUrl" (string or null) or "imageDescription" (string or null).
8.  If the source test has a known specific scoring system (e.g., 'scores range from 200-800 like the NC EOG which might report a score such as 540' or 'results are reported in proficiency levels 1-5'), please provide a brief description of this in the 'scoringSystemContext' field of the main quiz object. If no specific system is commonly known for this exact test, omit this field unless point #3 applies.
9.  If you cannot find specific released test materials for the *exact* county/region and unit, you may look for materials for a broader but closely related region (e.g., state-level if county-level is not found) or a very similar subject, but *only from authentic released tests*.
10. **If no relevant authentic materials can be found at all after a thorough search, respond with an empty quiz array and set "scoringSystemContext" to "Could not find any relevant released test questions for the specified criteria."** Do not attempt to generate a quiz from other sources.

Example of a relevant search query you might internally use: "{{county}} {{unit}} released test questions" or "past papers {{unit}} {{county}} public domain" or "official sample questions {{unit}} {{county}}".

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
    // Ensure output and output.quiz exist before trying to map
    if (!output || !output.quiz) {
        return { quiz: [], scoringSystemContext: output?.scoringSystemContext || "Could not find any relevant released test questions for the specified criteria." };
    }
    // Ensure quiz questions have default image fields if not provided by AI
    const processedQuiz = output.quiz.map(q => ({
        ...q,
        imageUrl: q.imageUrl || null, // Ensure it's null if not a string
        imageDescription: q.imageDescription || null, // Ensure it's null if not a string
    }));
    return { ...output, quiz: processedQuiz, scoringSystemContext: output.scoringSystemContext || null };
  }
);
