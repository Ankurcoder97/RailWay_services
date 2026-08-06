import { useState, useEffect, useRef } from 'react';
import { Search, Train, Clock, ArrowRight, X } from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore.js';
import { fetchTrainSearch } from '../../api/client.js';
import type { TrainSearchResult } from '../../types/index.js';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<TrainSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { setSelectedTrainNumber, addRecentSearch, recentSearches, setActiveTab } = useTrainStore();

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await fetchTrainSearch(query);
        setSuggestions(results);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (trainNum: string) => {
    setSelectedTrainNumber(trainNum);
    addRecentSearch(trainNum);
    setQuery('');
    setIsOpen(false);
    setActiveTab('dashboard');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-blue-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search train number or name (e.g. 22436, Rajdhani, Shatabdi)..."
          className="w-full pl-12 pr-10 py-3.5 bg-slate-900 text-white placeholder-slate-400 border border-slate-700 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm font-medium"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto custom-scrollbar">
          
          {query.trim() !== '' ? (
            <div>
              {isLoading ? (
                <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching Indian Railways database...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="p-2 space-y-1">
                  <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Search Results
                  </p>
                  {suggestions.map((item) => (
                    <div
                      key={item.trainNumber}
                      onClick={() => handleSelect(item.trainNumber)}
                      className="px-3 py-2.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 flex items-center justify-between cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600 text-blue-400 group-hover:text-white transition-colors">
                          <Train className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{item.trainNumber}</span>
                            <span className="text-sm font-semibold text-slate-200">{item.trainName}</span>
                          </div>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>{item.source}</span>
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                            <span>{item.destination}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-0.5 transition-transform">Track &rarr;</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No train found matching "{query}". Try <strong>22436</strong> or <strong>12951</strong>.
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 space-y-3">
              <div>
                <p className="px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Popular Express Trains
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { num: '22436', name: 'Vande Bharat Express' },
                    { num: '12951', name: 'Mumbai Rajdhani' },
                    { num: '12002', name: 'Bhopal Shatabdi' }
                  ].map((t) => (
                    <button
                      key={t.num}
                      onClick={() => handleSelect(t.num)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Train className="w-3.5 h-3.5 text-blue-400" />
                      <span>#{t.num} {t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {recentSearches.length > 0 && (
                <div>
                  <p className="px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Recent Searches</span>
                  </p>
                  <div className="space-y-1">
                    {recentSearches.map((item) => (
                      <div
                        key={item}
                        onClick={() => handleSelect(item)}
                        className="px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 text-xs text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-bold text-white">Train #{item}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">Track</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
