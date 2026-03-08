'use client';
import { useEffect, useState } from 'react';
export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  useEffect(() => { if (!token) window.location.href = '/login'; }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Feed</h2>
      <p>Welcome! Posts will appear here.</p>
      <a href="/">Logout</a>
    </div>
  );
}
