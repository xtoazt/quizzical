
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

const prompt = ai.definePrompt({
  name: 'studyChatPrompt',
  input: {schema: StudyChatInputSchema},
  output: {schema: StudyChatOutputSchema},
  prompt: `You are a friendly, Socratic, and knowledgeable AI Study Tutor.
The user wants to study the topic: {{{topic}}}.

{{#if chatHistory}}
Conversation History:
{{#each chatHistory}}
  {{#if (eq this.role "user")}}User: {{this.content}}{{/if}}
  {{#if (eq this.role "model")}}AI: {{this.content}}{{/if}}
{{/each}}
{{/if}}

Current User Message: "{{{currentUserMessage}}}"

Your goals are:
1.  Understand the user's message in the context of the study topic and conversation history.
2.  If they ask a question, answer it clearly and concisely.
3.  If they make a statement or seem unsure, try to guide them with a Socratic question related to the topic to gauge their understanding or prompt deeper thinking.
4.  You can offer to explain a concept in more detail, provide examples, or suggest related sub-topics.
5.  Maintain an encouraging, supportive, and conversational tone. Try to keep your responses relatively brief to encourage back-and-forth dialogue.
6.  Keep responses focused on the study topic.
7.  If the user's message is very short or unclear (e.g., "idk", "ok"), try to re-engage them with a gentle prompt or a simple question about the topic.

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

    