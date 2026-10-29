import API from './api';

/**
 * AI Business Assistant API Service
 * The backend grounds every answer in the logged-in owner's live records.
 */
export const aiService = {
  /**
   * @param {string} message current question
   * @param {Array<{role:'user'|'assistant', content:string}>} history prior turns
   */
  chat: async (message, history = []) => {
    // LLM calls can be slower than the default 15s axios timeout
    return await API.post('/ai/chat', { message, history }, { timeout: 45000 });
  },
};
