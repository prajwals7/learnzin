const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function testKey() {
  const key = process.env.GEMINI_API_KEY;
  console.log('Testing Key:', key ? key.substring(0, 5) + '...' : 'MISSING');
  try {
    const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: 'test',
        key: key
      }
    });
    console.log('SUCCESS! Quota is active.');
  } catch (err) {
    console.error('FAILED:', err.response?.data?.error || err.message);
  }
}

testKey();
