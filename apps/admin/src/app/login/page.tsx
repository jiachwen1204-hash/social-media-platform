'use client';
import { useState } from 'react';
export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = async () => {
    const res = await fetch('http://localhost:4000/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (data.token) { localStorage.setItem('token', data.token); window.location.href = '/dashboard'; }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>
        <input className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={login} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Login</button>
      </div>
    </div>
  );
}
