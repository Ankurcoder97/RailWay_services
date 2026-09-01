import { CloudSun, CloudRain, Droplets, Wind, Info, Clock, Bell } from 'lucide-react';
import type { LiveTrainStatus } from '../../types/index.js';
import { useWeather } from '../../hooks/useWeather.js';

interface RightInfoSidebarProps {
  status: LiveTrainStatus;
}

export default function RightInfoSidebar({ status }: RightInfoSidebarProps) {
  const { data: currentWeather } = useWeather(
    status.currentStation.code,
    status.currentStation.name,
    status.currentStation.lat,
    status.currentStation.lng
  );

  const formattedDate = new Date(status.lastUpdated).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = new Date(status.lastUpdated).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="space-y-4 shrink-0">
      
      {/* 1. Live Station Weather Card matching screenshot */}
      <div className="card-panel p-5 space-y-4 bg-slate-900/90 border border-slate-800 relative overflow-hidden">
        
        {/* Subtle Background Cloud Image/Texture Overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                {status.currentStation.name} Weather
              </h3>
              <p className="text-xs text-slate-400 capitalize">
                {currentWeather?.description || 'Overcast Clouds'}
              </p>
            </div>
          </div>
        </div>

        {/* Big Temperature Text */}
        <div className="text-4xl font-extrabold text-white tracking-tight">
          {currentWeather?.tempC ?? 28}&deg;C
        </div>

        {/* 3 Metric Items: Rain, Humidity, Wind */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
          <div>
            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <CloudRain className="w-3 h-3 text-cyan-400" />
              <span>Rain</span>
            </div>
            <div className="font-bold text-white mt-0.5">
              {currentWeather?.rainProbabilityPercent ?? 10}%
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-400" />
              <span>Humidity</span>
            </div>
            <div className="font-bold text-white mt-0.5">
              {currentWeather?.humidityPercent ?? 73}%
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Wind className="w-3 h-3 text-teal-400" />
              <span>Wind</span>
            </div>
            <div className="font-bold text-white mt-0.5">
              {currentWeather?.windSpeedKmh ?? 17} km/h
            </div>
          </div>
        </div>

      </div>

      {/* 2. Train Information Card matching screenshot */}
      <div className="card-panel p-5 space-y-3 bg-slate-900/90 border border-slate-800">
        
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Info className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-white text-sm">Train Information</h3>
        </div>

        <div className="space-y-2 text-xs">
          
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Train Number</span>
            <span className="font-bold text-white">{status.trainNumber}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Train Name</span>
            <span className="font-bold text-white">{status.trainName.replace(/^\d+\s*/, '')}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">From</span>
            <span className="font-bold text-white">{status.sourceStation}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">To</span>
            <span className="font-bold text-white">{status.destinationStation}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Total Distance</span>
            <span className="font-bold text-white">{status.totalDistanceKm} km</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-slate-400">Running Days</span>
            <span className="font-semibold text-slate-300">Mon, Tue, Wed, Thu, Fri, Sat, Sun</span>
          </div>

        </div>

      </div>

      {/* 3. Last Updated Card matching screenshot */}
      <div className="card-panel p-4 bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Last Updated</div>
            <div className="text-[11px] text-slate-400">{formattedDate}</div>
          </div>
        </div>
        <div className="font-bold text-white text-xs">{formattedTime}</div>
      </div>

      {/* 4. Live Alerts Card matching screenshot */}
      <div className="card-panel p-4 bg-slate-900/90 border border-slate-800 space-y-3">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-white text-sm">Live Alerts</h3>
          </div>
          <button className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            View All
          </button>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-medium text-slate-200">
              Departed from {status.currentStation.name} ({status.currentStation.code})
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">{formattedTime}</span>
        </div>

      </div>

    </div>
  );
}
