'use client';

import { useState, useEffect } from 'react';
import { X, Send, MessageCircle, Phone, Users, FileText } from 'lucide-react';

export default function DealActivityModal({
  deal,
  onClose,
}: {
  deal: any | null;
  onClose: () => void;
}) {
  const [activities, setActivities] = useState<any[]>([]);
  const [activityType, setActivityType] = useState('WHATSAPP');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    if (!deal) return;
    const res = await fetch(`/api/deals/${deal.id}/activities`);
    const data = await res.json();
    if (Array.isArray(data)) setActivities(data);
  };

  useEffect(() => {
    if (deal) {
      fetchActivities();
      setNotes('');
    }
  }, [deal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() || !deal) return;

    setLoading(true);
    const res = await fetch(`/api/deals/${deal.id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityType, notes }),
    });

    setLoading(false);
    if (res.ok) {
      setNotes('');
      fetchActivities();
    }
  };

  if (!deal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Riwayat Aktivitas & Catatan
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {deal.clientName} {deal.companyName ? `• ${deal.companyName}` : ''}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageCircle },
              { id: 'CALL', label: 'Telepon', icon: Phone },
              { id: 'MEETING', label: 'Meeting', icon: Users },
              { id: 'NOTE', label: 'Catatan', icon: FileText },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActivityType(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                  activityType === t.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <t.icon className="w-3 h-3" />
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tulis ringkasan obrolan, respon klien, atau hasil follow up..."
              className="w-full border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2.5 bottom-3.5 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="mt-4 flex-1 overflow-y-auto flex flex-col gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {activities.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-6">Belum ada riwayat aktivitas tercatat.</p>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {act.activityType}
                  </span>
                  <span>{new Date(act.createdAt).toLocaleString('id-ID')}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 mt-0.5 leading-relaxed">
                  {act.notes}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
