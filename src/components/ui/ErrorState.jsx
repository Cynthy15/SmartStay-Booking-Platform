import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react'
import './ErrorState.css'

export default function ErrorState({ error, onRetry }) {
  // Detect rate limit errors from RapidAPI
  const isRateLimit =
    error?.response?.status === 429 ||
    error?.message?.toLowerCase().includes('rate limit') ||
    error?.message?.toLowerCase().includes('too many')

  const isNetwork =
    error?.code === 'ERR_NETWORK' || error?.message?.toLowerCase().includes('network')

  return (
    <div className="error-state">
      <div className="error-icon">
        {isNetwork ? <WifiOff size={36} /> : <AlertTriangle size={36} />}
      </div>

      <h3 className="error-title">
        {isRateLimit
          ? 'API Limit Reached'
          : isNetwork
          ? 'No Connection'
          : 'Something went wrong'}
      </h3>

      <p className="error-message">
        {isRateLimit
          ? 'You have exceeded the API rate limit. Please wait a moment before trying again.'
          : isNetwork
          ? 'Unable to reach the server. Please check your internet connection.'
          : error?.message || 'An unexpected error occurred. Please try again.'}
      </p>

      {onRetry && (
        <button className="btn btn-primary error-retry-btn" onClick={onRetry}>
          <RefreshCw size={15} />
          Try again
        </button>
      )}
    </div>
  )
}
