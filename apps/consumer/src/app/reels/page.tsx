'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Reels() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const nextPost = () => {
    if (currentIndex < posts.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevPost = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black/50 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Reels</h1>
          <div className="flex items-center space-x-3">
            <Link href="/feed" className="text-sm text-gray-300 hover:text-white">Home</Link>
            <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[80vh] text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p>No reels yet</p>
          </div>
        ) : (
          <div className="relative h-[80vh] flex items-center justify-center">
            {/* Reel Card */}
            <div className="w-full max-w-sm bg-black rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[9/16] bg-gray-900 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-white text-lg">{posts[currentIndex]?.content || 'No content'}</p>
                  <p className="text-gray-400 mt-2">@{posts[currentIndex]?.user?.username || 'user'}</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex justify-center space-x-8">
                  <button className="flex flex-col items-center text-white">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span className="text-xs">Like</span>
                  </button>
                  <button className="flex flex-col items-center text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <span className="text-xs">Comment</span>
                  </button>
                  <button className="flex flex-col items-center text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    <span className="text-xs">Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation */}
            {posts.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                <button onClick={prevPost} disabled={currentIndex === 0} className="pointer-events-auto p-2 bg-black/50 rounded-full text-white disabled:opacity-30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={nextPost} disabled={currentIndex === posts.length - 1} className="pointer-events-auto p-2 bg-black/50 rounded-full text-white disabled:opacity-30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
