'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, Filter, Sparkles, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Header from '@/components/layout/Header';
import CourseCard from '@/components/course/CourseCard';
import WebResultCard from '@/components/course/WebResultCard';
import VideoPlayer from '@/components/course/VideoPlayer';
import { Difficulty } from '@/components/ui/DifficultyBadge';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: Difficulty;
  videoCount: number;
}

interface YoutubeResult {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  type: 'video' | 'playlist';
  videoCount?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDifficulty, setActiveDifficulty] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [youtubeResults, setYoutubeResults] = useState<YoutubeResult[]>([]);
  const [isSearchingYoutube, setIsSearchingYoutube] = useState(false);
  const [searchStatus, setSearchStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'API_RESTRICTED' | 'QUOTA_EXCEEDED' | 'ERROR'>('IDLE');
  const [selectedVideo, setSelectedVideo] = useState<YoutubeResult | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/subjects');
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (yt: YoutubeResult) => {
    setEnrollingId(yt.id);
    try {
      const { data } = await api.post('/youtube/import', {
        youtubeId: yt.id,
        title: yt.title,
        thumbnail: yt.thumbnail,
        channel: yt.channel,
        type: yt.type
      });
      // Small delay for premium feel
      setTimeout(() => {
        router.push(`/subjects/${data.subjectId}`);
      }, 800);
    } catch (err) {
      console.error('Enrollment failed', err);
    } finally {
      // Don't clear enrollingId immediately if we are navigating
    }
  };

  const categories = ['ALL', ...Array.from(new Set(courses.map(c => c.category)))];
  const difficulties = ['ALL', 'BASIC', 'INTERMEDIATE', 'ADVANCED'];

  const localFiltered = courses.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = activeDifficulty === 'ALL' || s.difficultyLevel === activeDifficulty;
    const matchesCategory = activeCategory === 'ALL' || s.category === activeCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Unified YouTube fallback logic
  useEffect(() => {
    const searchYoutube = async () => {
      if (searchQuery.length > 2) {
        setIsSearchingYoutube(true);
        setSearchStatus('LOADING');
        try {
          const { data } = await api.get(`/youtube/search?q=${encodeURIComponent(searchQuery)}`);
          setYoutubeResults(data.map((item: any) => ({
            id: item.id,
            title: item.title,
            thumbnail: item.thumbnail,
            channel: item.channel,
            type: item.type,
            videoCount: item.videoCount
          })));
          setSearchStatus('SUCCESS');
        } catch (err: any) {
          console.error('Failed to fetch YouTube results', err);
          const errorCode = err.response?.data?.code;
          
          if (errorCode === 'API_RESTRICTED') {
            setSearchStatus('API_RESTRICTED');
          } else if (errorCode === 'QUOTA_EXCEEDED') {
            setSearchStatus('QUOTA_EXCEEDED');
          } else {
            setSearchStatus('ERROR');
          }

          // Fallback to high-quality mocks if real API fails
          setYoutubeResults([
            { id: 'dQw4w9WgXcQ', title: `${searchQuery} Masterclass - Full Course`, thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60', channel: 'FreeCodeCamp', type: 'video' },
            { id: 'aqz-KE-bpKQ', title: `The Complete ${searchQuery} Bootcamp 2026`, thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60', channel: 'Academind', type: 'video' },
            { id: 'MsnQ5uepIaE', title: `${searchQuery} for Absolute Beginners`, thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=60', channel: 'Programming with Mosh', type: 'video' }
          ]);
        } finally {
          setIsSearchingYoutube(false);
        }
      } else {
        setYoutubeResults([]);
        setSearchStatus('IDLE');
      }
    };

    const timer = setTimeout(searchYoutube, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-bg-light pb-20">
      <Header />
      
      <main className="mx-auto max-w-7xl p-6 lg:p-12">
        <section className="mb-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="font-outfit text-4xl font-black text-text-dark md:text-5xl">
                   {searchQuery ? 'Search ' : 'Knowledge '}
                   <span className="gradient-text">{searchQuery ? 'Results.' : 'Powerup.'}</span>
                </h1>
                <p className="mt-4 text-lg text-text-secondary">
                  {searchQuery ? `Showing integrated results for "${searchQuery}"` : 'Select your next mastery path and start leveling up today.'}
                </p>
              </div>
              
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary group-focus-within:text-primary-purple transition-colors" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border-transparent bg-white px-12 py-3.5 text-sm font-medium shadow-sm transition-all focus:border-primary-purple/30 focus:ring-4 focus:ring-primary-purple/5"
                />
              </div>
            </div>

            {!searchQuery && (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2 mr-2">
                    <Filter size={14} /> Categories:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${activeCategory === cat ? 'gradient-bg text-white shadow-md' : 'bg-white text-text-secondary hover:bg-gray-50 border border-gray-100'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => <div key={n} className="h-80 animate-pulse rounded-3xl bg-gray-200" />)}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Unified Results Grid */}
            {(localFiltered.length > 0 || youtubeResults.length > 0) ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {/* Local Courses First */}
                  {localFiltered.map((course) => (
                    <motion.div key={course.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                      <CourseCard {...course} />
                    </motion.div>
                  ))}
                                    {/* Seamless Web Results */}
                  {youtubeResults.length > 0 && searchQuery.length > 2 && (
                    <>
                      {/* Section Marker if both exist */}
                      <div className="col-span-full border-t border-gray-100 pt-8 mt-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                           <div className="flex items-center gap-3">
                             <div className="bg-primary-purple/10 p-2 rounded-lg">
                                <Sparkles size={18} className="text-primary-purple" />
                             </div>
                             <h2 className="text-xl font-bold text-text-dark">
                               {searchStatus === 'SUCCESS' ? 'Extended Discoveries' : 'Essential Discoveries (Offline)'}
                             </h2>
                           </div>

                           {searchStatus === 'API_RESTRICTED' && (
                             <motion.div 
                               initial={{ opacity: 0, x: 20 }}
                               animate={{ opacity: 1, x: 0 }}
                               className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 border border-amber-100"
                             >
                               <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                               YouTube API Disabled. Please enable it in Google Console.
                             </motion.div>
                           )}
                        </div>
                      </div>
                      
                      {youtubeResults.map((yt) => (
                        <motion.div key={yt.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                          <WebResultCard 
                            id={yt.id}
                            title={yt.title}
                            channel={yt.channel}
                            thumbnail={yt.thumbnail}
                            type={yt.type}
                            videoCount={yt.videoCount}
                            onEnroll={() => handleEnroll(yt)}
                            isEnrolling={enrollingId === yt.id}
                          />
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
                
                {isSearchingYoutube && searchQuery.length > 2 && (
                  <div className="col-span-full flex items-center justify-center py-12 gap-3 text-text-secondary">
                     <div className="h-2 w-2 rounded-full bg-primary-purple animate-bounce" />
                     <div className="h-2 w-2 rounded-full bg-primary-purple animate-bounce [animation-delay:0.2s]" />
                     <div className="h-2 w-2 rounded-full bg-primary-purple animate-bounce [animation-delay:0.4s]" />
                     <span className="font-bold tracking-tight">Syncing with global library...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="mx-auto max-w-md rounded-3xl bg-white p-12 text-center shadow-sm">
                 <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-text-secondary">
                    <Search size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-text-dark">No courses found</h3>
                  <p className="mt-2 text-text-secondary">Try a broader term or check your spelling.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveDifficulty('ALL'); setActiveCategory('ALL'); }}
                    className="mt-6 font-bold text-primary-purple hover:underline transition-all"
                  >
                    Reset Explorer
                  </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm lg:p-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl"
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X size={24} />
              </button>
              
              <div className="overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl ring-1 ring-white/10">
                <VideoPlayer youtubeId={selectedVideo.id} />
                <div className="p-8">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-purple">
                    Web Discovery
                  </div>
                  <h2 className="mt-2 font-outfit text-2xl font-bold text-white md:text-3xl">
                    {selectedVideo.title}
                  </h2>
                  <p className="mt-2 text-zinc-400 font-medium">
                    Content provided by {selectedVideo.channel}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
