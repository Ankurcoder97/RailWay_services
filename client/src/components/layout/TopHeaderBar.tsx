import { useState } from 'react';
import { Search, ArrowRightLeft, RefreshCw, Share2, Bell, Target } from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore.js';
import ShareModal from '../ui/ShareModal.js';

interface TopHeaderBarProps {
  secondsUntilRefresh?: number;
  onShareClick?: () => void;
}

export default function TopHeaderBar({ secondsUntilRefresh = 9, onShareClick }: TopHeaderBarProps) {
  const [fromQuery, setFromQuery] = useState('Mumbai Central (MMCT)');
  const [toQuery, setToQuery] = useState('New Delhi (NDLS)');
  const [showShare, setShowShare] = useState(false);

  const { setSelectedTrainNumber, setActiveTab } = useTrainStore();

  const handleSwap = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  };

  const handleSearch = () => {
    // Select train matching query or default 12951
    setSelectedTrainNumber('12951');
    setActiveTab('dashboard');
  };

  return (
    <>
      <header className="w-full bg-[#080C14] border-b border-slate-800/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        
        {/* Center: From / To Train Search Widget matching screenshot */}
        <div className="flex flex-wrap items-center gap-2 max-w-2xl flex-1">
          
          {/* From Input */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute top-1 left-3 text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
              From
            </div>
            <input
              type="text"
              value={fromQuery}
              onChange={(e) => setFromQuery(e.target.value)}
              className="w-full pt-4 pb-1.5 pl-3 pr-8 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <Target className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 bottom-2" />
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
              className="w-full pt-4 pb-1.5 pl-3 pr-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
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

      {showShare && (
        <ShareModal trainNumber="12951" onClose={() => setShowShare(false)} />
      )}
    </>
  );
}
