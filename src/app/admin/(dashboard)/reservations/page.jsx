import React from 'react';
import { prisma } from '../../../../lib/prisma';
import { IconSearch, IconFilter, IconCheck, IconX, IconCalendarEvent } from '@tabler/icons-react';

export default async function AdminReservations() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: 'desc' },
    include: { restaurant: true, user: true }
  });

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
                <span className={`chip ${
                  res.status === 'Confirmed' ? 'chip-confirmed' :
                  res.status === 'Selesai' ? 'chip-confirmed' :
                  res.status === 'Dibatalkan' ? 'chip-cancelled' : 'chip-waiting'
                }`}>
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
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{res.date} • {res.time} • {res.guests} Pax</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px dashed #E2E8F0', paddingTop: '16px' }}>
              <button style={{ flex: 1, padding: '10px', background: '#DCFCE7', color: '#16A34A', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <IconCheck size={16} /> Approve
              </button>
              <button style={{ flex: 1, padding: '10px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <IconX size={16} /> Reject
              </button>
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
