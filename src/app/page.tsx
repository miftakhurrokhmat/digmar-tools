'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import KanbanBoard from '../components/KanbanBoard';
import MapView from '../components/MapView';
import DealModal from '../components/DealModal';
import DealActivityModal from '../components/DealActivityModal';
import UserManagementModal from '../components/UserManagementModal';
import { 
  Plus, 
  Filter, 
  Users, 
  UserCheck, 
  LogOut, 
  Calendar, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Layers,
  MapPin
} from 'lucide-react';

interface City {
  id: number;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  zoom: number;
}

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [deals, setDeals] = useState<any[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [userList, setUserList] = useState<AppUser[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<any | null>(null);
  const [activeActivityDeal, setActiveActivityDeal] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => router.push('/login'));
  }, [router]);

  useEffect(() => {
    const d = new Date();
    setSelectedPeriod(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }, []);

  useEffect(() => {
    fetch('/api/cities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCities(data);
      })
      .catch(console.error);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data)) setUserList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentUser) fetchUsers();
  }, [currentUser]);

  const fetchDeals = async () => {
    const params = new URLSearchParams();
    if (selectedCityId) params.append('cityId', selectedCityId);
    if (selectedPeriod) params.append('period', selectedPeriod);
    if (selectedUserId) params.append('userId', selectedUserId);

    const res = await fetch(`/api/deals?${params.toString()}`);
    const data = await res.json();
    if (Array.isArray(data)) setDeals(data);
  };

  useEffect(() => {
    if (currentUser) fetchDeals();
  }, [selectedCityId, selectedPeriod, selectedUserId, currentUser]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const handleStageChange = async (dealId: string, newStageId: number) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stageId: newStageId } : d))
    );

    await fetch(`/api/deals/${dealId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stageId: newStageId }),
    });
  };

  const handleDeleteDeal = async (dealId: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    await fetch(`/api/deals/${dealId}`, { method: 'DELETE' });
  };

  const handleOpenEdit = (deal: any) => {
    setDealToEdit(deal);
    setIsModalOpen(true);
  };

  const handleDealSaved = (savedDeal?: any) => {
    if (savedDeal) {
      setDeals((prev) => {
        const exists = prev.some((d) => d.id === savedDeal.id);
        if (exists) {
          return prev.map((d) => (d.id === savedDeal.id ? savedDeal : d));
        }
        return [savedDeal, ...prev];
      });
    }
    fetchDeals();
    setDealToEdit(null);
  };

  const activeCity = cities.find((c) => c.id.toString() === selectedCityId);
  const activeCenter: [number, number] | undefined = activeCity
    ? [activeCity.latitude, activeCity.longitude]
    : undefined;
  const activeZoom = activeCity ? activeCity.zoom : undefined;

  const totalPipeline = deals.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);
  const wonDeals = deals.filter((d) => d.stageId === 4);
  const totalWon = wonDeals.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);

  const stages = [
    { id: 1, name: 'Lead In', colorHex: '#3b82f6' },
    { id: 2, name: 'Contacted', colorHex: '#8b5cf6' },
    { id: 3, name: 'Proposal', colorHex: '#f59e0b' },
    { id: 4, name: 'Closed Won', colorHex: '#10b981' },
    { id: 5, name: 'Closed Lost', colorHex: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      <div className="max-w-[1520px] w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        <header className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-sm transition">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-blue-500/20">
                DT
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    digmar-tools
                  </h1>
                  {currentUser && (
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-semibold border ${
                      currentUser.role === 'ADMIN'
                        ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                        : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                    }`}>
                      {currentUser.role}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                  <span>DIY & Solo Raya State Tracker</span>
                  {currentUser && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {currentUser.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-medium">Bulan:</span>
                <input
                  type="month"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                />
                {selectedPeriod && (
                  <button
                    type="button"
                    onClick={() => setSelectedPeriod('')}
                    title="Reset Periode"
                    className="text-slate-400 hover:text-slate-600 font-bold ml-1 px-1"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedCityId}
                  onChange={(e) => setSelectedCityId(e.target.value)}
                  className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="">Semua Wilayah</option>
                  <optgroup label="── D.I. Yogyakarta ──">
                    {cities
                      .filter((c) => c.region === 'D.I. Yogyakarta')
                      .map((city) => (
                        <option key={city.id} value={city.id.toString()}>
                          {city.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="── Solo Raya ──">
                    {cities
                      .filter((c) => c.region === 'Solo Raya')
                      .map((city) => (
                        <option key={city.id} value={city.id.toString()}>
                          {city.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="">Semua PIC / User</option>
                  {userList.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setDealToEdit(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Deal
              </button>

              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

              {currentUser?.role === 'ADMIN' && (
                <button
                  onClick={() => setIsUserModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
                  title="Kelola Akun"
                >
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  Akun
                </button>
              )}

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 dark:hover:bg-red-950/40 text-xs font-medium transition"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Total Target Terdata
              </span>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
                {deals.length}
              </span>
              <span className="text-xs text-slate-400">prospek aktif</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Total Nilai Pipeline
              </span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                Rp {totalPipeline.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Realisasi Closing (Won)
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                Rp {totalWon.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-medium text-emerald-600/80 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                {wonDeals.length} Deal
              </span>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Distribusi Spasial Target Promosi
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">
              {activeCity ? activeCity.name : 'Semua Wilayah DIY & Solo Raya'}
            </span>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <MapView deals={deals} activeCenter={activeCenter} activeZoom={activeZoom} />
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Alur Tahapan Penjualan (Pipeline State)
            </h2>
          </div>
          <KanbanBoard
            stages={stages}
            deals={deals}
            onStageChange={handleStageChange}
            onOpenActivity={(deal) => setActiveActivityDeal(deal)}
            onEditDeal={handleOpenEdit}
            onDeleteDeal={handleDeleteDeal}
          />
        </section>

        <DealModal
          isOpen={isModalOpen}
          cities={cities}
          dealToEdit={dealToEdit}
          onClose={() => {
            setIsModalOpen(false);
            setDealToEdit(null);
          }}
          onSuccess={handleDealSaved}
        />

        <DealActivityModal
          deal={activeActivityDeal}
          onClose={() => setActiveActivityDeal(null)}
        />

        <UserManagementModal
          isOpen={isUserModalOpen}
          onClose={() => {
            setIsUserModalOpen(false);
            fetchUsers();
          }}
          currentUserId={currentUser?.id || ''}
        />
      </div>

      <footer className="mt-8 border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm py-4 px-6 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
          <p className="font-medium text-slate-600 dark:text-slate-300">
            Developer :{' '}
            <a
              href="https://github.com/miftakhurrokhmat"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 transition"
            >
              Miftakhurrokhmat
            </a>
          </p>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <p className="text-slate-400">
            Year : <span className="font-semibold text-slate-600 dark:text-slate-300">2026</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
