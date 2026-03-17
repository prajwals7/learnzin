'use client';

import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  youtubeId: string;
  onComplete?: () => void;
  onProgress?: (seconds: number) => void;
  lastPosition?: number;
}

const VideoPlayer = ({ youtubeId, onComplete, onProgress, lastPosition = 0 }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Basic YouTube Embed with postMessage support for tracking if needed
    // For a real production app, use 'react-youtube' for better event handling
  }, [youtubeId]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&start=${lastPosition}`}
        title="Video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
