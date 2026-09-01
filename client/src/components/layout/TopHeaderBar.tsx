import { useState } from 'react';
import { Search, ArrowRightLeft, RefreshCw, Share2, Bell, Target, Train, X, ArrowRight } from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore.js';
import { fetchTrainsBetween } from '../../api/client.js';
import type { TrainSearchResult } from '../../types/index.js';
import ShareModal from '../ui/ShareModal.js';

interface TopHeaderBarProps {
  secondsUntilRefresh?: number;
  onShareClick?: () => void;
}

const COMMON_STATIONS = [
  { name: 'Goghat (Gosaigaonhat)', code: 'GOGH' },
  { name: 'Howrah Junction', code: 'HWH' },
  { name: 'Mumbai Central', code: 'MMCT' },
  { name: 'New Delhi', code: 'NDLS' },
  { name: 'Kanpur Central', code: 'CNB' },
  { name: 'Prayagraj Junction', code: 'PRYJ' },
  { name: 'Varanasi Junction', code: 'BSB' },
  { name: 'Kolkata Sealdah', code: 'SDAH' },
  { name: 'Patna Junction', code: 'PNBE' },
  { name: 'Godhra Junction', code: 'GDA' },
  { name: 'Kharsaliya', code: 'KRSA' },
];

export default function TopHeaderBar({ secondsUntilRefresh = 9, onShareClick }: TopHeaderBarProps) {
  const [fromQuery, setFromQuery] = useState('Goghat (GOGH)');
  const [toQuery, setToQuery] = useState('Howrah (HWH)');
  const [showShare, setShowShare] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [trainOptions, setTrainOptions] = useState<TrainSearchResult[]>([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { setSelectedTrainNumber, setActiveTab } = useTrainStore();

  const handleSwap = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setShowResultsModal(true);
    try {
      const results = await fetchTrainsBetween(fromQuery, toQuery);
      setTrainOptions(results);
    } catch (err) {
      console.error('Failed to search trains between stations', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTrain = (num: string) => {
    setSelectedTrainNumber(num);
    setShowResultsModal(false);
    setActiveTab('dashboard');
  };

  return (
    <>
      <header className="w-full bg-[#080C14] border-b border-slate-800/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        
        {/* Center: From / To Train Search Widget */}
        <div className="flex flex-wrap items-center gap-2 max-w-2xl flex-1 relative">
          
          {/* From Input */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute top-1 left-3 text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
              From
            </div>
            <input
              type="text"
              value={fromQuery}
              onChange={(e) => setFromQuery(e.target.value)}
              onFocus={() => setShowFromSuggestions(true)}
              placeholder="e.g. Goghat (GOGH)..."
              className="w-full pt-4 pb-1.5 pl-3 pr-8 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <Target className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 bottom-2" />

            {/* From Station Suggestions Dropdown */}
            {showFromSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
                {COMMON_STATIONS.filter(s => s.name.toLowerCase().includes(fromQuery.toLowerCase()) || s.code.toLowerCase().includes(fromQuery.toLowerCase())).map(st => (
                  <div
                    key={st.code}
                    onClick={() => {
                      setFromQuery(`${st.name} (${st.code})`);
                      setShowFromSuggestions(false);
                    }}
                    className="px-3 py-2 text-xs text-white hover:bg-slate-800 cursor-pointer flex justify-between border-b border-slate-800/50"
                  >
                    <span>{st.name}</span>
                    <span className="font-bold text-blue-400">({st.code})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shrink-0"
            title="Swap Stations"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>

          {/* To Input */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute top-1 left-3 text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
              To
            </div>
            <input
              type="text"
              value={toQuery}
              onChange={(e) => setToQuery(e.target.value)}
              onFocus={() => setShowToSuggestions(true)}
              placeholder="e.g. Howrah (HWH)..."
              className="w-full pt-4 pb-1.5 pl-3 pr-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors"
            />

            {/* To Station Suggestions Dropdown */}
            {showToSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
                {COMMON_STATIONS.filter(s => s.name.toLowerCase().includes(toQuery.toLowerCase()) || s.code.toLowerCase().includes(toQuery.toLowerCase())).map(st => (
                  <div
                    key={st.code}
                    onClick={() => {
                      setToQuery(`${st.name} (${st.code})`);
                      setShowToSuggestions(false);
                    }}
                    className="px-3 py-2 text-xs text-white hover:bg-slate-800 cursor-pointer flex justify-between border-b border-slate-800/50"
                  >
                    <span>{st.name}</span>
                    <span className="font-bold text-blue-400">({st.code})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Train Button */}
          <button
            onClick={handleSearch}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Train</span>
          </button>

        </div>

        {/* Right Actions: Sync Timer, Share & Notification Bell */}
        <div className="flex items-center gap-2.5">
          
          {/* Sync Timer Pill */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-blue-400">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Sync <strong className="text-white">{secondsUntilRefresh}s</strong></span>
          </div>

          {/* Share Button */}
          <button
            onClick={() => onShareClick ? onShareClick() : setShowShare(true)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </button>
          </div>

        </div>

      </header>

      {/* Trains Between Stations Modal Result */}
      {showResultsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="card-panel w-full max-w-xl p-6 bg-slate-900 border border-slate-700 rounded-2xl space-y-4 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Trains Between Stations</h3>
                <p className="text-xs text-slate-400">
                  {fromQuery} &rarr; {toQuery}
                </p>
              </div>
              <button
                onClick={() => setShowResultsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSearching ? (
              <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Finding active trains on route...</span>
              </div>
            ) : trainOptions.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {trainOptions.map((t) => (
                  <div
                    key={t.trainNumber}
                    onClick={() => handleSelectTrain(t.trainNumber)}
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Train className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-400 text-xs">#{t.trainNumber}</span>
                          <span className="font-bold text-white text-sm">{t.trainName}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <span>Dep: <strong className="text-white">{t.departureTime || '13:35'}</strong></span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span>Arr: <strong className="text-emerald-400">{t.arrivalTime || '04:40'}</strong></span>
                        </p>
                      </div>
                    </div>

                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm">
                      Track Live &rarr;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No trains found running directly between these stations.
              </div>
            )}

          </div>
        </div>
      )}

      {showShare && (
        <ShareModal trainNumber="12951" onClose={() => setShowShare(false)} />
      )}
    </>
  );
}
