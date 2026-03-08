export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Admin Portal</h1>
      <nav>
        <a href="/login">Admin Login</a> | <a href="/dashboard">Dashboard</a>
      </nav>
    </div>
  );
}
