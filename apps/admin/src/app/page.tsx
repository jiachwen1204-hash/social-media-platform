import Link from 'next/link';
import './globals.css';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-400">Manage your platform</p>
        </div>

        {/* Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 space-y-4">
          <Link href="/login" className="btn-admin block text-center">
            Admin Login
          </Link>
          <Link href="/dashboard" className="btn-admin block text-center bg-blue-600 hover:bg-blue-500">
            Dashboard
          </Link>
        </div>
        
        <p className="text-center text-slate-500 text-sm mt-8">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
