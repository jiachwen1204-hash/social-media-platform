export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Admin Portal</h1>
        <p className="text-gray-300 text-center mb-6">Manage your platform</p>
        <div className="space-y-3">
          <a href="/login" className="block w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition">Admin Login</a>
          <a href="/dashboard" className="block w-full bg-slate-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-slate-500 transition">Dashboard</a>
        </div>
      </div>
    </div>
  );
}
