import { useState, useRef, useEffect } from 'react';
import { ArrowRightLeft, MapPin, Zap, Calendar, Users } from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore.js';

interface StationOption {
  code: string;
  name: string;
  state: string;
}

// Common Indian Railway stations
const POPULAR_STATIONS: StationOption[] = [
  { code: 'NDLS', name: 'New Delhi', state: 'Delhi' },
  { code: 'BOM', name: 'Mumbai Central', state: 'Maharashtra' },
  { code: 'BZA', name: 'Vijayawada Junction', state: 'Andhra Pradesh' },
  { code: 'HWH', name: 'Howrah', state: 'West Bengal' },
  { code: 'CSTM', name: 'Mumbai CST', state: 'Maharashtra' },
  { code: 'SBC', name: 'Bengaluru City', state: 'Karnataka' },
  { code: 'MAS', name: 'Chennai Central', state: 'Tamil Nadu' },
  { code: 'LTT', name: 'Lokmanya Tilak', state: 'Maharashtra' },
  { code: 'PNE', name: 'Pune', state: 'Maharashtra' },
  { code: 'AGC', name: 'Agra Cantt', state: 'Uttar Pradesh' },
  { code: 'JBP', name: 'Jabalpur', state: 'Madhya Pradesh' },
  { code: 'GZB', name: 'Ghaziabad', state: 'Uttar Pradesh' },
  { code: 'COK', name: 'Kochi Junction', state: 'Kerala' },
  { code: 'HYB', name: 'Hyderabad Deccan', state: 'Telangana' },
  { code: 'CSMT', name: 'Chhatrapati Shivaji', state: 'Maharashtra' },
];

export default function JourneySelector() {
  const { fromStation, toStation, setFromStation, setToStation } = useTrainStore();
  const [fromInput, setFromInput] = useState(fromStation?.name || '');
  const [toInput, setToInput] = useState(toStation?.name || '');
  const [fromSuggestions, setFromSuggestions] = useState<StationOption[]>([]);
  const [toSuggestions, setToSuggestions] = useState<StationOption[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  const filterStations = (input: string): StationOption[] => {
    if (!input.trim()) return POPULAR_STATIONS.slice(0, 6);
    return POPULAR_STATIONS.filter(
      s => s.name.toLowerCase().includes(input.toLowerCase()) || 
           s.code.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 8);
  };

  const handleFromInput = (value: string) => {
    setFromInput(value);
    setFromSuggestions(filterStations(value));
  };

  const handleToInput = (value: string) => {
    setToInput(value);
    setToSuggestions(filterStations(value));
  };

  const handleFromSelect = (station: StationOption) => {
    setFromStation(station);
    setFromInput(station.name);
    setShowFromDropdown(false);
  };

  const handleToSelect = (station: StationOption) => {
    setToStation(station);
    setToInput(station.name);
    setShowToDropdown(false);
  };

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
    setFromInput(toInput);
    setToInput(fromInput);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setShowToDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-400" />
            Plan Your Journey
          </h2>
          <p className="text-slate-400 text-sm mt-1">Select departure and arrival stations</p>
        </div>

        {/* Journey Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 relative">
          {/* From Station */}
          <div ref={fromRef} className="relative">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              From Station
            </label>
            <div className="relative">
              <input
                type="text"
                value={fromInput}
                onChange={(e) => handleFromInput(e.target.value)}
                onFocus={() => setShowFromDropdown(true)}
                placeholder="Enter departure station..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
              <MapPin className="absolute right-3 top-3.5 w-5 h-5 text-slate-500 pointer-events-none" />
            </div>

            {/* From Dropdown */}
            {showFromDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
                {fromSuggestions.length > 0 ? (
                  fromSuggestions.map((station) => (
                    <button
                      key={station.code}
                      onClick={() => handleFromSelect(station)}
                      className="w-full px-4 py-2.5 text-left hover:bg-slate-700 border-b border-slate-700 last:border-b-0 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white group-hover:text-blue-400">{station.name}</div>
                          <div className="text-xs text-slate-500">{station.code} • {station.state}</div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-400">No stations found</div>
                )}
              </div>
            )}
          </div>

          {/* Swap Button (Center) */}
          <div className="flex items-end justify-center pb-0 md:pb-3">
            <button
              onClick={swapStations}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all hover:scale-110 shadow-lg absolute md:relative md:top-auto md:left-auto top-8 left-1/2 -translate-x-1/2 md:translate-x-0 z-40"
              title="Swap stations"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* To Station */}
          <div ref={toRef} className="relative">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              To Station
            </label>
            <div className="relative">
              <input
                type="text"
                value={toInput}
                onChange={(e) => handleToInput(e.target.value)}
                onFocus={() => setShowToDropdown(true)}
                placeholder="Enter arrival station..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
              <MapPin className="absolute right-3 top-3.5 w-5 h-5 text-slate-500 pointer-events-none" />
            </div>

            {/* To Dropdown */}
            {showToDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
                {toSuggestions.length > 0 ? (
                  toSuggestions.map((station) => (
                    <button
                      key={station.code}
                      onClick={() => handleToSelect(station)}
                      className="w-full px-4 py-2.5 text-left hover:bg-slate-700 border-b border-slate-700 last:border-b-0 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white group-hover:text-blue-400">{station.name}</div>
                          <div className="text-xs text-slate-500">{station.code} • {station.state}</div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-400">No stations found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Journey Info Chips */}
        {fromStation && toStation && (
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-medium">
              <Zap className="w-4 h-4" />
              Direct Routes Available
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <Calendar className="w-4 h-4" />
              Check Today's Trains
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
              <Users className="w-4 h-4" />
              Share Journey
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
