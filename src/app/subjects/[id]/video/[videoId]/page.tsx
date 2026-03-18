'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, ArrowLeft, Loader2, X } from 'lucide-react';
import api from '@/lib/api';
import Header from '@/components/layout/Header';
import CourseSidebar from '@/components/course/CourseSidebar';
import VideoPlayer from '@/components/course/VideoPlayer';

export default function VideoPlaybackPage() {
  const params = useParams();
  const subjectId = params?.id as string;
  const videoId = params?.videoId as string;
  const router = useRouter();
  
  const [video, setVideo] = useState<any>(null);
  const [subjectTree, setSubjectTree] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [videoRes, treeRes] = await Promise.all([
          api.get(`/videos/${videoId}`),
          api.get(`/subjects/${subjectId}/tree`)
        ]);
        setVideo(videoRes.data);
        setSubjectTree(treeRes.data);
      } catch (err: any) {
        console.error('Failed to load playback data', err);
        setError(err.response?.data?.message || 'Failed to load video. Please try again.');
      } finally {
        setTimeout(() => setLoading(false), 200);
      }
    };

    if (videoId && subjectId) fetchData();
  }, [subjectId, videoId]);

  const handleComplete = async () => {
    try {
      await api.post(`/progress/video/${videoId}`, {
        isCompleted: true,
        lastPositionSeconds: video.durationSeconds
      });
      // Optionally route to next video
      if (video.nextVideoId) {
        router.push(`/subjects/${subjectId}/video/${video.nextVideoId}`);
      }
    } catch (err) {
      console.error('Failed to save progress', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary-purple" />
        <p className="mt-4 font-medium text-text-secondary">Loading your lesson...</p>
      </div>
    );
  }

  if (error || !video || !subjectTree) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-white p-4 text-center">
        <div className="rounded-full bg-red-100 p-6 text-red-600 mb-6">
          <X size={48} />
        </div>
        <h1 className="font-outfit text-2xl font-bold text-text-dark">Unable to load video</h1>
        <p className="mt-2 max-w-md text-text-secondary">{error || "We encountered an issue loading this lesson."}</p>
        <button 
          onClick={() => router.push(`/subjects/${subjectId}`)}
          className="mt-8 rounded-xl bg-primary-purple px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105"
        >
          Back to Overview
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Toggle would go here */}
        <div className="hidden lg:block">
          <CourseSidebar sections={subjectTree.sections} activeVideoId={videoId as string} />
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            <button 
              onClick={() => router.push(`/subjects/${subjectId}`)}
              className="mb-6 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary-purple"
            >
              <ArrowLeft size={16} /> Back to Course Overview
            </button>

            <VideoPlayer 
              youtubeId={video.youtubeId} 
              lastPosition={video.progress?.lastPositionSeconds || 0}
            />

            <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h1 className="font-outfit text-2xl font-bold text-text-dark">{video.title}</h1>
                <p className="mt-1 text-sm text-text-secondary italic">Part of {video.section.title}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleComplete}
                  className="rounded-full bg-difficulty-basic px-6 py-2 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  Mark as Completed
                </button>
                
                <div className="flex h-10 items-center rounded-full bg-white px-2 shadow-sm border border-gray-100">
                  <button 
                    disabled={!video.prevVideoId}
                    onClick={() => router.push(`/subjects/${subjectId}/video/${video.prevVideoId}`)}
                    className="p-2 transition-colors hover:text-primary-purple disabled:opacity-30"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="mx-2 h-4 w-[1px] bg-gray-200" />
                  <button 
                    disabled={!video.nextVideoId}
                    onClick={() => router.push(`/subjects/${subjectId}/video/${video.nextVideoId}`)}
                    className="p-2 transition-colors hover:text-primary-purple disabled:opacity-30"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
