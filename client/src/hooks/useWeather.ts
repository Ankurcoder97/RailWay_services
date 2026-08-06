import { useQuery } from '@tanstack/react-query';
import { fetchStationWeather } from '../api/client.js';

export function useWeather(stationCode?: string, stationName?: string, lat?: number, lng?: number) {
  return useQuery({
    queryKey: ['weather', stationCode, lat, lng],
    queryFn: () => fetchStationWeather(stationCode || '', stationName || '', lat || 0, lng || 0),
    enabled: Boolean(stationCode && lat && lng),
    staleTime: 5 * 60 * 1000, // 5 mins
  });
}
