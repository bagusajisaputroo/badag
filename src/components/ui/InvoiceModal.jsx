import React from 'react';
import QRCode from 'react-qr-code';

export default function InvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={onClose} style={{ zIndex: 100 }}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{ padding: '24px 20px', transform: 'translateY(0)', transition: 'transform 0.3s' }}>
        <div className="flex-row justify-between" style={{ marginBottom: '24px' }}>
          <h1 className="text-navy" style={{ fontSize: '20px' }}>E-Tiket & Invoice</h1>
          <i className="ti ti-x" style={{ fontSize: '24px', cursor: 'pointer', color: '#64748B' }} onClick={onClose}></i>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '16px', display: 'inline-block', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <QRCode value={invoice.invoiceId || invoice.id} size={180} fgColor="#1B3461" />
          </div>
          <p className="caption" style={{ marginTop: '12px' }}>Tunjukkan QR ini ke staf restoran</p>
        </div>

        <div className="card" style={{ background: '#F8FAFC', border: 'none', marginBottom: '24px' }}>
          <h2 className="text-navy" style={{ marginBottom: '16px', borderBottom: '1px dashed #CBD5E1', paddingBottom: '12px' }}>{invoice.restaurantName}</h2>
          <div className="flex-row justify-between" style={{ marginBottom: '8px' }}>
            <span className="text-muted" style={{ fontSize: '13px' }}>Invoice ID</span>
            <span className="text-navy" style={{ fontWeight: 600, fontSize: '13px' }}>{invoice.invoiceId || 'INV-PENDING'}</span>
          </div>
          <div className="flex-row justify-between" style={{ marginBottom: '8px' }}>
            <span className="text-muted" style={{ fontSize: '13px' }}>Tanggal & Waktu</span>
            <span className="text-navy" style={{ fontWeight: 600, fontSize: '13px' }}>{invoice.date}, {invoice.time}</span>
          </div>
          <div className="flex-row justify-between" style={{ marginBottom: '8px' }}>
            <span className="text-muted" style={{ fontSize: '13px' }}>Detail Tamu</span>
            <span className="text-navy" style={{ fontWeight: 600, fontSize: '13px' }}>{invoice.guests} Org • {invoice.tableType}</span>
          </div>
          <div className="flex-row justify-between" style={{ marginBottom: '8px' }}>
            <span className="text-muted" style={{ fontSize: '13px' }}>Status Pembayaran</span>
            <span style={{ fontWeight: 600, fontSize: '13px', color: invoice.paymentStatus === 'Paid' ? '#0EA5A0' : '#F59E0B' }}>{invoice.paymentStatus || 'Unpaid'}</span>
          </div>
          <div className="flex-row justify-between" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #CBD5E1' }}>
            <span className="text-navy" style={{ fontWeight: 700 }}>Total Tagihan</span>
            <span className="text-navy" style={{ fontWeight: 700, fontSize: '18px' }}>Rp {invoice.totalAmount ? invoice.totalAmount.toLocaleString('id-ID') : '0'}</span>
          </div>
        </div>

        <button className="btn-cta" onClick={onClose}>Tutup</button>
      </div>
    </div>
  );
}
