'use client';
import { useEffect } from 'react';
export default function Dashboard() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  useEffect(() => { if (!token) window.location.href = '/login'; }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-800 text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }} className="text-gray-300 hover:text-white">Logout</button>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Posts</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Reports</h3>
            <p className="text-3xl font-bold text-red-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
