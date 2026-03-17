import { Router } from 'express';
import prisma from '../utils/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get certificate for a subject
router.get('/:subjectId', authenticate, async (req: any, res: any) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.id;

    // Check if certificate already exists
    const existingCert = await prisma.certificate.findUnique({
      where: {
        userId_subjectId: { userId, subjectId }
      },
      include: {
        subject: true,
        user: true
      }
    });

    if (existingCert) {
      return res.json(existingCert);
    }

    // Check if course is 100% complete
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

    if (completedVideos < totalVideos || totalVideos === 0) {
      return res.status(400).json({ message: 'Course not yet completed' });
    }

    // Generate new certificate
    const certNo = `ZONE-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    
    const newCert = await prisma.certificate.create({
      data: {
        userId,
        subjectId,
        certificateNo: certNo
      },
      include: {
        subject: true,
        user: true
      }
    });

    res.json(newCert);
  } catch (err) {
    console.error('Failed to generate certificate', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
