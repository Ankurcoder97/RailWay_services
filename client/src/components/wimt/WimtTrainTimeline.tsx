import { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import type { LiveTrainStatus, Station } from '../../types/index.js';

interface WimtTrainTimelineProps {
  status: LiveTrainStatus;
  onBack: () => void;
  onRefresh: () => void;
}

export default function WimtTrainTimeline({ status, onBack, onRefresh }: WimtTrainTimelineProps) {
  const [dayTab, setDayTab] = useState<'today' | 'yesterday' | 'tomorrow'>('today');

  const displayTime = (timeStr?: string) => {
    if (!timeStr) return '--:--';
    const clean = String(timeStr).trim();

    // 1. If ISO timestamp string (e.g. "2026-09-01T22:05:00+05:30")
    const tIndex = clean.indexOf('T');
    if (tIndex >= 0 && clean.length >= tIndex + 6) {
      const timePart = clean.substring(tIndex + 1, tIndex + 6);
      const parts = timePart.split(':');
      if (parts.length === 2 && !isNaN(parseInt(parts[0], 10))) {
        let hours = parseInt(parts[0], 10);
        const mStr = parts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        if (hours === 0) hours = 12;
        const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
        return `${formattedHours}:${mStr} ${ampm}`;
      }
    }

    // 2. If already 12-hour format with AM/PM (e.g. "10:05 PM")
    if (/\d{1,2}:\d{2}\s*(am|pm)/i.test(clean)) {
      return clean;
    }

    // 3. If 24-hour time HH:mm (e.g. "22:05", "17:00", "05:40")
    if (clean.includes(':')) {
      const parts = clean.split(':');
      if (parts.length >= 2 && !isNaN(parseInt(parts[0], 10))) {
        let hours = parseInt(parts[0], 10);
        const mStr = parts[1].substring(0, 2);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        if (hours === 0) hours = 12;
        const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
        return `${formattedHours}:${mStr} ${ampm}`;
      }
    }

    return clean;
  };

  const currentIdx = status.stations.findIndex(
    s => s.code === status.currentStation?.code || s.name === status.currentStation?.name || s.status === 'current'
  );
  const activeCurrentIdx = currentIdx >= 0 ? currentIdx : Math.min(1, status.stations.length - 1);

  return (
    <div className="max-w-2xl mx-auto font-sans bg-slate-100 min-h-screen pb-12 select-none shadow-lg">
      
      {/* Top Header Bar */}
      <div className="bg-[#1565C0] text-white p-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1 rounded hover:bg-white/10">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg font-bold tracking-tight">{status.trainNumber} {status.trainName}</h2>
              <p className="text-xs text-blue-200">{status.sourceStation} &rarr; {status.destinationStation}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onRefresh} className="p-2 rounded hover:bg-white/10" title="Refresh Live Position">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Selector (Yesterday, Today, Tomorrow) */}
        <div className="flex items-center justify-around mt-3 pt-2 border-t border-white/10 text-xs font-bold">
          <button
            onClick={() => setDayTab('yesterday')}
            className={`px-3 py-1 rounded transition-colors ${dayTab === 'yesterday' ? 'bg-white text-[#1565C0]' : 'text-blue-200'}`}
          >
            Yesterday
          </button>
          <button
            onClick={() => setDayTab('today')}
            className={`px-3 py-1 rounded transition-colors ${dayTab === 'today' ? 'bg-white text-[#1565C0]' : 'text-blue-200'}`}
          >
            Today
          </button>
          <button
            onClick={() => setDayTab('tomorrow')}
            className={`px-3 py-1 rounded transition-colors ${dayTab === 'tomorrow' ? 'bg-white text-[#1565C0]' : 'text-blue-200'}`}
          >
            Tomorrow
          </button>
        </div>
      </div>

      {/* Live Status Banner */}
      <div className={`p-4 text-white font-bold text-sm flex items-center justify-between shadow-sm ${
        status.delayMinutes > 0 ? 'bg-[#C62828]' : 'bg-[#2E7D32]'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white animate-ping"></div>
          <span>
            {status.delayMinutes === 0 ? 'Running On Time' : `Delayed by ${status.delayMinutes} mins`}
          </span>
        </div>
        <div className="text-xs font-normal">
          Current: <strong className="underline font-bold">{status.currentStation?.name || 'En Route'}</strong>
        </div>
      </div>

      {/* Vertical Station Timeline List */}
      <div className="bg-white border-b shadow-sm relative p-4 space-y-0">
        
        {status.stations.map((st: Station, idx: number) => {
          const isCurrent = idx === activeCurrentIdx;
          const isPassed = idx < activeCurrentIdx || st.status === 'passed';

          return (
            <div key={st.code + idx} className="relative flex items-center py-3.5 border-b border-slate-100 last:border-0 group">
              
              {/* Vertical Line */}
              {idx < status.stations.length - 1 && (
                <div className={`absolute left-[15px] top-8 bottom-0 w-1 ${
                  isPassed ? 'bg-[#2E7D32]' : 'bg-slate-300'
                }`}></div>
              )}

              {/* Station Node / Train Marker */}
              <div className="relative z-10 w-8 flex justify-center shrink-0">
                {isCurrent ? (
                  <div className="relative flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold animate-bounce z-10">
                      🚆
                    </div>
                  </div>
                ) : (
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                    isPassed ? 'bg-[#2E7D32]' : 'bg-slate-400'
                  }`}></div>
                )}
              </div>

              {/* Station Information */}
              <div className="flex-1 ml-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-sm ${isCurrent ? 'text-blue-700 text-base' : 'text-slate-900'}`}>
                      {st.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">({st.code})</span>
                  </div>

                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>Platform: <b className="text-slate-700">#{st.platform || '1'}</b></span>
                    <span>Dist: <b className="text-slate-700">{st.distanceFromSourceKm} km</b></span>
                  </div>
                </div>

                {/* Timing Column */}
                <div className="text-right">
                  <div className={`text-sm font-extrabold ${
                    st.delayMinutes > 0 ? 'text-[#C62828]' : 'text-[#2E7D32]'
                  }`}>
                    {displayTime(st.actualDeparture || st.scheduledDeparture || st.actualArrival || st.scheduledArrival)}
                  </div>
                  {st.scheduledDeparture && st.actualDeparture && st.scheduledDeparture !== st.actualDeparture && (
                    <div className="text-xs text-slate-400 font-semibold line-through mt-0.5">
                      {displayTime(st.scheduledDeparture)}
                    </div>
                  )}
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
