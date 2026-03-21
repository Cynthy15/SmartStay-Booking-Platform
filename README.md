# 🏡 StayNest — Accommodation Booking Platform

A production-grade Airbnb-inspired booking platform built with React + Vite, featuring real API integration, smart caching, and a polished warm-toned UI.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your API key to .env
echo "VITE_RAPID_API_KEY=your_key_here" > .env

# 3. Start the dev server
npm run dev
```

Then open `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── bookings/
│   │   └── BookingModal.jsx      # Global booking form modal (3-step flow)
│   ├── layout/
│   │   ├── Navbar.jsx             # Sticky top nav with search + auth
│   │   ├── FilterSidebar.jsx      # Price/rating/date/guest filters
│   │   └── ProtectedRoute.jsx     # Auth guard for protected pages
│   ├── listings/
│   │   └── ListingCard.jsx        # Card with image gallery, favorite, book
│   └── ui/
│       ├── Loader.jsx             # Skeleton loading cards + spinner
│       └── ErrorState.jsx         # User-friendly API error display
├── context/
│   ├── FavoritesContext.jsx       # Global favorites state (localStorage)
│   └── FiltersContext.jsx         # Global filter state
├── hooks/
│   └── useListings.js             # TanStack Query hooks for API calls
├── pages/
│   ├── Home.jsx                   # Listings feed with filter sidebar
│   ├── ListingDetails.jsx         # Full property view + booking card
│   ├── Bookings.jsx               # Trip history dashboard
│   ├── Favorites.jsx              # Saved listings grid
│   └── Login.jsx                  # Auth page (simulated)
├── services/
│   └── api.js                     # Axios instance + data normalization
├── store/
│   ├── authStore.js               # Zustand: user authentication state
│   └── bookingsStore.js           # Zustand: bookings + modal state
├── App.jsx                        # Routes + provider tree
├── main.jsx                       # Entry point + QueryClient setup
└── index.css                      # Design system (CSS variables + utilities)
```

---

## 🔌 API Integration

**Provider:** RapidAPI — Airbnb19  
**Base URL:** `https://airbnb19.p.rapidapi.com`

### Environment Variable
```
VITE_RAPID_API_KEY=your_rapidapi_key
```
API keys are **never hardcoded** — always loaded from `.env` via `import.meta.env`.

### Axios Configuration (`src/services/api.js`)
- Centralized Axios instance with `baseURL` and required headers pre-set
- `fetchListings()` — searches properties by `placeId`
- `fetchListingDetails()` — fetches a single property by ID
- `normalizeListings()` / `normalizeDetails()` — flatten deeply nested API responses into clean objects

---

## ⚡ State Management

| Type | Tool | Used For |
|------|------|----------|
| Local state | `useState` | Forms, UI toggles, image index |
| Global state | Context API | Favorites (persisted), active filters |
| Server state | TanStack Query | API listings, listing details |
| Complex shared state | Zustand | Bookings, auth, booking modal |

### TanStack Query Caching
- `staleTime: 5 minutes` — no unnecessary refetches while browsing
- `gcTime: 10 minutes` — cached data survives page navigation
- `placeholderData` — shows previous results while fetching new ones
- `queryKey` includes all filter params — each unique search has its own cache entry

---

## 🛣️ Routes

| Path | Page | Auth Required |
|------|------|---------------|
| `/` | Listings feed | No |
| `/listing/:id` | Property details | No |
| `/favorites` | Saved listings | No |
| `/bookings` | Trip history | **Yes** |
| `/login` | Sign in | No |

---

## 💾 Persistence

- **Favorites** — saved to `localStorage` via `FavoritesContext`
- **Bookings** — saved to `localStorage` via Zustand store
- **Auth** — user session in `localStorage` via Zustand

---

## 🎨 Design System

Built with CSS custom properties:
- **Fonts:** Playfair Display (headings) + DM Sans (body)
- **Colors:** Warm cream background, terracotta accent, forest green secondary
- **Animations:** Fade-in-up page transitions, skeleton loading, hover lifts

---

## 🚢 Deployment

```bash
npm run build
```

Deploy the `dist/` folder to **Vercel** or **Netlify**.  
Set `VITE_RAPID_API_KEY` as an environment variable in your deployment dashboard.
