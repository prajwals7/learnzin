'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Award, Download, ArrowLeft, Loader2, ShieldCheck, Share2 } from 'lucide-react';
import api from '@/lib/api';
import Certificate from '@/components/ui/Certificate';
import Header from '@/components/layout/Header';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';

export default function PublicCertificatePage() {
  const params = useParams();
  const certNo = params?.certNo as string;
  const router = useRouter();
  
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await api.get(`/certs/verify/${certNo}`);
        setCert(res.data);
      } catch (err) {
        console.error('Failed to verify certificate', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (certNo) fetchCert();
  }, [certNo]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('certificate-content');
    if (!element) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 4,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`ZoneIn-Certificate-${cert.subject.title.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('Failed to download PDF', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Achievement: ${cert.subject.title}`,
        text: `I just completed ${cert.subject.title} on ZoneIn LMS!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary-purple" />
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="rounded-full bg-red-100 p-6 text-red-600 mb-6">
          <Award size={64} />
        </div>
        <h1 className="font-outfit text-3xl font-bold text-text-dark">Invalid Certificate</h1>
        <p className="mt-4 max-w-md text-text-secondary text-lg">
          We couldn't verify this certificate number. Please check the URL or contact support if you believe this is an error.
        </p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="mt-8 rounded-xl bg-primary-purple px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light pb-20">
      <Header />
      
      <main className="mx-auto max-w-6xl p-4 pt-12 md:p-12">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-primary-purple font-bold mb-3">
               <ShieldCheck size={20} />
               <span className="uppercase tracking-widest text-sm text-primary-purple/70">Verified Achievement</span>
            </div>
            <h1 className="font-outfit text-4xl font-black text-text-dark md:text-5xl">Professional Certification</h1>
            <p className="mt-4 text-xl text-text-secondary">Official record for <span className="font-bold text-text-dark">{cert.user.name}</span></p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 rounded-xl bg-white border-2 border-primary-purple px-6 py-3 font-bold text-primary-purple shadow-sm transition-all hover:bg-primary-purple/5 disabled:opacity-50"
            >
              {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              {downloading ? 'Generating...' : 'Download PDF'}
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl bg-primary-purple px-6 py-3 font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <Share2 size={18} /> Share Achievement
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-2xl shadow-2xl p-2 bg-gradient-to-br from-primary-purple/10 via-white to-secondary-cyan/10"
        >
          <div className="overflow-hidden rounded-xl shadow-inner bg-white">
            <Certificate 
              userName={cert.user.name}
              courseTitle={cert.subject.title}
              date={cert.issuedAt}
              certificateNo={cert.certificateNo}
            />
          </div>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="glass p-8 rounded-3xl">
              <h3 className="font-bold text-lg text-text-dark mb-2">Verified Status</h3>
              <p className="text-text-secondary">This certificate is verified by ZoneIn LMS and is authentic.</p>
           </div>
           <div className="glass p-8 rounded-3xl">
              <h3 className="font-bold text-lg text-text-dark mb-2">Social Sharing</h3>
              <p className="text-text-secondary">You can share this page link on LinkedIn, Twitter, or your portfolio.</p>
           </div>
           <div className="glass p-8 rounded-3xl">
              <h3 className="font-bold text-lg text-text-dark mb-2">Support</h3>
              <p className="text-text-secondary">Need help with your certificate? Contact our 24/7 student support.</p>
           </div>
        </div>
      </main>
    </div>
  );
}
