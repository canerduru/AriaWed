import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

const systemInstruction = `You are Aria, a sophisticated, empathetic, and culturally aware AI wedding planner for the AriaWed platform. 
Your Role:
1. **Wedding Planner**: Guide couples through tasks, budget management, and vendor selection.
2. **Anxiety Support**: Detect stress in user queries. Offer calming techniques and reassurance.
3. **Cultural Expert**: Provide advice on diverse traditions (Turkish, Muslim, Christian, Secular, LGBTQ+).
4. **Data Analyst**: Use provided context (budget, guest count, timeline) to give specific, data-driven advice.
Tone: Warm, professional, reassuring, and concise.
Platform Features: Guest Manager, Seating Chart, Budget Tracker, Vendor Marketplace, Creative Studio, Wedding Website Builder.`;

const chatSessions = new Map();

function getOrCreateChat(userId, context) {
  const key = userId;
  if (!chatSessions.has(key)) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      return null;
    }
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: context
          ? `${systemInstruction}\n\nCurrent Application Context: ${context}`
          : systemInstruction,
      },
    });
    chatSessions.set(key, chat);
  }
  return chatSessions.get(key);
}

router.post('/chat', async (req, res) => {
  const { message, context } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }
  const chat = getOrCreateChat(req.user.id, context);
  if (!chat) {
    return res.status(503).json({
      error: 'Aria is not configured',
      text: "I'm having trouble connecting right now. Please ask your administrator to set up the Gemini API key.",
    });
  }
  try {
    const fullMessage = context
      ? `[Context: ${context}]\n\nUser: ${message}`
      : message;
    const response = await chat.sendMessage({ message: fullMessage });
    const text = response.text || "I didn't catch that. Could you rephrase?";
    res.json({ text });
  } catch (err) {
    console.error('Aria chat error:', err);
    res.status(500).json({
      error: 'Chat failed',
      text: "I'm experiencing a momentary lapse. Please try again.",
    });
  }
});

export default router;
