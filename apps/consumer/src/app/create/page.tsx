'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function Create() {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Convert each file to base64 data URL
    const newImages: string[] = [];
    let processed = 0;
    
    Array.from(files).forEach((file) => {
      if (newImages.length >= 4) return; // Max 4 images
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
          processed++;
          if (processed === files.length || newImages.length === 4) {
            setImages(prev => [...prev, ...newImages].slice(0, 4));
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!content.trim() && images.length === 0) return;
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ content, images })
      });
      
      if (res.ok) {
        window.location.href = '/feed';
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create post');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/feed" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
            SocialHub
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/feed" className="text-sm text-gray-500 hover:text-indigo-600">Home</Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create Post</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>
          )}
          
          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden">
                  <img src={img} alt={`Upload ${i + 1}`} className="w-full h-40 object-cover" />
                  <button 
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <textarea 
            className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            placeholder="What's on your mind? Share photos..."
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {/* Image Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                id="media-upload"
              />
              <label 
                htmlFor="media-upload"
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Photo {images.length > 0 ? `(${images.length}/4)` : ''}</span>
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{content.length}/500</span>
              <button 
                onClick={handlePost}
                disabled={loading || (!content.trim() && images.length === 0)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Tips */}
        <div className="mt-4 bg-indigo-50 rounded-xl p-4">
          <p className="text-sm text-indigo-700 font-medium mb-2">💡 Tips for a great post:</p>
          <ul className="text-sm text-indigo-600 space-y-1">
            <li>• Share what you're thinking or feeling</li>
            <li>• Add up to 4 photos to make it more engaging</li>
            <li>• Tag friends to get their attention</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
