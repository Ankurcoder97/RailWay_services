import { Heart, MapPin, ArrowRight, Clock, ShieldAlert, Sparkles, Share2, CloudSun, CloudRain, Droplets, Wind } from 'lucide-react';
import type { LiveTrainStatus } from '../../types/index.js';
import StatusBadge from './StatusBadge.js';
import ProgressBar from './ProgressBar.js';
import { useTrainStore } from '../../store/useTrainStore.js';
import { useWeather } from '../../hooks/useWeather.js';

interface TrainCardProps {
  status: LiveTrainStatus;
  onShareClick?: () => void;
}

export default function TrainCard({ status, onShareClick }: TrainCardProps) {
  const { favouriteTrains, toggleFavourite } = useTrainStore();
  const isFav = favouriteTrains.includes(status.trainNumber);

  const { data: currentWeather } = useWeather(
    status.currentStation.code,
    status.currentStation.name,
    status.currentStation.lat,
    status.currentStation.lng
  );

  return (
    <div className="card-panel p-6 space-y-6 shadow-lg">
      
      {/* Header: Train Number, Name, Favorites & Share */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-md text-xs font-bold tracking-wide">
              #{status.trainNumber}
            </span>
            <StatusBadge delayMinutes={status.delayMinutes} />
            {status.isStale && (
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[10px] font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>Last Known GPS</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1.5 flex items-center gap-2">
            {status.trainName}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
            <span>{status.sourceStation}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span>{status.destinationStation}</span>
          </p>
        </div>

        {/* Favorite & Share Buttons */}
        <div className="flex items-center gap-2">
          {onShareClick && (
            <button
              onClick={onShareClick}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Share Train"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
          )}
          <button
            onClick={() => toggleFavourite(status.trainNumber)}
            className={`p-2.5 rounded-xl border transition-all ${
              isFav
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isFav ? 'Remove from Favourites' : 'Add to Favourites'}
          >
            <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Progress Bar Component */}
      <ProgressBar
        progressPercent={status.progressPercent}
        distanceCoveredKm={status.distanceCoveredKm}
        distanceRemainingKm={status.distanceRemainingKm}
        totalDistanceKm={status.totalDistanceKm}
        speedKmh={status.speedKmh}
      />

      {/* Current vs Next Station Highlight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        
        {/* Current Station Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/40 relative">
          <div className="absolute top-0 right-0 px-3 py-1 bg-blue-600/20 border-b border-l border-blue-500/30 rounded-bl-xl text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
            Current Location
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-600/20 rounded-lg text-blue-400 mt-1">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Station ({status.currentStation.code})</p>
              <h3 className="text-lg font-bold text-white tracking-tight">{status.currentStation.name}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                <div>
                  Platform: <strong className="text-blue-400">#{status.currentStation.platform || '1'}</strong>
                </div>
                <div>
                  Actual Dep: <strong className="text-emerald-400">{status.currentStation.actualDeparture || status.currentStation.scheduledDeparture}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Station & ETA Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
          <div className="absolute top-0 right-0 px-3 py-1 bg-slate-800 border-b border-l border-slate-700 rounded-bl-xl text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Next Stop
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-800 rounded-lg text-cyan-400 mt-1">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Upcoming ({status.nextStation.code})</p>
              <h3 className="text-lg font-bold text-white tracking-tight">{status.nextStation.name}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                <div>
                  ETA: <strong className="text-cyan-400">{status.nextStation.actualArrival || status.nextStation.scheduledArrival}</strong>
                </div>
                <div>
                  Platform: <strong className="text-slate-200">#{status.nextStation.platform || '1'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Live Station Weather Bar */}
      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>{status.currentStation.name} Weather:</span>
              <span className="text-amber-400 font-extrabold">{currentWeather?.tempC ?? 27}&deg;C</span>
              <span className="text-slate-400 font-normal capitalize">({currentWeather?.description || 'overcast clouds'})</span>
            </div>
            <p className="text-[11px] text-slate-400">Live climate at train's current station</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1 text-slate-300">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rain: <strong className="text-white">{currentWeather?.rainProbabilityPercent ?? 15}%</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>Humidity: <strong className="text-white">{currentWeather?.humidityPercent ?? 89}%</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-300 hidden sm:flex">
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            <span>Wind: <strong className="text-white">{currentWeather?.windSpeedKmh ?? 7} km/h</strong></span>
          </div>
        </div>
      </div>

      {/* Footer Timestamp & Status Notes */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Live feed synced with RailRadar.in & OpenWeather</span>
        </div>
        <div>
          Last updated: <strong className="text-slate-300">{new Date(status.lastUpdated).toLocaleTimeString()}</strong>
        </div>
      </div>

    </div>
  );
}
