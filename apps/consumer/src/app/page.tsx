export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">SocialHub</h1>
          <p className="text-indigo-100 text-lg">Connect. Share. Engage.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="space-y-4">
            <a href="/login" className="btn-primary block text-center">Sign In</a>
            <a href="/register" className="btn-secondary block text-center">Create Account</a>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <a href="/feed" className="text-sm text-gray-500 hover:text-indigo-600 text-center block transition-colors">
              Browse as Guest →
            </a>
          </div>
        </div>
        
        <p className="text-center text-indigo-200 text-sm mt-8">
          Join thousands of creators
        </p>
      </div>
    </div>
  );
}
