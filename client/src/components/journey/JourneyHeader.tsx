import { ArrowRight, Clock, TrendingUp } from 'lucide-react';
import type { LiveTrainStatus } from '../../types/index.js';
import { useTrainStore } from '../../store/useTrainStore.js';

interface JourneyHeaderProps {
  status: LiveTrainStatus;
}

export default function JourneyHeader({ status }: JourneyHeaderProps) {
  const { fromStation, toStation } = useTrainStore();

  return (
    <div className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg">
      {/* Top Row: Journey with Stations */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            {/* From Station */}
            <div className="text-center md:text-left">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wide">From</div>
              <div className="text-lg md:text-xl font-bold text-white">
                {fromStation?.name || status.sourceStation}
              </div>
              <div className="text-xs text-slate-500 mt-1">{fromStation?.code || 'Unknown'}</div>
            </div>

            {/* Arrow */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 border border-blue-500/20">
                <ArrowRight className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-semibold text-blue-300">Journey</span>
              </div>
            </div>

            {/* To Station */}
            <div className="text-center md:text-right">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wide">To</div>
              <div className="text-lg md:text-xl font-bold text-white">
                {toStation?.name || status.destinationStation}
              </div>
              <div className="text-xs text-slate-500 mt-1">{toStation?.code || 'Unknown'}</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>

      {/* Bottom Row: Journey Progress Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Progress */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <div className="text-xs text-slate-400 font-semibold uppercase mb-2">Progress</div>
          <div className="flex items-end gap-2">
            <div className="text-2xl font-bold text-blue-400">{status.progressPercent}%</div>
            <div className="text-xs text-slate-500">Complete</div>
          </div>
          <div className="mt-2 w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-500"
              style={{ width: `${status.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Distance */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <div className="text-xs text-slate-400 font-semibold uppercase mb-2">Distance</div>
          <div className="text-2xl font-bold text-white">
            {status.distanceCoveredKm} <span className="text-sm text-slate-400">/ {status.totalDistanceKm} km</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">{status.distanceRemainingKm} km left</div>
        </div>

        {/* Time */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div className="text-xs text-slate-400 font-semibold uppercase">Delay</div>
          </div>
          {status.delayMinutes > 0 ? (
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold text-orange-400">+{status.delayMinutes}m</div>
              <div className="text-xs text-orange-300 mb-0.5">Behind schedule</div>
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold text-emerald-400">On time</div>
              <div className="text-xs text-emerald-300 mb-0.5">Running</div>
            </div>
          )}
        </div>

        {/* Speed */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <div className="text-xs text-slate-400 font-semibold uppercase">Speed</div>
          </div>
          <div className="text-2xl font-bold text-white">{status.speedKmh} <span className="text-sm text-slate-400">km/h</span></div>
          <div className="text-xs text-slate-500 mt-1">Current velocity</div>
        </div>
      </div>
    </div>
  );
}
