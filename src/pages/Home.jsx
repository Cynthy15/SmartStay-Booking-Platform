import { useMemo } from 'react'
import { MapPin, TrendingUp } from 'lucide-react'
import { useListings } from '../hooks/useListings'
import { useFilters } from '../context/FiltersContext'
import ListingCard from '../components/listings/ListingCard'
import FilterSidebar from '../components/layout/FilterSidebar'
import Loader from '../components/ui/Loader'
import ErrorState from '../components/ui/ErrorState'
import './Home.css'

export default function Home() {
  const { filters } = useFilters()

  // Fetch listings via React Query
  const {
    data: apiListings,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useListings(filters)

  // Fallback to empty array if nothing
  const rawListings = apiListings || []

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
      {/* Hero Section */}
      <div className="home-hero">
        <div className="container">
          <p className="hero-eyebrow">
            <MapPin size={14} /> Exploring {filters.placeName || 'Paris'}
          </p>
          <h1 className="hero-title">Find your perfect place to stay</h1>
          <p className="hero-subtitle">
            {isLoading
              ? 'Searching for available properties...'
              : `${listings.length} stunning properties found`}
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="container home-layout">
        <FilterSidebar />

        <main className="listings-main">
          {/* Show notice if using mock data */}
          {usingMockData && !isLoading && (
            <div className="demo-notice">
              <TrendingUp size={14} /> Showing sample listings — connect your RapidAPI key to see live results
            </div>
          )}

          {/* Refetch progress bar */}
          {isFetching && !isLoading && (
            <div className="refetch-bar">
              <div className="refetch-progress" />
            </div>
          )}

          {/* Loader */}
          {isLoading && <Loader count={8} />}

          {/* Error state */}
          {isError && !isLoading && <ErrorState error={error} onRetry={refetch} />}

          {/* Listings grid */}
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