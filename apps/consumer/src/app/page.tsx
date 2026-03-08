export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Social Platform</h1>
        <p className="text-gray-500 text-center mb-6">Connect with friends and share moments</p>
        <div className="space-y-3">
          <a href="/login" className="block w-full bg-indigo-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-indigo-700 transition">Login</a>
          <a href="/register" className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-center font-semibold hover:bg-gray-200 transition">Register</a>
          <a href="/feed" className="block w-full bg-purple-100 text-purple-700 py-3 rounded-lg text-center font-semibold hover:bg-purple-200 transition">Browse Feed</a>
        </div>
      </div>
    </div>
  );
}
