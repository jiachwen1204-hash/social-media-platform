'use client';
import { useEffect } from 'react';

export default function Dashboard() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  useEffect(() => { 
    if (!token) window.location.href = '/login'; 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', color: 'blue' },
    { label: 'Active Posts', value: '567', change: '+8%', color: 'purple' },
    { label: 'Reports', value: '23', change: '-5%', color: 'rose' },
    { label: 'Revenue', value: '$12.5k', change: '+15%', color: 'green' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6">
        <h1 className="text-xl font-bold mb-8">Admin Portal</h1>
        <nav className="space-y-2">
          <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-blue-600 rounded-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-xl transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Users</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-xl transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Posts</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-xl transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>Reports</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <button onClick={handleLogout} className="text-slate-500 hover:text-slate-700 font-medium">
            Sign Out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-rose-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1,2,3].map((i) => (
              <div key={i} className="flex items-center py-3 border-b border-gray-100 last:border-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  {i}
                </div>
                <div className="flex-1">
                  <p className="text-slate-900">New user registered</p>
                  <p className="text-sm text-slate-500">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
