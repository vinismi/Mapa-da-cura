import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This is the new configuration.
// It directly uses the API key.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: 'AIzaSyCZIy8xDTgwCh-rwl2c1tG7h6MgQlVFrWw',
    }),
  ],
  // We are enabling logging to help debug if any other issues arise.
  logLevel: 'debug',
  // This ensures that errors in the AI flow are caught and logged.
  enableTracingAndMetrics: true,
});
