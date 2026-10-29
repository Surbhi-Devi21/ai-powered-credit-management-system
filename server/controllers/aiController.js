import { buildBusinessContext } from '../services/aiContextService.js';
import { askOpenRouter } from '../services/openRouterService.js';

const MAX_QUESTION_LEN = 500;
const MAX_HISTORY_TURNS = 10;

/**
 * @desc    Ask the grounded AI Business Assistant a question
 * @route   POST /api/v1/ai/chat
 * @access  Private (Owner only)
 * Body: { message: string, history?: [{ role: 'user'|'assistant', content: string }] }
 */
export const chatWithAssistant = async (req, res, next) => {
  try {
    const question = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!question) {
      res.status(400);
      throw new Error('Please type a question.');
    }
    if (question.length > MAX_QUESTION_LEN) {
      res.status(400);
      throw new Error(`Question is too long (max ${MAX_QUESTION_LEN} characters).`);
    }

    // Only plain user/assistant text turns are accepted; "system" roles from the
    // client are dropped so the prompt cannot be overridden.
    const history = (Array.isArray(req.body?.history) ? req.body.history : [])
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-MAX_HISTORY_TURNS)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

    // ownerId comes ONLY from the verified JWT user, never from the request body.
    const context = await buildBusinessContext(req.user._id);
    const answer = await askOpenRouter({ context, history, question });

    res.status(200).json({ success: true, data: { answer } });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};
