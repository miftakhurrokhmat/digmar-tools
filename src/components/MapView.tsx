'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Layers, ShieldCheck, MapPin } from 'lucide-react';

interface ZoneGeofence {
  id: string;
  name: string;
  category: string;
  center: [number, number];
  radius: number; // Dalam meter
  color: string;
  fillColor: string;
  description: string;
}

// Definisi zona geofencing strategis DIY & Solo Raya
const PROMOTION_ZONES: ZoneGeofence[] = [
  {
    id: 'diy-campus',
    name: 'Kluster Kampus & Edutech (DIY)',
    category: 'Pendidikan Tinggi & Sekolah Unggulan',
    center: [-7.765, 110.378], // Area Kampus UGM, UNY, UII, AMIKOM
    radius: 7500,
    color: '#2563eb',
    fillColor: '#3b82f6',
    description: 'Konsentrasi perguruan tinggi, SMK IT, dan pusat riset teknologi D.I. Yogyakarta.',
  },
  {
    id: 'solo-industry',
    name: 'Kluster Industri & Vokasi (Solo Raya)',
    category: 'Korporat, Vokasi & Sentra Bisnis',
    center: [-7.585, 110.825], // Koridor Solo - Sukoharjo
    radius: 9500,
    color: '#7c3aed',
    fillColor: '#8b5cf6',
    description: 'Kawasan industri tekstil, manufaktur, kampus vokasi, dan instansi bisnis Solo-Sukoharjo.',
  },
  {
    id: 'klaten-corridor',
    name: 'Koridor Penghubung Jogja-Solo (Klaten)',
    category: 'Ekspansi Agrikultur & UMKM',
    center: [-7.7058, 110.6022], // Pusat Klaten
    radius: 7000,
    color: '#d97706',
    fillColor: '#f59e0b',
    description: 'Titik temu distribusi promosi antar wilayah Sleman/Bantul dan Solo Raya.',
  },
];

// Inner Component untuk Leaflet di Client
function LeafletMapInner({
  deals,
  activeCenter,
  activeZoom,
  showGeofence,
  selectedZoneId,
}: {
  deals: any[];
  activeCenter?: [number, number];
  activeZoom?: number;
  showGeofence: boolean;
  selectedZoneId: string;
}) {
  const { MapContainer, TileLayer, Marker, Popup, Circle, useMap } = require('react-leaflet');
  const L = require('leaflet');

  const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  function MapController({
    center,
    zoom,
  }: {
    center?: [number, number];
    zoom?: number;
  }) {
    const map = useMap();
    useEffect(() => {
      if (center && zoom && map && typeof map.flyTo === 'function') {
        map.flyTo(center, zoom, { duration: 1.2 });
      }
    }, [center, zoom, map]);
    return null;
  }

  // Filter zona yang sedang aktif
  const displayedZones = selectedZoneId
    ? PROMOTION_ZONES.filter((z) => z.id === selectedZoneId)
    : PROMOTION_ZONES;

  return (
    <MapContainer
      center={activeCenter || [-7.765, 110.55]}
      zoom={activeZoom || 10}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <MapController center={activeCenter} zoom={activeZoom} />
      <TileLayer
        attribution="Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        maxZoom={19}
      />

      {/* Render Radius Circle Geofencing */}
      {showGeofence &&
        displayedZones.map((zone) => (
          <Circle
            key={zone.id}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{
              color: zone.color,
              fillColor: zone.fillColor,
              fillOpacity: 0.15,
              weight: 2,
              dashArray: '6, 8',
            }}
          >
            <Popup>
              <div className="p-1 max-w-[210px] text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span>{zone.name}</span>
                </div>
                <p className="text-[10px] font-semibold text-blue-600 mt-1 uppercase">
                  {zone.category}
                </p>
                <p className="text-slate-500 text-[11px] mt-1 leading-snug">
                  {zone.description}
                </p>
                <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Radius: {zone.radius / 1000} km</span>
                  <span className="font-semibold text-slate-600">Geofence Aktif</span>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}

      {/* Render Marker Target Deal */}
      {customIcon &&
        deals
          .filter((d) => d.latitude && d.longitude)
          .map((deal) => (
            <Marker
              key={deal.id}
              position={[deal.latitude, deal.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <p className="font-bold text-slate-800">{deal.clientName}</p>
                  {deal.companyName && (
                    <p className="text-slate-500 font-medium">{deal.companyName}</p>
                  )}
                  <p className="text-blue-600 font-semibold mt-1">
                    Rp {deal.dealValue.toLocaleString('id-ID')}
                  </p>
                  <div className="mt-1.5 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{typeof deal.city === 'object' ? deal.city?.name : deal.city}</span>
                    <span>PIC: {deal.createdBy?.name || 'Admin'}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
    </MapContainer>
  );
}

export default function MapView({
  deals,
  activeCenter,
  activeZoom,
}: {
  deals: any[];
  activeCenter?: [number, number];
  activeZoom?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [showGeofence, setShowGeofence] = useState(true);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');

  // Hitung titik tengah dan zoom jika user memilih zona spesifik
  const activeZone = PROMOTION_ZONES.find((z) => z.id === selectedZoneId);
  const mapCenter = activeZone ? activeZone.center : activeCenter;
  const mapZoom = activeZone ? 11 : activeZoom;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[400px] w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center text-xs text-slate-400">
        Memuat konfigurasi spasial peta...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Baris Kontrol Geofencing & Legenda */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-1">
        <div className="flex items-center gap-2">
          {/* Tombol Sakelar Radius */}
          <button
            type="button"
            onClick={() => setShowGeofence(!showGeofence)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${showGeofence
              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
              : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{showGeofence ? 'Radius Aktif' : 'Radius Nonaktif'}</span>
          </button>

          {/* Pemilih Zona Cepat */}
          {showGeofence && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="">Semua Zona Kluster</option>
                {PROMOTION_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} ({zone.radius / 1000} km)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Indikator Legenda Kluster */}
        {showGeofence && (
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Kluster DIY (Kampus)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              Kluster Solo Raya (Industri)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Kluster Klaten (Koridor)
            </span>
          </div>
        )}
      </div>

      {/* Peta Leaflet */}
      <div className="h-[420px] w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 relative z-0">
        <LeafletMapInner
          deals={deals}
          activeCenter={mapCenter}
          activeZoom={mapZoom}
          showGeofence={showGeofence}
          selectedZoneId={selectedZoneId}
        />
      </div>
    </div>
  );
}