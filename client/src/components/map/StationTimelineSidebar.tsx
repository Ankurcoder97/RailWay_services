import { useState } from 'react';
import { MapPin, Search, Train } from 'lucide-react';
import type { LiveTrainStatus, Station } from '../../types/index.js';

interface StationTimelineSidebarProps {
  status: LiveTrainStatus;
  onSelectStation?: (station: Station) => void;
}

export default function StationTimelineSidebar({ status, onSelectStation }: StationTimelineSidebarProps) {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredStations = status.stations.filter(
    (st) =>
      st.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      st.code.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="card-panel p-5 flex flex-col h-[550px] md:h-[650px] relative overflow-hidden shadow-lg">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Route Timeline</h3>
              <p className="text-xs text-slate-400">Where is my Train &bull; {status.stations.length} Stations</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-[11px] font-bold">
            Live Feed
          </span>
        </div>

        {/* Quick Filter Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter stations in route..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Vertical Station Timeline List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-4 pr-1 space-y-3">
        {filteredStations.map((st, index) => {
          const isCurrent = st.code === status.currentStation.code;
          const isPassed = st.status === 'passed';

          return (
            <div key={st.code} className="relative group">
              
              {/* Vertical Connecting Rail Line */}
              {index < filteredStations.length - 1 && (
                <div
                  className={`absolute left-[15px] top-6 bottom-0 w-0.5 z-0 ${
                    isPassed ? 'bg-emerald-500/60' : isCurrent ? 'bg-gradient-to-b from-blue-500 to-slate-700' : 'bg-slate-800'
                  }`}
                />
              )}

              {/* Station Item Container */}
              <div
                onClick={() => onSelectStation?.(st)}
                className={`relative z-10 p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isCurrent
                    ? 'bg-blue-950/40 border-blue-500 shadow-md'
                    : 'bg-slate-950/80 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                
                {/* Station Node Indicator */}
                <div className="flex items-start gap-3">
                  <div className="relative mt-1 flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-105 ${
                        isCurrent
                          ? 'bg-blue-600 border-white text-white shadow-md'
                          : isPassed
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      {isCurrent ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm tracking-tight">{st.name}</h4>
                      <span className="text-[11px] font-semibold text-slate-400">({st.code})</span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>Platform: <strong className="text-slate-200">#{st.platform || '1'}</strong></span>
                      <span>&bull;</span>
                      <span>{st.distanceFromSourceKm} km</span>
                    </p>

                    {/* Current Train Location Tag */}
                    {isCurrent && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-[10px] font-bold">
                        <Train className="w-3 h-3 text-blue-400 animate-pulse" />
                        <span>Train is Here &bull; {status.speedKmh} km/h</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timings & Delay Badge */}
                <div className="text-right flex-shrink-0 text-xs">
                  <div className="font-semibold text-slate-200">
                    {st.actualArrival || st.scheduledArrival || 'Origin'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Sch: {st.scheduledArrival || st.scheduledDeparture || 'N/A'}
                  </div>
                  <div className="mt-1">
                    {st.delayMinutes > 0 ? (
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md text-[10px] font-bold">
                        +{st.delayMinutes}m
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[10px] font-bold">
                        On Time
                      </span>
                    )}
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
