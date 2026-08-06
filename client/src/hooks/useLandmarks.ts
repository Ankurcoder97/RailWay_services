import { useQuery } from '@tanstack/react-query';
import { fetchNearbyLandmarks } from '../api/client.js';

export function useLandmarks(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ['landmarks', lat, lng],
    queryFn: () => fetchNearbyLandmarks(lat || 0, lng || 0),
    enabled: Boolean(lat && lng),
    staleTime: 10 * 60 * 1000,
  });
}
