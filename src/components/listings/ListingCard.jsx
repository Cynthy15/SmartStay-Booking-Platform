import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFavorites } from '../../context/FavoritesContext'
import useBookingsStore from '../../store/bookingsStore'
import './ListingCard.css'

export default function ListingCard({ listing }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const openBookingModal = useBookingsStore((s) => s.openBookingModal)
  const [imgIndex, setImgIndex] = useState(0)

  const images = listing.images?.filter(Boolean) ?? []
  const hasMultipleImages = images.length > 1
  const favorited = isFavorite(listing.id)

  function prevImage(e) {
    e.preventDefault()
    e.stopPropagation()
    setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }

  function nextImage(e) {
    e.preventDefault()
    e.stopPropagation()
    setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }

  function handleFavorite(e) {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(listing)
  }

  function handleBook(e) {
    e.preventDefault()
    e.stopPropagation()
    openBookingModal(listing)
  }

  return (
    <div className="listing-card">
      {/* Image gallery section */}
      <Link to={`/listing/${listing.id}`} className="card-image-wrapper">
        {images[imgIndex] ? (
          <img
            src={images[imgIndex]}
            alt={listing.name}
            className="card-image"
            loading="lazy"
          />
        ) : (
          <div className="card-image-placeholder">🏡</div>
        )}

        {/* Favorite button */}
        <button
          className={`favorite-btn ${favorited ? 'favorited' : ''}`}
          onClick={handleFavorite}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
        </button>

        {/* Superhost badge */}
        {listing.isSuperhost && (
          <span className="superhost-badge">Superhost</span>
        )}

        {/* Image nav arrows */}
        {hasMultipleImages && (
          <>
            <button className="img-nav img-nav-prev" onClick={prevImage} aria-label="Previous">
              <ChevronLeft size={16} />
            </button>
            <button className="img-nav img-nav-next" onClick={nextImage} aria-label="Next">
              <ChevronRight size={16} />
            </button>
            <div className="img-dots">
              {images.slice(0, 5).map((_, i) => (
                <span key={i} className={`img-dot ${i === imgIndex ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </Link>

      {/* Card content */}
      <div className="card-body">
        <Link to={`/listing/${listing.id}`} className="card-link">
          <div className="card-top-row">
            <p className="card-location">
              {listing.city || listing.neighborhood || 'Lovely location'}
            </p>
            {listing.rating && (
              <span className="card-rating">
                <Star size={12} fill="currentColor" />
                {typeof listing.rating === 'string'
                  ? listing.rating.replace(/[^0-9.]/g, '').slice(0, 3)
                  : listing.rating}
              </span>
            )}
          </div>

          <h3 className="card-title">{listing.name}</h3>

          <p className="card-meta">
            <Users size={12} />
            {listing.personCapacity} guests · {listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''} · {listing.bathrooms} bath
          </p>

          <p className="card-price">
            <span className="price-value">{listing.priceLabel}</span>
          </p>
        </Link>

        <button className="book-btn" onClick={handleBook}>
          Book now
        </button>
      </div>
    </div>
  )
}
