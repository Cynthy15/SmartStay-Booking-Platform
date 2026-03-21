// src/pages/ListingDetails.jsx
// Shows full property details — pulls real data from the API using the listing ID

import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Star, Users, Bed, Bath, Heart, Share2,
  Wifi, Wind, Car, Tv, Coffee, ChefHat, Shield, CheckCircle
} from 'lucide-react'
import { useListingDetails } from '../hooks/useListings'
import { useFavorites } from '../context/FavoritesContext'
import useBookingsStore from '../store/bookingsStore'
import { Spinner } from '../components/ui/Loader'
import ErrorState from '../components/ui/ErrorState'
import './ListingDetails.css'

// Map common amenity names to icons
const AMENITY_ICONS = {
  wifi: <Wifi size={16} />,
  'air conditioning': <Wind size={16} />,
  parking: <Car size={16} />,
  tv: <Tv size={16} />,
  coffee: <Coffee size={16} />,
  kitchen: <ChefHat size={16} />,
}

function getAmenityIcon(name) {
  const key = name?.toLowerCase() ?? ''
  for (const [term, icon] of Object.entries(AMENITY_ICONS)) {
    if (key.includes(term)) return icon
  }
  return <CheckCircle size={16} />
}

export default function ListingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const openBookingModal = useBookingsStore((s) => s.openBookingModal)
  const [activeImg, setActiveImg] = useState(0)
  const [copied, setCopied] = useState(false)

  const { data: listing, isLoading, isError, error, refetch } = useListingDetails(id)

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) return <div className="details-loading"><Spinner /></div>
  if (isError) return <div className="container" style={{ paddingTop: 40 }}><ErrorState error={error} onRetry={refetch} /></div>

  // If we have no API data, create a minimal display object from the listing ID
  if (!listing) {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <p>Listing not found. <Link to="/">Go home</Link></p>
      </div>
    )
  }

  const favorited = isFavorite(listing.id)
  const images = listing.images?.filter(Boolean) ?? []
  const displayImages = images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']

  return (
    <div className="details-page page-enter">
      {/* Back nav */}
      <div className="container details-nav">
        <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="details-actions">
          <button className="btn btn-ghost" onClick={handleShare}>
            <Share2 size={15} />
            {copied ? 'Copied!' : 'Share'}
          </button>
          <button
            className={`btn btn-ghost favorite-action ${favorited ? 'favorited' : ''}`}
            onClick={() => toggleFavorite(listing)}
          >
            <Heart size={15} fill={favorited ? 'currentColor' : 'none'} />
            {favorited ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="container">
        <h1 className="details-title">{listing.name}</h1>
        <div className="details-meta-row">
          {listing.rating && (
            <span className="details-rating">
              <Star size={14} fill="currentColor" />
              {listing.rating} · {listing.reviewCount} reviews
            </span>
          )}
          {listing.isSuperhost && (
            <span className="superhost-tag">
              <Shield size={13} />
              Superhost
            </span>
          )}
          <span className="details-location">
            {listing.city}{listing.country ? `, ${listing.country}` : ''}
          </span>
        </div>
      </div>

      {/* Image gallery */}
      <div className="container">
        <div className="gallery">
          <div className="gallery-main">
            <img
              src={displayImages[activeImg]}
              alt={listing.name}
              className="gallery-main-img"
              key={activeImg}
            />
          </div>
          {displayImages.length > 1 && (
            <div className="gallery-thumbs">
              {displayImages.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  className={`gallery-thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="container details-content">
        {/* Left column */}
        <div className="details-left">
          {/* Key stats */}
          <div className="stats-strip">
            <div className="stat-item">
              <Users size={18} />
              <span>{listing.personCapacity} guests</span>
            </div>
            <div className="stat-item">
              <Bed size={18} />
              <span>{listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="stat-item">
              <Bath size={18} />
              <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <section className="details-section">
              <h2 className="section-title">About this place</h2>
              <p className="details-description">{listing.description}</p>
            </section>
          )}

          {/* Amenities */}
          {listing.amenities?.length > 0 && (
            <section className="details-section">
              <h2 className="section-title">What this place offers</h2>
              <div className="amenities-grid">
                {listing.amenities.slice(0, 12).map((a, i) => (
                  <div key={i} className="amenity-item">
                    {getAmenityIcon(a)}
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Host info */}
          {listing.hostName && (
            <section className="details-section">
              <h2 className="section-title">Meet your host</h2>
              <div className="host-card">
                {listing.hostImage ? (
                  <img src={listing.hostImage} alt={listing.hostName} className="host-avatar" />
                ) : (
                  <div className="host-avatar-placeholder">
                    {listing.hostName[0]}
                  </div>
                )}
                <div className="host-info">
                  <p className="host-name">{listing.hostName}</p>
                  {listing.hostSince && (
                    <p className="host-since">Host since {listing.hostSince}</p>
                  )}
                  {listing.isSuperhost && (
                    <span className="superhost-tag small">
                      <Shield size={11} /> Superhost
                    </span>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right column: booking card */}
        <div className="details-right">
          <div className="booking-card">
            <div className="booking-card-header">
              <p className="booking-price">
                {listing.priceLabel || 'Price on request'}
              </p>
              {listing.rating && (
                <p className="booking-rating">
                  <Star size={13} fill="currentColor" />
                  {listing.rating}
                </p>
              )}
            </div>
            <button
              className="btn btn-primary booking-card-btn"
              onClick={() => openBookingModal(listing)}
            >
              Reserve
            </button>
            <p className="booking-card-note">You won't be charged yet</p>

            <div className="booking-summary-table">
              <div className="booking-summary-row">
                <span>Room type</span>
                <span className="capitalize">{listing.roomType?.replace(/_/g, ' ') || '—'}</span>
              </div>
              <div className="booking-summary-row">
                <span>Capacity</span>
                <span>Up to {listing.personCapacity} guests</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
