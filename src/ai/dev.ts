
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/access-test-data.ts';
import '@/ai/flows/explain-answer.ts';
import '@/ai/flows/generate-released-test-quiz.ts';
import '@/ai/flows/generate-hint.ts';
import '@/ai/flows/study-chat-flow.ts';
import '@/ai/flows/solve-question-flow.ts';
