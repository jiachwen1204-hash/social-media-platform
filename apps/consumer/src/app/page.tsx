export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Social Media Platform</h1>
      <nav>
        <a href="/login">Login</a> | <a href="/register">Register</a> | <a href="/feed">Feed</a>
      </nav>
    </div>
  );
}
