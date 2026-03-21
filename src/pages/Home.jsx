// src/pages/Home.jsx
import { useMemo } from 'react'
import { MapPin, TrendingUp } from 'lucide-react'
import { useListings } from '../hooks/useListings'
import { useFilters } from '../context/FiltersContext'
import ListingCard from '../components/listings/ListingCard'
import FilterSidebar from '../components/layout/FilterSidebar'
import Loader from '../components/ui/Loader'
import ErrorState from '../components/ui/ErrorState'
import './Home.css'

// Fallback mock listings
const MOCK_LISTINGS = [
  { id: 'mock-1', name: 'Charming Montmartre Apartment', city: 'Paris', personCapacity: 4, bedrooms: 2, bathrooms: 1, rating: '4.92', reviewCount: 128, priceLabel: '$145 / night', price: 145, isSuperhost: true, images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'] },
  { id: 'mock-2', name: 'Sunny Loft with Eiffel Tower View', city: 'Paris', personCapacity: 2, bedrooms: 1, bathrooms: 1, rating: '4.87', reviewCount: 94, priceLabel: '$220 / night', price: 220, isSuperhost: false, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600'] },
  { id: 'mock-3', name: 'Cozy Studio near the Louvre', city: 'Paris', personCapacity: 2, bedrooms: 1, bathrooms: 1, rating: '4.75', reviewCount: 67, priceLabel: '$98 / night', price: 98, isSuperhost: false, images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600'] },
  { id: 'mock-4', name: 'Elegant Haussmann Flat', city: 'Paris', personCapacity: 6, bedrooms: 3, bathrooms: 2, rating: '4.96', reviewCount: 203, priceLabel: '$380 / night', price: 380, isSuperhost: true, images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'] },
  { id: 'mock-5', name: 'Bohemian Artist Retreat', city: 'Paris', personCapacity: 3, bedrooms: 2, bathrooms: 1, rating: '4.80', reviewCount: 41, priceLabel: '$175 / night', price: 175, isSuperhost: false, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'] },
  { id: 'mock-6', name: 'Modern Penthouse with Rooftop', city: 'Paris', personCapacity: 4, bedrooms: 2, bathrooms: 2, rating: '4.94', reviewCount: 76, priceLabel: '$310 / night', price: 310, isSuperhost: true, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'] },
]

export default function Home() {
  const { filters } = useFilters()

  // Fetch listings from API (with caching/fallback)
  const { data: apiListings, isLoading, isError, error, refetch, isFetching } = useListings(filters)

  const rawListings = apiListings?.length > 0 ? apiListings : MOCK_LISTINGS

  // Apply client-side filters
  const listings = useMemo(() => {
    return rawListings.filter((l) => {
      const price = typeof l.price === 'number' ? l.price : 0
      const rating = parseFloat(l.rating) || 0

      if (filters.minPrice > 0 && price < filters.minPrice) return false
      if (filters.maxPrice < 1000 && price > filters.maxPrice) return false
      if (filters.minRating > 0 && rating < filters.minRating) return false
      return true
    })
  }, [rawListings, filters.minPrice, filters.maxPrice, filters.minRating])

  const usingMockData = !apiListings || apiListings.length === 0

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="home-hero">
        <div className="container">
          <p className="hero-eyebrow"><MapPin size={14} /> Exploring {filters.placeName}</p>
          <h1 className="hero-title">Find your perfect place to stay</h1>
          <p className="hero-subtitle">
            {isLoading ? 'Searching for available properties...' : `${listings.length} stunning properties found`}
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="container home-layout">
        <FilterSidebar />

        <main className="listings-main">
          {usingMockData && !isLoading && (
            <div className="demo-notice"><TrendingUp size={14} /> Showing sample listings — connect your RapidAPI key to see live results</div>
          )}

          {isFetching && !isLoading && (
            <div className="refetch-bar"><div className="refetch-progress" /></div>
          )}

          {isLoading && <Loader count={8} />}

          {isError && !isLoading && <ErrorState error={error} onRetry={refetch} />}

          {!isLoading && !isError && (
            listings.length === 0 ? (
              <div className="empty-state">
                <p className="empty-icon">🏡</p>
                <h3>No properties match your filters</h3>
                <p>Try adjusting your price range or rating filter.</p>
              </div>
            ) : (
              <div className="listings-grid">
                {listings.map((listing, i) => (
                  <div key={listing.id} style={{ animationDelay: `${i * 0.05}s` }}>
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            )
          )}
        </main>
      </div>
    </div>
  )
}