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
      // Decode JWT to get user info
      const parts = token.split('.');
      if (parts.length === 2) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        setUser({ id: payload.userId });
      }
      
      // Fetch all posts and filter for user
      fetch('/api/posts')
        .then(res => res.json())
        .then(data => {
          const allPosts = Array.isArray(data) ? data : [];
          // Show all posts (in real app, filter by userId)
          setPosts(allPosts);
        })
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

  const displayName = user?.displayName || user?.username || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent hover:opacity-80">
            SocialHub
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/feed" className="text-sm text-gray-500 hover:text-indigo-600">Home</Link>
            <Link href="/explore" className="text-sm text-gray-500 hover:text-indigo-600">Explore</Link>
            <Link href="/profile" className="text-sm font-medium text-indigo-600">Profile</Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700 font-medium">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {initial}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
              <p className="text-gray-500">@{user?.username || 'user'}</p>
            </div>
          </div>
          <div className="mt-6 flex space-x-8 justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/create" className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-xl font-semibold hover:bg-indigo-700 transition">
              Create Post
            </Link>
            <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* User Posts */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">My Posts</h3>
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">No posts yet</p>
            <Link href="/create" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {(post.user?.displayName || post.user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{post.user?.displayName || post.user?.username || 'User'}</p>
                    <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-gray-700">{post.content}</p>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="Post" className="mt-3 w-full max-h-64 object-cover rounded-xl" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
