import React from 'react';
import { prisma } from '../../../lib/prisma';
import { IconUsers, IconCalendarStats, IconStar, IconReceipt2, IconTrendingUp } from '@tabler/icons-react';

export default async function PartnerDashboard() {
  // Simulate fetching data for this specific partner's restaurant
  const partnerRestoId = '1'; // In a real app, this comes from session/auth

  const totalReservations = await prisma.reservation.count();
  const totalPromos = await prisma.promoBanner.count();
  
  // Fake revenue metric for demo
  const revenueToday = 2450000;

  const recentReservations = await prisma.reservation.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return (
    <div className="screen-content" style={{ background: '#F8FAFC' }}>
      <div style={{ background: 'linear-gradient(135deg, #1B3461 0%, #0EA5A0 100%)', padding: '64px 20px 32px', color: 'white', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>Soto Kudus Menara</h1>
        <p style={{ opacity: 0.9, fontSize: '13px', marginTop: '4px' }}>Overview & performance today.</p>
      </div>

      <div style={{ padding: '20px', marginTop: '-20px' }}>
        {/* Metric Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#64748B' }}>
              <IconCalendarStats size={16} color="#0EA5A0" />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Reservations Today</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>{totalReservations + 12}</div>
          </div>
          
          <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#64748B' }}>
              <IconReceipt2 size={16} color="#0EA5A0" />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Revenue Today</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Rp 2.45M</div>
          </div>

          <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#64748B' }}>
              <IconStar size={16} color="#0EA5A0" />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Rating</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>4.8</div>
          </div>

          {/* <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#64748B' }}>
              <IconUsers size={16} color="#0EA5A0" />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Waitlist</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>2 Pax</div>
          </div> */}
        </div>

        {/* BI Mini Chart */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Revenue Trend (This Week)</h2>
            <IconTrendingUp size={18} color="#0EA5A0" />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', paddingTop: '16px', borderTop: '1px dashed #E2E8F0' }}>
            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '10%' }}>
                <div style={{ 
                  width: '100%', 
                  background: 'linear-gradient(180deg, #0EA5A0 0%, rgba(14, 165, 160, 0.2) 100%)', 
                  height: `${h}%`,
                  borderRadius: '4px',
                  minHeight: '8px'
                }}></div>
                <span style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 600 }}>{['Sn','Mn','Tu','Wd','Th','Fr','St'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Incoming Bookings List */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Recent Bookings</h2>
            <span style={{ fontSize: '12px', color: '#0EA5A0', fontWeight: 600 }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentReservations.map((res) => (
              <div key={res.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{res.user?.name || 'Guest'}</span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{res.time} • {res.guests} Pax • {res.date}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`chip ${res.status === 'Confirmed' ? 'chip-confirmed' : res.status === 'Dibatalkan' ? 'chip-cancelled' : 'chip-waiting'}`}>
                    {res.status}
                  </span>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#0EA5A0', marginTop: '4px' }}>#{res.id.substring(0, 6)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
