import React, { useState } from 'react';
import { reservations } from '../data/mockData';

export default function ReservasiScreen({ navigateToExplore }) {
  const [resTab, setResTab] = useState('upcoming');

  return (
    <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '64px 20px 16px', background: 'white' }}>
        <h1 className="text-navy">Reservasi Saya</h1>
      </div>
      <div className="tabs-underline">
        <div className={`tab-u ${resTab === 'upcoming' ? 'active' : ''}`} onClick={() => setResTab('upcoming')}>Upcoming</div>
        <div className={`tab-u ${resTab === 'selesai' ? 'active' : ''}`} onClick={() => setResTab('selesai')}>Selesai</div>
        <div className={`tab-u ${resTab === 'dibatalkan' ? 'active' : ''}`} onClick={() => setResTab('dibatalkan')}>Dibatalkan</div>
      </div>
      
      <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        {resTab === 'upcoming' && (
          <div className="flex-col gap-4">
            {reservations.upcoming.map(res => (
              <div key={res.id} className="card" style={{ borderLeft: `3px solid ${res.status === 'Confirmed' ? '#0EA5A0' : '#F59E0B'}` }}>
                <div className="flex-row justify-between" style={{ marginBottom: '12px' }}>
                  <h2 className="text-navy">{res.restaurantName}</h2>
                  <span className={`chip ${res.status === 'Confirmed' ? 'chip-confirmed' : 'chip-waiting'}`}>{res.status}</span>
                </div>
                <div className="flex-col gap-2" style={{ marginBottom: '16px' }}>
                  {res.location && <p className="caption text-muted">{res.location}</p>}
                  <p className="text-muted flex-row gap-2"><i className="ti ti-calendar"></i> {res.date} • {res.time}</p>
                  <p className="text-muted flex-row gap-2"><i className="ti ti-users"></i> {res.guests} orang • {res.tableType}</p>
                </div>
                <div className="flex-row gap-3">
                  <button className="btn-outline-navy" style={{ flex: 1 }}>Lihat Detail</button>
                  {res.status === 'Confirmed' && <button className="btn-outline-red" style={{ flex: 1 }}>Batalkan</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {resTab === 'selesai' && (
          <div className="flex-col gap-4">
            {reservations.selesai.map(res => (
              <div key={res.id} className="card" style={{ opacity: 0.8 }}>
                <div className="flex-row justify-between" style={{ marginBottom: '12px' }}>
                  <h2 className="text-navy">{res.restaurantName}</h2>
                  <span className="chip" style={{ background: '#E2E8F0', color: '#64748B' }}>{res.status}</span>
                </div>
                <div className="flex-col gap-2" style={{ marginBottom: '16px' }}>
                  <p className="text-muted flex-row gap-2"><i className="ti ti-calendar"></i> {res.date} • {res.time}</p>
                </div>
                <button className="btn-outline-teal" style={{ width: '100%' }}>Beri Ulasan</button>
              </div>
            ))}
          </div>
        )}

        {resTab === 'dibatalkan' && (
          <div className="flex-col gap-4">
            {reservations.dibatalkan.map(res => (
              <div key={res.id} className="card" style={{ borderLeft: '3px solid #E11D48', opacity: 0.8 }}>
                <div className="flex-row justify-between" style={{ marginBottom: '12px' }}>
                  <h2 className="text-navy">{res.restaurantName}</h2>
                  <span className="chip chip-cancelled">{res.status}</span>
                </div>
                <div className="flex-col gap-2">
                  <p className="text-muted flex-row gap-2"><i className="ti ti-calendar"></i> {res.date} • {res.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '20px', background: 'white', borderTop: '0.5px solid #E2E8F0' }}>
        <button className="btn-cta" onClick={navigateToExplore}>Buat Reservasi Baru</button>
      </div>
    </div>
  );
}
