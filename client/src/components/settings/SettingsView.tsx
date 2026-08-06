import { Trash2, Heart, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore.js';

export default function SettingsView() {
  const {
    favouriteTrains,
    toggleFavourite,
    recentSearches,
    clearRecentSearches,
    refreshIntervalSec,
    setRefreshIntervalSec,
    setSelectedTrainNumber,
    setActiveTab,
  } = useTrainStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">App Preferences & API Configuration</h2>
        <p className="text-xs text-slate-400 mt-1">Manage tracking interval, saved trains, and API integrations</p>
      </div>

      {/* Auto Refresh Frequency Preference */}
      <div className="card-panel p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">GPS Polling Interval</h3>
            <p className="text-xs text-slate-400">Configure real-time position refresh frequency</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {[15, 20, 30].map((sec) => (
            <button
              key={sec}
              onClick={() => setRefreshIntervalSec(sec)}
              className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center ${
                refreshIntervalSec === sec
                  ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Every {sec} Seconds
            </button>
          ))}
        </div>
      </div>

      {/* Favourites Management */}
      <div className="card-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Saved Favourite Trains</h3>
              <p className="text-xs text-slate-400">Quick access pins on home dashboard</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{favouriteTrains.length} saved</span>
        </div>

        {favouriteTrains.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {favouriteTrains.map((num) => (
              <div
                key={num}
                className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3 text-xs font-semibold text-white"
              >
                <span
                  onClick={() => {
                    setSelectedTrainNumber(num);
                    setActiveTab('dashboard');
                  }}
                  className="cursor-pointer hover:text-blue-400"
                >
                  Train #{num}
                </span>
                <button
                  onClick={() => toggleFavourite(num)}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 pt-2">No favourite trains saved yet.</p>
        )}
      </div>

      {/* Clear Recent Searches */}
      <div className="card-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Search History</h3>
            <p className="text-xs text-slate-400">{recentSearches.length} recent queries stored locally</p>
          </div>
          {recentSearches.length > 0 && (
            <button
              onClick={clearRecentSearches}
              className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold hover:bg-rose-500/20 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* API Key Connection Status */}
      <div className="card-panel p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">API Key Engine Status</h3>
            <p className="text-xs text-slate-400">Integrated microservices status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            { name: 'RailRadar.in (Live Train GPS)', status: 'Active / Connected' },
            { name: 'OpenWeather API (Station Forecast)', status: 'Active / Connected' },
            { name: 'MapTiler Cloud (3D Vector Tiles)', status: 'Active / Connected' },
            { name: 'OpenTopography DEM (Elevation)', status: 'Active / Connected' },
            { name: 'Overpass API (Landmarks POI)', status: 'Active / Connected' },
            { name: 'Turf.js (Spatial Calculations)', status: 'Embedded Engine' }
          ].map((api) => (
            <div key={api.name} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">{api.name}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{api.status}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
