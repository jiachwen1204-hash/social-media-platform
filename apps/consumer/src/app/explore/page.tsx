'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Explore() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent hover:opacity-80">
            SocialHub
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/feed" className="text-sm text-gray-500 hover:text-indigo-600">Home</Link>
            <Link href="/explore" className="text-sm font-medium text-indigo-600">Explore</Link>
            <Link href="/profile" className="text-sm text-gray-500 hover:text-indigo-600">Profile</Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Explore</h2>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No posts to explore</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-gray-700 line-clamp-3">{post.content}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">@{post.user?.username}</span>
                  <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
