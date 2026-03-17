'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2, ShieldCheck, Calendar } from 'lucide-react';

interface CertificateProps {
  userName: string;
  courseTitle: string;
  date: string;
  certificateNo: string;
}

const Certificate = ({ userName, courseTitle, date, certificateNo }: CertificateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative mx-auto aspect-[1.414/1] w-full max-w-4xl overflow-hidden rounded-sm bg-white p-12 shadow-2xl ring-8 ring-double ring-primary-purple/20"
      id="certificate-content"
    >
      {/* Background Decor */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-purple/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-secondary-cyan/5 blur-3xl" />
      
      {/* Border Design */}
      <div className="absolute inset-4 border-[1px] border-primary-purple/10" />
      <div className="absolute inset-8 border-2 border-primary-purple/5" />

      <div className="relative flex h-full flex-col items-center justify-between border-4 border-double border-primary-purple/10 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="gradient-bg mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg shadow-primary-purple/20">
            <Award size={32} className="text-white" />
          </div>
          <h1 className="font-outfit text-sm font-black uppercase tracking-[0.3em] text-primary-purple">Certificate of Completion</h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">This is to certify that</p>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="font-outfit text-5xl font-bold text-text-dark">{userName}</h2>
          <div className="mt-4 h-[2px] w-24 bg-gradient-to-r from-transparent via-primary-purple to-transparent" />
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-text-secondary">
            has successfully completed all requirements for the professional mastery path in
            <span className="block mt-1 font-bold text-text-dark text-lg">{courseTitle}</span>
          </p>
        </div>

        <div className="grid w-full grid-cols-3 items-end pt-8">
          <div className="flex flex-col items-center">
            <div className="h-0.5 w-32 bg-gray-200" />
            <p className="mt-2 text-[10px] font-bold uppercase text-text-secondary">Course Instructor</p>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-1.5 rounded-full bg-primary-purple/5 px-3 py-1 mb-2 border border-primary-purple/10">
               <ShieldCheck size={12} className="text-primary-purple" />
               <span className="text-[10px] font-bold text-primary-purple">Verified by ZoneIn</span>
             </div>
             <p className="text-[10px] font-mono text-gray-400">Ref: {certificateNo}</p>
          </div>

          <div className="flex flex-col items-center">
             <div className="h-0.5 w-32 bg-gray-200" />
             <div className="mt-2 flex items-center gap-1 text-[10px] font-bold uppercase text-text-secondary">
               <Calendar size={10} />
               <span>{new Date(date).toLocaleDateString()}</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Certificate;
