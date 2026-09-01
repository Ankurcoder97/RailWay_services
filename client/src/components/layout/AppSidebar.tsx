import { Train, LayoutDashboard, Map, BarChart3, Compass, MapPin, Bell, Settings } from 'lucide-react';
import { useTrainStore, type TabType } from '../../store/useTrainStore.js';

export default function AppSidebar() {
  const { activeTab, setActiveTab } = useTrainStore();

  const navItems: { id: TabType; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'companion', label: 'Companion', icon: Compass },
    { id: 'stations', label: 'Stations', icon: MapPin },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-[#090D16] border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 select-none">
      
      {/* Top Section: Logo & Nav */}
      <div className="p-4 space-y-6">
        
        {/* Logo Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <Train className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">RailGaadi</span>
              <span className="px-1.5 py-0.5 text-[9px] font-black bg-blue-600 text-white rounded-md uppercase tracking-wider">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Indian Railways Real-Time Tracker</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Box: Live Feed Status */}
      <div className="p-4">
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Feed Connected</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-tight">
            RailRadar.in &amp; OpenWeather
          </p>
        </div>
      </div>

    </aside>
  );
}
