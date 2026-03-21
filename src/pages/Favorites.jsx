// src/pages/Favorites.jsx
// Shows all listings the user has saved to favorites

import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import ListingCard from '../components/listings/ListingCard'
import './Favorites.css'

export default function Favorites() {
  const { favorites } = useFavorites()

  return (
    <div className="favorites-page page-enter">
      <div className="favorites-hero">
        <div className="container">
          <div className="favorites-hero-inner">
            <Heart size={28} className="fav-hero-icon" />
            <div>
              <h1 className="favorites-title">Saved places</h1>
              <p className="favorites-subtitle">
                {favorites.length === 0
                  ? 'Your wishlist is empty'
                  : `${favorites.length} place${favorites.length > 1 ? 's' : ''} saved`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container favorites-content">
        {favorites.length === 0 ? (
          <div className="no-favorites">
            <span className="no-fav-icon">💛</span>
            <h3>No saved places yet</h3>
            <p>
              Tap the heart icon on any listing to save it here for later.
            </p>
            <Link to="/" className="btn btn-primary">
              Explore properties
            </Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((listing, i) => (
              <div key={listing.id} style={{ animationDelay: `${i * 0.06}s` }}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
