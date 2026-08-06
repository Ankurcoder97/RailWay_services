import { Train, Map, BarChart3, Compass, Sparkles } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar.js';
import { useTrainStore } from '../store/useTrainStore.js';

export default function Home() {
  const { setSelectedTrainNumber, setActiveTab } = useTrainStore();

  const handleQuickTrack = (num: string) => {
    setSelectedTrainNumber(num);
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-12 py-6">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Indian Railways Tracking Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Live Train Tracking & <br />
          <span className="text-blue-500">
            Journey Analytics
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Monitor train locations live on 3D MapTiler maps, view terrain elevation profiles, station weather, and travel insights powered by RailRadar.
        </p>

        {/* Hero Search Bar */}
        <div className="pt-2">
          <SearchBar />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-2">
          <span>Popular trains:</span>
          {[
            { num: '22436', name: 'Vande Bharat' },
            { num: '12951', name: 'Mumbai Rajdhani' },
            { num: '12002', name: 'Bhopal Shatabdi' }
          ].map((t) => (
            <button
              key={t.num}
              onClick={() => handleQuickTrack(t.num)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors font-medium flex items-center gap-1.5"
            >
              <Train className="w-3.5 h-3.5 text-blue-400" />
              <span>#{t.num} {t.name}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-6">
        
        <div 
          onClick={() => setActiveTab('map')}
          className="card-panel p-6 border border-slate-800 hover:border-blue-500/40 transition-all group cursor-pointer space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Map className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
            3D Vector Map & Route Timeline
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Full-screen interactive MapTiler map with camera tracking, station popups, and side-by-side Where Is My Train route timeline.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('analytics')}
          className="card-panel p-6 border border-slate-800 hover:border-cyan-500/40 transition-all group cursor-pointer space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
            Elevation & Delay Analytics
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Track route elevation graphs via OpenTopography DEM, station punctuality stats, delay distributions, and full timelines.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('companion')}
          className="card-panel p-6 border border-slate-800 hover:border-emerald-500/40 transition-all group cursor-pointer space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
            Smart Travel Companion
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Get live station weather, rain forecasts, nearby rivers, mountains, and bridges from Overpass API along your train line.
          </p>
        </div>

      </div>

    </div>
  );
}
