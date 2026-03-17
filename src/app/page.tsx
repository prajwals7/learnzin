'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Sparkles, Shield, Rocket, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-light overflow-x-hidden">
      {/* Navbar */}
      <nav className="mx-auto max-w-7xl px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="gradient-bg h-10 w-10 flex items-center justify-center rounded-xl font-bold text-white shadow-lg">Z</div>
          <span className="font-outfit text-2xl font-bold tracking-tight text-text-dark">ZoneIn</span>
        </div>
        <div className="flex gap-4 items-center">
           <Link href="/auth/login" className="font-semibold text-text-secondary hover:text-primary-purple transition-colors">Sign In</Link>
           <Link href="/auth/register" className="gradient-bg px-6 py-2.5 rounded-full font-bold text-white shadow-lg shadow-primary-purple/20 hover:scale-105 active:scale-95 transition-all">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative pt-20 pb-32">
          {/* Animated Background Blurs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-primary-purple/10 text-primary-purple px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase border border-primary-purple/20">
                Future of Learning is Here
              </span>
              <h1 className="mt-8 font-outfit text-6xl md:text-8xl font-black tracking-tighter text-text-dark leading-[0.9]">
                Master the Art <br />
                <span className="gradient-text">of Domain Expertise.</span>
              </h1>
              <p className="mt-8 text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                Experience a premium Learning Management System designed for the next generation of builders, thinkers, and creators.
              </p>
              
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register" className="gradient-bg px-10 py-5 rounded-2xl font-bold text-xl text-white shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                  Start Your Journey <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/dashboard" className="glass px-10 py-5 rounded-2xl font-bold text-xl text-text-dark hover:bg-white shadow-lg transition-all flex items-center justify-center gap-2">
                  <Play size={20} fill="currentColor" /> Browse Courses
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-7xl mx-auto px-6 pb-40">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Rocket />, title: "Rapid Progress", desc: "Sequential learning architecture designed to minimize friction and maximize retention." },
                { icon: <Shield />, title: "Structured Curriculum", desc: "Carefully curated paths with difficulty levels from Basic to Advanced mastery." },
                { icon: <Sparkles />, title: "Premium Experience", desc: "Immersive UI/UX with smooth animations and zero-distraction playback." }
              ].map((feature, i) => (
                <div key={i} className="glass p-8 rounded-3xl group hover:bg-white transition-all card-hover border-transparent hover:border-gray-100">
                  <div className="gradient-bg w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-text-dark mb-4">{feature.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 text-center text-text-secondary bg-white/50">
         <p>© 2026 ZoneIn LMS. Built with Passion for Learning.</p>
      </footer>
    </div>
  );
}
