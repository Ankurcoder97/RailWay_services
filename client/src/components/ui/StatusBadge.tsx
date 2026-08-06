import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  delayMinutes: number;
}

export default function StatusBadge({ delayMinutes }: StatusBadgeProps) {
  if (delayMinutes <= 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>On Time</span>
      </div>
    );
  }

  if (delayMinutes <= 15) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-full text-xs font-semibold shadow-sm">
        <Clock className="w-3.5 h-3.5" />
        <span>Delayed by {delayMinutes}m</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-full text-xs font-semibold shadow-sm">
      <AlertTriangle className="w-3.5 h-3.5" />
      <span>Late by {delayMinutes} mins</span>
    </div>
  );
}
