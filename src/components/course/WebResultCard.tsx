'use client';

import React from 'react';
import { Play, Youtube, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface WebResultCardProps {
  title: string;
  channel: string;
  thumbnail: string;
  id: string;
}

const WebResultCard = ({ title, channel, thumbnail, id }: WebResultCardProps) => {
  return (
    <div className="card-hover group relative flex h-full flex-col overflow-hidden rounded-2xl glass shadow-sm">
      {/* Thumbnail with Play Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
        <img 
          src={thumbnail} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-xl shadow-red-600/20 transition-transform group-hover:scale-110">
            <Play className="ml-1 h-6 w-6 text-white" fill="currentColor" />
          </div>
        </div>
        
        {/* Web Discovery Badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-text-dark backdrop-blur shadow-sm ring-1 ring-black/5">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          Web Discovery
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-text-secondary">
            <Youtube size={14} className="text-red-600" />
            {channel}
          </span>
        </div>
        
        <h3 className="mb-4 line-clamp-2 font-outfit text-lg font-bold leading-tight text-text-dark group-hover:text-primary-purple transition-colors">
          {title}
        </h3>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 text-xs font-bold text-text-dark transition-all hover:bg-gray-100 hover:text-primary-purple">
            Explore Course <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebResultCard;
