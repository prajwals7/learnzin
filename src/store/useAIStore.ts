import { create } from 'zustand';
import axios from 'axios';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface AIState {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const useAIStore = create<AIState>((set, get) => ({
  messages: [],
  isLoading: false,
  sendMessage: async (text: string) => {
    const { messages } = get();
    const newUserMessage: Message = { role: 'user', parts: [{ text }] };
    
    set({ 
      messages: [...messages, newUserMessage],
      isLoading: true 
    });

    try {
      const response = await axios.post(`${API_URL}/ai/chat`, {
        message: text,
        history: messages.map(m => ({
          role: m.role,
          parts: m.parts,
        })),
      });

      const aiMessage: Message = { 
        role: 'model', 
        parts: [{ text: response.data.text }] 
      };

      set((state) => ({ 
        messages: [...state.messages, aiMessage],
        isLoading: false 
      }));
    } catch (error) {
      console.error('Error sending message to AI:', error);
      set({ isLoading: false });
    }
  },
  clearMessages: () => set({ messages: [] }),
}));
