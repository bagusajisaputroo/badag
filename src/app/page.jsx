"use client";
import React, { useState } from 'react';

// Layout & UI
import DeviceFrame from '../components/layout/DeviceFrame';
import BottomNav from '../components/layout/BottomNav';
import BottomSheet from '../components/ui/BottomSheet';
import InvoiceModal from '../components/ui/InvoiceModal';
import toast, { Toaster } from 'react-hot-toast';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ReservasiScreen from '../screens/ReservasiScreen';
import AkunScreen from '../screens/AkunScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import PromoDetailScreen from '../screens/PromoDetailScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedRestoForBooking, setSelectedRestoForBooking] = useState('');
  const [viewingRestaurant, setViewingRestaurant] = useState(null);
  const [viewingPromo, setViewingPromo] = useState(null);
  const [preSelectedPromoId, setPreSelectedPromoId] = useState('');
  
  const [newBookingInvoice, setNewBookingInvoice] = useState(null);

  const openBooking = (restaurantData, promoId = '') => {
    setSelectedRestoForBooking(restaurantData);
    setPreSelectedPromoId(promoId);
    setSheetOpen(true);
  };

  const handleBookingConfirm = async (bookingData) => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantName: selectedRestoForBooking.name,
          date: bookingData.date,
          time: bookingData.time,
          guests: bookingData.guests,
          tableType: bookingData.tableType,
          areaId: bookingData.areaId,
          notes: bookingData.notes,
          promoId: bookingData.promoId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal membuat reservasi.');
        return;
      }

      // Show toast message for successful booking
      toast.success('Booking berhasil, silahkan cek email Anda.', {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      
      setSheetOpen(false);
      setPreSelectedPromoId('');
      setViewingRestaurant(null); // Close detail screen if open
      setViewingPromo(null); // Close promo detail if open
      
      // Redirect to reservasi tab to show upcoming bookings
      setTimeout(() => {
        setActiveTab('reservasi');
      }, 1500);
    } catch (e) {
      toast.error('Terjadi kesalahan saat memproses booking.');
    }
  };

  const closeBookingInvoice = () => {
    setNewBookingInvoice(null);
    setActiveTab('reservasi');
  };

  const renderActiveScreen = () => {
    if (viewingRestaurant) {
      return (
        <RestaurantDetailScreen 
          restaurant={viewingRestaurant} 
          onBack={() => {
            setViewingRestaurant(null);
            // If we came from promo detail, don't lose promo context
          }} 
          onBooking={openBooking}
        />
      );
    }

    if (viewingPromo) {
      return (
        <PromoDetailScreen
          promo={viewingPromo}
          onBack={() => setViewingPromo(null)}
          onBooking={(restaurant, promoId) => openBooking(restaurant, promoId)}
          onSelectRestaurant={(restaurant) => {
            setViewingRestaurant(restaurant);
            setViewingPromo(null);
          }}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen onSearch={() => {}} onSelectRestaurant={setViewingRestaurant} onSelectPromo={setViewingPromo} />;
      case 'explore':
        return <ExploreScreen onSelectRestaurant={setViewingRestaurant} />;
      case 'reservasi':
        return <ReservasiScreen navigateToExplore={() => setActiveTab('explore')} />;
      case 'akun':
        return <AkunScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <>
      <DeviceFrame activeTab={activeTab}>
        {!isLoggedIn ? (
          <LoginScreen onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <>
            {renderActiveScreen()}
            {!viewingRestaurant && !viewingPromo && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
            
            <BottomSheet 
              isOpen={sheetOpen} 
              onClose={() => setSheetOpen(false)} 
              restaurant={selectedRestoForBooking}
              onConfirm={handleBookingConfirm}
              preSelectedPromoId={preSelectedPromoId}
            />

            {newBookingInvoice && (
              <InvoiceModal 
                invoice={newBookingInvoice} 
                onClose={closeBookingInvoice} 
              />
            )}
          </>
        )}
      </DeviceFrame>
      
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            zIndex: 9999,
          }
        }}
        containerStyle={{
          position: 'fixed',
          top: '40px',
          zIndex: 9999,
        }}
      />
    </>
  );
}

