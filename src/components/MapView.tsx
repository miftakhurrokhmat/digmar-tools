'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Komponen internal yang menggunakan hook useMap secara aman di sisi client
function LeafletMapInner({
  deals,
  activeCenter,
  activeZoom,
}: {
  deals: any[];
  activeCenter?: [number, number];
  activeZoom?: number;
}) {
  const { MapContainer, TileLayer, Marker, Popup, useMap } = require('react-leaflet');
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

  return (
    <MapContainer
      center={[-7.7956, 110.3695]}
      zoom={10}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <MapController center={activeCenter} zoom={activeZoom} />
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {deals
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
                  <p className="text-slate-500">{deal.companyName}</p>
                )}
                <p className="text-blue-600 font-semibold mt-1">
                  Rp {deal.dealValue.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  PIC: {deal.createdBy?.name || 'Admin'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

// MapView utama hanya di-render di client (SSR: false)
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[380px] w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center text-xs text-slate-400">
        Memuat peta wilayah...
      </div>
    );
  }

  return (
    <div className="h-[380px] w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 relative z-0">
      <LeafletMapInner
        deals={deals}
        activeCenter={activeCenter}
        activeZoom={activeZoom}
      />
    </div>
  );
}