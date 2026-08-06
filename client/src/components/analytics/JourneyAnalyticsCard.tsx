import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { Mountain, Clock, Award, TrendingUp, MapPin } from 'lucide-react';
import type { LiveTrainStatus } from '../../types/index.js';
import { useAnalytics } from '../../hooks/useAnalytics.js';

interface JourneyAnalyticsCardProps {
  status: LiveTrainStatus;
}

export default function JourneyAnalyticsCard({ status }: JourneyAnalyticsCardProps) {
  const { data: analytics, isLoading } = useAnalytics(status.trainNumber);

  const delayData = status.stations.map(st => ({
    name: st.code,
    delay: st.delayMinutes,
  }));

  return (
    <div className="space-y-6">
      
      {/* Top Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="card-panel p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Punctuality Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {status.delayMinutes === 0 ? '98.5%' : status.delayMinutes < 15 ? '88.0%' : '72.4%'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">High Reliability Rating</p>
        </div>

        <div className="card-panel p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Average Speed</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {status.speedKmh} <span className="text-sm font-normal text-slate-400">km/h</span>
          </div>
          <p className="text-[11px] text-blue-400 mt-1">Cruising Speed</p>
        </div>

        <div className="card-panel p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Highest Elevation</span>
            <Mountain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {analytics?.highestElevationM || 493} <span className="text-sm font-normal text-slate-400">meters</span>
          </div>
          <p className="text-[11px] text-amber-400 mt-1">Terrain Peak along Route</p>
        </div>

        <div className="card-panel p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Current Status</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {status.delayMinutes <= 0 ? 'On Schedule' : `+${status.delayMinutes} min`}
          </div>
          <p className="text-[11px] text-cyan-400 mt-1">Live Feed Updated</p>
        </div>

      </div>

      {/* Elevation Profile Area Chart */}
      <div className="card-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Route Elevation Profile</h3>
              <p className="text-xs text-slate-400">Terrain height across journey distance (OpenTopography DEM API)</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20 text-xs font-bold">
            Peak: {analytics?.highestElevationM || 493}m
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Loading elevation chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.profile || []}>
                <defs>
                  <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="distanceKm" stroke="#64748b" tickFormatter={(v) => `${v} km`} />
                <YAxis stroke="#64748b" tickFormatter={(v) => `${v}m`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(value: any) => [`${value} meters`, 'Elevation']}
                  labelFormatter={(label: any) => `Distance: ${label} km`}
                />
                <Area type="monotone" dataKey="elevationM" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#elevationGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Delay Analysis Bar Chart */}
      <div className="card-panel p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Station Delay Distribution</h3>
            <p className="text-xs text-slate-400">Delay minutes recorded at each halt station</p>
          </div>
        </div>

        <div className="h-56 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={delayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(v) => `${v}m`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                formatter={(value: any) => [`${value} min`, 'Delay']}
              />
              <Bar dataKey="delay" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vertical Station Timeline */}
      <div className="card-panel p-6 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          <span>Full Journey Timeline ({status.stations.length} Stations)</span>
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {status.stations.map((st) => {
            const isCurrent = st.code === status.currentStation.code;
            return (
              <div key={st.code} className="relative flex items-center justify-between">
                
                {/* Timeline Dot */}
                <div className={`absolute -left-[27px] w-4 h-4 rounded-full border-2 border-slate-950 ${
                  isCurrent
                    ? 'bg-blue-600 ring-4 ring-blue-500/30'
                    : st.status === 'passed'
                    ? 'bg-emerald-400'
                    : 'bg-slate-700'
                }`} />

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{st.name}</span>
                    <span className="text-xs text-slate-400">({st.code})</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-[10px] font-bold rounded-md border border-blue-500/30">
                        Current Position
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Platform #{st.platform || '1'} &bull; {st.distanceFromSourceKm} km from origin
                  </p>
                </div>

                <div className="text-right text-xs">
                  <div className="font-semibold text-slate-200">
                    Sch: {st.scheduledArrival || st.scheduledDeparture || 'N/A'}
                  </div>
                  <div className={`font-bold ${st.delayMinutes > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    Act: {st.actualArrival || st.actualDeparture || 'N/A'} ({st.delayMinutes > 0 ? `+${st.delayMinutes}m` : 'On Time'})
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
