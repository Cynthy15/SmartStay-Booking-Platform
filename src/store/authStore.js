// src/store/authStore.js
// Zustand store for authentication state (simulated login)

import { create } from 'zustand'

const useAuthStore = create((set) => ({
  // ── State ────────────────────────────────────────────────────────────────
  user: JSON.parse(localStorage.getItem('staynest_user') || 'null'),
  isLoading: false,

  // ── Actions ───────────────────────────────────────────────────────────────

  // Simulate login (in a real app this would call an auth API)
  login: async (email, password) => {
    set({ isLoading: true })

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800))

    if (!email || !password) {
      set({ isLoading: false })
      throw new Error('Email and password are required')
    }

    const user = {
      id: '1',
      name: email.split('@')[0].replace(/[._]/g, ' '),
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      joinedYear: new Date().getFullYear(),
    }

    localStorage.setItem('staynest_user', JSON.stringify(user))
    set({ user, isLoading: false })
    return user
  },

  // Log the user out and clear storage
  logout: () => {
    localStorage.removeItem('staynest_user')
    set({ user: null })
  },
}))

export default useAuthStore
