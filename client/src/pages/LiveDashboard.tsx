import { useState } from 'react';
import { useTrainStore } from '../store/useTrainStore.js';
import { useTrainTracking } from '../hooks/useTrainTracking.js';
import Navbar from '../components/ui/Navbar.js';
import SearchBar from '../components/ui/SearchBar.js';
import TrainCard from '../components/ui/TrainCard.js';
import SkeletonLoader from '../components/ui/SkeletonLoader.js';
import ErrorState from '../components/ui/ErrorState.js';
import TrainMap from '../components/map/TrainMap.js';
import StationTimelineSidebar from '../components/map/StationTimelineSidebar.js';
import JourneyAnalyticsCard from '../components/analytics/JourneyAnalyticsCard.js';
import TravelCompanionCard from '../components/companion/TravelCompanionCard.js';
import SettingsView from '../components/settings/SettingsView.js';
import ShareModal from '../components/ui/ShareModal.js';
import type { Station } from '../types/index.js';

export default function LiveDashboard() {
  const { selectedTrainNumber, activeTab } = useTrainStore();
  const { data: status, isLoading, isError, refetch, secondsUntilRefresh } = useTrainTracking(selectedTrainNumber);
  const [showShareModal, setShowShareModal] = useState(false);
  const [focusedStation, setFocusedStation] = useState<Station | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Floating Navbar */}
      <Navbar 
        secondsUntilRefresh={secondsUntilRefresh} 
        isStale={status?.isStale} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Search Bar Bar on Top of Dashboard Pages */}
        {activeTab !== 'settings' && (
          <div className="w-full">
            <SearchBar />
          </div>
        )}

        {/* Content Tabs Switcher */}
        {isLoading ? (
          <SkeletonLoader />
        ) : isError || !status ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <>
            {/* 1. Dashboard View (Hero Card + Side-by-Side Map & Timeline Sidebar) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <TrainCard status={status} onShareClick={() => setShowShareModal(true)} />
                
                {/* Side-by-Side Split: Live Map (Left 2 cols) + Where Is My Train Timeline Sidebar (Right 1 col) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <TrainMap status={status} selectedStation={focusedStation} />
                  </div>
                  <div className="lg:col-span-1">
                    <StationTimelineSidebar
                      status={status}
                      onSelectStation={(st) => setFocusedStation(st)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Full Map View with Side-by-Side Timeline */}
            {activeTab === 'map' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h2 className="text-xl font-bold text-white">Live Tracking Map & Route Timeline</h2>
                    <p className="text-xs text-slate-400">Train #{status.trainNumber} - {status.trainName}</p>
                  </div>
                  <span className="text-xs text-blue-400 font-semibold bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    Live GPS Stream
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <TrainMap status={status} selectedStation={focusedStation} />
                  </div>
                  <div className="lg:col-span-1">
                    <StationTimelineSidebar
                      status={status}
                      onSelectStation={(st) => setFocusedStation(st)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Journey Analytics View */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <JourneyAnalyticsCard status={status} />
              </div>
            )}

            {/* 4. Travel Companion View */}
            {activeTab === 'companion' && (
              <div className="space-y-6">
                <TravelCompanionCard status={status} />
              </div>
            )}

            {/* 5. App Settings View */}
            {activeTab === 'settings' && (
              <SettingsView />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>&copy; {new Date().getFullYear()} RailGaadi &bull; Powered by RailRadar.in, OpenWeather, OpenTopography & MapLibre GL</p>
        <p className="text-[11px] text-slate-600">Designed with Apple Maps aesthetics for Indian Railways passengers</p>
      </footer>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal trainNumber={selectedTrainNumber} onClose={() => setShowShareModal(false)} />
      )}

    </div>
  );
}
