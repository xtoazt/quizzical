
'use server';
/**
 * @fileOverview AI Study Chatbot flow.
 *
 * - studyChat - A function that handles AI responses for the study chatbot.
 * - StudyChatInput - The input type for the studyChat function.
 * - StudyChatOutput - The return type for the studyChat function.
 */

import {ai} from '@/ai/genkit';
import { StudyChatInputSchema, StudyChatOutputSchema, type StudyChatInput, type StudyChatOutput } from '@/lib/types';

export async function studyChat(input: StudyChatInput): Promise<StudyChatOutput> {
  return studyChatFlow(input);
}

// Consider adding chatHistory to the prompt input schema and prompt itself for more context-aware conversations.
// For now, keeping it simple.
const prompt = ai.definePrompt({
  name: 'studyChatPrompt',
  input: {schema: StudyChatInputSchema},
  output: {schema: StudyChatOutputSchema},
  prompt: `You are a friendly and knowledgeable AI Study Tutor.
The user wants to study the topic: {{{topic}}}.
They have just sent the following message: "{{{currentUserMessage}}}"

Your goals are:
1.  Understand the user's message in the context of the study topic.
2.  If they ask a question, answer it clearly and concisely.
3.  If they make a statement or seem unsure, you can ask them a follow-up question related to the topic to gauge their understanding or guide them.
4.  You can also offer to explain a concept in more detail or provide examples.
5.  Maintain an encouraging and supportive tone.
6.  Keep responses focused on the study topic.

Generate your response to the user:
`,
});

const studyChatFlow = ai.defineFlow(
  {
    name: 'studyChatFlow',
    inputSchema: StudyChatInputSchema,
    outputSchema: StudyChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.aiResponseMessage) {
      return { aiResponseMessage: "I'm sorry, I couldn't process that. Could you try rephrasing?" };
    }
    return output;
  }
);
