import { MapPin, Map, BarChart3, Compass, Settings } from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore.js';

export default function DashboardTabs() {
  const { activeTab, setActiveTab } = useTrainStore();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: MapPin },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'companion', label: 'Companion', icon: Compass },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 border-b border-slate-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id as typeof activeTab;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
              isActive
                ? 'text-blue-400 border-blue-400 bg-blue-500/5'
                : 'text-slate-400 border-transparent hover:text-slate-300 hover:bg-slate-800/30'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
