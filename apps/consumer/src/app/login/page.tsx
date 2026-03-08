'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, password }) 
      });
      const data = await res.json();
      if (data.token) { 
        localStorage.setItem('token', data.token); 
        window.location.href = '/feed'; 
      } else {
        setError('Invalid email or password');
      }
    } catch (e) {
      setError('Unable to connect. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-900">SocialHub</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-600 mb-8">Enter your credentials to access your account</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input 
                id="email"
                type="email" 
                className="input-field" 
                placeholder="you@example.com"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input 
                id="password"
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          
          <p className="text-center text-slate-600 mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
        
        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/" className="hover:text-indigo-600 transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
