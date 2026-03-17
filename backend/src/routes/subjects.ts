import { Router } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// List all published subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { isPublished: true },
      include: {
        _count: {
          select: { sections: true }
        }
      }
    });

    const subjectsWithMeta = await Promise.all(subjects.map(async (subj: any) => {
      const videoCount = await prisma.video.count({
        where: { section: { subjectId: subj.id } }
      });
      return { ...subj, videoCount };
    }));

    res.json(subjectsWithMeta);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subjects', error: (error as Error).message });
  }
});

// Get subject details
router.get('/:id', async (req, res) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            videos: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        }
      }
    });

    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subject', error: (error as Error).message });
  }
});

// Get subject tree with progress and locking (Authenticated)
router.get('/:id/tree', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            videos: {
              orderBy: { orderIndex: 'asc' },
              include: {
                videoProgress: {
                  where: { userId }
                }
              }
            }
          }
        }
      }
    });

    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    let allVideos: any[] = [];
    subject.sections.forEach((s: any) => {
      allVideos = [...allVideos, ...s.videos];
    });

    const tree = subject.sections.map((section: any) => ({
      ...section,
      videos: section.videos.map((video: any) => {
        const videoIdx = allVideos.findIndex(v => v.id === video.id);
        const isFirst = videoIdx === 0;
        const prevVideo = videoIdx > 0 ? allVideos[videoIdx - 1] : null;
        
        const isUnlocked = isFirst || (prevVideo && prevVideo.videoProgress[0]?.isCompleted);
        
        return {
          ...video,
          isUnlocked,
          progress: video.videoProgress[0] || null
        };
      })
    }));

    res.json({ ...subject, sections: tree });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tree', error: (error as Error).message });
  }
});

export default router;
