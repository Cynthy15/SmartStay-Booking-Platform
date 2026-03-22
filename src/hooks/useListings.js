import { useQuery } from '@tanstack/react-query'
import { fetchListings, fetchListingDetails } from '../services/api'

export function useListings(filters) {
  return useQuery({
    queryKey: ['listings', filters?.placeId, filters?.checkin, filters?.checkout, filters?.adults],
    queryFn: () => fetchListings(filters || {}),
    enabled: true,                     
    staleTime: 5 * 60 * 1000,          
    gcTime: 10 * 60 * 1000,            
    placeholderData: (prev) => prev,  
  })
}

export function useListingDetails(id) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => fetchListingDetails(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}
