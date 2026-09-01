import { useState, useEffect } from 'react';
import { Search, ArrowRightLeft, RefreshCw, Share2, Bell, Target, Train, X, ArrowRight, MapPin } from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore.js';
import { fetchTrainSearch, fetchTrainsBetween } from '../../api/client.js';
import type { TrainSearchResult } from '../../types/index.js';
import ShareModal from '../ui/ShareModal.js';

interface TopHeaderBarProps {
  secondsUntilRefresh?: number;
  onShareClick?: () => void;
}

const COMMON_STATIONS = [
  { name: 'Goghat (Gosaigaonhat)', code: 'GOGH' },
  { name: 'Tarakeswar', code: 'TAK' },
  { name: 'Haripal', code: 'HPL' },
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
  const [searchMode, setSearchMode] = useState<'route' | 'train'>('route');
  
  // Train No / Name Search State
  const [trainQuery, setTrainQuery] = useState('');
  const [trainSuggestions, setTrainSuggestions] = useState<TrainSearchResult[]>([]);
  const [showTrainSuggestions, setShowTrainSuggestions] = useState(false);

  // Route Search State
  const [fromQuery, setFromQuery] = useState('Howrah Junction (HWH)');
  const [toQuery, setToQuery] = useState('Tarakeswar (TAK)');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [routeResults, setRouteResults] = useState<TrainSearchResult[]>([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [showShare, setShowShare] = useState(false);
  const { setSelectedTrainNumber, setActiveTab } = useTrainStore();

  // Search Train No/Name debounce
  useEffect(() => {
    if (!trainQuery.trim()) {
      setTrainSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetchTrainSearch(trainQuery);
        setTrainSuggestions(res);
      } catch (err) {
        console.error(err);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [trainQuery]);

  const handleSwap = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  };

  const handleRouteSearch = async () => {
    setIsSearching(true);
    setShowResultsModal(true);
    try {
      const results = await fetchTrainsBetween(fromQuery, toQuery);
      setRouteResults(results);
    } catch (err) {
      console.error('Failed to search trains between stations', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTrain = (num: string) => {
    setSelectedTrainNumber(num);
    setShowResultsModal(false);
    setShowTrainSuggestions(false);
    setTrainQuery('');
    setActiveTab('dashboard');
  };

  return (
    <>
      <header className="w-full bg-[#080C14] border-b border-slate-800/80 px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-20">
        
        {/* Single Row Search Container */}
        <div className="flex items-center gap-3 flex-1 max-w-4xl min-w-0">
          
          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setSearchMode('route')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                searchMode === 'route'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">By Route</span>
              <span className="sm:hidden">Route</span>
            </button>

            <button
              onClick={() => setSearchMode('train')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                searchMode === 'train'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Train className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">By Train No</span>
              <span className="sm:hidden">Train</span>
            </button>
          </div>

          {/* Mode 1: Search by Route (From -> To) */}
          {searchMode === 'route' ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              
              {/* From Input */}
              <div className="relative flex-1 min-w-[140px]">
                <div className="absolute top-1 left-3 text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                  From
                </div>
                <input
                  type="text"
                  value={fromQuery}
                  onChange={(e) => setFromQuery(e.target.value)}
                  onFocus={() => setShowFromSuggestions(true)}
                  placeholder="From Station..."
                  className="w-full pt-4 pb-1.5 pl-3 pr-7 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors truncate"
                />
                <Target className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 bottom-2" />

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
              <div className="relative flex-1 min-w-[140px]">
                <div className="absolute top-1 left-3 text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                  To
                </div>
                <input
                  type="text"
                  value={toQuery}
                  onChange={(e) => setToQuery(e.target.value)}
                  onFocus={() => setShowToSuggestions(true)}
                  placeholder="To Station..."
                  className="w-full pt-4 pb-1.5 pl-3 pr-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors truncate"
                />

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

              {/* Search Button */}
              <button
                onClick={handleRouteSearch}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>

            </div>
          ) : (
            /* Mode 2: Search by Train No or Name */
            <div className="relative flex-1 min-w-0">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-blue-400 absolute left-3.5" />
                <input
                  type="text"
                  value={trainQuery}
                  onChange={(e) => {
                    setTrainQuery(e.target.value);
                    setShowTrainSuggestions(true);
                  }}
                  onFocus={() => setShowTrainSuggestions(true)}
                  placeholder="Enter train number or local name (e.g. 37305, 12951, Goghat Local)..."
                  className="w-full pl-10 pr-8 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {trainQuery && (
                  <button onClick={() => setTrainQuery('')} className="absolute right-3 text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Train No / Name Suggestions Dropdown */}
              {showTrainSuggestions && trainSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
                  {trainSuggestions.map((t) => (
                    <div
                      key={t.trainNumber}
                      onClick={() => handleSelectTrain(t.trainNumber)}
                      className="px-3.5 py-2.5 hover:bg-slate-800 cursor-pointer flex items-center justify-between border-b border-slate-800/50"
                    >
                      <div className="flex items-center gap-2.5">
                        <Train className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="flex items-center gap-2 text-xs font-bold text-white">
                            <span>#{t.trainNumber}</span>
                            <span>{t.trainName}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{t.source} &rarr; {t.destination}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-400">Track &rarr;</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Actions: Sync Timer, Share & Notification Bell */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-blue-400">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Sync <strong className="text-white">{secondsUntilRefresh}s</strong></span>
          </div>

          <button
            onClick={() => onShareClick ? onShareClick() : setShowShare(true)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

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
                <h3 className="font-bold text-white text-base">Available Trains on Route</h3>
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
                <span>Finding active local &amp; express trains...</span>
              </div>
            ) : routeResults.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {routeResults.map((t) => (
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
