'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Clock, BookOpen, Award, Download, X } from 'lucide-react';
import api from '@/lib/api';
import Header from '@/components/layout/Header';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import Certificate from '@/components/ui/Certificate';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubjectOverviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [subject, setSubject] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<any>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const [subjRes, progressRes] = await Promise.all([
          api.get(`/subjects/${id}`),
          api.get(`/progress/subject/${id}`)
        ]);
        setSubject(subjRes.data);
        setProgress(progressRes.data);

        // Try to fetch existing certificate if 100%
        if (progressRes.data.percentage >= 100) {
          try {
            const certRes = await api.get(`/certs/${id}`);
            setCertificate(certRes.data);
          } catch (e) {
            // Not yet claimed
          }
        }
      } catch (err) {
        console.error('Failed to fetch subject', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  const handleStart = async () => {
    try {
      const firstVideoId = subject.sections[0]?.videos[0]?.id;
      if (firstVideoId) {
        router.push(`/subjects/${id}/video/${firstVideoId}`);
      }
    } catch (err) {
      console.error('Failed to start course', err);
    }
  };

  const handleClaimCertificate = async () => {
    setClaiming(true);
    try {
      const res = await api.get(`/certs/${id}`);
      setCertificate(res.data);
      setShowCertModal(true);
    } catch (err) {
      console.error('Failed to claim certificate', err);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return null;

  const isCompleted = progress?.percentage >= 100;

  return (
    <div className="min-h-screen bg-bg-light pb-20">
      <Header />
      
      <main className="mx-auto max-w-5xl p-4 pt-8 md:p-8">
        <button 
          onClick={() => router.push('/dashboard')}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary-purple transition-colors"
        >
          <ArrowLeft size={16} /> Back to Explorer
        </button>

        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex-1">
            <DifficultyBadge level={subject.difficultyLevel} />
            <h1 className="mt-4 font-outfit text-4xl font-bold text-text-dark md:text-5xl">{subject.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-text-secondary">{subject.description}</p>
            
            <div className="mt-10 flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-purple/10 text-primary-purple">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Lessons</p>
                  <p className="text-lg font-bold text-text-dark">
                    {subject.sections.reduce((acc: number, s: any) => acc + s.videos.length, 0)} Videos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-cyan/10 text-secondary-cyan">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Duration</p>
                  <p className="text-lg font-bold text-text-dark">Est. 4.5 Hours</p>
                </div>
              </div>
              
              {isCompleted && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-difficulty-basic/10 text-difficulty-basic">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-difficulty-basic">Status</p>
                    <p className="text-lg font-bold text-text-dark">Course Completed</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 rounded-2xl glass p-8 shadow-sm">
              <h2 className="font-outfit text-2xl font-bold text-text-dark">Course Structure</h2>
              <div className="mt-6 space-y-4">
                {subject.sections.map((section: any, idx: number) => (
                  <div key={idx} className="rounded-xl border border-gray-100 bg-white/50 p-4">
                    <h3 className="font-bold text-text-dark">{section.title}</h3>
                    <p className="text-sm text-text-secondary">{section.videos.length} videos</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80">
            <div className="sticky top-24 rounded-2xl glass p-6 shadow-xl ring-1 ring-black/5">
              <div className="aspect-video w-full rounded-xl gradient-bg flex items-center justify-center mb-6">
                 <Play className="text-white h-12 w-12" />
              </div>

              {progress?.percentage > 0 ? (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-text-dark">Your Progress</span>
                    <span className="text-sm font-bold text-primary-purple">{progress.percentage}%</span>
                  </div>
                  <ProgressBar percentage={progress.percentage} size="md" />
                </div>
              ) : null}

              <div className="space-y-3">
                <button 
                  onClick={handleStart}
                  className="gradient-bg w-full rounded-xl py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isCompleted ? 'Review Content' : progress?.percentage > 0 ? 'Continue Learning' : 'Start Course Now'}
                </button>

                {isCompleted && (
                  <button 
                    onClick={certificate ? () => setShowCertModal(true) : handleClaimCertificate}
                    disabled={claiming}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white border-2 border-primary-purple py-4 font-bold text-primary-purple transition-all hover:bg-primary-purple/5 active:scale-[0.98] disabled:opacity-50"
                  >
                    <Award size={20} />
                    {claiming ? 'Verifying...' : certificate ? 'View Certificate' : 'Claim Certificate'}
                  </button>
                )}
              </div>
              
              <p className="mt-4 text-center text-xs text-text-secondary">
                {isCompleted ? 'You earned a verified certificate!' : 'Lifetime access to all course materials & updates.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertModal && certificate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCertModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b p-6 px-8">
                <div>
                  <h3 className="font-outfit text-xl font-bold text-text-dark">Your Achievement</h3>
                  <p className="text-sm text-text-secondary">Official course completion certificate</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 rounded-xl bg-primary-purple px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-primary-purple/90">
                    <Download size={16} /> Download PDF
                  </button>
                  <button 
                    onClick={() => setShowCertModal(false)}
                    className="rounded-full p-2 transition-colors hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="max-h-[80vh] overflow-y-auto bg-gray-50 p-8">
                <Certificate 
                  userName={certificate.user.name}
                  courseTitle={certificate.subject.title}
                  date={certificate.issuedAt}
                  certificateNo={certificate.certificateNo}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
