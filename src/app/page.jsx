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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedRestoForBooking, setSelectedRestoForBooking] = useState('');
  const [viewingRestaurant, setViewingRestaurant] = useState(null);
  
  const [newBookingInvoice, setNewBookingInvoice] = useState(null);

  const openBooking = (restaurantData) => {
    setSelectedRestoForBooking(restaurantData);
    setSheetOpen(true);
  };

  const handleBookingConfirm = async (bookingData) => {
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
    setViewingRestaurant(null); // Close detail screen if open
    
    // Optionally redirect to reservasi tab to show upcoming bookings
    setTimeout(() => {
      setActiveTab('reservasi');
    }, 1500);
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
          onBack={() => setViewingRestaurant(null)} 
          onBooking={openBooking}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen onSearch={() => {}} onSelectRestaurant={setViewingRestaurant} />;
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
            {!viewingRestaurant && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
            
            <BottomSheet 
              isOpen={sheetOpen} 
              onClose={() => setSheetOpen(false)} 
              restaurant={selectedRestoForBooking}
              onConfirm={handleBookingConfirm}
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

