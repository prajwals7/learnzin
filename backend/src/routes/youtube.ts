import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Cache search results to avoid hitting API limits
const cache: { [key: string]: { results: any[], timestamp: number } } = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

router.get('/search', async (req, res) => {
  const query = req.query.q as string;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }

  // Check cache
  if (cache[query] && (Date.now() - cache[query].timestamp) < CACHE_DURATION) {
    return res.json(cache[query].results);
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 6,
        q: `${query} full course`, // Refine search for learning content
        type: 'video',
        key: apiKey,
      }
    });

    const results = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      channel: item.snippet.channelTitle,
    }));

    // Save to cache
    cache[query] = { results, timestamp: Date.now() };

    res.json(results);
  } catch (error: any) {
    console.error('YouTube Search API Error:', error.response?.data || error.message);
    
    // Fallback if API fails (e.g. quota exceeded)
    res.status(500).json({ 
      message: 'Failed to fetch YouTube results', 
      error: error.response?.data?.error?.message || error.message 
    });
  }
});

export default router;
