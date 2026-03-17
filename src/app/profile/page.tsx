'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, BookOpen, Award, Clock, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import Header from '@/components/layout/Header';
import CourseCard from '@/components/course/CourseCard';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // We'll fetch subjects progress for the user
        const res = await api.get('/subjects'); 
        // In a real app, we'd have a specific /me or /profile endpoint
        // For now, we'll show all subjects and highlight progress
        setProfileData(res.data);
      } catch (err) {
        console.error('Failed to fetch profile info', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      router.push('/auth/login');
    } catch (err) {
      logout();
      router.push('/auth/login');
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-bg-light">
      <Header />
      
      <main className="mx-auto max-w-7xl p-6 lg:p-12">
        <button 
          onClick={() => router.push('/dashboard')}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary-purple transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar / Stats */}
          <div className="w-full lg:w-80">
            <div className="glass rounded-3xl p-8 text-center shadow-xl">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-purple/10 text-primary-purple">
                <User size={48} />
              </div>
              <h1 className="mt-6 font-outfit text-2xl font-bold text-text-dark">{user?.name}</h1>
              <p className="text-sm text-text-secondary">{user?.email}</p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/50 p-4 text-center">
                  <Award className="mx-auto mb-2 text-secondary-cyan" size={20} />
                  <p className="text-xl font-bold text-text-dark">2</p>
                  <p className="text-[10px] uppercase tracking-wider text-text-secondary">Enrolled</p>
                </div>
                <div className="rounded-2xl bg-white/50 p-4 text-center">
                  <Clock className="mx-auto mb-2 text-primary-purple" size={20} />
                  <p className="text-xl font-bold text-text-dark">12h</p>
                  <p className="text-[10px] uppercase tracking-wider text-text-secondary">Learned</p>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/50 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-50"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-outfit text-3xl font-bold text-text-dark">My Courses</h2>
              <div className="flex items-center gap-2 text-sm font-bold text-primary-purple bg-primary-purple/5 px-4 py-2 rounded-full">
                <BookOpen size={16} />
                <span>Keep Going!</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileData?.map((subject: any) => (
                <CourseCard 
                  key={subject.id} 
                  id={subject.id}
                  title={subject.title}
                  description={subject.description}
                  thumbnailUrl={subject.thumbnailUrl}
                  difficultyLevel={subject.difficultyLevel}
                  videoCount={subject.sections?.length || 0}
                  progressPercentage={subject.progress?.percentage || 0}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
