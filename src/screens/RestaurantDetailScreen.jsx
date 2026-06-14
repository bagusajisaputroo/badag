import React from 'react';

export default function RestaurantDetailScreen({ restaurant, onBack, onBooking }) {
  if (!restaurant) return null;

  const getStatusClass = (status) => {
    if (status === 'Tersedia') return 'chip-tersedia';
    if (status === 'Ramai') return 'chip-ramai';
    if (status === 'Penuh') return 'chip-penuh';
    return '';
  };

  const occ = restaurant.occupancy;
  const occPct = occ ? Math.round((occ.filled / occ.total) * 100) : 0;
  const occAvail = occ ? occ.total - occ.filled : 0;
  const occColor = occPct > 80 ? '#E11D48' : occPct > 50 ? '#F59E0B' : '#0EA5A0';

  return (
    <div className="screen-content" style={{ paddingBottom: 0, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Header */}
      <div style={{ position: 'relative', height: '320px', backgroundImage: `url(${restaurant.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)' }}></div>
        
        {/* Back Button positioned below dynamic island */}
        <div style={{ position: 'absolute', top: '56px', left: '20px', zIndex: 10 }}>
          <div 
            onClick={onBack}
            style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
          >
            <i className="ti ti-arrow-left" style={{ fontSize: '20px' }}></i>
          </div>
        </div>

        {/* Hero Content */}
        <div style={{ position: 'absolute', bottom: '24px', left: '20px', right: '20px', color: 'white' }}>
          <div className="flex-row justify-between" style={{ alignItems: 'flex-end' }}>
            <div>
              <span className={`chip ${getStatusClass(restaurant.status)}`} style={{ marginBottom: '8px' }}>{restaurant.status}</span>
              <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>{restaurant.name}</h1>
              <p style={{ opacity: 0.9, fontSize: '13px' }}>{restaurant.type} • {restaurant.city}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div style={{ flex: 1, background: '#FFFFFF', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', marginTop: '-24px', position: 'relative', zIndex: 5, padding: '24px', overflowY: 'auto', paddingBottom: '120px' }}>
        
        {occ && (
          <div className="occ-card" style={{ marginBottom: '24px', marginTop: '-48px', position: 'relative', zIndex: 6, background: '#FFFFFF' }}>
            <div className="occ-top">
              <div>
                <div className="occ-label">Meja terisi saat ini</div>
                <div className="occ-num">{occ.filled}<span style={{ fontSize: '16px', color: '#94A3B8' }}> / {occ.total}</span></div>
                <div className="occ-sub">{occAvail === 0 ? 'Semua meja terisi' : `${occAvail} meja kosong`}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="occ-label" style={{ marginBottom: '4px' }}>Kapasitas</div>
                <div className="occ-pct">{occPct}%</div>
              </div>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${occPct}%`, background: occColor }}></div>
            </div>
          </div>
        )}
        <div className="flex-row gap-4" style={{ marginBottom: '24px' }}>
          <div className="flex-col gap-1" style={{ flex: 1 }}>
            <span className="text-muted caption">Rating</span>
            <span className="text-navy" style={{ fontWeight: 700, fontSize: '15px' }}><i className="ti ti-star-filled" style={{ color: '#FACC15' }}></i> {restaurant.rating} <span style={{ fontWeight: 400, fontSize: '13px', color: '#64748B' }}>({restaurant.reviewsCount})</span></span>
          </div>
          <div style={{ width: '1px', background: '#E2E8F0' }}></div>
          <div className="flex-col gap-1" style={{ flex: 1 }}>
            <span className="text-muted caption">Jarak</span>
            <span className="text-navy" style={{ fontWeight: 700, fontSize: '15px' }}><i className="ti ti-map-pin" style={{ color: '#0EA5A0' }}></i> {restaurant.distance}</span>
          </div>
        </div>

        <h2 className="text-navy" style={{ marginBottom: '8px' }}>Tentang Restoran</h2>
        <p className="text-muted" style={{ lineHeight: '1.5', marginBottom: '24px' }}>
          Restoran dan cafe modern dengan suasana yang nyaman, cocok untuk bersantai maupun bekerja. Menawarkan menu spesial yang diracik oleh chef profesional dengan bahan pilihan terbaik.
        </p>

        <h2 className="text-navy" style={{ marginBottom: '12px' }}>Fasilitas</h2>
        <div className="flex-row" style={{ flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {['WiFi Cepat', 'Area Outdoor', 'Ruang AC', 'Parkir Luas', 'Stop Kontak'].map(f => (
            <div key={f} className="chip" style={{ background: '#F1F5F9', color: '#1B3461', fontWeight: 500, padding: '6px 12px' }}>
              {f}
            </div>
          ))}
        </div>

        <h2 className="text-navy" style={{ marginBottom: '12px' }}>Lokasi</h2>
        <div className="card flex-row gap-3" style={{ padding: '16px', background: '#F8FAFC', border: 'none', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', background: '#E2E8F0', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B3461' }}>
            <i className="ti ti-map" style={{ fontSize: '20px' }}></i>
          </div>
          <div>
            <p className="text-navy" style={{ fontWeight: 600, marginBottom: '2px' }}>{restaurant.address}</p>
            <p className="text-muted caption">Buka Maps</p>
          </div>
        </div>

        {occ && occ.waitlist > 0 && (
          <div className="waitlist-card" style={{ marginBottom: '24px' }}>
            <div className="waitlist-header">
              <div className="waitlist-title">
                <i className="ti ti-list-numbers" style={{ fontSize: '15px', color: '#0EA5A0' }}></i>
                Antrean Waitlist
                <span className="wl-count">{occ.waitlist} orang</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Est. {occ.waitTime} mnt</span>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', padding: '16px 24px 32px', borderTop: '0.5px solid #E2E8F0', zIndex: 20 }}>
        {restaurant.status === 'Penuh' ? (
          <button className="btn-cta" style={{ background: '#1B3461', color: 'white' }} onClick={() => onBooking(restaurant)}>Gabung Waitlist</button>
        ) : (
          <button className="btn-cta" onClick={() => onBooking(restaurant)}>Reservasi Meja</button>
        )}
      </div>

    </div>
  );
}
