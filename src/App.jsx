import React, { useState } from 'react';

// Layout & UI
import DeviceFrame from './components/layout/DeviceFrame';
import BottomNav from './components/layout/BottomNav';
import BottomSheet from './components/ui/BottomSheet';

// Screens
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import ReservasiScreen from './screens/ReservasiScreen';
import AkunScreen from './screens/AkunScreen';
import RestaurantDetailScreen from './screens/RestaurantDetailScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedRestoForBooking, setSelectedRestoForBooking] = useState('');
  const [viewingRestaurant, setViewingRestaurant] = useState(null);

  const openBooking = (restaurantData) => {
    const name = typeof restaurantData === 'string' ? restaurantData : restaurantData.name;
    setSelectedRestoForBooking(name);
    setSheetOpen(true);
  };

  const handleBookingConfirm = () => {
    setSheetOpen(false);
    setViewingRestaurant(null); // Close detail screen if open
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
    <DeviceFrame activeTab={activeTab}>
      {renderActiveScreen()}
      {!viewingRestaurant && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
      
      <BottomSheet 
        isOpen={sheetOpen} 
        onClose={() => setSheetOpen(false)} 
        title={selectedRestoForBooking}
        onConfirm={handleBookingConfirm}
      />
    </DeviceFrame>
  );
}
