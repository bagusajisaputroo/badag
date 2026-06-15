import React, { useState, useEffect } from 'react';
import { DatePickerInput } from '@mantine/dates';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import 'dayjs/locale/id';

export default function BottomSheet({ isOpen, onClose, title, onConfirm }) {
  const [guests, setGuests] = useState('');
  const [tableType, setTableType] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);

  const allTimes = React.useMemo(() => {
    const times = [];
    for (let i = 12; i <= 21; i++) {
      const h = i.toString().padStart(2, '0');
      // Create some realistic unavailability patterns
      const available00 = i !== 14 && i !== 18;
      times.push({ time: `${h}:00`, available: available00 });
      
      if (i < 21) {
        const available30 = i !== 12 && i !== 19;
        times.push({ time: `${h}:30`, available: available30 });
      }
    }
    return times;
  }, []);

  const areas = [
    {
      id: 'Indoor',
      name: 'Indoor',
      images: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Area di dalam ruangan dengan AC dan suasana cozy.'
    },
    {
      id: 'Outdoor',
      name: 'Outdoor',
      images: [
        'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Area luar ruangan yang sejuk dan asri.'
    },
    {
      id: 'Rooftop',
      name: 'Rooftop',
      images: [
        'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513622470522-26c311a0711a?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Pemandangan kota yang indah dari atas gedung.'
    }
  ];

  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setStartY(null);
      setCurrentY(0);
      setIsAreaModalOpen(false);
      setLightboxOpen(false);
      // Reset form data when opened
      setGuests('');
      setTableType('');
      setSelectedDate(null);
      setSelectedTime('');
      setNotes('');
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirmClick = () => {
    if (!selectedDate || !guests || guests <= 0 || !selectedTime || !tableType) {
      alert('Mohon lengkapi Tanggal, Jumlah Tamu, Waktu, dan Area Meja.');
      return;
    }
    const d = new Date(selectedDate);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    onConfirm({ guests: parseInt(guests), tableType, date: dateStr, time: selectedTime, notes });
  };

  if (!isOpen) return null;

  const dragOffset = startY !== null ? Math.max(0, currentY - startY) : 0;
  const translateY = isClosing ? '100%' : `${dragOffset}px`;
  const transition = startY !== null ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <>
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
          
          {isAreaModalOpen ? (
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button 
                  onClick={() => setIsAreaModalOpen(false)} 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginRight: '16px', display: 'flex', alignItems: 'center' }}
                >
                  <i className="ti ti-arrow-left" style={{ fontSize: '24px', color: '#1B3461' }}></i>
                </button>
                <h1 className="text-navy" style={{ fontSize: '20px', margin: 0 }}>Pilih Area Meja</h1>
              </div>
              <p className="caption text-muted" style={{ marginBottom: '16px' }}>Geser untuk melihat foto lain, ketuk foto untuk memperbesar.</p>
              
              <div className="flex-col gap-4">
                {areas.map(area => (
                  <div 
                    key={area.id} 
                    className={`card ${tableType === area.id ? 'active' : ''}`}
                    style={{ padding: '0', overflow: 'hidden', border: tableType === area.id ? '2px solid #1B3461' : '1px solid #E2E8F0' }}
                  >
                    <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '12px', gap: '12px' }}>
                      {area.images.map((img, idx) => (
                        <img 
                          key={idx}
                          src={img} 
                          alt={`${area.name} ${idx + 1}`} 
                          style={{ width: '85%', height: '160px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, scrollSnapAlign: 'center', cursor: 'zoom-in' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxImages(area.images.map(src => ({ src })));
                            setLightboxIndex(idx);
                            setLightboxOpen(true);
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ padding: '0 16px 16px' }}>
                      <h3 className="text-navy" style={{ marginBottom: '4px' }}>{area.name}</h3>
                      <p className="caption text-muted" style={{ marginBottom: '16px' }}>{area.description}</p>
                      <button 
                        className="btn-cta" 
                        style={{ height: '40px', fontSize: '13px' }}
                        onClick={() => {
                          setTableType(area.id);
                          setIsAreaModalOpen(false);
                        }}
                      >
                        Pilih {area.name}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '24px' }}>
                <h1 className="text-navy" style={{ marginBottom: '4px', fontSize: '20px' }}>Reservasi Meja</h1>
                <p className="text-muted" style={{ marginBottom: '24px' }}>{title}</p>
                
                {/* Date Section */}
                <h2 className="text-navy" style={{ marginBottom: '12px' }}>Tanggal <span style={{color: 'red'}}>*</span></h2>
                <div style={{ marginBottom: '24px' }}>
                  {(() => {
                    const today = new Date();
                    const maxDate = new Date();
                    maxDate.setDate(today.getDate() + 7);
                    return (
                      <DatePickerInput 
                        locale="id"
                        placeholder="Ketuk untuk memilih tanggal"
                        valueFormat="DD MMMM YYYY"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        minDate={today}
                        maxDate={maxDate}
                        popoverProps={{ withinPortal: false }}
                        styles={{
                          input: {
                            padding: '24px 16px',
                            borderRadius: '12px',
                            border: '1px solid #E2E8F0',
                            fontSize: '15px',
                            fontFamily: 'Inter',
                            color: '#1B3461',
                            fontWeight: 600,
                            textAlign: 'center',
                            cursor: 'pointer'
                          }
                        }}
                      />
                    );
                  })()}
                </div>
  
                {/* Guests Section */}
                <h2 className="text-navy" style={{ marginBottom: '12px' }}>Jumlah Tamu <span style={{color: 'red'}}>*</span></h2>
                <div className="flex-row justify-between card" style={{ padding: '12px 16px', marginBottom: '24px' }}>
                  <span className="text-navy" style={{ fontWeight: 600 }}>Orang</span>
                  <div className="flex-row gap-4">
                    <button 
                      onClick={() => setGuests(Math.max(1, (parseInt(guests) || 0) - 1))}
                      style={{ width: '32px', height: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', background: 'white', color: '#1B3461', fontSize: '18px', cursor: 'pointer' }}
                    >-</button>
                    <input 
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      style={{ width: '40px', textAlign: 'center', border: 'none', fontSize: '16px', fontWeight: 700, color: '#1B3461', outline: 'none', background: 'transparent' }}
                      placeholder="0"
                    />
                    <button 
                      onClick={() => setGuests((parseInt(guests) || 0) + 1)}
                      style={{ width: '32px', height: '32px', borderRadius: '16px', border: 'none', background: '#F1F5F9', color: '#1B3461', fontSize: '18px', cursor: 'pointer' }}
                    >+</button>
                  </div>
                </div>
  
                {/* Time Section */}
                <h2 className="text-navy" style={{ marginBottom: '12px' }}>Waktu <span style={{color: 'red'}}>*</span></h2>
                
                <div style={{ textAlign: 'center', marginBottom: '16px', background: '#F8FAFC', borderRadius: '12px', padding: '16px' }}>
                   <h1 style={{ fontSize: '32px', color: '#1B3461', letterSpacing: '2px', fontWeight: 700 }}>{selectedTime || '--:--'}</h1>
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
  
                {/* Table Type Section */}
                <h2 className="text-navy" style={{ marginBottom: '12px' }}>Area Meja <span style={{color: 'red'}}>*</span></h2>
                <div style={{ marginBottom: '24px' }}>
                  {tableType ? (
                    <div 
                      className="card flex-row justify-between align-center" 
                      style={{ padding: '16px', border: '1px solid #1B3461', background: '#F8FAFC', cursor: 'pointer' }}
                      onClick={() => setIsAreaModalOpen(true)}
                    >
                      <div className="flex-row gap-3 align-center" style={{ flex: 1 }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#E2E8F0', overflow: 'hidden', flexShrink: 0 }}>
                          <img 
                            src={areas.find(a => a.id === tableType)?.images[0] || areas[0].images[0]} 
                            alt={tableType} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <p className="text-navy" style={{ fontWeight: 600 }}>{tableType}</p>
                          <p className="caption text-muted">Area yang dipilih</p>
                        </div>
                      </div>
                      <button className="btn-outline-navy" style={{ padding: '6px 12px', fontSize: '12px', flexShrink: 0 }}>Ubah</button>
                    </div>
                  ) : (
                    <button 
                      className="btn-outline-navy" 
                      style={{ width: '100%', padding: '16px', borderStyle: 'dashed' }}
                      onClick={() => setIsAreaModalOpen(true)}
                    >
                      <i className="ti ti-photo" style={{ marginRight: '8px' }}></i>
                      Pilih Area
                    </button>
                  )}
                </div>
  
                {/* Special Requests */}
                <h2 className="text-navy" style={{ marginBottom: '12px' }}>Catatan Khusus (Opsional)</h2>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Ada yang ulang tahun, minta kursi bayi..."
                  style={{ width: '100%', height: '80px', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '12px', fontSize: '13px', outline: 'none', resize: 'none', fontFamily: 'Inter' }}
                ></textarea>
              </div>
  
              <div style={{ flexShrink: 0, marginTop: '16px' }}>
                <button className="btn-cta" onClick={handleConfirmClick}>Konfirmasi Booking</button>
              </div>
            </>
          )}
        </div>
        
      </div>
      
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={lightboxImages}
          plugins={[Zoom]}
          carousel={{ finite: true }}
        />
      )}
    </>
  );
}
