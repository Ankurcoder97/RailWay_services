import { useQuery } from '@tanstack/react-query';
import { fetchElevationAnalytics } from '../api/client.js';

export function useAnalytics(trainNumber: string) {
  return useQuery({
    queryKey: ['analytics', trainNumber],
    queryFn: () => fetchElevationAnalytics(trainNumber),
    enabled: Boolean(trainNumber),
    staleTime: 15 * 60 * 1000,
  });
}
