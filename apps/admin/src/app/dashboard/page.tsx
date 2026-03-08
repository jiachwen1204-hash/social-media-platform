'use client';
import { useEffect } from 'react';
export default function Dashboard() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  useEffect(() => { if (!token) window.location.href = '/login'; }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
      <p>Admin panel coming soon.</p>
    </div>
  );
}
