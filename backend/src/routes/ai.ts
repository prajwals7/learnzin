import { Router, Request, Response } from 'express';
import { startChat } from '../utils/ai';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const chat = startChat(history || []);
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const errorMessage = error.message || 'Unknown error occurred';
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: errorMessage
    });
  }

});

export default router;

