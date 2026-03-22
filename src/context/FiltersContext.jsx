import { createContext, useContext, useState } from 'react'

const FiltersContext = createContext(null)

// Default filter values
const DEFAULT_FILTERS = {
  placeId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ', // Paris, France as default
  placeName: 'Paris, France',
  checkin: '',
  checkout: '',
  adults: 1,
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
}

export function FiltersProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function updateFilters(updates) {
    setFilters((prev) => ({ ...prev, ...updates }))
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  return (
    <FiltersContext.Provider value={{ filters, updateFilter, updateFilters, resetFilters }}>
      {children}
    </FiltersContext.Provider>
  )
}

export function useFilters() {
  const ctx = useContext(FiltersContext)
  if (!ctx) throw new Error('useFilters must be used inside FiltersProvider')
  return ctx
}
