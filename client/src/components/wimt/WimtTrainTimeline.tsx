import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Bell, BellRing, X, Check, Volume2, CheckCircle2 } from 'lucide-react';
import type { LiveTrainStatus, Station } from '../../types/index.js';

interface WimtTrainTimelineProps {
  status: LiveTrainStatus;
  onBack: () => void;
  onRefresh: () => void;
}

function timeToMinutes(timeStr?: string): number {
  if (!timeStr) return 0;
  const str = String(timeStr).trim();
  let h = 0, m = 0;
  if (str.includes('PM') || str.includes('pm')) {
    const parts = str.replace(/(AM|PM|am|pm)/gi, '').trim().split(':');
    h = parseInt(parts[0], 10) || 0;
    m = parseInt(parts[1], 10) || 0;
    if (h < 12) h += 12;
  } else if (str.includes('AM') || str.includes('am')) {
    const parts = str.replace(/(AM|PM|am|pm)/gi, '').trim().split(':');
    h = parseInt(parts[0], 10) || 0;
    m = parseInt(parts[1], 10) || 0;
    if (h === 12) h = 0;
  } else {
    const parts = str.split(':');
    h = parseInt(parts[0], 10) || 0;
    m = parseInt(parts[1], 10) || 0;
  }
  return h * 60 + m;
}

export default function WimtTrainTimeline({ status, onBack, onRefresh }: WimtTrainTimelineProps) {
  // Station Wakeup Alarm State
  const [alarmStation, setAlarmStation] = useState<Station | null>(null);
  const [selectedStationForAlarm, setSelectedStationForAlarm] = useState<Station | null>(null);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [alarmOffsetMins, setAlarmOffsetMins] = useState(10);
  const [alarmTriggered, setAlarmTriggered] = useState(false);

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

  // Determine if train run has completed based on arrival time & current time of day
  const lastStn = status.stations[status.stations.length - 1];
  const lastArrTime = lastStn?.actualArrival || lastStn?.scheduledArrival || '03:40 PM';

  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const arrMins = timeToMinutes(displayTime(lastArrTime));

  const isCompletedRun = status.progressPercent >= 100 || status.distanceRemainingKm === 0 || (arrMins > 0 && currentMins > arrMins && (currentMins - arrMins) < 720);

  // Find index of current train position
  const currentIdx = status.stations.findIndex(
    s => s.code === status.currentStation?.code || s.name === status.currentStation?.name || s.status === 'current'
  );

  const activeCurrentIdx = isCompletedRun
    ? status.stations.length - 1
    : currentIdx >= 0
    ? currentIdx
    : Math.min(1, status.stations.length - 1);

  // Check alarm trigger conditions
  useEffect(() => {
    if (!alarmStation) return;
    const targetIdx = status.stations.findIndex(s => s.code === alarmStation.code);
    if (targetIdx >= 0 && activeCurrentIdx >= targetIdx - 1) {
      setAlarmTriggered(true);
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
      } catch (e) {
        console.warn('Audio chime played note:', e);
      }
    }
  }, [alarmStation, activeCurrentIdx, status.stations]);

  const handleOpenAlarmModal = (st: Station) => {
    setSelectedStationForAlarm(st);
    setShowAlarmModal(true);
  };

  const handleConfirmAlarm = () => {
    if (selectedStationForAlarm) {
      setAlarmStation(selectedStationForAlarm);
      setAlarmTriggered(false);
      setShowAlarmModal(false);
    }
  };

  const handleCancelAlarm = () => {
    setAlarmStation(null);
    setAlarmTriggered(false);
  };

  return (
    <div className="max-w-2xl mx-auto font-sans bg-slate-100 min-h-screen pb-12 select-none shadow-lg">
      
      {/* Top Header Bar sticky below WimtHeader (top-[98px]) */}
      <div className="bg-[#1565C0] text-white p-4 sticky top-[98px] z-20 shadow-md">
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
      </div>

      {/* Live Status Banner */}
      <div className={`p-4 text-white font-bold text-sm flex items-center justify-between shadow-sm ${
        isCompletedRun
          ? 'bg-[#2E7D32]'
          : status.delayMinutes > 0
          ? 'bg-[#C62828]'
          : 'bg-[#2E7D32]'
      }`}>
        <div className="flex items-center gap-2">
          {isCompletedRun ? (
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          ) : (
            <div className="w-3 h-3 rounded-full bg-white animate-ping shrink-0"></div>
          )}
          <span>
            {isCompletedRun
              ? `Reached Destination (Completed at ${displayTime(lastArrTime)})`
              : status.delayMinutes === 0
              ? 'Running On Time'
              : `Delayed by ${status.delayMinutes} mins`}
          </span>
        </div>
        <div className="text-xs font-normal">
          {isCompletedRun ? 'Arrived at:' : 'Current:'}{' '}
          <strong className="underline font-bold">
            {isCompletedRun ? lastStn?.name || status.destinationStation : status.currentStation?.name || 'En Route'}
          </strong>
        </div>
      </div>

      {/* Active Alarm Status Banner */}
      {alarmStation && (
        <div className={`p-3.5 text-xs font-bold flex items-center justify-between border-b ${
          alarmTriggered
            ? 'bg-amber-500 text-slate-950 animate-bounce'
            : 'bg-amber-100 text-amber-900 border-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-700 animate-pulse" />
            <span>
              {alarmTriggered
                ? `⏰ WAKE UP ALARM! Approaching ${alarmStation.name} (${alarmStation.code})!`
                : `⏰ Wakeup Alarm set for ${alarmStation.name} (${alarmStation.code}) — ${alarmOffsetMins}m before arrival`}
            </span>
          </div>
          <button
            onClick={handleCancelAlarm}
            className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded font-bold transition-colors"
          >
            Cancel Alarm
          </button>
        </div>
      )}

      {/* Vertical Station Timeline List */}
      <div className="bg-white border-b shadow-sm relative p-4 space-y-0">
        
        {status.stations.map((st: Station, idx: number) => {
          const isCurrent = idx === activeCurrentIdx;
          const isPassed = idx < activeCurrentIdx || st.status === 'passed' || isCompletedRun;
          const isAlarmForThisStation = alarmStation?.code === st.code;

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

                    {/* Alarm Trigger Button for Station */}
                    <button
                      onClick={() => handleOpenAlarmModal(st)}
                      className={`ml-1.5 p-1 rounded-full transition-all ${
                        isAlarmForThisStation
                          ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/50'
                          : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100'
                      }`}
                      title={`Set Wakeup Alarm for ${st.name}`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>
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

      {/* Station Wakeup Alarm Modal */}
      {showAlarmModal && selectedStationForAlarm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-lg p-5 space-y-4 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">Set Destination Alarm</h3>
              </div>
              <button onClick={() => setShowAlarmModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-500">Wakeup alarm for station:</p>
              <h4 className="text-base font-extrabold text-blue-700 mt-0.5">
                {selectedStationForAlarm.name} ({selectedStationForAlarm.code})
              </h4>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Ring Alarm Before Arrival:</label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setAlarmOffsetMins(mins)}
                    className={`py-2 text-xs font-bold rounded border transition-colors ${
                      alarmOffsetMins === mins
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {mins} Mins
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
              <Volume2 className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Alarm chime &amp; notification will play when train approaches {selectedStationForAlarm.name}.</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleConfirmAlarm}
                className="flex-1 py-2.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Set Alarm</span>
              </button>
              <button
                onClick={() => setShowAlarmModal(false)}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded transition-colors"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
