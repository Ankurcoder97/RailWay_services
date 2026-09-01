import { useState } from 'react';
import { useTrainStore } from '../store/useTrainStore.js';
import { useTrainTracking } from '../hooks/useTrainTracking.js';
import AppSidebar from '../components/layout/AppSidebar.js';
import TopHeaderBar from '../components/layout/TopHeaderBar.js';
import TrainHeroDetail from '../components/dashboard/TrainHeroDetail.js';
import RightInfoSidebar from '../components/dashboard/RightInfoSidebar.js';
import TrainMap from '../components/map/TrainMap.js';
import StationTimelineSidebar from '../components/map/StationTimelineSidebar.js';
import JourneyAnalyticsCard from '../components/analytics/JourneyAnalyticsCard.js';
import TravelCompanionCard from '../components/companion/TravelCompanionCard.js';
import SettingsView from '../components/settings/SettingsView.js';
import ShareModal from '../components/ui/ShareModal.js';
import SkeletonLoader from '../components/ui/SkeletonLoader.js';
import ErrorState from '../components/ui/ErrorState.js';
import type { Station } from '../types/index.js';
import { Heart, Globe } from 'lucide-react';

export default function LiveDashboard() {
  const { selectedTrainNumber, activeTab } = useTrainStore();
  const { data: status, isLoading, isError, refetch, secondsUntilRefresh } = useTrainTracking(selectedTrainNumber);
  const [showShareModal, setShowShareModal] = useState(false);
  const [focusedStation, setFocusedStation] = useState<Station | null>(null);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex selection:bg-blue-600 selection:text-white font-sans">
      
      {/* 1. Left Vertical App Sidebar matching screenshot */}
      <AppSidebar />

      {/* Main Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* 2. Top Header Bar matching screenshot */}
        <TopHeaderBar 
          secondsUntilRefresh={secondsUntilRefresh}
          onShareClick={() => setShowShareModal(true)}
        />

        {/* 3. Primary Dashboard Body */}
        <main className="flex-1 p-4 md:p-6 space-y-6">
          
          {isLoading ? (
            <SkeletonLoader />
          ) : isError || !status ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <>
              {/* Main Dashboard View matching screenshot layout */}
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  
                  {/* Left 2 Columns (~70% width): Train Hero Detail + Route Map */}
                  <div className="lg:col-span-2 space-y-6">
                    <TrainHeroDetail
                      status={status}
                      onSelectStation={(st) => setFocusedStation(st)}
                      onShareClick={() => setShowShareModal(true)}
                    />

                    {/* Route Map Section matching screenshot */}
                    <div className="card-panel p-5 space-y-4 bg-slate-900/90 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <h3 className="font-bold text-white text-sm">Route Map</h3>
                      </div>
                      <TrainMap status={status} selectedStation={focusedStation} />
                    </div>
                  </div>

                  {/* Right 1 Column (~30% width): Weather, Train Info, Last Updated & Alerts */}
                  <div className="lg:col-span-1">
                    <RightInfoSidebar status={status} />
                  </div>

                </div>
              )}

              {/* Live Map Tab */}
              {activeTab === 'map' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
              )}

              {/* Stations Tab */}
              {activeTab === 'stations' && (
                <div className="max-w-4xl mx-auto">
                  <StationTimelineSidebar
                    status={status}
                    onSelectStation={(st) => setFocusedStation(st)}
                  />
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <JourneyAnalyticsCard status={status} />
              )}

              {/* Companion Tab */}
              {activeTab === 'companion' && (
                <TravelCompanionCard status={status} />
              )}

              {/* Alerts Tab */}
              {activeTab === 'alerts' && (
                <div className="card-panel p-6 max-w-2xl mx-auto space-y-4">
                  <h3 className="font-bold text-white text-base">Live Train Notifications &amp; Alerts</h3>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-200">Departed from {status.currentStation.name}</span>
                    <span className="text-emerald-400 font-bold">LIVE</span>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <SettingsView />
              )}
            </>
          )}

        </main>

        {/* 4. Footer with Created with ❤️ by Ankur */}
        <footer className="border-t border-slate-800/80 py-5 text-center text-xs text-slate-400 space-y-1 bg-[#080C14]">
          <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-white">
            <span>Created with</span>
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 inline-block animate-pulse" />
            <span>by <strong className="text-blue-400 font-bold">Ankur</strong></span>
          </p>
          <p className="text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} RailGaadi &bull; Powered by RailRadar.in, OpenWeather, OpenTopography &amp; MapTiler
          </p>
        </footer>

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal trainNumber={selectedTrainNumber} onClose={() => setShowShareModal(false)} />
      )}

    </div>
  );
}
