const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
  const key = process.env.GEMINI_API_KEY;
  console.log('Testing Gemini Key:', key ? key.substring(0, 5) + '...' : 'MISSING');
  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello!");
    console.log('SUCCESS! Gemini is responding:', result.response.text());
  } catch (err) {
    console.error('FAILED Gemini:', err.message);
  }
}

testGemini();
