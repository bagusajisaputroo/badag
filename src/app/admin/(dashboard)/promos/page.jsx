import React from 'react';
import { prisma } from '../../../../lib/prisma';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';

export default async function AdminPromos() {
  const promos = await prisma.promoBanner.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="screen-content" style={{ background: '#F8FAFC' }}>
      <div style={{ background: 'white', padding: '64px 20px 24px', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Promos</h1>
          <button style={{ width: '40px', height: '40px', background: '#0EA5A0', color: 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconPlus size={20} />
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {promos.map((promo) => (
          <div key={promo.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0' }}>
            <div 
              style={{
                height: '140px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: 'white',
                background: promo.imageUrl 
                  ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${promo.imageUrl}) center/cover` 
                  : promo.color
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{promo.title}</h2>
              <p style={{ fontSize: '13px', opacity: 0.9 }}>{promo.subtitle}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', padding: '16px' }}>
              <button style={{ flex: 1, padding: '10px', background: '#F1F5F9', color: '#1B3461', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <IconEdit size={16} /> Edit
              </button>
              <button style={{ flex: 1, padding: '10px', background: '#FEE2E2', color: '#E11D48', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <IconTrash size={16} /> Delete
              </button>
            </div>
          </div>
        ))}

        {promos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
            <p>No promos available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
