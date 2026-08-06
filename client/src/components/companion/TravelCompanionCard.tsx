import { CloudSun, CloudRain, Wind, Droplets, Landmark as LandmarkIcon, Compass, Sparkles, Navigation } from 'lucide-react';
import type { LiveTrainStatus } from '../../types/index.js';
import { useWeather } from '../../hooks/useWeather.js';
import { useLandmarks } from '../../hooks/useLandmarks.js';

interface TravelCompanionCardProps {
  status: LiveTrainStatus;
}

export default function TravelCompanionCard({ status }: TravelCompanionCardProps) {
  const { data: currentWeather } = useWeather(
    status.currentStation.code,
    status.currentStation.name,
    status.currentStation.lat,
    status.currentStation.lng
  );

  const { data: destinationWeather } = useWeather(
    status.stations[status.stations.length - 1]?.code || 'DEST',
    status.destinationStation,
    status.stations[status.stations.length - 1]?.lat || status.currentLat,
    status.stations[status.stations.length - 1]?.lng || status.currentLng
  );

  const { data: landmarks, isLoading: isLandmarksLoading } = useLandmarks(status.currentLat, status.currentLng);

  return (
    <div className="space-y-6">
      
      {/* Weather Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Current Location Weather */}
        <div className="card-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{status.currentStation.name} Weather</h3>
                <p className="text-xs text-slate-400">Live climate at current station</p>
              </div>
            </div>
            <span className="text-3xl font-extrabold text-white">
              {currentWeather?.tempC ?? 28}&deg;C
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <CloudRain className="w-4 h-4 text-cyan-400 mx-auto" />
              <div className="text-slate-400">Rain Prob</div>
              <div className="font-bold text-white">{currentWeather?.rainProbabilityPercent ?? 15}%</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <Droplets className="w-4 h-4 text-blue-400 mx-auto" />
              <div className="text-slate-400">Humidity</div>
              <div className="font-bold text-white">{currentWeather?.humidityPercent ?? 55}%</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <Wind className="w-4 h-4 text-teal-400 mx-auto" />
              <div className="text-slate-400">Wind</div>
              <div className="font-bold text-white">{currentWeather?.windSpeedKmh ?? 12} km/h</div>
            </div>
          </div>
        </div>

        {/* Destination Forecast Weather */}
        <div className="card-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{status.destinationStation} Weather</h3>
                <p className="text-xs text-slate-400">Arrival Destination Climate</p>
              </div>
            </div>
            <span className="text-3xl font-extrabold text-cyan-300">
              {destinationWeather?.tempC ?? 26}&deg;C
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <CloudRain className="w-4 h-4 text-cyan-400 mx-auto" />
              <div className="text-slate-400">Rain Prob</div>
              <div className="font-bold text-white">{destinationWeather?.rainProbabilityPercent ?? 20}%</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <Droplets className="w-4 h-4 text-blue-400 mx-auto" />
              <div className="text-slate-400">Humidity</div>
              <div className="font-bold text-white">{destinationWeather?.humidityPercent ?? 60}%</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <Wind className="w-4 h-4 text-teal-400 mx-auto" />
              <div className="text-slate-400">Wind</div>
              <div className="font-bold text-white">{destinationWeather?.windSpeedKmh ?? 10} km/h</div>
            </div>
          </div>
        </div>

      </div>

      {/* Nearby Overpass POIs & Terrain Landmarks */}
      <div className="card-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <LandmarkIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Nearby Landmarks & Terrain</h3>
              <p className="text-xs text-slate-400">Rivers, mountains, bridges & attractions near current window view (Overpass API)</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 rounded-lg border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OpenStreetMap</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {isLandmarksLoading ? (
            <div className="col-span-2 text-center text-slate-400 text-xs py-8">
              Scanning geography near train position...
            </div>
          ) : (
            landmarks?.map((lm) => (
              <div
                key={lm.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-start gap-3"
              >
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg mt-0.5">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{lm.name}</h4>
                    <span className="px-2 py-0.5 bg-slate-800 text-emerald-400 text-[10px] font-bold rounded-md capitalize">
                      {lm.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{lm.description}</p>
                  <p className="text-[11px] text-emerald-400 font-medium mt-2">
                    Approx. {lm.distanceKm} km from railway line
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
