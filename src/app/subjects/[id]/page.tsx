'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Clock, BookOpen, Award, Download, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import Header from '@/components/layout/Header';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import Certificate from '@/components/ui/Certificate';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function SubjectOverviewPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [subject, setSubject] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<any>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchSubject = async () => {
      setLoading(true);
      setError(null);
      try {
        const [subjRes, progressRes] = await Promise.all([
          api.get(`/subjects/${id}`),
          api.get(`/progress/subject/${id}`)
        ]);
        setSubject(subjRes.data);
        setProgress(progressRes.data);

        if (progressRes.data.percentage >= 100) {
          try {
            const certRes = await api.get(`/certs/${id}`);
            setCertificate(certRes.data);
          } catch (e) { /* Not yet claimed */ }
        }
      } catch (err: any) {
        console.error('Failed to fetch subject', err);
        setError(err.response?.data?.message || 'Failed to load course details.');
      } finally {
        setTimeout(() => setLoading(false), 200);
      }
    };
    if (id) fetchSubject();
  }, [id]);

  const handleStart = async () => {
    try {
      if (!subject) return;
      const firstVideoId = subject.sections[0]?.videos[0]?.id;
      if (firstVideoId) {
        router.push(`/subjects/${id}/video/${firstVideoId}`);
      }
    } catch (err) {
      console.error('Failed to start course', err);
    }
  };

  const triggerCelebration = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    function randomInRange(min: number, max: number) { return Math.random() * (max - min) + min; }
    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleClaimCertificate = async () => {
    setClaiming(true);
    try {
      const res = await api.get(`/certs/${id}`);
      setCertificate(res.data);
      setShowCertModal(true);
      triggerCelebration();
    } catch (err) {
      console.error('Failed to claim certificate', err);
    } finally {
      setClaiming(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('certificate-content');
    if (!element) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(element, { scale: 4, useCORS: true, logging: false, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`ZoneIn-Certificate-${subject.title.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('Failed to download PDF', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-bg-light">
        <Loader2 className="h-12 w-12 animate-spin text-primary-purple" />
        <p className="mt-4 font-medium text-text-secondary">Preparing your learning environment...</p>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-bg-light p-4 text-center">
        <div className="rounded-full bg-red-100 p-6 text-red-600 mb-6">
          <X size={48} />
        </div>
        <h1 className="font-outfit text-2xl font-bold text-text-dark">Something went wrong</h1>
        <p className="mt-2 max-w-md text-text-secondary">{error || "We couldn't find the course you're looking for."}</p>
        <button onClick={() => router.push('/dashboard')} className="mt-8 rounded-xl bg-primary-purple px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105">
          Return to Dashboard
        </button>
      </div>
    );
  }

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
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={downloading}
                    className="flex items-center gap-2 rounded-xl bg-primary-purple px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-primary-purple/90 disabled:opacity-50"
                  >
                    {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
                    {downloading ? 'Generating...' : 'Download PDF'}
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
