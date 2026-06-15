import React from 'react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', icon: 'ti-home', label: 'Home' },
    { id: 'explore', icon: 'ti-compass', label: 'Explore' },
    { id: 'reservasi', icon: 'ti-calendar-event', label: 'Reservasi' },
    { id: 'akun', icon: 'ti-user', label: 'Akun' }
  ];

  return (
    <div className="bottom-nav">
      {tabs.map((tab) => (
        <div 
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} 
          onClick={() => setActiveTab(tab.id)}
        >
          <i className={`ti ${tab.icon}`}></i>
        </div>
      ))}
    </div>
  );
}
