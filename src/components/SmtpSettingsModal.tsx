'use client';

import { useState, useEffect } from 'react';
import { X, Server, Check, BarChart3 } from 'lucide-react';

export default function SmtpSettingsModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [host, setHost] = useState('smtp.gmail.com');
    const [port, setPort] = useState('587');
    const [secure, setSecure] = useState(false);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [fromName, setFromName] = useState('Tim Marketing');
    const [fromEmail, setFromEmail] = useState('');
    const [dailyLimit, setDailyLimit] = useState(50);
    const [usedCount, setUsedCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSaved(false);
            fetch('/api/settings/smtp')
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        setHost(data.host || 'smtp.gmail.com');
                        setPort(String(data.port || 587));
                        setSecure(Boolean(data.secure));
                        setUser(data.user || '');
                        setPass(data.pass || '');
                        setFromName(data.fromName || 'Tim Marketing');
                        setFromEmail(data.fromEmail || '');
                        setDailyLimit(data.dailyEmailLimit || 50);
                        setUsedCount(data.dailyEmailSentCount || 0);
                    }
                });
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaved(false);

        const res = await fetch('/api/settings/smtp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                host,
                port,
                secure,
                user,
                pass,
                fromName,
                fromEmail,
                dailyEmailLimit: dailyLimit,
            }),
        });

        setLoading(false);
        if (res.ok) {
            setSaved(true);
            setTimeout(() => onClose(), 800);
        } else {
            alert('Gagal menyimpan konfigurasi SMTP');
        }
    };

    if (!isOpen) return null;

    const percentage = Math.min(Math.round((usedCount / (dailyLimit || 1)) * 100), 100);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-blue-600" />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            Konfigurasi SMTP & Kuota Harian (Admin)
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Visualisasi Kuota Harian Terpusat */}
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                            Pemakaian Kuota Email Kantor Hari Ini
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                            {usedCount} / {dailyLimit} Email ({percentage}%)
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${percentage >= 90 ? 'bg-rose-500' : percentage >= 70 ? 'bg-amber-500' : 'bg-blue-600'
                                }`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                        Digunakan bersama oleh seluruh tim sales. Kuota direset otomatis setiap pukul 00:00.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                            <label className="font-semibold text-slate-600 dark:text-slate-400">SMTP Host</label>
                            <input
                                required
                                value={host}
                                onChange={(e) => setHost(e.target.value)}
                                placeholder="smtp.gmail.com"
                                className="mt-1 w-full border rounded-lg p-2 border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Port</label>
                            <input
                                required
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                                placeholder="587"
                                className="mt-1 w-full border rounded-lg p-2 border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Username / Email Akun</label>
                            <input
                                required
                                type="email"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                placeholder="marketing@domain.com"
                                className="mt-1 w-full border rounded-lg p-2 border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">App Password / Sandi</label>
                            <input
                                required
                                type="password"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                placeholder="••••••••••••••••"
                                className="mt-1 w-full border rounded-lg p-2 border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Display Name</label>
                            <input
                                required
                                value={fromName}
                                onChange={(e) => setFromName(e.target.value)}
                                placeholder="Tim Edukasi Digmar"
                                className="mt-1 w-full border rounded-lg p-2 border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">From Email (Opsional)</label>
                            <input
                                type="email"
                                value={fromEmail}
                                onChange={(e) => setFromEmail(e.target.value)}
                                placeholder="noreply@domain.com"
                                className="mt-1 w-full border rounded-lg p-2 border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-semibold text-slate-600 dark:text-slate-400">
                            Batas Maksimal Kuota Harian (Email)
                        </label>
                        <input
                            required
                            type="number"
                            min="1"
                            max="2000"
                            value={dailyLimit}
                            onChange={(e) => setDailyLimit(parseInt(e.target.value) || 0)}
                            className="mt-1 w-full border rounded-lg p-2 border-slate-300 dark:border-slate-700 bg-transparent font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                        >
                            Tutup
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {saved && <Check className="w-3.5 h-3.5" />}
                            {loading ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan Konfigurasi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}