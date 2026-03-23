'use client';

import { Play, Youtube, Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface WebResultCardProps {
  title: string;
  channel: string;
  thumbnail: string;
  id: string;
  type?: 'video' | 'playlist';
  videoCount?: number;
  onEnroll?: () => void;
  isEnrolling?: boolean;
}

const WebResultCard = ({ title, channel, thumbnail, id, onEnroll, isEnrolling }: WebResultCardProps) => {
  return (
    <div 
      className="card-hover group relative flex h-full flex-col overflow-hidden rounded-2xl glass shadow-sm"
    >
      {/* Thumbnail with Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img 
          src={thumbnail} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
           <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
              <Youtube className="h-8 w-8 text-white" />
           </div>
        </div>
        
        {/* Web Discovery Badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-text-dark backdrop-blur shadow-sm ring-1 ring-black/5">
          <div className={`h-1.5 w-1.5 rounded-full ${type === 'playlist' ? 'bg-indigo-500' : 'bg-primary-purple'} animate-pulse`} />
          {type === 'playlist' ? 'Complete Playlist' : 'Extended Discovery'}
        </div>

        {type === 'playlist' && videoCount && (
          <div className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-lg bg-black/70 px-2 py-1 text-[10px] font-black text-white backdrop-blur">
             {videoCount} Videos
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-text-secondary">
            <Youtube size={14} className="text-red-600" />
            {channel}
          </span>
        </div>
        
        <h3 className="mb-2 line-clamp-2 font-outfit text-lg font-bold text-text-dark group-hover:text-primary-purple transition-colors leading-tight">
          {title}
        </h3>
        <p className="mb-6 line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
          Add this specialized YouTube course to your personal library to track progress and earn certificates.
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100/50">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEnroll?.();
            }}
            disabled={isEnrolling}
            className="group/btn flex w-full items-center justify-center gap-2 rounded-xl gradient-bg py-3 text-sm font-bold text-white shadow-lg shadow-primary-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:grayscale"
          >
            {isEnrolling ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Plus size={16} className="transition-transform group-hover/btn:rotate-90" />
                Enroll in ZoneIn
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebResultCard;
