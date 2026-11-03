'use client';

import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@digmar.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        window.location.href = '/';
      } else {
        setError(data.error || 'Login gagal, periksa email dan password.');
      }
    } catch (err) {
      setLoading(false);
      setError('Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            digmar-tools
          </h1>
          <p className="text-xs text-slate-500 mt-1">Masuk untuk mengelola pipeline & pemetaan</p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Email</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                required
                type="email"
                placeholder="nama@digmar.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-transparent border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Password</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-transparent border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Memeriksa Akun...' : 'Masuk Dashboard'}
          </button>
        </form>

        <div className="mt-5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-400 text-center">
          Default Admin: <span className="font-semibold text-slate-600 dark:text-slate-300">admin@digmar.com</span> / pass: <span className="font-semibold text-slate-600 dark:text-slate-300">admin123</span>
        </div>
      </div>
    </div>
  );
}
