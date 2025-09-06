import React, { useState } from 'react';
import './Favourites.css';

const Favourites = () => {
  // Sample favorited routes data - in a real app, this would come from a backend/state management
  const [favouritedRoutes] = useState([
    {
      id: 1,
      name: "Paris Romance Route",
      description: "A romantic journey through the City of Light",
      image: "https://media.timeout.com/images/106225049/750/562/image.jpg",
      duration: "3 days",
      difficulty: "Easy",
      rating: 4.8,
      tags: ["Romance", "City", "Culture"]
    },
    {
      id: 2,
      name: "New Zealand Adventure",
      description: "Explore the stunning landscapes of Middle Earth",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
      duration: "7 days",
      difficulty: "Moderate",
      rating: 4.9,
      tags: ["Adventure", "Nature", "Hiking"]
    },
    {
      id: 3,
      name: "Thailand Lantern Festival",
      description: "Experience the magical Yi Peng festival",
      image: "https://images.highlightstravel.com/allpicture/2018/09/2485d4a0f923417eb47aeaf3_cut_600x550_241_1747309520.jpg",
      duration: "5 days",
      difficulty: "Easy",
      rating: 4.7,
      tags: ["Festival", "Culture", "Photography"]
    },
    {
      id: 4,
      name: "Swiss Waterfall Trail",
      description: "Discover breathtaking mountain waterfalls",
      image: "https://i.redd.it/niumc5rju6ba1.png",
      duration: "4 days",
      difficulty: "Moderate",
      rating: 4.6,
      tags: ["Nature", "Hiking", "Waterfalls"]
    }
  ]);

  return (
    <div className="favourites-page">
      {/* Header */}
      <header className="header">
        {/* Logo */}
        <div className="logo">
          <span className="logo-text">WANDERPATH</span>
        </div>
        
        {/* Auth Buttons */}
        <div className="auth-buttons">
          <a href="/user" className="back-button">
            <span className="back-icon">←</span>
            Back to Dashboard
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

      {/* Flying Airplanes */}
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>

      {/* Main Content */}
      <main className="favourites-content">
        <div className="favourites-header">
          <h2 className="favourites-title">YOUR FAVOURITE ROUTES</h2>
          <p className="favourites-subtitle">All the amazing journeys you've saved for later</p>
        </div>

        {favouritedRoutes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💔</div>
            <h3>No Favourites Yet</h3>
            <p>Start exploring routes and click the heart to save your favorites!</p>
            <a href="/user" className="explore-button">Explore Routes</a>
          </div>
        ) : (
          <div className="favourites-grid">
            {favouritedRoutes.map((route) => (
              <div key={route.id} className="favourite-card">
                <div className="card-image">
                  <img src={route.image} alt={route.name} />
                  <div className="card-overlay">
                    <button className="remove-favourite-btn">
                      <span className="heart-icon">❤️</span>
                    </button>
                    <div className="rating">
                      <span className="star">⭐</span>
                      <span className="rating-value">{route.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <h3 className="route-name">{route.name}</h3>
                  <p className="route-description">{route.description}</p>
                  <div className="route-meta">
                    <span className="duration">⏱️ {route.duration}</span>
                    <span className="difficulty">🏃 {route.difficulty}</span>
                  </div>
                  <div className="route-tags">
                    {route.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="card-actions">
                    <button className="view-route-btn">View Route</button>
                    <button className="plan-trip-btn">Plan Trip</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favourites;
