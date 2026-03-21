// src/components/bookings/BookingModal.jsx

import { useState } from 'react'
import { X, Calendar, Users, CreditCard, CheckCircle } from 'lucide-react'
import useBookingsStore from '../../store/bookingsStore'
import useAuthStore from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import './BookingModal.css'

export default function BookingModal() {
  const { isBookingModalOpen, selectedListing, closeBookingModal, addBooking } =
    useBookingsStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // Form state — local state is perfect for form inputs
  const [form, setForm] = useState({
    checkin: '',
    checkout: '',
    adults: 1,
    specialRequests: '',
  })
  const [step, setStep] = useState('form') // 'form' | 'confirm' | 'success'
  const [errors, setErrors] = useState({})

  if (!isBookingModalOpen || !selectedListing) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const newErrors = {}
    if (!form.checkin) newErrors.checkin = 'Check-in date is required'
    if (!form.checkout) newErrors.checkout = 'Check-out date is required'
    if (form.checkin && form.checkout && form.checkin >= form.checkout) {
      newErrors.checkout = 'Check-out must be after check-in'
    }
    return newErrors
  }

  function handleNext() {
    if (!user) {
      closeBookingModal()
      navigate('/login')
      return
    }
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setStep('confirm')
  }

  function handleConfirm() {
    addBooking({
      listing: selectedListing,
      ...form,
      guestName: user.name,
      guestEmail: user.email,
    })
    setStep('success')
  }

  function handleClose() {
    closeBookingModal()
    setStep('form')
    setForm({ checkin: '', checkout: '', adults: 1, specialRequests: '' })
    setErrors({})
  }

  function handleViewBookings() {
    handleClose()
    navigate('/bookings')
  }

  // Calculate nights
  const nights =
    form.checkin && form.checkout
      ? Math.max(
          0,
          Math.round(
            (new Date(form.checkout) - new Date(form.checkin)) / (1000 * 60 * 60 * 24)
          )
        )
      : 0

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {step === 'success' ? '🎉 Booking Confirmed!' : 'Book your stay'}
          </h2>
          <button className="modal-close" onClick={handleClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Listing preview strip */}
        {step !== 'success' && (
          <div className="modal-listing-strip">
            {selectedListing.images?.[0] && (
              <img
                src={selectedListing.images[0]}
                alt={selectedListing.name}
                className="modal-listing-img"
              />
            )}
            <div>
              <p className="modal-listing-name">{selectedListing.name}</p>
              <p className="modal-listing-loc">
                {selectedListing.city || 'Amazing location'}
              </p>
              <p className="modal-listing-price">{selectedListing.priceLabel}</p>
            </div>
          </div>
        )}

        {/* ── STEP: Form ── */}
        {step === 'form' && (
          <div className="modal-body">
            <div className="form-row">
              <div className="form-field">
                <label className="form-label">
                  <Calendar size={13} /> Check-in
                </label>
                <input
                  type="date"
                  name="checkin"
                  value={form.checkin}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleChange}
                  className={`form-input ${errors.checkin ? 'input-error' : ''}`}
                />
                {errors.checkin && <span className="field-error">{errors.checkin}</span>}
              </div>
              <div className="form-field">
                <label className="form-label">
                  <Calendar size={13} /> Check-out
                </label>
                <input
                  type="date"
                  name="checkout"
                  value={form.checkout}
                  min={form.checkin || new Date().toISOString().split('T')[0]}
                  onChange={handleChange}
                  className={`form-input ${errors.checkout ? 'input-error' : ''}`}
                />
                {errors.checkout && <span className="field-error">{errors.checkout}</span>}
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">
                <Users size={13} /> Guests
              </label>
              <select
                name="adults"
                value={form.adults}
                onChange={handleChange}
                className="form-input"
              >
                {Array.from({ length: selectedListing.personCapacity || 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} guest{i + 1 > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Special requests (optional)</label>
              <textarea
                name="specialRequests"
                value={form.specialRequests}
                onChange={handleChange}
                className="form-input form-textarea"
                placeholder="Any special requirements or requests..."
                rows={3}
              />
            </div>

            {nights > 0 && (
              <div className="nights-summary">
                <span>{nights} night{nights > 1 ? 's' : ''}</span>
                <span>·</span>
                <span>{selectedListing.priceLabel}</span>
              </div>
            )}

            {!user && (
              <p className="login-notice">
                You'll be asked to sign in before confirming.
              </p>
            )}

            <button className="btn btn-primary modal-cta" onClick={handleNext}>
              <CreditCard size={16} />
              {user ? 'Review booking' : 'Sign in to book'}
            </button>
          </div>
        )}

        {/* ── STEP: Confirm ── */}
        {step === 'confirm' && (
          <div className="modal-body">
            <div className="confirm-summary">
              <div className="confirm-row">
                <span>Check-in</span>
                <strong>{new Date(form.checkin).toLocaleDateString()}</strong>
              </div>
              <div className="confirm-row">
                <span>Check-out</span>
                <strong>{new Date(form.checkout).toLocaleDateString()}</strong>
              </div>
              <div className="confirm-row">
                <span>Nights</span>
                <strong>{nights}</strong>
              </div>
              <div className="confirm-row">
                <span>Guests</span>
                <strong>{form.adults}</strong>
              </div>
              {form.specialRequests && (
                <div className="confirm-row">
                  <span>Requests</span>
                  <strong className="confirm-requests">{form.specialRequests}</strong>
                </div>
              )}
            </div>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => setStep('form')}>
                Edit
              </button>
              <button className="btn btn-primary" onClick={handleConfirm}>
                Confirm booking
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: Success ── */}
        {step === 'success' && (
          <div className="modal-body success-body">
            <div className="success-icon">
              <CheckCircle size={52} />
            </div>
            <p className="success-message">
              Your stay at <strong>{selectedListing.name}</strong> has been booked!
            </p>
            <p className="success-dates">
              {new Date(form.checkin).toLocaleDateString()} →{' '}
              {new Date(form.checkout).toLocaleDateString()}
            </p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={handleClose}>
                Keep browsing
              </button>
              <button className="btn btn-primary" onClick={handleViewBookings}>
                View my trips
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
