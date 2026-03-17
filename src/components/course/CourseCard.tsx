'use client';

import React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import DifficultyBadge, { Difficulty } from '../ui/DifficultyBadge';
import ProgressBar from '../ui/ProgressBar';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string | null;
  difficultyLevel: Difficulty;
  videoCount: number;
  progressPercentage?: number;
}


const CourseCard = ({ id, title, description, thumbnailUrl, difficultyLevel, videoCount, progressPercentage = 0 }: CourseCardProps) => {
  return (
    <Link href={`/subjects/${id}`} className="card-hover group block overflow-hidden rounded-2xl glass shadow-sm">
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="gradient-bg flex h-full items-center justify-center opacity-80" />
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
            <Play className="h-8 w-8 text-white" fill="currentColor" />
          </div>
        </div>
      </div>

      
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <DifficultyBadge level={difficultyLevel} />
          <span className="text-[12px] font-medium text-text-secondary">{videoCount} Lessons</span>
        </div>
        
        <h3 className="mb-2 line-clamp-1 font-outfit text-xl font-bold text-text-dark">{title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-text-secondary">{description}</p>
        
        {progressPercentage > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <ProgressBar percentage={progressPercentage} size="sm" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
