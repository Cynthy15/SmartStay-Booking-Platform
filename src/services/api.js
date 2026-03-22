import create from 'zustand'
import axios from 'axios'

const DEFAULT_PLACE_ID = 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ' // Paris

if (!import.meta.env.VITE_RAPID_API_KEY) {
  throw new Error('Missing VITE_RAPID_API_KEY in .env')
}

// Axios instance
const api = axios.create({
  baseURL: 'https://airbnb19.p.rapidapi.com',
  timeout: 10000,
  params: {
    limit: 12, // max 12 results
  },
  headers: {
    'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
    'x-rapidapi-host': 'airbnb19.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
})

// ──────────────── RETRY INTERCEPTOR ────────────────
const sleep = (ms) => new Promise((res) => setTimeout(res, ms))
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    // Retry once on 429
    if (response?.status === 429 && !config._retry) {
      console.warn('⚠️ Rate limit hit. Retrying in 10s...')
      config._retry = true
      await sleep(10000)
      return api(config)
    }
    return Promise.reject(error)
  }
)

const cache = new Map()

const MOCK_LISTINGS = [
  { id: 'mock-1', name: 'Charming Montmartre Apartment', city: 'Paris', personCapacity: 4, bedrooms: 2, bathrooms: 1, rating: 4.92, priceLabel: '$145 / night', price: 145, isSuperhost: true, images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'] },
  { id: 'mock-2', name: 'Sunny Loft with Eiffel Tower View', city: 'Paris', personCapacity: 2, bedrooms: 1, bathrooms: 1, rating: 4.87, priceLabel: '$220 / night', price: 220, isSuperhost: false, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'] },
  { id: 'mock-3', name: 'Cozy Studio near the Louvre', city: 'Paris', personCapacity: 2, bedrooms: 1, bathrooms: 1, rating: 4.75, priceLabel: '$98 / night', price: 98, isSuperhost: false, images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'] },
]

export async function fetchListings({ placeId, checkin, checkout, adults = 1 }) {
  const safePlaceId = placeId || DEFAULT_PLACE_ID
  const params = { placeId: safePlaceId, adults }
  if (checkin) params.checkin = checkin
  if (checkout) params.checkout = checkout

  const cacheKey = JSON.stringify(params)
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  try {
    const { data } = await api.get('/api/v2/searchPropertyByPlaceId', { params })
    const listings = normalizeListings(data)

    // If API fails or empty, fallback to mock
    if (!listings.length) {
      console.warn('⚠️ Empty API response, using mock data')
      cache.set(cacheKey, MOCK_LISTINGS)
      return MOCK_LISTINGS
    }

    cache.set(cacheKey, listings)
    return listings
  } catch (err) {
    console.error('❌ Fetch listings error:', err.message)
    // fallback mock
    cache.set(cacheKey, MOCK_LISTINGS)
    return MOCK_LISTINGS
  }
}

// ──────────────── FETCH LISTING DETAILS ────────────────
export async function fetchListingDetails(id) {
  const cacheKey = `details-${id}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  try {
    const { data } = await api.get('/api/v2/getPropertyDetails', { params: { id } })
    const details = normalizeDetails(data)
    cache.set(cacheKey, details)
    return details
  } catch (err) {
    console.error('❌ Fetch listing details error:', err.message)
    // fallback single mock listing
    const fallback = MOCK_LISTINGS.find((l) => l.id === id) || MOCK_LISTINGS[0]
    const details = { ...fallback, description: 'Demo description', amenities: ['wifi', 'kitchen', 'parking'], hostName: 'Demo Host' }
    cache.set(cacheKey, details)
    return details
  }
}

// ──────────────── NORMALIZATION ────────────────
function normalizeListings(data) {
  const raw = data?.data?.list ?? []
  if (!Array.isArray(raw)) return []

  return raw.map((item) => {
    const listing = item?.listing ?? item
    const pricing = item?.pricingQuote ?? {}
    const rate = pricing?.structuredStayDisplayPrice?.primaryLine ?? {}

    return {
      id: listing?.id ?? Math.random().toString(36).slice(2),
      name: listing?.name ?? 'Beautiful Property',
      city: listing?.city ?? '',
      personCapacity: listing?.personCapacity ?? 2,
      bedrooms: listing?.bedrooms ?? 1,
      bathrooms: listing?.bathrooms ?? 1,
      rating: parseFloat(listing?.avgRating ?? 0),
      price: rate?.price ?? pricing?.rate?.amount ?? null,
      priceLabel: rate?.price ? `${rate.price} / night` : 'Price on request',
      images: listing?.contextualPictures?.map((p) => p.picture) ?? [listing?.pictureUrl].filter(Boolean),
      isSuperhost: listing?.isSuperhost ?? false,
      lat: listing?.lat ?? null,
      lng: listing?.lng ?? null,
    }
  })
}

function normalizeDetails(data) {
  const d = data?.data?.pdpListingDetail ?? data?.data ?? {}
  return {
    id: d?.id,
    name: d?.name ?? 'Lovely Property',
    description: d?.summary ?? '',
    city: d?.city ?? '',
    country: d?.country ?? '',
    personCapacity: d?.personCapacity ?? 2,
    bedrooms: d?.bedrooms ?? 1,
    beds: d?.beds ?? 1,
    bathrooms: d?.bathrooms ?? 1,
    rating: parseFloat(d?.avgRating ?? 0),
    images: d?.photos?.map((p) => p?.baseUrl ?? p?.picture) ?? [],
    hostName: d?.primaryHost?.firstName ?? 'Host',
    isSuperhost: d?.primaryHost?.isSuperhost ?? false,
    lat: d?.lat ?? null,
    lng: d?.lng ?? null,
  }
}

export default api