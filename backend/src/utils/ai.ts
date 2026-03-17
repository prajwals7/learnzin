import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");



export const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  systemInstruction: "You are a helpful AI tutor for ZoneIn LMS. Your goal is to help students learn effectively. Answer their questions about various subjects, explain complex topics simply, and encourage them in their studies. Keep your tone encouraging, professional, and educational. If you don't know something, be honest but try to guide them to where they might find the answer in their courses.",
});









export const startChat = (history: any[] = []) => {
  return model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
};
