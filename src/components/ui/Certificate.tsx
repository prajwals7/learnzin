'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Calendar, Star } from 'lucide-react';

interface CertificateProps {
  userName: string;
  courseTitle: string;
  date: string;
  certificateNo: string;
}

const Certificate = ({ userName, courseTitle, date, certificateNo }: CertificateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative mx-auto aspect-[1.414/1] w-full max-w-4xl overflow-hidden bg-white p-1 shadow-2xl"
      id="certificate-content"
      style={{
        background: 'linear-gradient(45deg, #d4af37 0%, #f9f295 45%, #e6be8a 70%, #b8860b 100%)',
      }}
    >
      <div className="relative h-full w-full bg-white p-12">
        {/* Background Decor */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-purple/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-secondary-cyan/5 blur-3xl" />
        
        {/* Corner Decor */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-primary-purple/20 rounded-tl-3xl m-8" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-primary-purple/20 rounded-tr-3xl m-8" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-primary-purple/20 rounded-bl-3xl m-8" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-primary-purple/20 rounded-br-3xl m-8" />

        <div className="relative flex h-full flex-col items-center justify-between border-2 border-primary-purple/10 p-10 text-center">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary-purple/20 blur-xl rounded-full" />
              <div className="gradient-bg relative flex h-20 w-20 items-center justify-center rounded-full shadow-2xl ring-4 ring-white">
                <Award size={40} className="text-white" />
              </div>
            </div>
            <h1 className="font-outfit text-sm font-black uppercase tracking-[0.4em] text-primary-purple">Certificate of Achievement</h1>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-text-secondary">This globally recognized certificate is awarded to</p>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="font-outfit text-6xl font-black text-text-dark tracking-tight">{userName}</h2>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary-purple/40" />
              <Star className="text-[#d4af37]" size={16} fill="#d4af37" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary-purple/40" />
            </div>
            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-text-secondary">
              for demonstrating exceptional proficiency and successfully completing the
              <span className="block mt-2 font-black text-text-dark text-2xl uppercase tracking-tight">{courseTitle}</span>
              <span className="text-sm font-bold text-primary-purple/60">Professional Mastery Path</span>
            </p>
          </div>

          <div className="relative w-full pt-12">
            {/* The Seal */}
            <div className="absolute left-1/2 -top-10 -translate-x-1/2 opacity-10">
               <ShieldCheck size={120} className="text-primary-purple" />
            </div>

            <div className="grid w-full grid-cols-3 items-end">
              <div className="flex flex-col items-center">
                <p className="font-outfit text-xl font-bold italic text-text-dark">Prajwal S.</p>
                <div className="mt-2 h-0.5 w-32 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-text-secondary">Course Director</p>
              </div>
              
              <div className="flex flex-col items-center pb-2">
                 <div className="flex items-center gap-2 rounded-full bg-primary-purple/5 px-4 py-2 border border-primary-purple/10">
                   <ShieldCheck size={14} className="text-primary-purple" />
                   <span className="text-[10px] font-bold text-primary-purple uppercase tracking-tighter">Verified Achievement</span>
                 </div>
                 <p className="mt-3 text-[10px] font-mono font-bold text-gray-400">ID: {certificateNo}</p>
              </div>

              <div className="flex flex-col items-center">
                 <div className="flex items-center gap-2 text-text-dark font-bold">
                    <Calendar size={14} className="text-primary-purple" />
                    <span className="text-sm">{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                 </div>
                 <div className="mt-2 h-0.5 w-32 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                 <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-text-secondary">Date of Issue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Certificate;
