import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateQuiz } from '../utils/ai';

const router = Router();

// Generate a quiz for a subject
router.post('/generate/:subjectId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const subjectId = req.params.subjectId as string;
    
    // 1. Fetch subject and its videos to get context
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        sections: {
          include: {
            videos: true
          }
        }
      }
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // 2. Prepare content summary for AI
    const sections = (subject as any).sections;
    const videoTitles = sections
      .flatMap((s: any) => s.videos.map((v: any) => v.title))
      .join(', ');
    
    const contentSummary = `${subject.description}. Topics covered include: ${videoTitles}`;

    // 3. Generate quiz using AI
    const quizData = await generateQuiz(subject.title, contentSummary);

    // 4. Save quiz to database
    const quiz = await prisma.quiz.create({
      data: {
        subjectId,
        title: `${subject.title} - Mastery Quiz`,
        questions: {
          create: quizData.map((q: any, index: number) => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            orderIndex: index
          }))
        }
      },
      include: {
        questions: true
      }
    });

    res.json(quiz);
  } catch (error: any) {
    console.error('Quiz Generation Error:', error);
    res.status(500).json({ 
      message: 'Failed to generate quiz', 
      error: error.message 
    });
  }
});

// Get quizzes for a subject
router.get('/subject/:subjectId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const subjectId = req.params.subjectId as string;
    const quizzes = await prisma.quiz.findMany({
      where: { subjectId },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
    res.json(quizzes);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch quizzes', error: error.message });
  }
});

export default router;
