import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import prisma from './utils/prisma';
import authRoutes from './routes/auth';
import subjectRoutes from './routes/subjects';
import videoRoutes from './routes/videos';
import progressRoutes from './routes/progress';
import certRoutes from './routes/cert';
import aiRoutes from './routes/ai';
import youtubeRoutes from './routes/youtube';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/certs', certRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/youtube', youtubeRoutes);


// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic test route to check DB connection
app.get('/api/db-test', async (req: Request, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    res.json({ status: 'connected', userCount });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
