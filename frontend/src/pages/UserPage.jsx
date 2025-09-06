import React from 'react';
import './UserPage.css';

const UserPage = () => {
  return (
    <div className="user-page">
      {/* Header */}
      <header className="header">
        {/* Logo */}
        <div className="logo">
          <span className="logo-text">WANDERPATH</span>
        </div>
        
        {/* Auth Buttons */}
        <div className="auth-buttons">
          
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-left">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Explore more routes..."
              className="search-input"
            />
          </div>
        </div>
        
        <div className="nav-right">
          <button className="nav-button make-route-btn">
            Make Your Own Route
          </button>
          
          <a href="/favourites" className="nav-button favourites-btn">
            <span className="heart-icon">❤️</span>
            Favourites
          </a>
          
          <button className="nav-button my-routes-btn">
            My Routes
          </button>
        </div>
      </nav>

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
