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
        const res = await api.get('/subjects/me'); 
        setProfileData(res.data);
      } catch (err) {
        console.error('Failed to fetch profile info', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const totalEnrolled = profileData?.length || 0;
  const completedCourses = profileData?.filter((s: any) => s.progressPercentage >= 100).length || 0;

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
                  <BookOpen className="mx-auto mb-2 text-primary-purple" size={20} />
                  <p className="text-xl font-bold text-text-dark">{totalEnrolled}</p>
                  <p className="text-[10px] uppercase tracking-wider text-text-secondary">Enrolled</p>
                </div>
                <div className="rounded-2xl bg-white/50 p-4 text-center">
                  <Award className="mx-auto mb-2 text-secondary-cyan" size={20} />
                  <p className="text-xl font-bold text-text-dark">{completedCourses}</p>
                  <p className="text-[10px] uppercase tracking-wider text-text-secondary">Completed</p>
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
              <h2 className="font-outfit text-3xl font-bold text-text-dark">My Learning Journey</h2>
              <div className="flex items-center gap-2 text-sm font-bold text-primary-purple bg-primary-purple/5 px-4 py-2 rounded-full">
                <BookOpen size={16} />
                <span>{totalEnrolled} Courses Active</span>
              </div>
            </div>

            {profileData?.length === 0 ? (
              <div className="text-center py-20 glass rounded-3xl">
                <BookOpen className="mx-auto mb-4 text-gray-300" size={48} />
                <h3 className="text-xl font-bold text-text-dark">No courses yet</h3>
                <p className="text-text-secondary mt-2 mb-8">Start your first course to see it here!</p>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-primary-purple text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  Explore Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileData?.map((subject: any) => (
                  <CourseCard 
                    key={subject.id} 
                    id={subject.id}
                    title={subject.title}
                    description={subject.description}
                    thumbnailUrl={subject.thumbnailUrl}
                    difficultyLevel={subject.difficultyLevel}
                    videoCount={subject.videoCount}
                    progressPercentage={subject.progressPercentage}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
