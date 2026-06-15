import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/ui/RestaurantCard';

export default function HomeScreen({ onSearch, onSelectRestaurant }) {
  const [homeCat, setHomeCat] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [promoBanners, setPromoBanners] = useState([]);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setRestaurants(data); });
      
    fetch('/api/user')
      .then(res => res.json())
      .then(data => { if (data && !data.error) setUserProfile(data); });
      
    fetch('/api/promos')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPromoBanners(data); });
  }, []);

  // Filter logic based on the selected category
  const filteredRestaurants = restaurants.filter(r => {
    if (homeCat === 'Semua') return true;
    if (homeCat === 'Trending') return r.isTrending;
    return r.tags.includes(homeCat) || r.type.includes(homeCat);
  });

  const trending = filteredRestaurants.filter(r => r.isTrending);
  // Show the rest as recommended, or if category is selected, show all matches
  // Show the rest as recommended, or if category is selected, show all matches
  let recommended = homeCat === 'Semua' 
    ? filteredRestaurants.filter(r => r.isRecommended)
    : filteredRestaurants.filter(r => !r.isTrending);

  // Fallback: If no recommended restaurants are set in DB, show all non-trending
  if (homeCat === 'Semua' && recommended.length === 0) {
    recommended = filteredRestaurants.filter(r => !r.isTrending);
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="screen-content">
      <div className="home-header">
        <div className="flex-row justify-between">
          <h1 style={{ fontSize: '20px' }}>Seato</h1>
          <i className="ti ti-bell" style={{ fontSize: '24px' }}></i>
        </div>
        <div style={{ marginTop: '24px' }}>
          <p style={{ opacity: 0.9 }}>Selamat pagi, {userProfile?.initials || ''} 👋</p>
          <h1 style={{ marginTop: '4px' }}>Mau makan di mana hari ini?</h1>
        </div>
        <div className="search-bar">
          <i className="ti ti-search text-muted"></i>
          <input 
            type="text" 
            placeholder="Cari restoran, cafe..." 
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="location-pill">
          <i className="ti ti-map-pin"></i> {userProfile?.location?.split(',')[0] || ''} <i className="ti ti-chevron-down" style={{fontSize:'14px'}}></i>
        </div>
      </div>

      <div style={{ padding: '24px 0 16px' }}>
        <h2 style={{ padding: '0 20px', marginBottom: '12px' }} className="text-navy">Kategori</h2>
        <div className="horizontal-scroll">
          {['Semua', 'Trending', 'Cafe', 'Fine Dining', 'Rooftop', 'Indonesian'].map(cat => (
            <div 
              key={cat} 
              className={`filter-chip ${homeCat === cat ? 'active' : ''}`}
              onClick={() => setHomeCat(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 0 24px' }}>
        <div className="horizontal-scroll">
          {promoBanners.map(promo => (
            <div 
              key={promo.id} 
              className="card promo-banner" 
              style={{ backgroundImage: `${promo.color}, url(${promo.imageUrl})` }}
            >
              <div className="promo-content">
                <h2 style={{fontSize: '18px'}}>{promo.title}</h2>
                <p style={{opacity: 0.9}}>{promo.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {trending.length > 0 && (
        <div style={{ padding: '0 0 24px' }}>
          <h2 style={{ padding: '0 20px', marginBottom: '16px' }} className="text-navy">Lagi Happening 🔥</h2>
          <div className="horizontal-scroll">
            {trending.map((item) => (
              <RestaurantCard key={item.id} data={item} variant="vertical" onAction={onSelectRestaurant} />
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '0 20px' }}>
        <h2 className="text-navy" style={{ marginBottom: '16px' }}>{homeCat === 'Semua' ? 'Rekomendasi untukmu' : `Pilihan ${homeCat}`}</h2>
        <div className="flex-col gap-3">
          {recommended.map((item) => (
            <RestaurantCard key={item.id} data={item} variant="horizontal" onAction={onSelectRestaurant} />
          ))}
          {recommended.length === 0 && trending.length === 0 && (
            <p className="text-muted" style={{ textAlign: 'center', padding: '20px 0' }}>Tidak ada restoran di kategori ini.</p>
          )}
        </div>
      </div>
    </div>
  );
}
