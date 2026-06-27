"use client";
import React, { useEffect, useState } from 'react';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

export default function PartnerDashboardBI() {
  const [partnerRestoId, setPartnerRestoId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('partnerRestoId');
    if (!id) {
      window.location.href = '/admin/login';
    } else {
      setPartnerRestoId(id);
    }
  }, []);

  if (!partnerRestoId) return null;

  return (
    <div style={{ padding: '32px 40px', background: '#F8FAFC', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
          Business Intelligence
        </h1>
        <p style={{ color: '#64748B', fontSize: '15px', margin: 0 }}>
          Overview of your restaurant's performance and customer flow.
        </p>
      </div>

      {/* Top Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <MetricCard title="Total Views" value="2,450" change="+18.9%" isPositive={true} />
        <MetricCard title="Profile Visits" value="420" change="-12.3%" isPositive={false} />
        <MetricCard title="Reservations" value="128" change="+9.1%" isPositive={true} />
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '20px', marginBottom: '24px' }}>
        
        {/* Funnel Chart */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '32px' }}>Views & Click Flow</h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <FunnelStep width="100%" label="Views" value="2,450" color="#93C5FD" opacity={0.6} />
            <FunnelStep width="80%" label="Profile Visits" value="420 (17.1%)" color="#60A5FA" opacity={0.7} />
            <FunnelStep width="60%" label="Reservations" value="128 (5.2%)" color="#3B82F6" opacity={0.8} />
            <FunnelStep width="40%" label="Actual Arrivals" value="98 (3.9%)" color="#2563EB" opacity={0.9} />
          </div>
        </div>

        {/* Heatmap Chart */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Peak Hours</h2>
          <Heatmap />
        </div>

        {/* Top Keywords */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Top Keywords</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <KeywordRow keyword="WFC Friendly" value="1,250" />
            <KeywordRow keyword="Smoking Indoor" value="980" />
            <KeywordRow keyword="Outdoor" value="870" />
            <KeywordRow keyword="Live Music" value="640" />
            <KeywordRow keyword="Private Room" value="320" />
          </div>
        </div>

      </div>

      {/* Bottom Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <BottomCard title="Busiest Day" value="Sabtu" valueColor="#1E3A8A" />
        <BottomCard title="Quietest Day" value="Selasa" valueColor="#1E3A8A" />
        <BottomCard title="Avg. Occupancy" value="68%" valueColor="#0EA5A0" />
        <BottomCard title="Conversion Rate" value="3.9%" valueColor="#0F172A" />
      </div>
    </div>
  );
}

// --- COMPONENTS ---

function MetricCard({ title, value, change, isPositive }) {
  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
      <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 600, marginBottom: '12px' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', letterSpacing: '-1px' }}>{value}</div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700,
          color: isPositive ? '#10B981' : '#EF4444',
          background: isPositive ? '#ECFDF5' : '#FEF2F2',
          padding: '4px 8px', borderRadius: '20px'
        }}>
          {change}
        </div>
      </div>
    </div>
  );
}

function FunnelStep({ width, label, value, color, opacity }) {
  return (
    <div style={{ 
      width: width, 
      height: '60px', 
      background: color, 
      opacity: opacity,
      borderTopLeftRadius: '8px', 
      borderTopRightRadius: '8px',
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      marginBottom: '2px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9 }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function Heatmap() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = ['08:00', '12:00', '16:00', '20:00', '22:00'];
  
  // Mock data for heatmap intensity (0 to 1)
  const data = [
    [0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.4], // 08:00
    [0.3, 0.4, 0.4, 0.5, 0.6, 0.8, 0.7], // 12:00
    [0.2, 0.3, 0.3, 0.4, 0.5, 0.7, 0.6], // 16:00
    [0.5, 0.6, 0.6, 0.7, 0.9, 1.0, 0.9], // 20:00
    [0.3, 0.4, 0.3, 0.4, 0.6, 0.8, 0.6], // 22:00
  ];

  const getColor = (intensity) => {
    // Gradient from pale blue to dark red based on intensity
    if (intensity < 0.3) return `rgba(147, 197, 253, ${intensity * 2})`; // Light blue
    if (intensity < 0.6) return `rgba(251, 146, 60, ${intensity})`; // Orange
    return `rgba(220, 38, 38, ${intensity})`; // Red
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* X Axis (Days) */}
      <div style={{ display: 'flex', marginLeft: '48px', marginBottom: '8px' }}>
        {days.map(d => (
          <div key={d} style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{d}</div>
        ))}
      </div>
      
      {/* Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {times.map((time, rIndex) => (
          <div key={time} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '40px', fontSize: '12px', color: '#64748B', fontWeight: 600, textAlign: 'right', marginRight: '8px' }}>
              {time}
            </div>
            <div style={{ display: 'flex', flex: 1, gap: '4px' }}>
              {data[rIndex].map((intensity, cIndex) => (
                <div key={cIndex} style={{ 
                  flex: 1, 
                  aspectRatio: '1.2', 
                  backgroundColor: getColor(intensity),
                  borderRadius: '4px',
                  border: '1px solid rgba(0,0,0,0.05)'
                }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', gap: '12px' }}>
        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Low</span>
        <div style={{ width: '120px', height: '8px', background: 'linear-gradient(90deg, rgba(147,197,253,0.3) 0%, rgba(251,146,60,0.6) 50%, rgba(220,38,38,1) 100%)', borderRadius: '4px' }}></div>
        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>High</span>
      </div>
    </div>
  );
}

function KeywordRow({ keyword, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{keyword}</div>
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{value}</div>
    </div>
  );
}

function BottomCard({ title, value, valueColor }) {
  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 600, marginBottom: '16px' }}>{title}</div>
      <div style={{ fontSize: '24px', fontWeight: 800, color: valueColor, letterSpacing: '-0.5px' }}>{value}</div>
    </div>
  );
}
