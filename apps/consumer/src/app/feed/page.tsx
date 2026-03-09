'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Loading skeleton component
function PostSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 animate-pulse">
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="ml-3">
          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="flex items-center pt-3 border-t border-gray-100 mt-4">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="ml-6 h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
      <p className="text-gray-500 mb-4">Be the first to share something!</p>
      <Link href="/create" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition">
        Create Post
      </Link>
    </div>
  );
}

// Error state component
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      <button 
        onClick={onRetry}
        className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
      >
        Try Again
      </button>
    </div>
  );
}

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Failed to load posts');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Unable to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ content: newPost })
      });
      if (res.ok) {
        const post = await res.json();
        setPosts([post, ...posts]);
        setNewPost('');
      }
    } catch (err) {
      console.error(err);
    }
  };

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
          <div className="flex items-center space-x-4">
            <Link href="/feed" className="text-sm font-medium text-indigo-600">Home</Link>
            <Link href="/explore" className="text-sm text-gray-500 hover:text-indigo-600">Explore</Link>
            <Link href="/profile" className="text-sm text-gray-500 hover:text-indigo-600">Profile</Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">Sign Out</button>
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
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-400">{newPost.length}/500</span>
            <button 
              onClick={handlePost} 
              disabled={!newPost.trim()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts - Loading State */}
        {loading ? (
          <div className="space-y-4">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchPosts} />
        ) : posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
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
