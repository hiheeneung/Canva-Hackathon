# Canva-Hackathon
Travel Journal App

# 🐳 Travel Journal

> *"Animals like birds and whales return to the same migration routes year after year, remembering their paths across continents. Humans? We forget the ramen shop we ate at last night. WanderPath helps us remember and share our journeys."*

## 🌍 The Problem

People travel through cities but forget the routes they took (where they walked, shopped, ate). When recommending trips to friends, it's hard to recall exact paths, not just single spots. Current tools (Google Maps "Starred" places) don't show the lived journey.

## 💡 The Solution

Just like birds, whales, and butterflies remember and retrace migration routes, our platform lets travelers log their personal travel routes and share them with others.

### Key Features

- **🗺️ Drop Pins**: Click on the map to drop pins at restaurants, shops, attractions
- **🛤️ Build Migration Trails**: Pins are auto-connected into a trail (like a bird's flight path)
- **🌐 Explore Community Trails**: Search a city → see migration routes made by others
- **⭐ Crowdsourced Memory Paths**: Popular routes rise to the top

## 🧑‍💻 User Actions

1. **Log Your Route (Drop Pins)**
   - Click on the map to drop pins at restaurants, shops, attractions
   - Each pin = memory 

2. **Build a Migration Trail**
   - Pins are auto-connected into a trail (like a bird's flight path)
   - Saved as a named "route" (e.g., Sydney Food Crawl, Singapore Temple Walk)

3. **Explore Community Trails**
   - Search a city → see migration routes made by others
   - Popular routes rise to the top (crowdsourced "memory paths")

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Swagger** for API documentation
- **bcryptjs** for password hashing

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Leaflet** with React-Leaflet for maps
- **Axios** for API calls

## 📁 Project Structure

```
Canva-Hackathon/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and Swagger configuration
│   │   ├── middleware/      # Authentication middleware
│   │   ├── models/          # MongoDB schemas (User, Route, Pin)
│   │   └── routes/          # API endpoints
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # React components
│   │   ├── lib/             # API utilities
│   │   └── assets/          # Static assets
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Canva-Hackathon
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/travel-migration
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The API will be available at `http://localhost:4000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Access API Documentation**
   Visit `http://localhost:4000/api-docs` for Swagger documentation

## 📱 Pages & Features

### 🏠 Home Page
- No navigation bar
- Signup/Login buttons in top right corner
- Logo in top left corner
- "Where will you (go) today?" call-to-action button

### 🔐 Authentication
- **Signup Page**: User registration
- **Login Page**: User authentication

### 👤 User Dashboard
- Popular destinations with pictures
- Navigation Bar with:
  - **SEARCH**: Explore more routes (filter by most recent, most liked)
  - **MAKE YOUR OWN ROUTE**: Create new migration trails
  - **FAVOURITES**: Saved favorite routes
  - **MY ROUTES**: Personal route management

### 🗺️ Create Route Page
- Search location using Google Maps API
- Add pin locations with details
- Order changing feature among places
- "CREATE YOUR ROUTE" button
- Success confirmation: "Route Successfully Created!"

### ⭐ Favorites
- List of favorite routes

### 📍 My Routes Page
- List of personal routes (sorted by cities)
- Sorting options: latest to oldest, oldest to latest
- Filter by country

## 🗄️ Database Schema

### Route Schema
```javascript
{
  userId: String,
  city: String,
  name: String,
  pins: [
    { 
      name: String, 
      category: String, 
      note: String, 
      lat: Number, 
      lng: Number 
    }
  ],
  timestamp: Date
}
```


## 🎯 Future Enhancements

- Real-time collaboration on routes
- Photo uploads for each pin
- Route sharing via social media
- Mobile app development
- Offline map support
- Route recommendations based on preferences


*Remember your journeys, share your paths, and discover the world through others' migration trails.* 🐦✨
