import { useState } from 'react';
import { useTrainStore } from '../store/useTrainStore.js';
import { useTrainTracking } from '../hooks/useTrainTracking.js';
import WimtHeader from '../components/wimt/WimtHeader.js';
import WimtSearchCards from '../components/wimt/WimtSearchCards.js';
import WimtTrainsList from '../components/wimt/WimtTrainsList.js';
import WimtTrainTimeline from '../components/wimt/WimtTrainTimeline.js';
import TrainMap from '../components/map/TrainMap.js';
import SkeletonLoader from '../components/ui/SkeletonLoader.js';
import ErrorState from '../components/ui/ErrorState.js';
import { fetchTrainsBetween } from '../api/client.js';
import type { TrainSearchResult } from '../types/index.js';
import { Heart } from 'lucide-react';

export default function LiveDashboard() {
  const { selectedTrainNumber, setSelectedTrainNumber, activeTab } = useTrainStore();
  const { data: status, isLoading, isError, refetch } = useTrainTracking(selectedTrainNumber);

  const [viewMode, setViewMode] = useState<'search' | 'list' | 'timeline'>('search');
  const [fromStation, setFromStation] = useState('Goghat (GOGH)');
  const [toStation, setToStation] = useState('Howrah Junction (HWH)');
  const [trainList, setTrainList] = useState<TrainSearchResult[]>([]);

  const handleFindTrains = async (from: string, to: string) => {
    setFromStation(from);
    setToStation(to);
    setViewMode('list');
    try {
      const results = await fetchTrainsBetween(from, to);
      setTrainList(results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectTrain = (num: string) => {
    setSelectedTrainNumber(num);
    setViewMode('timeline');
  };

  const handleBack = () => {
    if (viewMode === 'timeline') {
      setViewMode('list');
    } else {
      setViewMode('search');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Header Bar */}
      <WimtHeader />

      {/* 2. Main Content Body */}
      <main className="flex-1 p-3 sm:p-4">
        
        {/* If Active Tab is Map */}
        {activeTab === 'map' && status ? (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setViewMode('search')}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold"
              >
                &larr; Back to Search
              </button>
              <span className="font-bold text-slate-800 text-sm">
                Train #{status.trainNumber} - {status.trainName}
              </span>
            </div>
            <TrainMap status={status} />
          </div>
        ) : viewMode === 'list' ? (
          /* Full Morning to Night Trains Schedule List Screen */
          <WimtTrainsList
            fromStation={fromStation}
            toStation={toStation}
            trains={trainList}
            onSelectTrain={handleSelectTrain}
            onBack={() => setViewMode('search')}
          />
        ) : viewMode === 'timeline' && status ? (
          /* Live Train Running Status Screen */
          isLoading ? (
            <SkeletonLoader />
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <WimtTrainTimeline
              status={status}
              onBack={handleBack}
              onRefresh={() => refetch()}
            />
          )
        ) : (
          /* Default Search Cards View */
          <WimtSearchCards 
            onSelectTrain={handleSelectTrain} 
            onFindTrains={handleFindTrains}
          />
        )}

      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 bg-white">
        <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700">
          <span>Created with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline-block animate-pulse" />
          <span>by <strong className="text-blue-600 font-bold">Ankur</strong></span>
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          &copy; {new Date().getFullYear()} Where is my Train &bull; Powered by RailRadar.in API
        </p>
      </footer>

    </div>
  );
}
