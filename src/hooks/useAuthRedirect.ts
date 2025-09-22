'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContextNew';

export const useAuthRedirect = (redirectTo: string = '/login', requireAuth: boolean = true) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      console.log('Auth redirect check:', { isAuthenticated, requireAuth, redirectTo });
      
      if (requireAuth && !isAuthenticated) {
        console.log('Redirecting to login - not authenticated');
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        console.log('Redirecting to dashboard - already authenticated');
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, router, redirectTo, requireAuth]);

  return { isAuthenticated, loading };
};