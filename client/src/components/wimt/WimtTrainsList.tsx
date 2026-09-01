import { useState } from 'react';
import { ArrowLeft, ChevronDown, CheckCircle2 } from 'lucide-react';
import type { TrainSearchResult } from '../../types/index.js';

interface WimtTrainsListProps {
  fromStation: string;
  toStation: string;
  trains: TrainSearchResult[];
  onSelectTrain: (trainNumber: string) => void;
  onBack: () => void;
}

export default function WimtTrainsList({ fromStation, toStation, trains, onSelectTrain, onBack }: WimtTrainsListProps) {
  const [selectedDate, setSelectedDate] = useState('All Dates');
  const [selectedQuota, setSelectedQuota] = useState('GN - Unreserved');

  const cleanFrom = fromStation.replace(/\(.*?\)/, '').trim() || 'Origin';
  const cleanTo = toStation.replace(/\(.*?\)/, '').trim() || 'Destination';

  return (
    <div className="max-w-2xl mx-auto font-sans bg-white min-h-screen pb-12 select-none shadow-md">
      
      {/* 1. Header Bar sticky below WimtHeader (top-[98px]) */}
      <div className="bg-[#1565C0] text-white p-3 sticky top-[98px] z-20 shadow-md">
        
        {/* Top Control Bar: Back Arrow + Date Selector Dropdown + Quota Dropdown */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/15">
          <button onClick={onBack} className="p-1 rounded hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            {/* Date Filter */}
            <div className="relative">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white/15 hover:bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded border border-white/20 focus:outline-none appearance-none pr-6 cursor-pointer"
              >
                <option value="All Dates" className="text-slate-900">📅 All Dates</option>
                <option value="Today" className="text-slate-900">📅 Today, 1 Sep</option>
                <option value="Yesterday" className="text-slate-900">📅 Yesterday, 31 Aug</option>
              </select>
              <ChevronDown className="w-3 h-3 text-white absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quota Filter */}
            <div className="relative">
              <select
                value={selectedQuota}
                onChange={(e) => setSelectedQuota(e.target.value)}
                className="bg-white/15 hover:bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded border border-white/20 focus:outline-none appearance-none pr-6 cursor-pointer"
              >
                <option value="GN - Unreserved" className="text-slate-900">₹ GN - Unreserved</option>
                <option value="TQ - Tatkal" className="text-slate-900">₹ TQ - Tatkal</option>
                <option value="LD - Ladies" className="text-slate-900">₹ LD - Ladies</option>
              </select>
              <ChevronDown className="w-3 h-3 text-white absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Route Header Bar */}
        <div className="flex items-center justify-between pt-2.5 px-2 text-center">
          <div className="font-bold text-sm text-white tracking-wide truncate max-w-[180px]">{cleanFrom}</div>
          <div className="text-blue-200 text-xs font-semibold flex items-center gap-1">
            <span>||||||</span>
          </div>
          <div className="font-bold text-sm text-white tracking-wide truncate max-w-[180px]">{cleanTo}</div>
        </div>

      </div>

      {/* 2. Morning to Night Full Train Schedule List */}
      <div className="divide-y divide-slate-200">
        {trains.map((t, idx) => {
          const isRecentlyReached = idx === 0 || idx === 1 || idx === 3;

          return (
            <div
              key={t.trainNumber + idx}
              onClick={() => onSelectTrain(t.trainNumber)}
              className={`p-4 hover:bg-blue-50/50 cursor-pointer transition-colors ${
                isRecentlyReached ? 'bg-emerald-50/30' : 'bg-white'
              }`}
            >
              
              {/* Top Line: Train Number Badge + Timings + Status Badge */}
              <div className="flex items-center justify-between">
                
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 font-bold text-xs rounded text-white bg-[#0288D1]">
                    {t.trainNumber}
                  </span>

                  <div className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
                    <span>{t.departureTime || '06:00 AM'}</span>
                    <span className="text-blue-600 font-bold">&rarr;</span>
                    <span>{t.arrivalTime || '10:55 AM'}</span>
                  </div>
                </div>

                {isRecentlyReached ? (
                  <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#2E7D32] bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Reached ({t.arrivalTime || 'Completed'})</span>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-emerald-600">
                    {Array.isArray(t.runsOn) ? t.runsOn.join(' ') : 'Runs Daily'}
                  </div>
                )}

              </div>

              {/* Bottom Line: Train Name + Class Price Badge */}
              <div className="flex items-center justify-between mt-1.5">
                
                <h3 className="text-sm font-bold truncate pr-2 text-slate-800">
                  {t.trainName}
                </h3>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded border bg-emerald-100 text-emerald-800 border-emerald-300">
                    GN
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded border bg-emerald-100 text-emerald-800 border-emerald-300">
                    ₹135
                  </span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
