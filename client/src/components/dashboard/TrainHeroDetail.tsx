import { 
  ArrowLeft, Share2, Heart, Star, Gauge, Route, Flag, Compass, MapPin, Clock, Map 
} from 'lucide-react';
import type { LiveTrainStatus, Station } from '../../types/index.js';
import { useTrainStore } from '../../store/useTrainStore.js';

interface TrainHeroDetailProps {
  status: LiveTrainStatus;
  onSelectStation?: (station: Station) => void;
  onShareClick?: () => void;
}

export default function TrainHeroDetail({ status, onSelectStation, onShareClick }: TrainHeroDetailProps) {
  const { favouriteTrains, toggleFavourite } = useTrainStore();
  const isFav = favouriteTrains.includes(status.trainNumber);

  return (
    <div className="card-panel p-6 space-y-6 shadow-xl border border-slate-800 bg-[#0B111E]">
      
      {/* Back to Dashboard Link */}
      <button 
        onClick={() => window.history.back()} 
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Header: Title, Actions & Subtitle */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {status.trainName}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={onShareClick}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleFavourite(status.trainNumber)}
                className={`p-2 rounded-xl border transition-all ${
                  isFav
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400'
                }`}
                title="Favorite"
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-medium">
            <Star className="w-3.5 h-3.5 text-slate-400 fill-slate-400" />
            <span className="text-blue-400 font-bold">{status.trainNumber}</span>
            <span>&bull;</span>
            <span>{status.sourceStation} &rarr; {status.destinationStation}</span>
          </p>

          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{status.delayMinutes === 0 ? 'Running on Time' : `Delayed by ${status.delayMinutes}m`}</span>
            </span>

            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated just now</span>
            </span>
          </div>
        </div>
      </div>

      {/* Dotted Progress Track Visualization */}
      <div className="pt-2 pb-2">
        <div className="relative flex items-center justify-between">
          
          {/* Background Dotted Track Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 border-b-2 border-dashed border-slate-700 z-0"></div>
          
          {/* Active Progress Overlay Track */}
          <div 
            className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-400 z-0 transition-all duration-500"
            style={{ width: `${Math.min(status.progressPercent, 95)}%` }}
          ></div>

          {/* Origin Station Dot */}
          <div className="relative z-10 text-center">
            <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-600 mx-auto flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            </div>
            <div className="mt-2 text-xs font-bold text-white">{status.sourceStation.split(' ')[0]}</div>
            <div className="text-[10px] font-semibold text-slate-400">{status.stations[0]?.code || 'MMCT'}</div>
          </div>

          {/* Current Glowing Train Indicator Node */}
          <div className="relative z-10 text-center">
            <div className="w-7 h-7 rounded-full bg-emerald-400 border-4 border-slate-900 shadow-lg shadow-emerald-500/50 mx-auto flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 rounded-full bg-slate-950"></div>
            </div>
            <div className="mt-2 text-xs font-bold text-emerald-400">{status.distanceCoveredKm} km</div>
            <div className="text-[10px] font-semibold text-slate-400">Covered</div>
          </div>

          {/* Destination Station Dot */}
          <div className="relative z-10 text-center">
            <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-600 mx-auto flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            </div>
            <div className="mt-2 text-xs font-bold text-white">{status.destinationStation.split(' ')[0]}</div>
            <div className="text-[10px] font-semibold text-slate-400">{status.stations[status.stations.length - 1]?.code || 'NDLS'}</div>
          </div>

        </div>
      </div>

      {/* 3 Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Speed Stat Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
          <div className="p-3 bg-slate-800/80 rounded-xl text-blue-400 shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">{status.speedKmh} km/h</div>
            <div className="text-xs text-slate-400 font-medium">Current Speed</div>
          </div>
        </div>

        {/* Covered Distance Stat Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
          <div className="p-3 bg-slate-800/80 rounded-xl text-cyan-400 shrink-0">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">{status.distanceCoveredKm} km</div>
            <div className="text-xs text-slate-400 font-medium">Covered Distance</div>
          </div>
        </div>

        {/* Remaining Distance Stat Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
          <div className="p-3 bg-slate-800/80 rounded-xl text-amber-400 shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">{status.distanceRemainingKm} km</div>
            <div className="text-xs text-slate-400 font-medium">Remaining Distance</div>
          </div>
        </div>

      </div>

      {/* Journey Completion Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Compass className="w-4 h-4 text-blue-400" />
            <span>Journey Completion</span>
          </div>
          <div className="font-bold text-white">
            <span className="text-blue-400">{status.progressPercent}%</span>
            <span className="text-slate-400 font-normal ml-1">({status.distanceCoveredKm} km / {status.totalDistanceKm} km)</span>
          </div>
        </div>

        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${status.progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* 2 Highlight Cards Grid (Current Location vs Next Stop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        
        {/* Current Location Highlight Card */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 relative space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Current Location</span>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold">
              + LIVE
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl text-blue-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {status.currentStation.name} ({status.currentStation.code})
              </h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span>Platform: <strong className="text-white">#{status.currentStation.platform || '1'}</strong></span>
                <span>Actual Departure: <strong className="text-emerald-400">{status.currentStation.actualDeparture || status.currentStation.scheduledDeparture}</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectStation?.(status.currentStation)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/80 transition-colors flex items-center justify-center gap-1.5"
          >
            <Map className="w-3.5 h-3.5" />
            <span>View on Map</span>
          </button>
        </div>

        {/* Next Stop Highlight Card */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 relative space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Next Stop</span>
            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-[10px] font-bold">
              Upcoming
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl text-cyan-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {status.nextStation.name} ({status.nextStation.code})
              </h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span>ETA: <strong className="text-cyan-400">{status.nextStation.actualArrival || status.nextStation.scheduledArrival}</strong></span>
                <span>Platform: <strong className="text-white">#{status.nextStation.platform || '1'}</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectStation?.(status.nextStation)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/80 transition-colors flex items-center justify-center gap-1.5"
          >
            <Map className="w-3.5 h-3.5" />
            <span>View on Map</span>
          </button>
        </div>

      </div>

    </div>
  );
}
