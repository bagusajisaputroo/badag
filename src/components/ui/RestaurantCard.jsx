import React from 'react';

export default function RestaurantCard({ variant = 'horizontal', data, onAction }) {
  if (variant === 'vertical') {
    return (
      <div className="card resto-card-v flex-col gap-2" onClick={() => onAction && onAction(data)}>
        <div 
          className="img-placeholder" 
          style={{ height: '100px', backgroundImage: `url(${data.imageUrl})` }}
        >
        </div>
        <h2 className="text-navy" style={{ lineHeight: '1.2' }}>{data.name}</h2>
        <p className="caption">{data.city}</p>
        <div className="flex-row justify-between" style={{ marginTop: 'auto' }}>
          <span className="text-navy" style={{ fontWeight: 600, fontSize: '11px' }}>★ {data.rating}</span>
        </div>
      </div>
    );
  }

  if (variant === 'explore') {
    return (
      <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => onAction && onAction(data)}>
        <div 
          className="img-placeholder" 
          style={{ height: '140px', borderRadius: 0, backgroundImage: `url(${data.imageUrl})` }}
        >
        </div>
        <div style={{ padding: '16px' }}>
          <div className="flex-row justify-between" style={{ alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h2 className="text-navy">{data.name}</h2>
              <p className="caption" style={{ marginTop: '4px' }}>{data.address} • {data.distance}</p>
            </div>
          </div>
          <div className="flex-row gap-2">
            <span className="chip" style={{ background: '#F1F5F9', color: '#64748B' }}>{data.type}</span>
            <span className="text-navy" style={{ fontWeight: 600, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="ti ti-star-filled" style={{ color: '#FACC15' }}></i> {data.rating} ({data.reviewsCount} ulasan)
            </span>
          </div>
        </div>
      </div>
    );
  }

  // default horizontal
  return (
    <div className="card resto-card-h" onClick={() => onAction && onAction(data)}>
      <div 
        className="img-placeholder" 
        style={{ width: '80px', height: '80px', backgroundImage: `url(${data.imageUrl})` }}
      >
      </div>
      <div className="flex-col justify-between" style={{ flex: 1 }}>
        <div>
          <h2 className="text-navy">{data.name}</h2>
          <p className="caption">{data.city} • {data.type}</p>
        </div>
        <div className="flex-row justify-between" style={{ alignItems: 'flex-end' }}>
          <div className="flex-row gap-2">
            <span className="text-navy" style={{ fontWeight: 600, fontSize: '11px' }}>★ {data.rating}</span>
            <span className="caption">• {data.distance}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
