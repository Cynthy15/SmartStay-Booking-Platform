// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext'
import { FiltersProvider } from './context/FiltersContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'
import BookingModal from './components/bookings/BookingModal'
import Home from './pages/Home'
import ListingDetails from './pages/ListingDetails'
import Bookings from './pages/Bookings'
import Favorites from './pages/Favorites'
import Login from './pages/Login'

export default function App() {
  return (
    <FiltersProvider>
      <FavoritesProvider>
        {/* Navbar appears on all pages */}
        <Navbar />

        {/* Global booking modal */}
        <BookingModal />

        {/* Page routes */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />

          {/* Protected route */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '60vh', gap: 16, textAlign: 'center'
              }}>
                <p style={{ fontSize: 72 }}>🏡</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>Page not found</h2>
                <a href="/" className="btn btn-primary">Go home</a>
              </div>
            }
          />
        </Routes>
      </FavoritesProvider>
    </FiltersProvider>
  )
}