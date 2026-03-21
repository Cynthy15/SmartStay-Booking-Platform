// src/components/ui/Loader.jsx

import './Loader.css'

// Skeleton card for loading state — mimics the ListingCard layout
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line long" />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton skeleton-line short" />
      </div>
    </div>
  )
}

// Full-page spinner for initial loads
export function Spinner() {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <p className="spinner-text">Finding amazing stays...</p>
    </div>
  )
}

// Grid of skeleton cards
export default function Loader({ count = 8 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
