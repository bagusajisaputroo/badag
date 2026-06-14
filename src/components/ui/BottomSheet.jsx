import React, { useState, useEffect } from 'react';

export default function BottomSheet({ isOpen, onClose, title, onConfirm }) {
  const [guests, setGuests] = useState(2);
  const [tableType, setTableType] = useState('Indoor');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('19:00');

  const allDates = React.useMemo(() => {
    const dates = [];
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayName = i === 0 ? 'Hari Ini' : i === 1 ? 'Besok' : days[d.getDay()];
      dates.push({
        dayName: dayName,
        dateNum: d.getDate(),
        month: months[d.getMonth()],
        fullDate: d.toISOString().split('T')[0]
      });
    }
    return dates;
  }, []);

  const allTimes = React.useMemo(() => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const h = i.toString().padStart(2, '0');
      // Create some realistic unavailability patterns
      const available00 = !(i >= 2 && i <= 6) && i !== 14 && i !== 18;
      const available30 = !(i >= 2 && i <= 6) && i !== 12 && i !== 19;
      times.push({ time: `${h}:00`, available: available00 });
      times.push({ time: `${h}:30`, available: available30 });
    }
    times.push({ time: '00:00', available: true }); // 00:00 besoknya
    return times;
  }, []);

  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setStartY(null);
      setCurrentY(0);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const dragOffset = startY !== null ? Math.max(0, currentY - startY) : 0;
  const translateY = isClosing ? '100%' : `${dragOffset}px`;
  const transition = startY !== null ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <div className="bottom-sheet-overlay" onClick={handleClose} style={{ zIndex: 100 }}>
      <div 
        className="bottom-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          padding: '24px 20px 32px', height: '85%', display: 'flex', flexDirection: 'column',
          transform: `translateY(${translateY})`,
          transition: transition
        }}
      >
        
        <div 
          onPointerDown={(e) => { 
            e.currentTarget.setPointerCapture(e.pointerId); 
            setStartY(e.clientY); 
            setCurrentY(e.clientY);
          }}
          onPointerMove={(e) => {
            if (startY !== null) {
              setCurrentY(e.clientY);
            }
          }}
          onPointerUp={(e) => {
            e.currentTarget.releasePointerCapture(e.pointerId);
            if (startY !== null && e.clientY - startY > 80) {
              handleClose();
            } else {
              setStartY(null);
              setCurrentY(0);
            }
          }}
          onClick={handleClose}
          style={{ padding: '16px 0', marginTop: '-16px', cursor: 'grab', display: 'flex', justifyContent: 'center', flexShrink: 0 }}
        >
          <div style={{ width: '40px', height: '4px', background: '#E2E8F0', borderRadius: '2px' }}></div>
        </div>
        
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
          <div className="horizontal-scroll" style={{ padding: '0 0 24px', margin: '0 -20px' }}>
            <div style={{ padding: '0 20px', display: 'flex', gap: '12px' }}>
              {allDates.map(d => (
                <div 
                  key={d.fullDate} 
                  onClick={() => setSelectedDate(d.fullDate)}
                  className={`card ${d.fullDate === selectedDate ? 'active' : ''}`}
                  style={{ 
                    flexShrink: 0, width: '72px', textAlign: 'center', cursor: 'pointer', padding: '12px 8px',
                    borderColor: d.fullDate === selectedDate ? '#1B3461' : '#E2E8F0',
                    background: d.fullDate === selectedDate ? '#1B3461' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <p style={{ fontWeight: 600, fontSize: '11px', color: d.fullDate === selectedDate ? '#93C5FD' : '#64748B', marginBottom: '4px' }}>{d.dayName}</p>
                  <p style={{ fontWeight: 700, fontSize: '20px', color: d.fullDate === selectedDate ? 'white' : '#1B3461', lineHeight: 1, marginBottom: '4px' }}>{d.dateNum}</p>
                  <p style={{ fontSize: '11px', color: d.fullDate === selectedDate ? '#CBD5E1' : '#64748B' }}>{d.month}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Time Section */}
          <h2 className="text-navy" style={{ marginBottom: '12px' }}>Waktu</h2>
          
          <div style={{ textAlign: 'center', marginBottom: '16px', background: '#F8FAFC', borderRadius: '12px', padding: '16px' }}>
             <h1 style={{ fontSize: '32px', color: '#1B3461', letterSpacing: '2px', fontWeight: 700 }}>{selectedTime}</h1>
             <p className="caption">Waktu reservasi yang dipilih</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {allTimes.map(t => (
                <div 
                  key={t.time} 
                  onClick={() => t.available && setSelectedTime(t.time)}
                  className={`chip ${t.time === selectedTime ? 'active' : ''}`} 
                  style={{ 
                    padding: '10px 0', fontSize: '13px', textAlign: 'center',
                    border: '1px solid ' + (t.time === selectedTime ? '#1B3461' : t.available ? '#E2E8F0' : '#F1F5F9'), 
                    background: t.time === selectedTime ? '#1B3461' : t.available ? 'white' : '#F8FAFC', 
                    color: t.time === selectedTime ? 'white' : t.available ? '#1B3461' : '#CBD5E1', 
                    cursor: t.available ? 'pointer' : 'not-allowed',
                    opacity: t.available ? 1 : 0.6
                  }}
                >
                  {t.time}
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
          <button className="btn-cta" onClick={() => onConfirm({ guests, tableType, date: selectedDate, time: selectedTime })}>Konfirmasi Booking</button>
        </div>
      </div>
    </div>
  );
}
