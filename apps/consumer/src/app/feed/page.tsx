'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check for token, but allow guest viewing
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const samplePosts = [
    { id: 1, user: 'John Doe', handle: '@johndoe', content: 'Just joined SocialHub! Excited to connect with new people. 🎉', time: '2 hours ago', likes: 24, comments: 8 },
    { id: 2, user: 'Jane Smith', handle: '@janesmith', content: 'Beautiful day for sharing ideas and making connections!', time: '5 hours ago', likes: 18, comments: 3 },
    { id: 3, user: 'Alex Chen', handle: '@alexchen', content: 'The community here is amazing. Love the vibes! 💜', time: '1 day ago', likes: 42, comments: 12 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
            SocialHub
          </h1>
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-indigo-600 font-medium">
              Home
            </Link>
            <button 
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* New Post Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <textarea 
            className="w-full border-0 focus:ring-0 resize-none text-gray-700 placeholder-gray-400 text-lg"
            placeholder="What's on your mind?"
            rows={3}
          />
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <div className="flex space-x-3">
              <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition">
              Post
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {samplePosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {post.user.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">{post.user}</p>
                  <p className="text-sm text-gray-500">{post.handle} · {post.time}</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg mb-4">{post.content}</p>
              <div className="flex items-center pt-3 border-t border-gray-100">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-rose-500 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-indigo-500 ml-6 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 ml-6 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guest Banner */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 text-center">
          <p className="text-gray-600 mb-3">You're viewing as a guest</p>
          <Link href="/login" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition">
            Sign In to Post
          </Link>
        </div>
      </main>
    </div>
  );
}
