
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/access-test-data.ts';
import '@/ai/flows/explain-answer.ts';
import '@/ai/flows/generate-released-test-quiz.ts';
