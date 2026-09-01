import { Menu, MoreVertical, Search, Ticket, Armchair, MapPin } from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore.js';

export default function WimtHeader() {
  const { activeTab, setActiveTab } = useTrainStore();

  return (
    <header className="w-full bg-[#1565C0] text-white shadow-md sticky top-0 z-30 select-none">
      
      {/* Top Title Bar */}
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Menu className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Where is my Train</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs (SPOT, PNR, SEATS, LIVE MAP) */}
      <div className="max-w-4xl mx-auto px-4 flex items-center border-t border-white/10">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 text-center text-sm font-bold tracking-wider uppercase transition-all relative ${
            activeTab === 'dashboard' ? 'text-white' : 'text-blue-200 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Search className="w-4 h-4" />
            <span>SPOT</span>
          </div>
          {activeTab === 'dashboard' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-sm"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-3 text-center text-sm font-bold tracking-wider uppercase transition-all relative ${
            activeTab === 'map' ? 'text-white' : 'text-blue-200 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>LIVE MAP</span>
          </div>
          {activeTab === 'map' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-sm"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab('companion')}
          className={`flex-1 py-3 text-center text-sm font-bold tracking-wider uppercase transition-all relative ${
            activeTab === 'companion' ? 'text-white' : 'text-blue-200 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Ticket className="w-4 h-4" />
            <span>PNR</span>
          </div>
          {activeTab === 'companion' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-sm"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-3 text-center text-sm font-bold tracking-wider uppercase transition-all relative ${
            activeTab === 'analytics' ? 'text-white' : 'text-blue-200 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Armchair className="w-4 h-4" />
            <span>SEATS</span>
          </div>
          {activeTab === 'analytics' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-sm"></div>
          )}
        </button>
      </div>

    </header>
  );
}
