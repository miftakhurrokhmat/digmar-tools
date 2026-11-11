'use client';

import { useState, useEffect } from 'react';
import { X, Mail, MessageCircle, CheckCircle2, XCircle, Search, RefreshCw } from 'lucide-react';

export default function CommunicationLogsModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterChannel, setFilterChannel] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/communication-logs');
            const data = await res.json();
            if (Array.isArray(data)) setLogs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchLogs();
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredLogs = logs.filter((log) => {
        const matchChannel = filterChannel ? log.channel === filterChannel : true;
        const matchSearch = searchQuery
            ? log.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.deal?.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.sender?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchChannel && matchSearch;
    });

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col max-h-[88vh]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                            Audit Log Komunikasi (Email & WhatsApp)
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Rekap jejak pengiriman pesan promosi & proposal ke klien
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 mt-3">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                            <input
                                type="text"
                                placeholder="Cari penerima / klien / PIC..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none w-52"
                            />
                        </div>

                        <select
                            value={filterChannel}
                            onChange={(e) => setFilterChannel(e.target.value)}
                            className="border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg text-xs p-1.5 focus:outline-none cursor-pointer"
                        >
                            <option value="">Semua Kanal</option>
                            <option value="EMAIL">Email</option>
                            <option value="WHATSAPP">WhatsApp</option>
                        </select>
                    </div>

                    <button
                        onClick={fetchLogs}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-semibold text-slate-600 dark:text-slate-300 transition"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Tabel Log */}
                <div className="mt-3 flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-2.5">Kanal</th>
                                <th className="p-2.5">Tujuan (Penerima)</th>
                                <th className="p-2.5">Klien / Deal</th>
                                <th className="p-2.5">Pengirim (PIC)</th>
                                <th className="p-2.5">Waktu</th>
                                <th className="p-2.5 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-400">
                                        Belum ada riwayat komunikasi tercatat.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                        <td className="p-2.5">
                                            {log.channel === 'EMAIL' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
                                                    <Mail className="w-3 h-3" /> EMAIL
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                                                    <MessageCircle className="w-3 h-3" /> WHATSAPP
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-2.5 font-medium">
                                            <div>{log.recipient}</div>
                                            {log.subject && (
                                                <div className="text-[10px] text-slate-400 truncate max-w-xs">{log.subject}</div>
                                            )}
                                        </td>
                                        <td className="p-2.5">
                                            <div className="font-semibold text-slate-800 dark:text-slate-100">
                                                {log.deal?.clientName || '-'}
                                            </div>
                                            {log.deal?.companyName && (
                                                <div className="text-[10px] text-slate-400">{log.deal.companyName}</div>
                                            )}
                                        </td>
                                        <td className="p-2.5">{log.sender?.name || 'Sistem'}</td>
                                        <td className="p-2.5 text-[11px] text-slate-400 whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-2.5 text-center">
                                            {log.status === 'SENT' ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Terkirim
                                                </span>
                                            ) : (
                                                <span
                                                    className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-semibold"
                                                    title={log.errorMessage || 'Gagal'}
                                                >
                                                    <XCircle className="w-3.5 h-3.5" /> Gagal
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}