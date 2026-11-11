'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    PieChart,
    Users,
    MapPin,
    Mail,
    MessageCircle,
    ShieldAlert,
    Calendar,
    Filter
} from 'lucide-react';

const MONTH_OPTIONS = [
    { value: 'all', label: 'Semua Bulan (1 Tahun Penuh)' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
];

export default function AnalyticsPage() {
    const currentYear = new Date().getFullYear().toString();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

    const [selectedYear, setSelectedYear] = useState<string>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [forbidden, setForbidden] = useState(false);

    // Buat daftar opsi tahun (2 tahun ke belakang dan 2 tahun ke depan)
    const currentYearNum = parseInt(currentYear);
    const yearOptions = [
        currentYearNum - 2,
        currentYearNum - 1,
        currentYearNum,
        currentYearNum + 1,
        currentYearNum + 2,
    ];

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                year: selectedYear,
                month: selectedMonth,
            });

            const res = await fetch(`/api/analytics?${params.toString()}`);
            if (res.status === 403 || res.status === 401) {
                setForbidden(true);
                setLoading(false);
                return;
            }
            const resData = await res.json();
            if (resData) setData(resData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [selectedYear, selectedMonth]);

    if (forbidden) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm">
                    <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                        Akses Dibatasi
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 mb-5">
                        Halaman analitik eksekutif hanya dapat diakses oleh Administrator dan Manajemen.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const { summary, regionStats, productStats, customerTypeStats, salesLeaderboard, commStats } = data || {};

    return (
        <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 p-4 md:p-8 font-sans text-slate-900 dark:text-slate-100">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">

                {/* Header Navigasi & Kontrol Filter Periode */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 md:px-6 shadow-xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                            title="Kembali ke Dashboard Utama"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                                    Executive Analytics Dashboard
                                </h1>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800">
                                    MANAGEMENT / ADMIN
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Pemantauan konversi deal, penetrasi wilayah DIY - Solo Raya, dan efektivitas tim sales
                            </p>
                        </div>
                    </div>

                    {/* Kontrol Filter Tahun & Bulan */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Filter Tahun */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-xs shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-400 font-medium">Tahun:</span>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                            >
                                {yearOptions.map((y) => (
                                    <option key={y} value={y.toString()} className="dark:bg-slate-900">
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Bulan */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-xs shrink-0">
                            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-400 font-medium">Bulan:</span>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                            >
                                {MONTH_OPTIONS.map((m) => (
                                    <option key={m.value} value={m.value} className="dark:bg-slate-900">
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tombol Cepat Set ke Bulan Ini */}
                        {(selectedMonth !== currentMonth || selectedYear !== currentYear) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedYear(currentYear);
                                    setSelectedMonth(currentMonth);
                                }}
                                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-transparent hover:border-blue-200 transition shrink-0"
                            >
                                Bulan Ini
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="py-24 text-center text-xs text-slate-400 animate-pulse">
                        Memuat kalkulasi data analitik...
                    </div>
                ) : !data ? (
                    <div className="py-24 text-center text-xs text-slate-400">
                        Tidak ada data pada periode ini.
                    </div>
                ) : (
                    <>
                        {/* 1. Baris KPI Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Win Rate Penjualan
                                </span>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                                        {summary?.winRate}%
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        ({summary?.wonCount} dari {summary?.totalDeals} deal)
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Realisasi Pendapatan (Won)
                                </span>
                                <div className="mt-2">
                                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                        Rp {summary?.totalWonValue.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Potensi Pipeline Tertunda
                                </span>
                                <div className="mt-2">
                                    <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                                        Rp {(summary?.totalPipelineValue - summary?.totalWonValue).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Aktivitas Outbound
                                </span>
                                <div className="mt-2 flex items-center gap-3 text-xs">
                                    <span className="flex items-center gap-1 font-bold text-blue-600">
                                        <Mail className="w-3.5 h-3.5" /> {commStats?.totalEmails} Email
                                    </span>
                                    <span className="flex items-center gap-1 font-bold text-emerald-600">
                                        <MessageCircle className="w-3.5 h-3.5" /> {commStats?.totalWhatsapp} WA
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Grid Perbandingan Wilayah & Kategori Produk */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Perbandingan Region DIY vs Solo Raya */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    Kontribusi Wilayah: D.I. Yogyakarta vs Solo Raya
                                </h3>

                                <div className="flex flex-col gap-4 text-xs">
                                    {regionStats &&
                                        Object.entries(regionStats).map(([regName, stats]: [string, any]) => {
                                            const percent =
                                                summary?.totalPipelineValue > 0
                                                    ? Math.round((stats.totalValue / summary.totalPipelineValue) * 100)
                                                    : 0;
                                            return (
                                                <div
                                                    key={regName}
                                                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
                                                >
                                                    <div className="flex justify-between items-center font-bold">
                                                        <span className="text-slate-800 dark:text-slate-200 text-sm">{regName}</span>
                                                        <span className="text-blue-600">{percent}% dari total pipeline</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                    <div className="mt-2.5 flex justify-between text-[11px] text-slate-500">
                                                        <span>Total Target: {stats.dealCount} Deal</span>
                                                        <span>Closing: Rp {stats.wonValue.toLocaleString('id-ID')}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>

                            {/* Breakdown Produk & Customer Segment */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
                                        <PieChart className="w-4 h-4 text-purple-600" />
                                        Segmentasi Penjualan & Produk
                                    </h3>

                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                                            <span className="text-[11px] text-slate-400">Pelatihan Profesional</span>
                                            <div className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">
                                                Rp {productStats?.PROFESSIONAL_TRAINING.toLocaleString('id-ID')}
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                                            <span className="text-[11px] text-slate-400">Mentoring Anak</span>
                                            <div className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">
                                                Rp {productStats?.KIDS_MENTORING.toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
                                        <span className="text-slate-500">
                                            B2B (Kampus / Korporasi): <strong>{customerTypeStats?.B2B} deal</strong>
                                        </span>
                                        <span className="text-slate-500">
                                            B2C Profesional: <strong>{customerTypeStats?.B2C_PRO} deal</strong>
                                        </span>
                                        <span className="text-slate-500">
                                            B2C Siswa/Ortu: <strong>{customerTypeStats?.B2C_STUDENT} deal</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Leaderboard Kinerja PIC Sales */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4 text-emerald-600" />
                                Peringkat Performa Tim Sales
                            </h3>

                            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="p-3">Nama Sales</th>
                                            <th className="p-3">Role</th>
                                            <th className="p-3 text-center">Total Deal</th>
                                            <th className="p-3 text-center">Closing (Won)</th>
                                            <th className="p-3">Total Closing (IDR)</th>
                                            <th className="p-3">Potensi Pipeline</th>
                                            <th className="p-3 text-center">Aktivitas Kontak</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {salesLeaderboard && salesLeaderboard.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-4 text-center text-slate-400">
                                                    Tidak ada aktivitas tim sales pada periode ini.
                                                </td>
                                            </tr>
                                        ) : (
                                            salesLeaderboard?.map((user: any) => (
                                                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{user.name}</td>
                                                    <td className="p-3">
                                                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-center">{user.totalDeals}</td>
                                                    <td className="p-3 text-center font-bold text-emerald-600">{user.wonDeals}</td>
                                                    <td className="p-3 font-semibold text-emerald-600">
                                                        Rp {user.wonValue.toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="p-3 font-medium text-slate-600 dark:text-slate-300">
                                                        Rp {user.pipelineValue.toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="p-3 text-center font-bold">{user.commCount} aksi</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}