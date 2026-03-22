import { SlidersHorizontal, Star, DollarSign } from 'lucide-react'
import { useFilters } from '../../context/FiltersContext'
import './FilterSidebar.css'

export default function FilterSidebar() {
  const { filters, updateFilter, resetFilters } = useFilters()

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <SlidersHorizontal size={16} />
        <h3>Filters</h3>
        <button className="filter-reset" onClick={resetFilters}>
          Reset
        </button>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <label className="filter-label">
          <DollarSign size={14} />
          Price per night
        </label>
        <div className="price-range-display">
          <span>${filters.minPrice}</span>
          <span>—</span>
          <span>${filters.maxPrice}</span>
        </div>
        <div className="range-inputs">
          <div className="range-group">
            <label className="sub-label">Min</label>
            <input
              type="range"
              min={0}
              max={filters.maxPrice}
              value={filters.minPrice}
              onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
              className="range-slider"
            />
          </div>
          <div className="range-group">
            <label className="sub-label">Max</label>
            <input
              type="range"
              min={filters.minPrice}
              max={1000}
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
              className="range-slider"
            />
          </div>
        </div>
      </div>

      {/* Min Rating */}
      <div className="filter-section">
        <label className="filter-label">
          <Star size={14} />
          Minimum rating
        </label>
        <div className="star-buttons">
          {[0, 3, 4, 4.5].map((rating) => (
            <button
              key={rating}
              className={`star-btn ${filters.minRating === rating ? 'active' : ''}`}
              onClick={() => updateFilter('minRating', rating)}
            >
              {rating === 0 ? 'Any' : `${rating}★+`}
            </button>
          ))}
        </div>
      </div>

      {/* Guests */}
      <div className="filter-section">
        <label className="filter-label">Guests</label>
        <div className="guests-control">
          <button
            className="guest-btn"
            onClick={() => updateFilter('adults', Math.max(1, filters.adults - 1))}
          >
            −
          </button>
          <span className="guest-count">{filters.adults} adult{filters.adults > 1 ? 's' : ''}</span>
          <button
            className="guest-btn"
            onClick={() => updateFilter('adults', Math.min(16, filters.adults + 1))}
          >
            +
          </button>
        </div>
      </div>

      {/* Check-in / Check-out */}
      <div className="filter-section">
        <label className="filter-label">Dates</label>
        <div className="date-inputs">
          <div className="date-field">
            <label className="sub-label">Check-in</label>
            <input
              type="date"
              value={filters.checkin}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => updateFilter('checkin', e.target.value)}
              className="date-input"
            />
          </div>
          <div className="date-field">
            <label className="sub-label">Check-out</label>
            <input
              type="date"
              value={filters.checkout}
              min={filters.checkin || new Date().toISOString().split('T')[0]}
              onChange={(e) => updateFilter('checkout', e.target.value)}
              className="date-input"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
