import { useState } from 'react';
import { Search, ArrowUpDown, X, MapPin } from 'lucide-react';
import { fetchTrainsBetween } from '../../api/client.js';
import type { TrainSearchResult } from '../../types/index.js';

interface WimtSearchCardsProps {
  onSelectTrain: (trainNumber: string) => void;
  onFindTrains?: (from: string, to: string) => void;
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
  { name: 'Chennai Central', code: 'MAS' },
  { name: 'KSR Bengaluru City', code: 'SBC' },
  { name: 'Bengaluru Cantt.', code: 'BNC' },
  { name: 'Hyderabad Deccan', code: 'HYB' },
  { name: 'Godhra Junction', code: 'GDA' },
  { name: 'Kharsaliya', code: 'KRSA' },
];

const COMMON_RECENT_SEARCHES = [
  { number: '12951', name: 'Mumbai Central - New Delhi Tejas Rajdhani', route: 'MMCT - NDLS' },
  { number: '37305', name: 'Howrah - Haripal Local (EMU)', route: 'HWH - HPL' },
  { number: '37309', name: 'Howrah - Tarakeswar Local (EMU)', route: 'HWH - TAK' },
  { number: '15960', name: 'Kamrup Express', route: 'GOGH - HWH' },
  { number: '22436', name: 'Vande Bharat Express', route: 'NDLS - BSB' },
  { number: '12002', name: 'Bhopal Shatabdi Express', route: 'NDLS - RKMP' },
  { number: '12626', name: 'Kerala Express', route: 'NDLS - TVC' },
  { number: '12301', name: 'Howrah Rajdhani Express', route: 'HWH - NDLS' },
];

export default function WimtSearchCards({ onSelectTrain, onFindTrains }: WimtSearchCardsProps) {
  const [fromQuery, setFromQuery] = useState('Goghat (GOGH)');
  const [toQuery, setToQuery] = useState('Howrah Junction (HWH)');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const [spotTrainQuery, setSpotTrainQuery] = useState('12951 Tejas Rajdhani Express');
  const [liveStationQuery, setLiveStationQuery] = useState('Howrah Junction (HWH)');

  const [routeResults, setRouteResults] = useState<TrainSearchResult[]>([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSwap = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  };

  const handleFindTrains = async () => {
    if (onFindTrains) {
      onFindTrains(fromQuery, toQuery);
      return;
    }
    setIsSearching(true);
    setShowResultsModal(true);
    try {
      const results = await fetchTrainsBetween(fromQuery, toQuery);
      setRouteResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSpotTrainSearch = async () => {
    const match = spotTrainQuery.match(/\d{5}/);
    const trainNum = match ? match[0] : spotTrainQuery.trim() || '12951';
    onSelectTrain(trainNum);
  };

  const extractCode = (str: string) => {
    const m = str.match(/\((.*?)\)/);
    if (m && m[1]) return m[1].toUpperCase();
    return str.substring(0, 3).toUpperCase();
  };

  const filteredFromStations = COMMON_STATIONS.filter(
    s => s.name.toLowerCase().includes(fromQuery.toLowerCase()) || s.code.toLowerCase().includes(fromQuery.toLowerCase())
  );

  const filteredToStations = COMMON_STATIONS.filter(
    s => s.name.toLowerCase().includes(toQuery.toLowerCase()) || s.code.toLowerCase().includes(toQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4 font-sans select-none pb-8">
      
      {/* 1. From -> To Station Search Card */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 space-y-3 relative">
        
        {/* Connection Line & Dots */}
        <div className="relative space-y-3">
          
          <div className="absolute left-[18px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-slate-300 z-0"></div>

          {/* From Input Row */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-sm shrink-0"></div>
            
            <div className="relative flex-1">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus-within:border-blue-600">
                <span className="px-1.5 py-0.5 bg-blue-600 text-white font-bold text-[11px] rounded uppercase shrink-0">
                  {extractCode(fromQuery)}
                </span>
                <input
                  type="text"
                  value={fromQuery}
                  onChange={(e) => {
                    setFromQuery(e.target.value);
                    setShowFromDropdown(true);
                  }}
                  onFocus={() => setShowFromDropdown(true)}
                  placeholder="From Station"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
                />
                {fromQuery && (
                  <button onClick={() => setFromQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* From Autocomplete Dropdown List */}
              {showFromDropdown && filteredFromStations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto">
                  {filteredFromStations.map((st) => (
                    <div
                      key={st.code}
                      onClick={() => {
                        setFromQuery(`${st.name} (${st.code})`);
                        setShowFromDropdown(false);
                      }}
                      className="px-3 py-2 text-xs text-slate-800 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-semibold">{st.name}</span>
                      </div>
                      <span className="font-bold text-blue-600">({st.code})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap Floating Button */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={handleSwap}
              className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md border-2 border-white transition-transform active:scale-95"
              title="Swap Stations"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* To Input Row */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-4 h-4 rounded-full bg-amber-600 border-2 border-white shadow-sm shrink-0"></div>
            
            <div className="relative flex-1">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus-within:border-blue-600">
                <span className="px-1.5 py-0.5 bg-blue-600 text-white font-bold text-[11px] rounded uppercase shrink-0">
                  {extractCode(toQuery)}
                </span>
                <input
                  type="text"
                  value={toQuery}
                  onChange={(e) => {
                    setToQuery(e.target.value);
                    setShowToDropdown(true);
                  }}
                  onFocus={() => setShowToDropdown(true)}
                  placeholder="To Station"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
                />
                {toQuery && (
                  <button onClick={() => setToQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* To Autocomplete Dropdown List */}
              {showToDropdown && filteredToStations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto">
                  {filteredToStations.map((st) => (
                    <div
                      key={st.code}
                      onClick={() => {
                        setToQuery(`${st.name} (${st.code})`);
                        setShowToDropdown(false);
                      }}
                      className="px-3 py-2 text-xs text-slate-800 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-semibold">{st.name}</span>
                      </div>
                      <span className="font-bold text-blue-600">({st.code})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Big Green Find Trains Button */}
        <button
          onClick={handleFindTrains}
          className="w-full py-3 bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-base rounded shadow-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Search className="w-5 h-5" />
          <span>Find Trains</span>
        </button>

      </div>

      {/* 2. SPOT TRAIN Card */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 inline-block rounded-br text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">
          SPOT TRAIN
        </div>
        
        <div className="p-3 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus-within:border-blue-600">
            <span className="px-1.5 py-0.5 bg-blue-600 text-white font-bold text-[11px] rounded shrink-0">
              {spotTrainQuery.match(/\d{5}/)?.[0] || '12951'}
            </span>
            <input
              type="text"
              value={spotTrainQuery}
              onChange={(e) => setSpotTrainQuery(e.target.value)}
              placeholder="Train No. or Train Name"
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
            />
            {spotTrainQuery && (
              <button onClick={() => setSpotTrainQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={handleSpotTrainSearch}
            className="p-2.5 bg-[#4CAF50] hover:bg-[#43A047] text-white rounded shadow-sm transition-colors shrink-0"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. LIVE STATION Card */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 inline-block rounded-br text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">
          LIVE STATION
        </div>
        
        <div className="p-3 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus-within:border-blue-600">
            <span className="px-1.5 py-0.5 bg-blue-600 text-white font-bold text-[11px] rounded uppercase shrink-0">
              {extractCode(liveStationQuery)}
            </span>
            <input
              type="text"
              value={liveStationQuery}
              onChange={(e) => setLiveStationQuery(e.target.value)}
              placeholder="Station Name"
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
            />
            {liveStationQuery && (
              <button onClick={() => setLiveStationQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={handleFindTrains}
            className="p-2.5 bg-[#4CAF50] hover:bg-[#43A047] text-white rounded shadow-sm transition-colors shrink-0"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 4. Recent Searches Table */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {COMMON_RECENT_SEARCHES.map((item) => (
            <div
              key={item.number}
              onClick={() => onSelectTrain(item.number)}
              className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-bold text-slate-800 w-12">{item.number}</span>
                <span className="font-medium text-slate-700 truncate max-w-[240px] sm:max-w-md">{item.name}</span>
              </div>
              <span className="font-semibold text-slate-500 uppercase tracking-wider shrink-0">{item.route}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trains Between Stations Modal Result */}
      {showResultsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-lg p-5 space-y-4 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Trains Between Stations</h3>
                <p className="text-xs text-slate-500">{fromQuery} &rarr; {toQuery}</p>
              </div>
              <button onClick={() => setShowResultsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSearching ? (
              <div className="py-8 text-center text-xs text-slate-500">Searching active trains...</div>
            ) : routeResults.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {routeResults.map((t) => (
                  <div
                    key={t.trainNumber}
                    onClick={() => {
                      onSelectTrain(t.trainNumber);
                      setShowResultsModal(false);
                    }}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-bold text-blue-700 text-sm">#{t.trainNumber} {t.trainName}</div>
                      <div className="text-xs text-slate-600 mt-1">Dep: {t.departureTime || '13:35'} | Arr: {t.arrivalTime || '04:40'}</div>
                    </div>
                    <span className="px-3 py-1 bg-[#4CAF50] text-white font-bold text-xs rounded">Spot &rarr;</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">No trains found on route.</div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
