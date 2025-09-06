import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        {/* Logo */}
        <div className="logo">
          <span className="logo-text">WANDERPATH</span>
        </div>
        
        {/* Auth Buttons */}
        <div className="auth-buttons">
          <a href="/signup" className="signup-btn">Sign up</a>
          <a href="/login" className="login-btn">Log in</a>
        </div>
      </header>

      {/* Travel Destinations */}
      <div className="travel-destinations">
        <div className="destination paris"></div>
        <div className="destination tokyo"></div>
        <div className="destination santorini"></div>
        <div className="destination bali"></div>
        <div className="destination newyork"></div>
        <div className="destination dubai"></div>
        <div className="destination newzealand"></div>
        <div className="destination iceland"></div>
        <div className="destination switzerland"></div>
        <div className="destination maldives"></div>
        <div className="destination norway"></div>
        <div className="destination japan"></div>
        <div className="destination morocco"></div>
        <div className="destination thailand"></div>
        <div className="destination italy"></div>
      </div>

      {/* Floating Stars */}
      <div className="floating-star">✨</div>
      <div className="floating-star">⭐</div>
      <div className="floating-star">✨</div>
      <div className="floating-star">⭐</div>
      <div className="floating-star">✨</div>
      <div className="floating-star">⭐</div>

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <h1 className="main-heading">
            Where will you <span className="highlight-word">go</span> today?
          </h1>
          
          <p className="sub-text">
            With WanderPath, you can create your dream holiday routes anytime, anywhere.
          </p>
          
          <a href="/user" className="cta-button">
            Start Connecting The Dots
          </a>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
