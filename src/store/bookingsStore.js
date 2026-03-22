import { create } from 'zustand'

const useBookingsStore = create((set, get) => ({
  bookings: JSON.parse(localStorage.getItem('staynest_bookings') || '[]'),
  isBookingModalOpen: false,
  selectedListing: null,

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
