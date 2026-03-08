'use client';
import { useState } from 'react';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = async () => {
    const res = await fetch('http://localhost:4000/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (data.token) { localStorage.setItem('token', data.token); window.location.href = '/feed'; }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>
        <input className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-indigo-500 outline-none" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={login} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">Login</button>
        <p className="text-center mt-4 text-gray-600">No account? <a href="/register" className="text-indigo-600 hover:underline">Register</a></p>
      </div>
    </div>
  );
}
