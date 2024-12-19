import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Define prop types for Login and Register components
interface AuthComponentProps {
  onSuccess: () => void;
}

const Login = dynamic<AuthComponentProps>(() => 
  import('@/components/auth/Login').then(mod => mod.default)
, { ssr: false });

const Register = dynamic<AuthComponentProps>(() => 
  import('@/components/auth/Register').then(mod => mod.default)
, { ssr: false });

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded transition-colors ${
              isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded transition-colors ${
              !isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Register
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {isLogin ? (
            <Login onSuccess={handleSuccess} />
          ) : (
            <Register onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}