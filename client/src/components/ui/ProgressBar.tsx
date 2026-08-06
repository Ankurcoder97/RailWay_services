import { motion } from 'framer-motion';
import { Gauge, Navigation } from 'lucide-react';

interface ProgressBarProps {
  progressPercent: number;
  distanceCoveredKm: number;
  distanceRemainingKm: number;
  totalDistanceKm: number;
  speedKmh: number;
}

export default function ProgressBar({
  progressPercent,
  distanceCoveredKm,
  distanceRemainingKm,
  totalDistanceKm,
  speedKmh
}: ProgressBarProps) {
  const percentBounded = Math.min(Math.max(progressPercent, 0), 100);

  return (
    <div className="space-y-3">
      {/* Top Labels */}
      <div className="flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Navigation className="w-3.5 h-3.5 text-blue-400" />
          <span>Covered: <strong className="text-white">{distanceCoveredKm} km</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-400 font-bold bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
          <Gauge className="w-3.5 h-3.5" />
          <span>{speedKmh} km/h</span>
        </div>
        <div className="text-slate-300">
          <span>Remaining: <strong className="text-white">{distanceRemainingKm} km</strong></span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-full shadow-glow"
          initial={{ width: 0 }}
          animate={{ width: `${percentBounded}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>Journey Completion</span>
        <span className="font-bold text-slate-200">{percentBounded}% ({totalDistanceKm} km total)</span>
      </div>
    </div>
  );
}
