// src/hooks/useListings.js
// Custom hooks that wrap TanStack Query for clean data fetching

import { useQuery } from '@tanstack/react-query'
import { fetchListings, fetchListingDetails } from '../services/api'

// ── Hook: Fetch a list of properties ─────────────────────────────────────────
// queryKey includes all filter params so cache is per-search
export function useListings(filters) {
  return useQuery({
    queryKey: ['listings', filters?.placeId, filters?.checkin, filters?.checkout, filters?.adults],
    queryFn: () => fetchListings(filters || {}),
    enabled: true,                     // always attempt to load; fallbacks handled in fetchListings
    staleTime: 5 * 60 * 1000,          // 5 minutes before considered stale
    gcTime: 10 * 60 * 1000,            // Keep in cache for 10 minutes
    placeholderData: (prev) => prev,   // Keep showing old data while fetching new
  })
}

// ── Hook: Fetch details for a single property ─────────────────────────────────
export function useListingDetails(id) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => fetchListingDetails(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,      // Detail pages stay fresh longer
  })
}
