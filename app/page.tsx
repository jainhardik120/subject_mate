"use client"

import { useRouter } from 'next/navigation';
import useSigner from './state';
import Image from 'next/image';

import shot1 from "./shot1.png";

export default function Home() {
  const { token } = useSigner();
  const router = useRouter();

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const goToLogin = () => {
    router.push('/auth/login');
  };

  const goToSignup = () => {
    router.push('/auth/signup');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Welcome to Our App</h1>
      <p className="text-lg text-center mb-8">
        This app helps students at Jaypee Institute of Information Technology
        find others willing to swap elective subjects.
      </p>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-96">
        <h2 className="text-xl font-semibold mb-4">How to Use the App:</h2>
        <ol className="list-decimal pl-5">
          <li>Create a new request for each subject you want to switch.</li>
          <Image src={shot1} alt="create a request" width={800} height={600}/>
          <li>Find a match by clicking the &rdquo;Find Match&rdquo; button for each request.</li>
        </ol>
      </div>

      {token ? (
        <button
          onClick={goToDashboard}
          className="py-3 px-6 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-4"
        >
          Go to Dashboard
        </button>
      ) : (
        <>
          <button
            onClick={goToLogin}
            className="py-3 px-6 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4 mr-2"
          >
            Login
          </button>
          <button
            onClick={goToSignup}
            className="py-3 px-6 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mb-4 ml-2"
          >
            Signup
          </button>
        </>
      )}
    </div>
  );
}
