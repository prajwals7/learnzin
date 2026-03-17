import { Router } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get progress for a subject
router.get('/subject/:subjectId', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { subjectId } = req.params as { subjectId: string };

    const totalVideos = await prisma.video.count({
      where: { section: { subjectId } }
    });

    const completedVideos = await prisma.videoProgress.count({
      where: {
        userId,
        isCompleted: true,
        video: { section: { subjectId } }
      }
    });

    const percentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

    res.json({ totalVideos, completedVideos, percentage });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch progress', error: (error as Error).message });
  }
});

// Update video progress (upsert)
router.post('/video/:videoId', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { videoId } = req.params as { videoId: string };
    const { lastPositionSeconds, isCompleted } = req.body;

    const progress = await prisma.videoProgress.upsert({
      where: {
        userId_videoId: { userId, videoId }
      },
      update: {
        lastPositionSeconds,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined
      },
      create: {
        userId,
        videoId,
        lastPositionSeconds,
        isCompleted,
        completedAt: isCompleted ? new Date() : null
      }
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress', error: (error as Error).message });
  }
});

export default router;
