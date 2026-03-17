import { Router } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get video details with next/prev pointers
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
      include: {
        section: {
          include: {
            subject: {
              include: {
                sections: {
                  orderBy: { orderIndex: 'asc' },
                  include: {
                    videos: { orderBy: { orderIndex: 'asc' } }
                  }
                }
              }
            }
          }
        },
        videoProgress: {
          where: { userId }
        }
      }
    });

    if (!video) return res.status(404).json({ message: 'Video not found' });

    // Flatten all videos in subject to find neighbors
    let allVideos: any[] = [];
    video.section.subject.sections.forEach((s: any) => {
      allVideos = [...allVideos, ...s.videos];
    });

    const currentIdx = allVideos.findIndex(v => v.id === video.id);
    const prevVideoId = currentIdx > 0 ? allVideos[currentIdx - 1].id : null;
    const nextVideoId = currentIdx < allVideos.length - 1 ? allVideos[currentIdx + 1].id : null;

    res.json({
      ...video,
      prevVideoId,
      nextVideoId,
      progress: video.videoProgress[0] || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch video', error: (error as Error).message });
  }
});

export default router;
