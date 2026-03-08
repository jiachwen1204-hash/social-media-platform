'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Stories() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        // Get unique users from posts for stories
        const uniqueUsers = Array.from(new Map(data.map((p: any) => [p.user?.id, p.user])).values()).filter(Boolean);
        setUsers(uniqueUsers);
      })
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
            SocialHub
          </h1>
          <div className="flex items-center space-x-4">
            <Link href="/feed" className="text-sm text-gray-500 hover:text-indigo-600">Home</Link>
            <Link href="/explore" className="text-sm text-gray-500 hover:text-indigo-600">Explore</Link>
            <Link href="/reels" className="text-sm text-gray-500 hover:text-indigo-600">Reels</Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Stories</h2>
        
        {/* Stories Ring */}
        <div className="flex space-x-4 overflow-x-auto pb-6 mb-6">
          {/* Add Story */}
          <div className="flex-shrink-0 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl border-2 border-white shadow-lg cursor-pointer hover:opacity-90">
              +
            </div>
            <p className="text-xs text-gray-500 mt-1">Add Story</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center w-full py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500 w-full">No stories yet</div>
          ) : (
            users.slice(0, 10).map((user: any) => (
              <div key={user.id} className="flex-shrink-0 text-center cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-700">{(user.displayName || user.username || 'U').charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate max-w-16">{user.username || 'user'}</p>
              </div>
            ))
          )}
        </div>

        {/* Stories Content Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-2">What are Stories?</h3>
          <p className="text-gray-600 text-sm">
            Stories are short-form content that disappears after 24 hours. Share moments, updates, and highlights with your followers.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">24hr expiry</span>
            <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs">Photos & Videos</span>
          </div>
        </div>
      </main>
    </div>
  );
}
