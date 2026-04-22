import * as SecureStore from 'expo-secure-store';
import { SYSTEM_PROMPT } from './prompts';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export const askKenny = async (userMessage, contextObj, history = []) => {
  try {
    const apiKey = await SecureStore.getItemAsync('CLAUDE_API_KEY');
    if (!apiKey) {
      return "I need your Claude API key to think. Please add it to settings.";
    }

    const contextString = JSON.stringify(contextObj, null, 2);
    const systemPrompt = SYSTEM_PROMPT.replace('{CONTEXT}', contextString);

    const messages = [
      ...history.map(msg => ({
        role: msg.role === 'kenny' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error('Claude API Error:', data.error);
      return "My brain is a bit foggy right now (API error). Check your connection or key.";
    }

    return data.content[0].text;
  } catch (error) {
    console.error('Kenny Brain Error:', error);
    return "Something went wrong in my head. Try again?";
  }
};
