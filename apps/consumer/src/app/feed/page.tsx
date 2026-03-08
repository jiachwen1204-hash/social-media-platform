'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

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
            className="w-full border-0 focus:ring-0 resize-none text-gray-700 placeholder-gray-400"
            placeholder="What's on your mind?"
            rows={3}
          />
          <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition">
              Post
            </button>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No posts yet. Be the first to share!</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {(post.user?.displayName || post.user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{post.user?.displayName || post.user?.username || 'User'}</p>
                    <p className="text-sm text-gray-500">{(post.user?.username || '@user')} · {new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg mb-4">{post.content}</p>
                <div className="flex items-center pt-3 border-t border-gray-100">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-rose-500 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span>0</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-indigo-500 ml-6 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <span>0</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
