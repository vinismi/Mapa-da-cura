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
});
