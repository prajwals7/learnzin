"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startChat = exports.model = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
exports.model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: "You are a helpful AI tutor for ZoneIn LMS. Your goal is to help students learn effectively. Answer their questions about various subjects, explain complex topics simply, and encourage them in their studies. Keep your tone encouraging, professional, and educational. If you don't know something, be honest but try to guide them to where they might find the answer in their courses.",
});
const startChat = (history = []) => {
    return exports.model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 1000,
        },
    });
};
exports.startChat = startChat;
