'use client';
import { useState } from 'react';
export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const register = async () => {
    const res = await fetch('http://localhost:4000/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, username, displayName, password }) });
    const data = await res.json();
    if (data.token) { localStorage.setItem('token', data.token); window.location.href = '/feed'; }
  };
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Register</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br/>
      <input placeholder="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} /><br/>
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
      <button onClick={register}>Register</button>
      <p>Have account? <a href="/login">Login</a></p>
    </div>
  );
}
