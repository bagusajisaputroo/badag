import React, { useState } from 'react';

export default function RestaurantDetailScreen({ restaurant, onBack, onBooking }) {
  const [showContactForm, setShowContactForm] = useState(false);

  if (!restaurant) return null;

  const occ = restaurant.occupancy;
  const occPct = occ && occ.total > 0 ? Math.round((occ.filled / occ.total) * 100) : 0;
  const statusLabel = occPct >= 90 ? 'Full' : occPct >= 60 ? 'Busy' : 'Available';
  const statusColor = occPct >= 90 ? '#EF4444' : occPct >= 60 ? '#F59E0B' : '#10B981';

  // Calculate true availability from areas data
  let seatoOccupied = 0;
  let seatoAllocated = 0;
  let walkInOccupied = 0;
  let walkInAllocated = 0;

  if (restaurant.areas && restaurant.areas.length > 0) {
    restaurant.areas.forEach(a => {
      seatoOccupied += a.seatoOccupied;
      seatoAllocated += a.seatoAllocated;
      walkInOccupied += a.walkInOccupied;
      walkInAllocated += (a.total - a.seatoAllocated);
    });
  } else {
    // Fallback logic
    seatoOccupied = 10;
    seatoAllocated = 10;
    walkInOccupied = 0;
    walkInAllocated = 10;
  }

  const isSeatoFull = seatoAllocated > 0 ? seatoOccupied >= seatoAllocated : true;
  const isWalkinAvailable = walkInOccupied < walkInAllocated;

  return (
    <div className="screen-content" style={{ paddingBottom: 0, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      
      {/* Hero Header */}
      <div style={{ position: 'relative', height: '280px', backgroundImage: `url(${restaurant.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Back & Actions */}
        <div style={{ position: 'absolute', top: '56px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
          <div 
            onClick={onBack}
            style={{ width: '40px', height: '40px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
          >
            <i className="ti ti-arrow-left" style={{ fontSize: '20px' }}></i>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
              <i className="ti ti-heart" style={{ fontSize: '20px' }}></i>
            </div>
            <div style={{ width: '40px', height: '40px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
              <i className="ti ti-share" style={{ fontSize: '20px' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div style={{ flex: 1, background: '#FFFFFF', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', marginTop: '-24px', position: 'relative', zIndex: 5, padding: '24px', overflowY: 'auto', paddingBottom: '120px' }}>
        
        {/* Top Info Section (Name, Type, Distance, Rating, Facilities) */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1B3461', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              {restaurant.name}
            </h1>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: '#64748B' }}>
              {restaurant.type} • {restaurant.distance || '0.8 km'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '15px' }}>
              <span style={{ fontWeight: 800, color: '#1B3461' }}>{restaurant.rating}</span> 
              <span style={{ color: '#64748B', fontWeight: 500 }}>({restaurant.reviewsCount || 342})</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {['WFC Friendly', 'Smoking Indoor', 'Outdoor Area', 'Family Friendly'].map(f => (
              <div key={f} style={{ background: 'transparent', border: '1px solid #E2E8F0', color: '#1B3461', fontSize: '12px', fontWeight: 600, padding: '8px 16px', borderRadius: '20px' }}>
                {f}
              </div>
            ))}
          </div>

          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
            Restoran dan cafe modern dengan suasana yang nyaman, cocok untuk bersantai maupun bekerja. Menawarkan menu spesial yang diracik oleh chef profesional dengan bahan pilihan terbaik.
          </p>
        </div>

        {/* Occupancy & Availability Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          
          {/* Card 1: Current Occupancy */}
          <div style={{ border: '1px solid rgba(249, 115, 22, 0.4)', borderRadius: '16px', padding: '20px 16px', display: 'flex', alignItems: 'center', gap: '16px', background: 'white' }}>
            <div style={{ color: '#1B3461' }}>
              <i className="ti ti-users" style={{ fontSize: '28px' }}></i>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#1B3461', letterSpacing: '0.02em', lineHeight: '1.2' }}>CURRENT<br/>OCCUPANCY</div>
              <div style={{ fontSize: '10px', color: '#64748B', lineHeight: '1.2' }}>(BERDASARKAN<br/>SELURUH KAPASITAS)</div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#F97316' }}>{occPct}% {statusLabel}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Last updated 5 mins ago</div>
            </div>
          </div>

          {/* Card 2: SEATO Reservation Availability */}
          <div style={{ border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '16px', padding: '20px 16px', display: 'flex', alignItems: 'center', gap: '16px', background: 'white' }}>
            <div style={{ color: '#1B3461' }}>
              <i className="ti ti-calendar-event" style={{ fontSize: '28px' }}></i>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#1B3461', letterSpacing: '0.02em', lineHeight: '1.2' }}>SEATO<br/>RESERVATION<br/>AVAILABILITY</div>
              <div style={{ fontSize: '10px', color: '#64748B', lineHeight: '1.2' }}>(KUOTA YANG DAPAT<br/>DIRESERVASI)</div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 700 }}>Seato slots for 19:00</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#EF4444', margin: '2px 0' }}>{isSeatoFull ? 'Full' : 'Available'}</div>
              <div style={{ fontSize: '11px', color: '#1B3461', fontWeight: 700 }}>
                {isWalkinAvailable ? 'Walk-in / Call available' : 'Fully Booked'}
              </div>
            </div>
          </div>

        </div>

        <div className="card flex-row gap-3" style={{ padding: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', background: '#E2E8F0', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B3461' }}>
            <i className="ti ti-map" style={{ fontSize: '20px' }}></i>
          </div>
          <div>
            <p className="text-navy" style={{ fontWeight: 600, marginBottom: '2px' }}>{restaurant.address}</p>
            <p className="text-muted caption">Buka di Maps</p>
          </div>
        </div>

      </div>

      {/* Sticky Bottom CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', padding: '16px 24px 32px', borderTop: '1px solid #E2E8F0', zIndex: 20 }}>
        {isSeatoFull && isWalkinAvailable ? (
          <button 
            className="btn-cta" 
            style={{ background: '#1B3461', color: 'white' }} 
            onClick={() => setShowContactForm(true)}
          >
            Kontak Reservasi Manual
          </button>
        ) : isSeatoFull && !isWalkinAvailable ? (
          <button 
            className="btn-cta" 
            style={{ background: '#E2E8F0', color: '#64748B' }} 
            disabled
          >
            Fully Booked
          </button>
        ) : (
          <button 
            className="btn-cta" 
            style={{ background: '#0EA5A0', color: 'white' }} 
            onClick={() => onBooking(restaurant)}
          >
            Reservasi via SEATO
          </button>
        )}
      </div>

      {/* Contact Manual Modal */}
      {showContactForm && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: 'white', width: '100%', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Reservasi Manual</h3>
              <div onClick={() => setShowContactForm(false)} style={{ width: '32px', height: '32px', background: '#F1F5F9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <i className="ti ti-x"></i>
              </div>
            </div>
            
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: '1.5' }}>
              Kuota reservasi melalui aplikasi SEATO saat ini penuh. Namun, restoran masih memiliki ketersediaan meja untuk Walk-in. Silakan hubungi restoran secara langsung untuk reservasi manual.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <button style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', fontWeight: 600, color: '#1B3461', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', background: '#ECFDF5', color: '#10B981', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-brand-whatsapp" style={{ fontSize: '20px' }}></i>
                </div>
                Hubungi via WhatsApp
              </button>
              <button style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', fontWeight: 600, color: '#1B3461', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', background: '#F1F5F9', color: '#0EA5A0', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-phone" style={{ fontSize: '20px' }}></i>
                </div>
                Telepon Restoran
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
