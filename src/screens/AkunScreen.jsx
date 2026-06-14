import React, { useState } from 'react';
import { userProfile } from '../data/mockData';

export default function AkunScreen() {
  const [notifOn, setNotifOn] = useState(true);

  return (
    <div className="screen-content">
      <div className="profile-header">
        <div className="avatar text-white">{userProfile.initials}</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: '4px' }}>{userProfile.name}</h1>
          <p style={{ opacity: 0.9, marginBottom: '12px' }}>{userProfile.email}</p>
          <button style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '6px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Edit Profil</button>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginTop: '-24px' }}>
        <div className="card flex-row" style={{ padding: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div className="stat-card">
            <h1 className="text-navy">{userProfile.stats.reservasi}</h1>
            <p className="caption">Reservasi</p>
          </div>
          <div style={{ width: '1px', background: '#E2E8F0', height: '40px' }}></div>
          <div className="stat-card">
            <h1 className="text-navy">{userProfile.stats.ulasan}</h1>
            <p className="caption">Ulasan</p>
          </div>
          <div style={{ width: '1px', background: '#E2E8F0', height: '40px' }}></div>
          <div className="stat-card">
            <h1 className="text-navy">{userProfile.stats.favorit}</h1>
            <p className="caption">Favorit</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 20px' }}>
        <h2 className="text-muted" style={{ marginBottom: '12px', fontSize: '13px' }}>Aktivitas</h2>
        <div className="menu-list">
          <div className="menu-item"><i className="ti ti-calendar"></i> <span className="text-navy" style={{ fontWeight: 600, flex: 1 }}>Riwayat Reservasi</span> <i className="ti ti-chevron-right text-muted"></i></div>
          <div className="menu-item"><i className="ti ti-heart"></i> <span className="text-navy" style={{ fontWeight: 600, flex: 1 }}>Restoran Favorit</span> <i className="ti ti-chevron-right text-muted"></i></div>
          <div className="menu-item"><i className="ti ti-star"></i> <span className="text-navy" style={{ fontWeight: 600, flex: 1 }}>Ulasan Saya</span> <i className="ti ti-chevron-right text-muted"></i></div>
        </div>

        <h2 className="text-muted" style={{ margin: '24px 0 12px', fontSize: '13px' }}>Pengaturan</h2>
        <div className="menu-list">
          <div className="menu-item" onClick={() => setNotifOn(!notifOn)}>
            <i className="ti ti-bell"></i> 
            <span className="text-navy" style={{ fontWeight: 600, flex: 1 }}>Notifikasi</span> 
            <div className={`toggle-switch ${!notifOn ? 'off' : ''}`}></div>
          </div>
          <div className="menu-item"><i className="ti ti-map-pin"></i> <span className="text-navy" style={{ fontWeight: 600, flex: 1 }}>Lokasi</span> <span className="caption">{userProfile.location}</span></div>
          <div className="menu-item"><i className="ti ti-language"></i> <span className="text-navy" style={{ fontWeight: 600, flex: 1 }}>Bahasa</span> <span className="caption">Indonesia</span></div>
        </div>

        <h2 className="text-muted" style={{ margin: '24px 0 12px', fontSize: '13px' }}>Lainnya</h2>
        <div className="menu-list" style={{ marginBottom: '40px' }}>
          <div className="menu-item"><i className="ti ti-help"></i> <span className="text-navy" style={{ fontWeight: 600, flex: 1 }}>Pusat Bantuan</span></div>
          <div className="menu-item"><i className="ti ti-file-text"></i> <span className="text-navy" style={{ fontWeight: 600, flex: 1 }}>Syarat & Ketentuan</span></div>
          <div className="menu-item"><i className="ti ti-shield"></i> <span className="text-navy" style={{ fontWeight: 600, flex: 1 }}>Kebijakan Privasi</span></div>
          <div className="menu-item"><i className="ti ti-logout" style={{ color: '#E11D48' }}></i> <span style={{ fontWeight: 600, color: '#E11D48', flex: 1 }}>Keluar</span></div>
        </div>
      </div>
    </div>
  );
}
