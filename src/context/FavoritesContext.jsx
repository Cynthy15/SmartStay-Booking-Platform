// src/context/FavoritesContext.jsx
// Global state for favorites — persisted to localStorage

import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  // Load saved favorites from localStorage on first render
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('staynest_favorites')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('staynest_favorites', JSON.stringify(favorites))
  }, [favorites])

  function addFavorite(listing) {
    setFavorites((prev) => {
      if (prev.find((f) => f.id === listing.id)) return prev
      return [...prev, listing]
    })
  }

  function removeFavorite(id) {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  function isFavorite(id) {
    return favorites.some((f) => f.id === id)
  }

  function toggleFavorite(listing) {
    if (isFavorite(listing.id)) {
      removeFavorite(listing.id)
    } else {
      addFavorite(listing)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

// Custom hook for easy access
export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider')
  return ctx
}
