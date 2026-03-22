// src/pages/Bookings.jsx
// Protected route — shows user's bookings and allows cancellation

import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, XCircle, CheckCircle, Clock } from 'lucide-react'
import useBookingsStore from '../store/bookingsStore'
import useAuthStore from '../store/authStore'
import './Bookings.css'

function BookingCard({ booking, onCancel }) {
  const isCancelled = booking.status === 'cancelled'
  const isUpcoming = !isCancelled && new Date(booking.checkin) >= new Date()
  const isPast = !isCancelled && new Date(booking.checkout) < new Date()

  const nights = Math.round(
    (new Date(booking.checkout) - new Date(booking.checkin)) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className={`booking-card-item ${isCancelled ? 'cancelled' : ''}`}>
      {/* Image */}
      <div className="bcard-image">
        {booking.listing?.images?.[0] ? (
          <img src={booking.listing.images[0]} alt={booking.listing.name} />
        ) : (
          <div className="bcard-img-placeholder">🏡</div>
        )}
      </div>

      {/* Info */}
      <div className="bcard-info">
        <div className="bcard-top">
          <div>
            <h3 className="bcard-name">{booking.listing?.name ?? 'Your stay'}</h3>
            <p className="bcard-location">
              <MapPin size={12} />
              {booking.listing?.city ?? 'Amazing location'}
            </p>
          </div>
          <span className={`bcard-status ${booking.status}`}>
            {isCancelled ? (
              <><XCircle size={13} /> Cancelled</>
            ) : isUpcoming ? (
              <><Clock size={13} /> Upcoming</>
            ) : isPast ? (
              <><CheckCircle size={13} /> Completed</>
            ) : (
              <><CheckCircle size={13} /> Active</>
            )}
          </span>
        </div>

        <div className="bcard-dates">
          <div className="bcard-date-item">
            <span className="bcard-date-label">Check-in</span>
            <span className="bcard-date-value">
              {new Date(booking.checkin).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
              })}
            </span>
          </div>
          <div className="bcard-date-arrow">→</div>
          <div className="bcard-date-item">
            <span className="bcard-date-label">Check-out</span>
            <span className="bcard-date-value">
              {new Date(booking.checkout).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
              })}
            </span>
          </div>
          <div className="bcard-nights">
            <Calendar size={12} />
            {nights} night{nights !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="bcard-footer">
          <span className="bcard-guests">
            <Users size={12} />
            {booking.adults} guest{booking.adults > 1 ? 's' : ''}
          </span>
          {booking.specialRequests && (
            <span className="bcard-requests" title={booking.specialRequests}>
              Note: {booking.specialRequests.slice(0, 40)}…
            </span>
          )}
          {!isCancelled && isUpcoming && (
            <button
              className="cancel-btn"
              onClick={() => onCancel(booking.id)}
            >
              Cancel booking
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Bookings() {
  const { bookings, cancelBooking } = useBookingsStore()
  const { user } = useAuthStore()

  if (!user) {
    return (
      <div className="bookings-gate">
        <div className="gate-content">
          <span className="gate-icon">🔐</span>
          <h2>Sign in to view your trips</h2>
          <p>You need to be signed in to see your bookings.</p>
          <Link to="/login" className="btn btn-primary">Sign in</Link>
        </div>
      </div>
    )
  }

  const userBookings = bookings.filter((b) => b.guestEmail === user.email)

  const upcoming = userBookings.filter(
    (b) => b.status !== 'cancelled' && new Date(b.checkin) >= new Date()
  )
  const past = userBookings.filter(
    (b) => b.status !== 'cancelled' && new Date(b.checkout) < new Date()
  )
  const active = userBookings.filter(
    (b) => b.status !== 'cancelled' && new Date(b.checkin) < new Date() && new Date(b.checkout) >= new Date()
  )
  const cancelled = userBookings.filter((b) => b.status === 'cancelled')

  function handleCancel(id) {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(id)
    }
  }

  return (
    <div className="bookings-page page-enter">
      <div className="bookings-hero">
        <div className="container">
          <h1 className="bookings-title">Your trips</h1>
          <p className="bookings-subtitle">
            Welcome back, {user.name.split(' ')[0]}
          </p>
        </div>
      </div>

      <div className="container bookings-content">
        {userBookings.length === 0 ? (
          <div className="no-bookings">
            <span className="no-bookings-icon">✈️</span>
            <h3>No trips yet</h3>
            <p>Start exploring and book your first stay!</p>
            <Link to="/" className="btn btn-primary">Explore stays</Link>
          </div>
        ) : (
          <>
            {/* Active */}
            {active.length > 0 && (
              <section className="bookings-section">
                <h2 className="bookings-section-title">Active · {active.length}</h2>
                <div className="bookings-list">
                  {active.map((b) => (
                    <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <section className="bookings-section">
                <h2 className="bookings-section-title">Upcoming · {upcoming.length}</h2>
                <div className="bookings-list">
                  {upcoming.map((b) => (
                    <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                  ))}
                </div>
              </section>
            )}

            {/* Past */}
            {past.length > 0 && (
              <section className="bookings-section">
                <h2 className="bookings-section-title">Past trips · {past.length}</h2>
                <div className="bookings-list">
                  {past.map((b) => (
                    <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                  ))}
                </div>
              </section>
            )}

            {/* Cancelled */}
            {cancelled.length > 0 && (
              <section className="bookings-section">
                <h2 className="bookings-section-title">Cancelled · {cancelled.length}</h2>
                <div className="bookings-list">
                  {cancelled.map((b) => (
                    <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
