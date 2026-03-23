import { Router } from 'express';
import { YouTube } from 'youtube-sr';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Cache search results to avoid hitting API limits
const cache: { [key: string]: { results: any[], timestamp: number } } = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    const type = (req.query.type as 'video' | 'playlist' | 'all') || 'all';
    const cacheKey = `${query}_${type}`;

    // Check cache
    if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < CACHE_DURATION) {
      return res.json(cache[cacheKey].results);
    }
    // We search for both videos and playlists by default
    const searchResults = await YouTube.search(`${query}${type === 'video' ? ' full course' : ''}`, {
      limit: 10,
      type: type as any
    });

    console.log('FULL ITEM 0:', JSON.stringify(searchResults[0], null, 2));

    const results = searchResults.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      thumbnail: item.thumbnail?.url,
      channel: item.channel?.name,
      type: item.type || 'video', // 'video' or 'playlist'
      videoCount: item.videoCount || 1
    }));

    // Save to cache
    cache[cacheKey] = { results, timestamp: Date.now() };

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
  const { youtubeId, title, thumbnail, channel, type } = req.body;
  const userId = req.user!.id;

  if (!youtubeId || !title) {
    return res.status(400).json({ message: 'youtubeId and title are required' });
  }

  try {
    // 1. Create slug
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-6)}`;

    // 2. Fetch playlist videos if type is playlist
    let playlistVideos: any[] = [];
    if (type === 'playlist') {
      const playlist = await YouTube.getPlaylist(youtubeId);
      await playlist.fetch(); // Ensure all videos are loaded (up to first batch)
      playlistVideos = playlist.videos.map((v, index) => ({
        title: v.title,
        youtubeId: v.id,
        orderIndex: index,
        durationSeconds: v.duration / 1000 || 0
      }));
    } else {
      playlistVideos = [{
        title,
        youtubeId,
        orderIndex: 0,
        durationSeconds: 0
      }];
    }

    if (playlistVideos.length === 0) {
      return res.status(400).json({ message: 'No videos found in playlist' });
    }

    // 3. Create the Subject, Section, and Videos in one transaction
    const result = await prisma.$transaction(async (tx) => {
      const subject = await tx.subject.create({
        data: {
          title,
          slug,
          description: `Imported ${type === 'playlist' ? 'playlist' : 'video'} from ${channel} (YouTube). This course was dynamically added to your library from Extended Discovery.`,
          thumbnailUrl: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
          category: 'Web Discovery',
          difficultyLevel: 'BASIC',
          isPublished: true,
          sections: {
            create: {
              title: type === 'playlist' ? 'Course Curriculum' : 'Main Content',
              orderIndex: 0,
              videos: {
                create: playlistVideos.map(v => ({
                  title: v.title,
                  youtubeId: v.youtubeId,
                  orderIndex: v.orderIndex,
                  durationSeconds: Math.floor(v.durationSeconds),
                }))
              }
            }
          }
        }
      });

      // 4. Enroll the user
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
