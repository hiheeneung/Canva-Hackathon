import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserPage from './pages/UserPage'
import Favourites from './pages/Favourites'
import MyRoutes from './pages/MyRoutes'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/my-routes" element={<MyRoutes />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
