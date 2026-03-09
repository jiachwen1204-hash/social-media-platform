'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'posts'>('overview');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch stats
      const statsRes = await fetch('https://consumer-jet.vercel.app/api/admin/stats', { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch users
      const usersRes = await fetch('https://consumer-jet.vercel.app/api/admin/users', { headers });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      // Fetch posts
      const postsRes = await fetch('https://consumer-jet.vercel.app/api/admin/posts', { headers });
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string, currentRole: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const newRole = currentRole === 'BANNED' ? 'USER' : 'BANNED';
    await fetch('https://consumer-jet.vercel.app/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ targetUserId: userId, role: newRole })
    });
    fetchData(token);
  };

  const handleDeletePost = async (postId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    await fetch('https://consumer-jet.vercel.app/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ postId })
    });
    fetchData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-white">Admin Portal</h1>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  Users
                </button>
                <button 
                  onClick={() => setActiveTab('posts')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'posts' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  Posts
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={handleLogout} className="text-slate-300 hover:text-white text-sm">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-2">{stats?.totalUsers || 0}</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm">Total Posts</p>
                <p className="text-3xl font-bold text-white mt-2">{stats?.totalPosts || 0}</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm">Published Posts</p>
                <p className="text-3xl font-bold text-white mt-2">{stats?.publishedPosts || 0}</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm">Admins</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats?.roleDistribution?.find((r: any) => r.role === 'ADMIN')?.count || 0}
                </p>
              </div>
            </div>

            {/* Recent Users Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Recent Users</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {users.slice(0, 5).map((user: any) => (
                      <tr key={user.id} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4 whitespace-nowrap text-white">{user.displayName || user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-300">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ADMIN' ? 'bg-indigo-600/20 text-indigo-400' : user.role === 'BANNED' ? 'bg-red-600/20 text-red-400' : 'bg-green-600/20 text-green-400'}`}>
                            {user.role || 'USER'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-sm">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 whitespace-nowrap text-white">{user.displayName || user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ADMIN' ? 'bg-indigo-600/20 text-indigo-400' : user.role === 'BANNED' ? 'bg-red-600/20 text-red-400' : 'bg-green-600/20 text-green-400'}`}>
                          {user.role || 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleBanUser(user.id, user.role)}
                          className={`px-3 py-1 rounded-lg text-sm ${user.role === 'BANNED' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                        >
                          {user.role === 'BANNED' ? 'Unban' : 'Ban'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Content Moderation</h2>
            </div>
            <div className="divide-y divide-slate-700">
              {posts.map((post: any) => (
                <div key={post.id} className="p-6 hover:bg-slate-700/30">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-white font-medium">{post.user?.displayName || post.user?.username || 'User'}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${post.user?.role === 'ADMIN' ? 'bg-indigo-600/20 text-indigo-400' : post.user?.role === 'BANNED' ? 'bg-red-600/20 text-red-400' : 'bg-green-600/20 text-green-400'}`}>
                          {post.user?.role || 'USER'}
                        </span>
                        <span className="text-slate-500 text-sm">@{post.user?.username}</span>
                        <span className="text-slate-500 text-sm">· {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '-'}</span>
                      </div>
                      <p className="text-slate-200">{post.content}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 rounded text-xs ${post.published ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
