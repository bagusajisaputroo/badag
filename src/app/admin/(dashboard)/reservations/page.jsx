"use client";
import React from 'react';
import { IconSearch, IconFilter, IconCheck, IconX, IconCalendarEvent, IconClockX, IconCircleCheck } from '@tabler/icons-react';

export default function AdminReservations() {
  const [reservations, setReservations] = React.useState([]);

  React.useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    // Filter by logged-in restaurant
    const restaurantId = localStorage.getItem('partnerRestoId');
    const url = restaurantId 
      ? `/api/admin/reservations?restaurantId=${restaurantId}` 
      : '/api/admin/reservations';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReservations(data);
      })
      .catch(console.error);
  };

  const handleAction = async (id, status, cancelledBy = null) => {
    try {
      const body = { status };
      if (cancelledBy) body.cancelledBy = cancelledBy;
      
      await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      fetchReservations(); // Refresh
    } catch(e) {
      console.error(e);
    }
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'chip-confirmed';
      case 'Selesai': return 'chip-confirmed';
      case 'Dibatalkan': return 'chip-cancelled';
      case 'Ditolak Restoran': return 'chip-cancelled';
      default: return 'chip-waiting';
    }
  };

  return (
    <div className="screen-content" style={{ background: '#F8FAFC' }}>
      <div style={{ background: 'white', padding: '64px 20px 24px', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 30 }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Reservations</h1>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: '12px', padding: '0 12px', height: '40px' }}>
            <IconSearch size={16} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Search..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', fontSize: '13px', width: '100%' }}
            />
          </div>
          <button style={{ width: '40px', height: '40px', background: '#1B3461', color: 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconFilter size={18} />
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reservations.map((res) => (
          <div key={res.id} style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span className={`chip ${getStatusChipClass(res.status)}`}>
                  {res.status}
                </span>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>#{res.id.substring(0, 8)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Rp {res.totalAmount?.toLocaleString() || '-'}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{res.paymentStatus}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B3461' }}>
                  <IconCalendarEvent size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{res.user?.name || 'Guest'}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{res.date} • {res.time} • {res.guests} Pax • {res.tableType}</div>
                </div>
              </div>
              
              {/* Show cancel reason if exists */}
              {res.cancelReason && (
                <div style={{ fontSize: '12px', color: '#EF4444', background: '#FEF2F2', padding: '8px 12px', borderRadius: '8px', marginTop: '4px' }}>
                  <strong>Alasan:</strong> {res.cancelReason}
                  {res.cancelledBy && (
                    <span style={{ color: '#64748B', marginLeft: '8px' }}>
                      (oleh {res.cancelledBy === 'user' ? 'User' : res.cancelledBy === 'admin' ? 'Admin' : 'Sistem'})
                    </span>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px dashed #E2E8F0', paddingTop: '16px' }}>
              {/* Menunggu Konfirmasi: Approve + Reject */}
              {res.status === 'Menunggu Konfirmasi' && (
                <>
                  <button onClick={() => handleAction(res.id, 'Confirmed')} style={{ flex: 1, padding: '10px', background: '#DCFCE7', color: '#16A34A', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
                    <IconCheck size={16} /> Approve
                  </button>
                  <button onClick={() => handleAction(res.id, 'Ditolak Restoran', 'admin')} style={{ flex: 1, padding: '10px', background: '#FEF3C7', color: '#92400E', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
                    <IconX size={16} /> Reject
                  </button>
                </>
              )}
              
              {/* Confirmed: Selesaikan button */}
              {res.status === 'Confirmed' && (
                <button onClick={() => handleAction(res.id, 'Selesai')} style={{ flex: 1, padding: '10px', background: '#DBEAFE', color: '#1D4ED8', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
                  <IconCircleCheck size={16} /> Selesaikan
                </button>
              )}
            </div>
          </div>
        ))}
        {reservations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
            <p>No reservations found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
