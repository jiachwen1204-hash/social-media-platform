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
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
      <button onClick={login}>Login</button>
      <p>No account? <a href="/register">Register</a></p>
    </div>
  );
}
