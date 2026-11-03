'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface City {
  id: number;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
}

export default function DealModal({
  isOpen,
  cities,
  dealToEdit,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  cities: City[];
  dealToEdit?: any | null;
  onClose: () => void;
  onSuccess: (deal?: any) => void;
}) {
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [productCategory, setProductCategory] = useState('PROFESSIONAL_TRAINING');
  const [customerType, setCustomerType] = useState('B2C_PRO_SMK');
  const [topic, setTopic] = useState('');
  const [targetPeriod, setTargetPeriod] = useState('');
  const [cityId, setCityId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [stageId, setStageId] = useState('1');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dealToEdit) {
      setClientName(dealToEdit.clientName || '');
      setCompanyName(dealToEdit.companyName || '');
      setPhone(dealToEdit.phone || '');
      setDealValue(dealToEdit.dealValue?.toString() || '');
      setProductCategory(dealToEdit.productCategory || 'PROFESSIONAL_TRAINING');
      setCustomerType(dealToEdit.customerType || 'B2C_PRO_SMK');
      setTopic(dealToEdit.topic || '');
      setTargetPeriod(dealToEdit.targetPeriod || '');
      setCityId(dealToEdit.cityId?.toString() || '');
      setLatitude(dealToEdit.latitude?.toString() || '');
      setLongitude(dealToEdit.longitude?.toString() || '');
      setStageId(dealToEdit.stageId?.toString() || '1');
    } else {
      const d = new Date();
      setClientName('');
      setCompanyName('');
      setPhone('');
      setDealValue('');
      setProductCategory('PROFESSIONAL_TRAINING');
      setCustomerType('B2C_PRO_SMK');
      setTopic('');
      setTargetPeriod(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
      if (cities.length > 0) {
        setCityId(cities[0].id.toString());
        setLatitude(cities[0].latitude.toString());
        setLongitude(cities[0].longitude.toString());
      }
      setStageId('1');
    }
  }, [dealToEdit, cities, isOpen]);

  const handleCityChange = (selectedId: string) => {
    setCityId(selectedId);
    const city = cities.find((c) => c.id.toString() === selectedId);
    if (city) {
      setLatitude(city.latitude.toString());
      setLongitude(city.longitude.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      clientName,
      companyName,
      phone,
      dealValue: parseFloat(dealValue),
      productCategory,
      customerType,
      topic,
      targetPeriod,
      cityId: parseInt(cityId),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      stageId: parseInt(stageId),
    };

    const url = dealToEdit ? `/api/deals/${dealToEdit.id}` : '/api/deals';
    const method = dealToEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        onSuccess(data);
        onClose();
      } else {
        alert(data.error || 'Gagal menyimpan deal');
      }
    } catch (err) {
      setLoading(false);
      alert('Terjadi kesalahan jaringan');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {dealToEdit ? 'Ubah Data Prospek' : 'Tambah Target Deal Baru'}
          </h2>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300">Nama Kontak / Klien *</label>
              <input
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Contoh: Pak Budi"
                className="mt-1 w-full border rounded-lg p-2 dark:border-slate-700 bg-transparent"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300">Instansi / Perusahaan</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Contoh: PT Telkom / Mandiri"
                className="mt-1 w-full border rounded-lg p-2 dark:border-slate-700 bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300">No. WhatsApp / HP *</label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812xxxx"
                className="mt-1 w-full border rounded-lg p-2 dark:border-slate-700 bg-transparent"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300">Estimasi Nilai Deal (Rp) *</label>
              <input
                required
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value)}
                placeholder="10000000"
                className="mt-1 w-full border rounded-lg p-2 dark:border-slate-700 bg-transparent font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300">Kategori Produk *</label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2 dark:border-slate-700 bg-transparent"
              >
                <option value="PROFESSIONAL_TRAINING">Pelatihan Profesional</option>
                <option value="KIDS_MENTORING">Mentoring Anak</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300">Segmentasi Customer *</label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2 dark:border-slate-700 bg-transparent"
              >
                <option value="B2C_PRO_SMK">B2C (Profesional / SMK)</option>
                <option value="B2C_STUDENT_PARENT">B2C (Siswa / Orang Tua)</option>
                <option value="B2B_CORP_GOV_CAMPUS">B2B (Korporat / Kampus / Instansi)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-300">Materi / Kebutuhan Topik</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Power BI, Data Analytics, Python IoT"
              className="mt-1 w-full border rounded-lg p-2 dark:border-slate-700 bg-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300">Target Periode (Bulan) *</label>
              <input
                required
                type="month"
                value={targetPeriod}
                onChange={(e) => setTargetPeriod(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2 dark:border-slate-700 bg-transparent"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300">Wilayah Target *</label>
              <select
                value={cityId}
                onChange={(e) => handleCityChange(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2 dark:border-slate-700 bg-transparent"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.region})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : dealToEdit ? 'Simpan Perubahan' : 'Buat Target Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
