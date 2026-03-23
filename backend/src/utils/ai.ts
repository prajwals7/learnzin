import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");



export const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  systemInstruction: "You are a helpful AI tutor for ZoneIn LMS. Your goal is to help students learn effectively. Answer their questions about various subjects, explain complex topics simply, and encourage them in their studies. Keep your tone encouraging, professional, and educational. If you don't know something, be honest but try to guide them to where they might find the answer in their courses.",
});









export const generateQuiz = async (subjectTitle: string, contentSummary: string) => {
  const prompt = `
    Generate a highly educational multiple-choice quiz for the course "${subjectTitle}".
    Based on this content summary: "${contentSummary}".
    
    Create exactly 5 questions.
    Each question must have:
    1. A clear, challenging question text.
    2. Exactly 4 options.
    3. The index of the correct answer (0-3).
    4. A helpful explanation of why the answer is correct.

    Return the result as a raw JSON array of objects with the following structure:
    [
      {
        "text": "Question text?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": 0,
        "explanation": "Because..."
      }
    ]
    Do not include any markdown formatting or extra text, just the JSON array.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
};

export const startChat = (history: any[] = []) => {
  return model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
};
