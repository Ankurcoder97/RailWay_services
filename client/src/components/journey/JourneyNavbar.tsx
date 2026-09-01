import { MapPin, ArrowRight, Clock, Phone, Share2, Menu } from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore.js';
import { useState } from 'react';

interface JourneyNavbarProps {
  trainNumber?: string;
  trainName?: string;
  delayMinutes?: number;
  isStale?: boolean;
  secondsUntilRefresh?: number;
}

export default function JourneyNavbar({
  trainNumber,
  trainName,
  delayMinutes = 0,
  isStale,
  secondsUntilRefresh = 20,
}: JourneyNavbarProps) {
  const { fromStation, toStation, setActiveTab } = useTrainStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900/90 backdrop-blur border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between gap-3">
          {/* Journey Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm">
              <div className="text-xs font-bold text-blue-400 truncate">
                {fromStation?.name?.split(' ')[0] || 'From'}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="text-xs font-bold text-blue-400 truncate">
                {toStation?.name?.split(' ')[0] || 'To'}
              </div>
            </div>
            {trainName && (
              <div className="text-xs text-slate-400 mt-0.5 truncate">
                #{trainNumber} {trainName}
              </div>
            )}
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-700 border-b border-slate-700 text-sm text-white"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setActiveTab('map');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-700 border-b border-slate-700 text-sm text-white"
                >
                  Map
                </button>
                <button
                  onClick={() => {
                    setActiveTab('analytics');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-700 border-b border-slate-700 text-sm text-white"
                >
                  Analytics
                </button>
                <button
                  onClick={() => {
                    setActiveTab('companion');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm text-white"
                >
                  Companion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Left: Journey Info */}
          <div className="flex items-center gap-4 min-w-0">
            {/* From Station */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="text-sm font-bold text-white truncate">
                {fromStation?.name || 'Depart'}
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />

            {/* To Station */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="text-sm font-bold text-white truncate">
                {toStation?.name || 'Arrive'}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-700" />

            {/* Train Info */}
            {trainName && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-600/10 border border-blue-500/20">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-semibold text-blue-300">
                  #{trainNumber} {trainName}
                </span>
              </div>
            )}
          </div>

          {/* Middle: Status Info */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Delay Status */}
            {delayMinutes !== 0 && (
              <div className={`px-3 py-1 rounded-lg flex items-center gap-1.5 ${
                delayMinutes > 0
                  ? 'bg-orange-500/10 border border-orange-500/30'
                  : 'bg-emerald-500/10 border border-emerald-500/30'
              }`}>
                <Clock className="w-4 h-4" />
                <span className={`text-xs font-semibold ${
                  delayMinutes > 0 ? 'text-orange-300' : 'text-emerald-300'
                }`}>
                  {delayMinutes > 0 ? `+${delayMinutes}m` : `${delayMinutes}m`}
                </span>
              </div>
            )}

            {/* Data Staleness */}
            {isStale ? (
              <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <span className="text-xs font-semibold text-amber-300">Stale data</span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">
                <span className="text-xs font-semibold text-slate-400">
                  Refresh in {secondsUntilRefresh}s
                </span>
              </div>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200" title="Share">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200" title="Call Support">
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
