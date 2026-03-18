'use client';

import React from 'react';
import { Play, Youtube, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface WebResultCardProps {
  title: string;
  channel: string;
  thumbnail: string;
  id: string;
  onClick?: () => void;
}

const WebResultCard = ({ title, channel, thumbnail, id, onClick }: WebResultCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="card-hover group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl glass shadow-sm"
    >
      {/* Thumbnail with Play Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img 
          src={thumbnail} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full transition-transform group-hover:scale-110">
            <Play className="h-8 w-8 text-white" fill="currentColor" />
          </div>
        </div>
        
        {/* Web Discovery Badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-text-dark backdrop-blur shadow-sm ring-1 ring-black/5">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          Web Discovery
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-text-secondary">
            <Youtube size={14} className="text-red-600" />
            {channel}
          </span>
          <span className="text-[12px] font-medium text-text-secondary italic">External Content</span>
        </div>
        
        <h3 className="mb-2 line-clamp-1 font-outfit text-xl font-bold text-text-dark group-hover:text-primary-purple transition-colors">
          {title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-text-secondary">
          Integrated learning resource provided by {channel}. Explore specialized topics and broaden your domain expertise.
        </p>
        
        <div className="mt-auto border-t border-gray-100 pt-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 text-xs font-bold text-text-dark transition-all hover:bg-gray-100 hover:text-primary-purple">
            Watch Discovery <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebResultCard;
