import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Dynamic imports
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const Dashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false });
const Fans = dynamic(() => import('@/components/Fans'), { ssr: false });
const Users = dynamic(() => import('@/components/Users'), { ssr: false });
const Listeners = dynamic(() => import('@/components/Listeners'), { ssr: false });
const Sessions = dynamic(() => import('@/components/Sessions'), { ssr: false });
const Analytics = dynamic(() => import('@/components/Analytics'), { ssr: false });
const Settings = dynamic(() => import('@/components/Settings'), { ssr: false });
const Login = dynamic(() => import('@/components/auth/Login'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
      setIsLoading(false);

      if (!token) {
        router.push('/auth');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, the useEffect will redirect to /auth
  if (!isAuthenticated) {
    return null;
  }

  // Main dashboard layout
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        {router.pathname === '/' && <Dashboard />}
        {router.pathname === '/fans' && <Fans />}
        {router.pathname === '/users' && <Users />}
        {router.pathname === '/listeners' && <Listeners />}
        {router.pathname === '/sessions' && <Sessions />}
        {router.pathname === '/analytics' && <Analytics />}
        {router.pathname === '/settings' && <Settings />}
      </main>
    </div>
  );
}