'use client';
import { useEffect, useState } from 'react';
export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  useEffect(() => { if (!token) window.location.href = '/login'; }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">SocialFeed</h1>
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }} className="text-gray-600 hover:text-gray-800">Logout</button>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <p className="text-gray-500 text-center">Welcome to your feed! Posts will appear here.</p>
        </div>
      </div>
    </div>
  );
}
