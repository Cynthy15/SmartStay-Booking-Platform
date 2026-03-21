import axios from 'axios'

const DEFAULT_PLACE_ID = 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ' // Paris by default

function assertApiKey() {
  if (!import.meta.env.VITE_RAPID_API_KEY) {
    throw new Error('Missing VITE_RAPID_API_KEY environment variable. Add it to .env and restart dev server.')
  }
}

assertApiKey()

const api = axios.create({
  baseURL: 'https://airbnb19.p.rapidapi.com',
  timeout: 10000, // 10 seconds max
  headers: {
    'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
    'x-rapidapi-host': 'airbnb19.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
})

const cache = new Map()

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error

    //  Retry if rate limited, but ONLY ONCE
    if (response?.status === 429 && !config._retry) {
      console.warn('Rate limit hit. Retrying in 2s...')
      config._retry = true
      await sleep(2000)
      return api(config)
    }

    // Timeout or network issue
    if (error.code === 'ECONNABORTED') {
      console.error(' Request timeout')
    }

    return Promise.reject(error)
  }
)
export async function fetchListings({
  placeId,
  checkin,
  checkout,
  adults = 1,
}) {
  const safePlaceId = placeId || DEFAULT_PLACE_ID
  const params = { placeId: safePlaceId, adults }
  if (checkin) params.checkin = checkin
  if (checkout) params.checkout = checkout

  const cacheKey = JSON.stringify(params)

  // Return cached data
  if (cache.has(cacheKey)) {
    console.log('⚡ Using cached listings')
    return cache.get(cacheKey)
  }

  console.log('Fetching listings for placeId=', safePlaceId, 'checkin=', checkin, 'checkout=', checkout, 'adults=', adults)

  try {
    const { data } = await api.get('/api/v2/searchPropertyByPlaceId', { params })

    const normalized = normalizeListings(data)

    // fallback if API returns nothing
    if (!normalized.length) {
      console.warn('⚠️ Empty API response, using fallback data')
      return getFallbackListings()
    }

    cache.set(cacheKey, normalized)
    return normalized
  } catch (error) {
    console.error('❌ Fetch listings error:', error?.response?.status || error?.code, error?.message)

    // gracefully fallback
    console.warn('⚠️ API error, using fallback data')
    return []
  }
}
// FETCH DETAILS
export async function fetchListingDetails(id) {
  const cacheKey = `details-${id}`

  if (cache.has(cacheKey)) {
    console.log('⚡ Using cached details')
    return cache.get(cacheKey)
  }

  console.log('Fetching listing details...')

  try {
    const { data } = await api.get(
      '/api/v2/getPropertyDetails',
      { params: { id } }
    )

    const normalized = normalizeDetails(data)

    cache.set(cacheKey, normalized)
    return normalized
  } catch (error) {
    console.error('❌ Fetch details error:', error.message)

    // fallback via mock data
    const fallback = getFallbackListings().find(m => m.id === id)
    if (fallback) {
      return {
        ...fallback,
        description: 'A beautiful place for your perfect stay. Unwind and relax in style. Enjoy an amazing stay with comfortable beds, modern amenities, and beautiful views! Located right in the heart of the city.',
        amenities: ['wifi', 'tv', 'kitchen', 'air conditioning', 'parking'],
        hostName: 'Demo Host',
      }
    }

    return {
      id,
      name: 'Demo Property',
      description: 'No data available (API issue)',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      amenities: [],
    }
  }
}
// FALLBACK DATA
function getFallbackListings() {
  return [
    { id: 'mock-1', name: 'Charming Montmartre Apartment', city: 'Paris', personCapacity: 4, bedrooms: 2, bathrooms: 1, rating: '4.92', reviewCount: 128, priceLabel: '$145 / night', price: 145, isSuperhost: true, images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'] },
    { id: 'mock-2', name: 'Sunny Loft with Eiffel Tower View', city: 'Paris', personCapacity: 2, bedrooms: 1, bathrooms: 1, rating: '4.87', reviewCount: 94, priceLabel: '$220 / night', price: 220, isSuperhost: false, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'] },
    { id: 'mock-3', name: 'Cozy Studio near the Louvre', city: 'Paris', personCapacity: 2, bedrooms: 1, bathrooms: 1, rating: '4.75', reviewCount: 67, priceLabel: '$98 / night', price: 98, isSuperhost: false, images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'] },
    { id: 'mock-4', name: 'Elegant Haussmann Flat', city: 'Paris', personCapacity: 6, bedrooms: 3, bathrooms: 2, rating: '4.96', reviewCount: 203, priceLabel: '$380 / night', price: 380, isSuperhost: true, images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'] },
    { id: 'mock-5', name: 'Bohemian Artist Retreat', city: 'Paris', personCapacity: 3, bedrooms: 2, bathrooms: 1, rating: '4.80', reviewCount: 41, priceLabel: '$175 / night', price: 175, isSuperhost: false, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'] },
    { id: 'mock-6', name: 'Modern Penthouse with Rooftop', city: 'Paris', personCapacity: 4, bedrooms: 2, bathrooms: 2, rating: '4.94', reviewCount: 76, priceLabel: '$310 / night', price: 310, isSuperhost: true, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'] },
  ]
}
// NORMALIZATION 
function normalizeListings(data) {
  const raw = data?.data?.list ?? data?.data ?? []

  if (!Array.isArray(raw)) return []

  return raw.map((item) => {
    const listing = item?.listing ?? item
    const pricing = item?.pricingQuote ?? {}
    const rate = pricing?.structuredStayDisplayPrice?.primaryLine ?? {}

    return {
      id:
        listing?.id ??
        listing?.listingId ??
        Math.random().toString(36).slice(2),
      name: listing?.name ?? 'Beautiful Property',
      city: listing?.city ?? '',
      roomType: listing?.roomTypeCategory ?? 'entire_home',
      personCapacity: listing?.personCapacity ?? 2,
      bedrooms: listing?.bedrooms ?? 1,
      bathrooms: listing?.bathrooms ?? 1,
      rating:
        listing?.avgRatingA11yLabel ??
        listing?.avgRating ??
        null,
      reviewCount: listing?.reviewsCount ?? 0,
      price: rate?.price ?? pricing?.rate?.amount ?? null,
      priceLabel: rate?.price
        ? `${rate.price} / night`
        : pricing?.rate?.amountFormatted
        ? `${pricing.rate.amountFormatted} / night`
        : 'Price on request',
      images:
        listing?.contextualPictures?.map((p) => p.picture) ??
        [listing?.pictureUrl].filter(Boolean),
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
    rating: d?.avgRatingA11yLabel ?? null,
    reviewCount: d?.reviewsCount ?? 0,
    images: d?.photos?.map((p) => p?.baseUrl ?? p?.picture) ?? [],
    amenities: [],
    hostName: d?.primaryHost?.firstName ?? 'Host',
    isSuperhost: d?.primaryHost?.isSuperhost ?? false,
    lat: d?.lat ?? null,
    lng: d?.lng ?? null,
  }
}

export default api