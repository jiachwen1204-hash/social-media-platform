import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-2xl backdrop-blur-sm mb-6">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Admin Portal</h1>
          <p className="text-slate-400 text-lg">Manage your platform</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/10">
          <div className="space-y-4">
            <Link href="/login" className="btn-admin block text-center">Admin Login</Link>
            <Link href="/dashboard" className="btn-admin block text-center bg-blue-600 hover:bg-blue-500">Dashboard</Link>
          </div>
        </div>
        
        <p className="text-center text-slate-500 text-sm mt-8">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
