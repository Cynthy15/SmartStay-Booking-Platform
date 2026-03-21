// src/store/bookingsStore.js
// Zustand store for booking state management
// Zustand is simpler than Redux — just create a store with state + actions

import { create } from 'zustand'

const useBookingsStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────
  bookings: JSON.parse(localStorage.getItem('staynest_bookings') || '[]'),
  isBookingModalOpen: false,
  selectedListing: null,

  // ── Actions ───────────────────────────────────────────────────────────────

  // Open the booking modal for a specific listing
  openBookingModal: (listing) =>
    set({ isBookingModalOpen: true, selectedListing: listing }),

  // Close the booking modal
  closeBookingModal: () =>
    set({ isBookingModalOpen: false, selectedListing: null }),

  // Add a new booking
  addBooking: (booking) => {
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      bookedAt: new Date().toISOString(),
      status: 'confirmed',
    }
    const updated = [...get().bookings, newBooking]
    localStorage.setItem('staynest_bookings', JSON.stringify(updated))
    set({ bookings: updated, isBookingModalOpen: false })
    return newBooking
  },

  // Cancel a booking by ID
  cancelBooking: (bookingId) => {
    const updated = get().bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    )
    localStorage.setItem('staynest_bookings', JSON.stringify(updated))
    set({ bookings: updated })
  },

  // Get only active (non-cancelled) bookings
  getActiveBookings: () => get().bookings.filter((b) => b.status !== 'cancelled'),
}))

export default useBookingsStore
