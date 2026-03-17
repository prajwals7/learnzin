'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User, LayoutDashboard, Search } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const Header = () => {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <header className="glass sticky top-0 z-50 w-full border-b border-gray-200/50 px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="gradient-bg flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
            <span className="font-outfit text-xl font-bold text-white">Z</span>
          </div>
          <span className="hidden font-outfit text-2xl font-bold tracking-tight text-text-dark sm:block">ZoneIn</span>
        </Link>

        <div className="flex flex-1 items-center justify-center px-4 md:px-12">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full rounded-full border border-gray-100 bg-gray-50/50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary-purple/50 focus:bg-white focus:ring-1 focus:ring-primary-purple/30"
            />
          </div>
        </div>

        <nav className="flex items-center gap-2 md:gap-4">
          <Link 
            href="/dashboard" 
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 ${pathname === '/dashboard' ? 'text-primary-purple' : 'text-text-secondary'}`}
          >
            <LayoutDashboard size={20} />
          </Link>
          
          <div className="h-8 w-[1px] bg-gray-200 mx-1" />

          <div className="group relative">
            <button className="flex items-center gap-2 rounded-full p-1 transition-all hover:bg-gray-100">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="h-8 w-8 rounded-full border border-gray-200"
              />
              <span className="hidden text-sm font-semibold text-text-dark md:block">{user.name}</span>
            </button>
            <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/5 group-hover:block">
              <Link href="/profile" className="flex items-center gap-2 rounded-lg p-2 text-sm text-text-dark transition-colors hover:bg-gray-50">
                <User size={16} /> Profile
              </Link>
              <button 
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg p-2 text-sm text-red-500 transition-colors hover:bg-red-50"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
