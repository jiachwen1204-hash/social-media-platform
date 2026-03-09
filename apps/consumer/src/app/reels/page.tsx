'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface Reel {
  id: string;
  content: string;
  videoUrl?: string;
  user: { id: string; username: string; displayName: string };
  createdAt: string;
  likes: number;
  comments: number;
}

export default function Reels() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setReels(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setCurrentIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    document.querySelectorAll('.reel-item').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reels]);

  const handleLike = async (reelId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    const newLiked = !likedReels[reelId];
    setLikedReels({ ...likedReels, [reelId]: newLiked });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold text-white">Reels</h1>
          <div className="flex items-center space-x-3">
            <Link href="/feed" className="text-sm text-gray-300 hover:text-white">Home</Link>
            <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : reels.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[80vh] text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p>No reels yet</p>
            <Link href="/create" className="mt-4 text-pink-500 hover:text-pink-400">Create your first reel</Link>
          </div>
        ) : (
          <div ref={containerRef} className="h-[calc(100vh-60px)] overflow-y-scroll snap-y snap-mandatory scrollbar-hidden">
            {reels.map((reel, index) => (
              <div 
                key={reel.id} 
                data-index={index}
                className="reel-item h-[calc(100vh-60px)] snap-start flex items-center justify-center"
              >
                <div className="w-full max-w-sm h-full bg-gray-900 relative flex flex-col">
                  {/* Video/Content Area */}
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 relative">
                    {reel.videoUrl ? (
                      <video 
                        src={reel.videoUrl} 
                        className="w-full h-full object-cover"
                        loop 
                        playsInline
                        muted={currentIndex !== index}
                        autoPlay={currentIndex === index}
                      />
                    ) : (
                      <div className="text-center p-8">
                        <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-10 h-10 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="text-white text-lg">{reel.content}</p>
                        <p className="text-gray-400 mt-2">@{reel.user.username}</p>
                      </div>
                    )}
                    
                    {/* Tap to play indicator */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Bottom gradient + content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {(reel.user.displayName || reel.user.username || 'U').charAt(0).toUpperCase()}
                            </div>
                            <p className="font-semibold text-white">@{reel.user.username}</p>
                          </div>
                          <p className="text-sm text-gray-300 line-clamp-2">{reel.content}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right side actions */}
                    <div className="absolute right-3 bottom-20 flex flex-col items-center gap-6 pointer-events-auto">
                      <button 
                        onClick={() => handleLike(reel.id)}
                        className="flex flex-col items-center"
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${likedReels[reel.id] ? 'bg-pink-500' : 'bg-gray-700'}`}>
                          <svg className={`w-6 h-6 ${likedReels[reel.id] ? 'fill-white' : 'fill-none stroke-white'}`} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <span className="text-xs text-white mt-1">{reel.likes || 0}</span>
                      </button>

                      <button className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                          <svg className="w-6 h-6 fill-none stroke-white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <span className="text-xs text-white mt-1">Comment</span>
                      </button>

                      <button className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                          <svg className="w-6 h-6 fill-none stroke-white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </div>
                        <span className="text-xs text-white mt-1">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
