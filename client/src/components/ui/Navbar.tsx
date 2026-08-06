import { useState } from 'react';
import { Train, Map, BarChart3, Compass, Settings, Heart, Share2, RefreshCw } from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore.js';
import ShareModal from './ShareModal.js';

interface NavbarProps {
  secondsUntilRefresh?: number;
  isStale?: boolean;
}

export default function Navbar({ secondsUntilRefresh, isStale }: NavbarProps) {
  const { activeTab, setActiveTab, favouriteTrains, selectedTrainNumber } = useTrainStore();
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 py-3 bg-slate-900 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-500 transition-colors">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white">
                  RailGaadi
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Indian Railways Real-Time Tracker</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Train className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="hidden md:inline">Live Map</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('companion')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'companion'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden md:inline">Companion</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </button>
          </nav>

          {/* Right Action Icons & Refresh Meter */}
          <div className="flex items-center gap-2.5">
            {secondsUntilRefresh !== undefined && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 font-medium">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Sync in <strong className="text-blue-400 font-bold">{secondsUntilRefresh}s</strong></span>
              </div>
            )}

            {isStale && (
              <div className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Last GPS</span>
              </div>
            )}

            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Share Train Journey"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setActiveTab('settings')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 transition-colors border border-slate-700"
                title="Favourites"
              >
                <Heart className="w-4 h-4 fill-rose-500/20" />
                {favouriteTrains.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {favouriteTrains.length}
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>
      </header>

      {showShareModal && (
        <ShareModal 
          trainNumber={selectedTrainNumber} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </>
  );
}
