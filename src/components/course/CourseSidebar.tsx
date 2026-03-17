'use client';

import React from 'react';
import { CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface Video {
  id: string;
  title: string;
  isUnlocked: boolean;
  progress: { isCompleted: boolean } | null;
}

interface Section {
  id: string;
  title: string;
  videos: Video[];
}

interface SidebarProps {
  sections: Section[];
  activeVideoId?: string;
}

const CourseSidebar = ({ sections, activeVideoId }: SidebarProps) => {
  const router = useRouter();
  const params = useParams();
  const subjectId = params?.id as string;

  return (
    <aside className="h-full w-full border-r border-gray-200 bg-white lg:w-80">
      <div className="border-b border-gray-100 p-6">
        <h2 className="font-outfit text-xl font-bold text-text-dark">Course Content</h2>
      </div>
      
      <div className="overflow-y-auto p-4 custom-scrollbar" style={{ height: 'calc(100vh - 140px)' }}>
        {sections.map((section) => (
          <div key={section.id} className="mb-6">
            <h3 className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.videos.map((video) => {
                const isActive = video.id === activeVideoId;
                const isCompleted = video.progress?.isCompleted;
                
                return (
                  <button
                    key={video.id}
                    disabled={!video.isUnlocked}
                    onClick={() => router.push(`/subjects/${subjectId}/video/${video.id}`)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
                      isActive 
                        ? 'bg-primary-purple/10 text-primary-purple shadow-sm' 
                        : video.isUnlocked 
                          ? 'text-text-dark hover:bg-gray-50' 
                          : 'cursor-not-allowed text-gray-400 opacity-60'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 size={18} className="text-difficulty-basic" />
                      ) : !video.isUnlocked ? (
                        <Lock size={18} />
                      ) : (
                        <PlayCircle size={18} className={isActive ? 'text-primary-purple' : 'text-text-secondary'} />
                      )}
                    </div>
                    <span className="line-clamp-2 text-sm font-medium">{video.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default CourseSidebar;
