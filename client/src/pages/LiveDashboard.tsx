import { useState } from 'react';
import { useTrainStore } from '../store/useTrainStore.js';
import { useTrainTracking } from '../hooks/useTrainTracking.js';
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
import JourneyHeader from '../components/journey/JourneyHeader.js';
import JourneyNavbar from '../components/journey/JourneyNavbar.js';
import DashboardTabs from '../components/ui/DashboardTabs.js';
import type { Station } from '../types/index.js';
import { Heart } from 'lucide-react';

export default function LiveDashboard() {
  const { selectedTrainNumber, activeTab } = useTrainStore();
  const { data: status, isLoading, isError, refetch, secondsUntilRefresh } = useTrainTracking(selectedTrainNumber);
  const [showShareModal, setShowShareModal] = useState(false);
  const [focusedStation, setFocusedStation] = useState<Station | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Journey Navbar */}
      <JourneyNavbar 
        trainNumber={status?.trainNumber}
        trainName={status?.trainName}
        delayMinutes={status?.delayMinutes}
        isStale={status?.isStale} 
        secondsUntilRefresh={secondsUntilRefresh}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-slate-950">
        {/* Dashboard Tabs Navigation */}
        <div className="max-w-7xl w-full mx-auto px-4 md:px-6 pt-4">
          <DashboardTabs />
        </div>

        {/* Page Content */}
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
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
            {/* 1. Dashboard View (Journey Header + Hero Card + Side-by-Side Map & Timeline Sidebar) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <JourneyHeader status={status} />
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
                <JourneyHeader status={status} />
                
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
                <JourneyHeader status={status} />
                <JourneyAnalyticsCard status={status} />
              </div>
            )}

            {/* 4. Travel Companion View */}
            {activeTab === 'companion' && (
              <div className="space-y-6">
                <JourneyHeader status={status} />
                <TravelCompanionCard status={status} />
              </div>
            )}

            {/* 5. App Settings View */}
            {activeTab === 'settings' && (
              <SettingsView />
            )}
          </>
        )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-400 space-y-2 bg-slate-900/50">
        <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-white">
          <span>Created with</span>
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500 inline-block animate-pulse" />
          <span>by <strong className="text-blue-400 font-bold">Ankur</strong></span>
        </p>
        <p className="text-[11px] text-slate-400">
          &copy; {new Date().getFullYear()} RailGaadi &bull; Powered by RailRadar.in, OpenWeather, OpenTopography & MapTiler
        </p>
      </footer>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal trainNumber={selectedTrainNumber} onClose={() => setShowShareModal(false)} />
      )}

    </div>
  );
}
