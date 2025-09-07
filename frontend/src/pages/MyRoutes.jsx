import React, { useState } from 'react';
import './MyRoutes.css';

const MyRoutes = () => {
  // Mock data for routes - in a real app, this would come from a backend/state management
  const [routes] = useState([
    {
      id: 1,
      name: "Japan Foodie Adventure",
      thumbnail: "https://cdn.cheapoguides.com/wp-content/uploads/sites/2/2024/12/GettyImages-505797368-1024x683.jpg",
      tags: ["City", "Food", "Culture"],
      days: 7,
      stops: 12,
      description: "Explore Tokyo's culinary scene from street food to Michelin stars"
    },
    {
      id: 2,
      name: "Bangkok Spicy Challenge",
      thumbnail: "https://sethlui.com/wp-content/uploads/2015/09/bangkok-rod-fai-market-0900.jpg",
      tags: ["Street Food", "Spicy", "Culture"],
      days: 5,
      stops: 10,
      description: "Dive into Bangkok's fiery street food scene and local markets"
    },
    {
      id: 3,
      name: "Paris Cafe Hopping",
      thumbnail: "https://i0.wp.com/limitless-secrets.com/wp-content/uploads/2022/01/IMG_8641.jpg?fit=819%2C1024&ssl=1",
      tags: ["Cafe", "Romance", "City"],
      days: 4,
      stops: 8,
      description: "Discover charming Parisian cafes and their unique coffee culture"
    },
    {
      id: 4,
      name: "Switzerland Christmas Wonderland",
      thumbnail: "https://www.gokite.travel/wp-content/uploads/2024/11/1.-Zurich-Christmas-Markets.webp",
      tags: ["Christmas", "Winter", "Mountains"],
      days: 6,
      stops: 7,
      description: "Experience magical Christmas markets in snowy Alpine villages"
    },
    {
      id: 5,
      name: "New Zealand Coastal Drive",
      thumbnail: "https://destinationlesstravel.com/wp-content/uploads/2020/03/Reflections-at-Lake-Matheson-New-Zealand.jpg.webp",
      tags: ["Coast", "Nature", "Scenic"],
      days: 8,
      stops: 12,
      description: "Stunning coastal roads with breathtaking ocean and mountain views"
    },
    {
      id: 6,
      name: "Iceland Ring Road",
      thumbnail: "https://images.squarespace-cdn.com/content/v1/596b2969d2b85786e6892853/55c6f836-5b9e-4e6f-9d57-9d20603b2bf6/The+roads+in+Iceland+during+the+winter",
      tags: ["Nature", "Adventure", "Photography"],
      days: 12,
      stops: 15,
      description: "Complete circuit of Iceland's most stunning landscapes"
    }
  ]);

  const handleViewRoute = (routeId) => {
    // Navigate to route detail page
    console.log('Viewing route:', routeId);
  };

  const handleEditRoute = (routeId) => {
    // Navigate to route edit page
    console.log('Editing route:', routeId);
  };

  const handleDeleteRoute = (routeId) => {
    // Show confirmation and delete route
    if (window.confirm('Are you sure you want to delete this route?')) {
      console.log('Deleting route:', routeId);
    }
  };

  const handleCreateRoute = () => {
    // Navigate to create route page
    console.log('Creating new route');
  };

  return (
    <div className="my-routes-page">
      {/* Header */}
      <header className="header">
        {/* Logo */}
        <div className="logo">
          <span className="logo-text">WANDERPATH</span>
        </div>
        
        {/* Navigation */}
        <div className="nav-buttons">
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

      {/* Flying Airplanes */}
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>
      <div className="airplane">✈️</div>

      {/* Main Content */}
      <main className="routes-content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="routes-title">MY ROUTES</h1>
          <p className="routes-subtitle">Plan, revisit, and relive your journeys.</p>
        </div>

        {/* Routes Grid */}
        <div className="routes-grid">
          {routes.map((route) => (
            <div key={route.id} className="route-card">
              <div className="card-image">
                <img src={route.thumbnail} alt={route.name} />
                <div className="card-overlay">
                  <div className="route-summary">
                    <span className="days">{route.days} days</span>
                    <span className="stops">{route.stops} stops</span>
                  </div>
                </div>
              </div>
              
              <div className="card-content">
                <h3 className="route-name">{route.name}</h3>
                <p className="route-description">{route.description}</p>
                
                <div className="route-tags">
                  {route.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
                
                <div className="card-actions">
                  <button 
                    className="view-btn"
                    onClick={() => handleViewRoute(route.id)}
                  >
                    View Route
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditRoute(route.id)}
                  >
                    Edit Route
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteRoute(route.id)}
                  >
                    Delete Route
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no routes) */}
        {routes.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <h3>No Routes Yet</h3>
            <p>Start creating your first route and begin your journey!</p>
            <button className="create-first-route-btn" onClick={handleCreateRoute}>
              Create Your First Route
            </button>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button className="fab" onClick={handleCreateRoute}>
        <span className="fab-icon">+</span>
      </button>
    </div>
  );
};

export default MyRoutes;
