import { useQuery } from '@tanstack/react-query';
import { fetchLiveStatus } from '../api/client.js';
import { useTrainStore } from '../store/useTrainStore.js';
import { useEffect, useState } from 'react';

export function useTrainTracking(trainNumber: string) {
  const refreshIntervalSec = useTrainStore((state) => state.refreshIntervalSec);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(refreshIntervalSec);

  const query = useQuery({
    queryKey: ['trainStatus', trainNumber],
    queryFn: () => fetchLiveStatus(trainNumber),
    refetchInterval: refreshIntervalSec * 1000,
    staleTime: (refreshIntervalSec - 2) * 1000,
    enabled: Boolean(trainNumber),
  });

  useEffect(() => {
    setSecondsUntilRefresh(refreshIntervalSec);
    const interval = setInterval(() => {
      setSecondsUntilRefresh((prev) => (prev <= 1 ? refreshIntervalSec : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [refreshIntervalSec, query.dataUpdatedAt]);

  return {
    ...query,
    secondsUntilRefresh,
  };
}
