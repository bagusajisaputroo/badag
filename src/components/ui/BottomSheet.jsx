import React, { useState } from 'react';

export default function BottomSheet({ isOpen, onClose, title, onConfirm }) {
  const [guests, setGuests] = useState(2);
  const [tableType, setTableType] = useState('Indoor');
  const [selectedTime, setSelectedTime] = useState('19:00');

  if (!isOpen) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={onClose} style={{ zIndex: 100 }}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{ padding: '24px 20px 32px', height: '85%', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ width: '40px', height: '4px', background: '#E2E8F0', borderRadius: '2px', margin: '0 auto 16px', flexShrink: 0 }}></div>
        
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '24px' }}>
          <h1 className="text-navy" style={{ marginBottom: '4px', fontSize: '20px' }}>Reservasi Meja</h1>
          <p className="text-muted" style={{ marginBottom: '24px' }}>{title}</p>
          
          {/* Guests Section */}
          <h2 className="text-navy" style={{ marginBottom: '12px' }}>Jumlah Tamu</h2>
          <div className="flex-row justify-between card" style={{ padding: '12px 16px', marginBottom: '24px' }}>
            <span className="text-navy" style={{ fontWeight: 600 }}>Orang</span>
            <div className="flex-row gap-4">
              <button 
                onClick={() => setGuests(Math.max(1, guests - 1))}
                style={{ width: '32px', height: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', background: 'white', color: '#1B3461', fontSize: '18px', cursor: 'pointer' }}
              >-</button>
              <span className="text-navy" style={{ fontWeight: 700, width: '20px', textAlign: 'center' }}>{guests}</span>
              <button 
                onClick={() => setGuests(guests + 1)}
                style={{ width: '32px', height: '32px', borderRadius: '16px', border: 'none', background: '#F1F5F9', color: '#1B3461', fontSize: '18px', cursor: 'pointer' }}
              >+</button>
            </div>
          </div>

          {/* Table Type Section */}
          <h2 className="text-navy" style={{ marginBottom: '12px' }}>Area Meja</h2>
          <div className="flex-row gap-3" style={{ marginBottom: '24px' }}>
            {['Indoor', 'Outdoor', 'Rooftop'].map(type => (
              <div 
                key={type} 
                onClick={() => setTableType(type)}
                className="card" 
                style={{ 
                  flex: 1, textAlign: 'center', cursor: 'pointer',
                  borderColor: tableType === type ? '#1B3461' : '#E2E8F0', 
                  background: tableType === type ? '#F8FAFC' : 'white' 
                }}
              >
                <p className="text-navy" style={{ fontWeight: 600, fontSize: '13px' }}>{type}</p>
              </div>
            ))}
          </div>

          {/* Date Section */}
          <h2 className="text-navy" style={{ marginBottom: '12px' }}>Tanggal</h2>
          <div className="flex-row gap-3" style={{ marginBottom: '24px' }}>
            <div className="card" style={{ flex: 1, textAlign: 'center', borderColor: '#1B3461', background: '#F8FAFC', cursor: 'pointer' }}>
              <p className="text-navy" style={{ fontWeight: 600 }}>Hari Ini</p>
              <p className="caption">15 Mei</p>
            </div>
            <div className="card" style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}>
              <p className="text-navy" style={{ fontWeight: 600 }}>Besok</p>
              <p className="caption">16 Mei</p>
            </div>
            <div className="card" style={{ flex: 1, textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-navy flex-row gap-2" style={{ fontWeight: 600 }}>Pilih <i className="ti ti-calendar" style={{ fontSize: '14px', color: '#64748B' }}></i></p>
            </div>
          </div>

          {/* Time Section */}
          <h2 className="text-navy" style={{ marginBottom: '12px' }}>Waktu</h2>
          <div className="horizontal-scroll" style={{ padding: '0 0 24px', margin: '0 -20px' }}>
            <div style={{ padding: '0 20px', display: 'flex', gap: '12px' }}>
              {['18:00', '18:30', '19:00', '19:30', '20:00'].map(t => (
                <div 
                  key={t} 
                  onClick={() => setSelectedTime(t)}
                  className={`chip ${t === selectedTime ? 'active' : ''}`} 
                  style={{ 
                    padding: '10px 16px', fontSize: '13px', border: '1px solid #E2E8F0', 
                    background: t === selectedTime ? '#1B3461' : 'white', 
                    color: t === selectedTime ? 'white' : '#1B3461', cursor: 'pointer'
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <h2 className="text-navy" style={{ marginBottom: '12px' }}>Catatan Khusus (Opsional)</h2>
          <textarea 
            placeholder="Contoh: Ada yang ulang tahun, minta kursi bayi..."
            style={{ width: '100%', height: '80px', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '12px', fontSize: '13px', outline: 'none', resize: 'none', fontFamily: 'Inter' }}
          ></textarea>
        </div>

        <div style={{ flexShrink: 0, marginTop: '16px' }}>
          <button className="btn-cta" onClick={onConfirm}>Konfirmasi Booking</button>
        </div>
      </div>
    </div>
  );
}
