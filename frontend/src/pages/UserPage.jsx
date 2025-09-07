import React, { useState } from 'react';
import './UserPage.css';

const UserPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="user-page">
      {/* Header with Navigation */}
      <header className="header">
        {/* Logo */}
        <div className="logo">
          <span className="logo-text">WANDERPATH</span>
        </div>
        
        {/* Search Bar */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search destinations, routes, or experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <span className="search-icon">🔍</span>
            </button>
          </form>
        </div>
        
        {/* Navigation Elements */}
        <div className="nav-right">
          <a href="/create-route" className="nav-button make-route-btn">
            Create Your Own Route
          </a>
          
          <a href="/favourites" className="nav-button favourites-btn">
            <span className="heart-icon">❤️</span>
            Favourites
          </a>
          
          <a href="/my-routes" className="nav-button my-routes-btn">
            My Routes
          </a>
        </div>
      </header>

      {/* Floating Stars */}
      <div className="floating-star">✨</div>
      <div className="floating-star">⭐</div>
      <div className="floating-star">✨</div>
      <div className="floating-star">⭐</div>
      <div className="floating-star">✨</div>
      <div className="floating-star">⭐</div>
      <div className="floating-star">✨</div>
      <div className="floating-star">⭐</div>
      <div className="floating-star">✨</div>
      <div className="floating-star">⭐</div>
      <div className="floating-star">✨</div>
      <div className="floating-star">⭐</div>
      <div className="floating-star">✨</div>
      <div className="floating-star">⭐</div>
      <div className="floating-star">✨</div>
      <div className="floating-star">⭐</div>

      {/* Flying Airplanes */}
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>

      {/* Dashboard */}
      <main className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">POPULAR DESTINATIONS</h1>
          <p className="dashboard-subtitle">Discover breathtaking places around the world</p>
        </div>

        <div className="destinations-grid">
          <div className="destination-card">
            <div className="destination-image newzealand-image"></div>
            <div className="destination-info">
              <h3 className="destination-name">New Zealand</h3>
              <p className="destination-description">Land of Adventure</p>
            </div>
          </div>

          <div className="destination-card">
            <div className="destination-image thailand-image"></div>
            <div className="destination-info">
              <h3 className="destination-name">Thailand</h3>
              <p className="destination-description">Lantern Festival</p>
            </div>
          </div>

          <div className="destination-card">
            <div className="destination-image switzerland-image"></div>
            <div className="destination-info">
              <h3 className="destination-name">Switzerland</h3>
              <p className="destination-description">Mountain Waterfalls</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPage;
