// src/components/layout/Navbar.jsx

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Heart, Calendar, User, LogOut, Menu, X } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { useFilters } from '../../context/FiltersContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { filters, updateFilters } = useFilters()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.placeName)

  // Popular destination shortcuts with their placeIds
  const DESTINATIONS = [
    { name: 'Paris', placeId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ' },
    { name: 'New York', placeId: 'ChIJOwg_06VPwokRYv534QaPC8g' },
    { name: 'Tokyo', placeId: 'ChIJ51cu8IcbXWARiRtXIothAS4' },
    { name: 'Bali', placeId: 'ChIJoQ8Q6NNB0S0RkOYkS7EPkSQ' },
  ]

  function handleSearch(e) {
    e.preventDefault()
    // Find matching destination or use current input as name
    const match = DESTINATIONS.find(
      (d) => d.name.toLowerCase() === searchInput.toLowerCase()
    )
    if (match) {
      updateFilters({ placeId: match.placeId, placeName: match.name })
    }
    navigate('/')
  }

  function handleDestinationClick(dest) {
    setSearchInput(dest.name)
    updateFilters({ placeId: dest.placeId, placeName: dest.name })
    navigate('/')
    setMenuOpen(false)
  }

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⌂</span>
          <span className="logo-text">StayNest</span>
        </Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Where are you going?"
            className="search-input"
            list="destinations-list"
          />
          <datalist id="destinations-list">
            {DESTINATIONS.map((d) => (
              <option key={d.placeId} value={d.name} />
            ))}
          </datalist>
          <button type="submit" className="search-btn">Search</button>
        </form>

        {/* Quick destination pills (desktop) */}
        <div className="navbar-destinations">
          {DESTINATIONS.map((d) => (
            <button
              key={d.placeId}
              className={`dest-pill ${filters.placeId === d.placeId ? 'active' : ''}`}
              onClick={() => handleDestinationClick(d)}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* Nav Actions */}
        <div className="navbar-actions">
          <Link
            to="/favorites"
            className={`nav-action-btn ${isActive('/favorites') ? 'active' : ''}`}
            title="Favorites"
          >
            <Heart size={18} />
            <span>Saved</span>
          </Link>
          <Link
            to="/bookings"
            className={`nav-action-btn ${isActive('/bookings') ? 'active' : ''}`}
            title="Bookings"
          >
            <Calendar size={18} />
            <span>Trips</span>
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-avatar-btn" onClick={() => setMenuOpen(!menuOpen)}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary nav-login-btn">
              <User size={16} />
              Sign in
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-toggle btn btn-ghost"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearch}>
            <Search size={16} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Where are you going?"
            />
            <button type="submit" className="btn btn-primary">Go</button>
          </form>
          <div className="mobile-destinations">
            {DESTINATIONS.map((d) => (
              <button
                key={d.placeId}
                className="dest-pill"
                onClick={() => handleDestinationClick(d)}
              >
                {d.name}
              </button>
            ))}
          </div>
          <div className="mobile-links">
            <Link to="/favorites" onClick={() => setMenuOpen(false)}>❤ Saved</Link>
            <Link to="/bookings" onClick={() => setMenuOpen(false)}>📅 Trips</Link>
            {user ? (
              <button onClick={handleLogout}>Sign out</button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
