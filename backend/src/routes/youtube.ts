import { Router } from 'express';
import { YouTube } from 'youtube-sr';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Cache search results to avoid hitting API limits
const cache: { [key: string]: { results: any[], timestamp: number } } = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

router.get('/search', async (req, res) => {
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }

  // Check cache
  if (cache[query] && (Date.now() - cache[query].timestamp) < CACHE_DURATION) {
    return res.json(cache[query].results);
  }

  try {
    // Search using youtube-sr (no API key required)
    const searchResults = await YouTube.search(`${query} full course`, {
      limit: 6,
      type: 'video'
    });

    const results = searchResults.map((video: any) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail?.url,
      channel: video.channel?.name,
    }));

    // Save to cache
    cache[query] = { results, timestamp: Date.now() };

    res.json(results);
  } catch (error: any) {
    console.error('YouTube-SR Search Error:', error.message);
    
    res.status(500).json({ 
      message: 'Failed to fetch YouTube results', 
      code: 'SEARCH_ERROR',
      details: error.message 
    });
  }
});

router.post('/import', authenticate, async (req: AuthRequest, res) => {
  const { youtubeId, title, thumbnail, channel } = req.body;
  const userId = req.user!.id;

  if (!youtubeId || !title) {
    return res.status(400).json({ message: 'youtubeId and title are required' });
  }

  try {
    // 1. Create slug
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-6)}`;

    // 2. Create the Subject, Section, and Video in one transaction
    const result = await prisma.$transaction(async (tx) => {
      const subject = await tx.subject.create({
        data: {
          title,
          slug,
          description: `Imported course from ${channel} (YouTube). This course was dynamically added to your library from Extended Discovery.`,
          thumbnailUrl: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
          category: 'Web Discovery',
          difficultyLevel: 'BASIC',
          isPublished: true,
          sections: {
            create: {
              title: 'Main Content',
              orderIndex: 0,
              videos: {
                create: {
                  title: title,
                  youtubeId,
                  orderIndex: 0,
                  durationSeconds: 0, // Unknown
                }
              }
            }
          }
        }
      });

      // 3. Enroll the user
      await tx.enrollment.create({
        data: {
          userId,
          subjectId: subject.id,
        }
      });

      return subject;
    });

    res.json({ subjectId: result.id });
  } catch (error: any) {
    console.error('YouTube Import Error:', error.message);
    res.status(500).json({ message: 'Failed to import course', error: error.message });
  }
});

export default router;
