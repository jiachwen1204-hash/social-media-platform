'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const tokenData = JSON.parse(Buffer.from(token.replace('Bearer ', ''), 'base64').toString());
      setUser({ id: tokenData.userId });
      
      // Fetch user's posts
      fetch('/api/posts')
        .then(res => res.json())
        .then(data => setPosts(Array.isArray(data) ? data : []))
        .finally(() => setLoading(false));
    } catch {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

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
            <Link href="/profile" className="text-sm font-medium text-indigo-600">Profile</Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              U
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">User</h2>
              <p className="text-gray-500">@user</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-6">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{posts.length}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">My Posts</h3>
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No posts yet</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-gray-700">{post.content}</p>
                <p className="text-sm text-gray-400 mt-2">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
