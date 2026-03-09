'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface Story {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  expiresAt: string;
  user: { id: string; username: string; displayName: string };
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        const mockStories: Story[] = Array.isArray(data) ? data.slice(0, 10).map((post: any, i: number) => ({
          id: `story-${i}`,
          userId: post.user?.id || '1',
          content: post.content,
          imageUrl: undefined,
          createdAt: post.createdAt,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          user: post.user
        })) : [];
        setStories(mockStories);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (viewingIndex === null) {
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          if (viewingIndex < stories.length - 1) {
            setViewingIndex(viewingIndex + 1);
            return 0;
          } else {
            setViewingIndex(null);
            return 100;
          }
        }
        return p + 2; // 5 seconds total (50 * 2 = 100)
      });
    }, 100);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [viewingIndex, stories.length]);

  const handlePrevious = () => {
    if (viewingIndex !== null && viewingIndex > 0) {
      setViewingIndex(viewingIndex - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (viewingIndex !== null) {
      if (viewingIndex < stories.length - 1) {
        setViewingIndex(viewingIndex + 1);
        setProgress(0);
      } else {
        setViewingIndex(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  const currentStory = viewingIndex !== null ? stories[viewingIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
            SocialHub
          </h1>
          <div className="flex items-center space-x-4">
            <Link href="/feed" className="text-sm text-gray-500 hover:text-indigo-600">Home</Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">Sign Out</button>
          </div>
        </div>
      </header>

      {/* Fullscreen Story Viewer */}
      {currentStory && (
        <div className="fixed inset-0 z-[100] bg-black">
          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
            {stories.map((_, i) => (
              <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100"
                  style={{ 
                    width: i < viewingIndex ? '100%' : i === viewingIndex ? `${progress}%` : '0%' 
                  }}
                />
              </div>
            ))}
          </div>

          {/* Close button */}
          <button 
            onClick={() => setViewingIndex(null)}
            className="absolute top-4 right-4 z-10 text-white p-2 hover:bg-white/10 rounded-full transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* User info */}
          <div className="absolute top-12 left-4 right-4 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {(currentStory.user?.displayName || currentStory.user?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold">{currentStory.user?.displayName || currentStory.user?.username}</p>
                <p className="text-white/60 text-sm">{new Date(currentStory.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          {/* Story content - fullscreen immersive */}
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={handleNext}
          >
            {currentStory.imageUrl ? (
              <img src={currentStory.imageUrl} alt="Story" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8 max-w-md">
                <div className="w-24 h-24 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl font-bold text-white">{(currentStory.user?.displayName || currentStory.user?.username || 'U').charAt(0).toUpperCase()}</span>
                </div>
                <p className="text-white text-xl">{currentStory.content}</p>
              </div>
            )}
          </div>

          {/* Navigation zones */}
          <div className="absolute inset-y-0 left-0 w-1/3 cursor-pointer" onClick={handlePrevious} />
          <div className="absolute inset-y-0 right-0 w-1/3 cursor-pointer" onClick={handleNext} />
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Stories</h2>
        
        {/* Stories Ring - Horizontal Scroll */}
        <div className="flex space-x-4 overflow-x-auto pb-6 mb-6 -mx-4 px-4">
          {/* Add Story */}
          <div 
            className="flex-shrink-0 text-center cursor-pointer" 
            onClick={() => window.location.href = '/create'}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl border-4 border-white shadow-lg hover:opacity-90">
              +
            </div>
            <p className="text-xs text-gray-500 mt-1">Add Story</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center w-full py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-8 text-gray-500 w-full">No stories yet</div>
          ) : (
            stories.filter(s => !isExpired(s.expiresAt)).map((story, i) => (
              <div 
                key={story.id} 
                className="flex-shrink-0 text-center cursor-pointer"
                onClick={() => setViewingIndex(i)}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-700">{(story.user?.displayName || story.user?.username || 'U').charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate max-w-16">{story.user?.username || 'user'}</p>
              </div>
            ))
          )}
        </div>

        {/* All Stories List */}
        {stories.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold text-gray-900 mb-4">All Stories</h3>
            <div className="space-y-3">
              {stories.map((story, i) => (
                <div 
                  key={story.id} 
                  className={`bg-white rounded-xl p-4 flex items-center gap-4 ${isExpired(story.expiresAt) ? 'opacity-50' : 'cursor-pointer'}`}
                  onClick={() => !isExpired(story.expiresAt) && setViewingIndex(i)}
                >
                  <div 
                    className={`w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0
                    ${isExpired(story.expiresAt) ? 'grayscale' : ''}`}
                  >
                    {(story.user?.displayName || story.user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{story.user?.displayName || story.user?.username}</p>
                    <p className="text-sm text-gray-500 truncate">{story.content}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs ${isExpired(story.expiresAt) ? 'text-red-500' : 'text-green-500'}`}>
                      {isExpired(story.expiresAt) ? 'Expired' : 'Active'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-2">What are Stories?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Stories are short-form content that disappears after 24 hours. Share moments, updates, and highlights with your followers.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">24hr expiry</span>
            <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs">Photos & Videos</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Fullscreen</span>
          </div>
        </div>
      </main>
    </div>
  );
}
