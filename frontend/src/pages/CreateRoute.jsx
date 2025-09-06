import React, { useState } from 'react';
import './CreateRoute.css';

const CreateRoute = () => {
  const [routeName, setRouteName] = useState('');
  const [stops, setStops] = useState([]);
  const [newStop, setNewStop] = useState('');

  const addStop = () => {
    if (newStop.trim()) {
      setStops([...stops, newStop.trim()]);
      setNewStop('');
    }
  };

  const deleteStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const moveStopUp = (index) => {
    if (index > 0) {
      const newStops = [...stops];
      [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
      setStops(newStops);
    }
  };

  const moveStopDown = (index) => {
    if (index < stops.length - 1) {
      const newStops = [...stops];
      [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
      setStops(newStops);
    }
  };

  const saveRoute = () => {
    if (!routeName.trim() || stops.length === 0) {
      alert('Please add a route name and at least one stop!');
      return;
    }

    const newRoute = {
      id: Date.now(),
      name: routeName,
      stops: stops,
      dateCreated: new Date().toISOString(),
      thumbnail: '/assets/maps/placeholder.png', // Later, replace this with Google Static Maps API if time allows
      tags: ['Custom'],
      days: Math.ceil(stops.length / 3), // Estimate days based on stops
      description: `Custom route with ${stops.length} stops`
    };

    // Save to localStorage
    const existingRoutes = JSON.parse(localStorage.getItem('userRoutes') || '[]');
    existingRoutes.push(newRoute);
    localStorage.setItem('userRoutes', JSON.stringify(existingRoutes));

    // Redirect to My Routes
    window.location.href = '/my-routes';
  };

  return (
    <div className="create-route-page">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-text">WANDERPATH</span>
        </div>
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
      <div className="floating-star">🌟</div>
      <div className="floating-star">💫</div>
      <div className="floating-star">⭐</div>

      {/* Flying Airplanes */}
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>

      {/* Main Content */}
      <main className="create-route-content">
        {/* Hero Section */}
        <div className="create-route-header">
          <h2 className="create-route-title">CREATE YOUR DREAM ROUTE</h2>
          <p className="create-route-subtitle">Plan your perfect journey, stop by stop</p>
        </div>

        <div className="create-route-container">
          {/* Left Column - Route Builder */}
          <div className="route-builder">
            {/* Route Name Input */}
            <div className="input-section">
              <label htmlFor="routeName" className="input-label">Route Name</label>
              <input
                type="text"
                id="routeName"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="Enter your route name..."
                className="route-name-input"
              />
            </div>

            {/* Add Stop Section */}
            <div className="input-section">
              <label htmlFor="newStop" className="input-label">Add Stop</label>
              <div className="add-stop-container">
                <input
                  type="text"
                  id="newStop"
                  value={newStop}
                  onChange={(e) => setNewStop(e.target.value)}
                  placeholder="Enter stop location..."
                  className="stop-input"
                  onKeyPress={(e) => e.key === 'Enter' && addStop()}
                />
                <button onClick={addStop} className="add-stop-btn">
                  + Add Stop
                </button>
              </div>
              
              {/* Map Search Visual */}
              <div className="map-search-section">
                <img 
                  src="https://miro.medium.com/v2/resize:fit:1400/1*qYUvh-EtES8dtgKiBRiLsA.png" 
                  alt="Interactive map for location search" 
                  className="search-map-image"
                />
                <div className="map-overlay">
                  <p>🔍 Search and pin locations on the map</p>
                </div>
              </div>
            </div>

            {/* Stops List */}
            {stops.length > 0 && (
              <div className="stops-section">
                <h3 className="stops-title">Your Route Stops</h3>
                <div className="stops-list">
                  {stops.map((stop, index) => (
                    <div key={index} className="stop-item">
                      <div className="stop-info">
                        <span className="stop-icon">📍</span>
                        <span className="stop-number">Stop {index + 1}:</span>
                        <span className="stop-name">{stop}</span>
                      </div>
                      <div className="stop-actions">
                        <button
                          onClick={() => moveStopUp(index)}
                          disabled={index === 0}
                          className="move-btn"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveStopDown(index)}
                          disabled={index === stops.length - 1}
                          className="move-btn"
                          title="Move Down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => deleteStop(index)}
                          className="delete-btn"
                          title="Delete Stop"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Route Summary */}
          <div className="route-summary">
            <div className="summary-card">
              <h3 className="summary-title">Route Summary</h3>
              
              <div className="summary-info">
                <div className="summary-item">
                  <strong>Route Name: </strong>
                  <span>{routeName || 'Untitled Route'}</span>
                </div>
                <div className="summary-item">
                  <strong>Total Stops:</strong>
                  <span>{stops.length}</span>
                </div>
                <div className="summary-item">
                  <strong>Estimated Days:</strong>
                  <span>{Math.ceil(stops.length / 3) || 1}</span>
                </div>
              </div>

              {/* Placeholder Map */}
              <div className="map-placeholder">
                {/* Later, replace this with Google Static Maps API if time allows */}
                <div className="map-image">
                  <span className="map-icon">🗺️</span>
                  <p>Route Preview</p>
                  <small>Map will appear here</small>
                </div>
              </div>

              {/* Save Button */}
              <button 
                onClick={saveRoute} 
                className="save-route-btn"
                disabled={!routeName.trim() || stops.length === 0}
              >
                Save Route
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateRoute;
