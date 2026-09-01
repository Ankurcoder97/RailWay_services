import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StationOption {
  code: string;
  name: string;
  state: string;
}

interface TrainStore {
  selectedTrainNumber: string;
  setSelectedTrainNumber: (trainNum: string) => void;
  fromStation: StationOption | null;
  setFromStation: (station: StationOption | null) => void;
  toStation: StationOption | null;
  setToStation: (station: StationOption | null) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  favouriteTrains: string[];
  toggleFavourite: (trainNum: string) => void;
  followTrainOnMap: boolean;
  setFollowTrainOnMap: (follow: boolean) => void;
  activeTab: 'dashboard' | 'analytics' | 'companion' | 'map' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'analytics' | 'companion' | 'map' | 'settings') => void;
  refreshIntervalSec: number;
  setRefreshIntervalSec: (sec: number) => void;
}

export const useTrainStore = create<TrainStore>()(
  persist(
    (set, get) => ({
      selectedTrainNumber: '22436', // Default Vande Bharat Express
      setSelectedTrainNumber: (trainNum: string) => set({ selectedTrainNumber: trainNum }),
      fromStation: null,
      setFromStation: (station: StationOption | null) => set({ fromStation: station }),
      toStation: null,
      setToStation: (station: StationOption | null) => set({ toStation: station }),
      recentSearches: ['22436', '12951', '12002'],
      addRecentSearch: (query: string) => {
        const current = get().recentSearches;
        const filtered = current.filter(q => q.toLowerCase() !== query.toLowerCase());
        set({ recentSearches: [query, ...filtered].slice(0, 8) });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
      favouriteTrains: ['22436', '12951'],
      toggleFavourite: (trainNum: string) => {
        const favs = get().favouriteTrains;
        if (favs.includes(trainNum)) {
          set({ favouriteTrains: favs.filter(f => f !== trainNum) });
        } else {
          set({ favouriteTrains: [...favs, trainNum] });
        }
      },
      followTrainOnMap: true,
      setFollowTrainOnMap: (follow: boolean) => set({ followTrainOnMap: follow }),
      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),
      refreshIntervalSec: 20,
      setRefreshIntervalSec: (sec: number) => set({ refreshIntervalSec: sec }),
    }),
    {
      name: 'railgaadi-storage',
      partialize: (state) => ({
        selectedTrainNumber: state.selectedTrainNumber,
        fromStation: state.fromStation,
        toStation: state.toStation,
        recentSearches: state.recentSearches,
        favouriteTrains: state.favouriteTrains,
        refreshIntervalSec: state.refreshIntervalSec,
      }),
    }
  )
);
