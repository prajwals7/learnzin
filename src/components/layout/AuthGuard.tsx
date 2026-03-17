'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isPublicRoute = pathname ? PUBLIC_ROUTES.includes(pathname) : false;
      
      if (!accessToken && !isPublicRoute) {
        router.push('/auth/login');
      } else if (accessToken && (pathname === '/auth/login' || pathname === '/auth/register')) {
        router.push('/dashboard');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [accessToken, pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg-light">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-purple border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
