"use client"

import { useRouter } from 'next/navigation';
import useSigner from './state';

export default function Home() {
  const { token } = useSigner();
  const router = useRouter();

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const goToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Welcome to Our App</h1>
      <p className="text-lg text-center mb-8">
        This is the onboarding screen of our app. You can proceed to the
        dashboard if youre already logged in, or go to the login page to sign
        in.
      </p>
      {token ? (
        <button
          onClick={goToDashboard}
          className="py-3 px-6 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Go to Dashboard
        </button>
      ) : (
        <button
          onClick={goToLogin}
          className="py-3 px-6 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go to Login
        </button>
      )}
    </div>
  );
}