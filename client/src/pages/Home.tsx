import { Map, BarChart3, Compass, Sparkles, Zap, Users, Clock } from 'lucide-react';
import JourneySelector from '../components/journey/JourneySelector.js';
import JourneyDisplay from '../components/journey/JourneyDisplay.js';
import { useTrainStore } from '../store/useTrainStore.js';

export default function Home() {
  const { fromStation, toStation } = useTrainStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-6">
      <div className="space-y-12 max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-4 md:pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-Time Indian Railways Tracking Engine</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Track Your <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Train Journey
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Real-time train tracking with live GPS updates, route maps, station timelines, and journey analytics powered by RailRadar.
            </p>
          </div>
        </div>

        {/* Journey Selector */}
        <div>
          <JourneySelector />
        </div>

        {/* Journey Display - Shows when stations are selected */}
        {fromStation && toStation && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <JourneyDisplay />
          </div>
        )}

        {/* Features Grid */}
        {!fromStation && !toStation && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Why Choose RailGadi</h2>
              <p className="text-slate-400">Experience the most advanced train tracking platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-blue-500/40 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:bg-slate-800/50">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Map className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  3D Live Map
                </h3>
                <p className="text-sm text-slate-400">
                  Interactive MapTiler map with real-time train positioning and station popups.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:bg-slate-800/50">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Advanced Analytics
                </h3>
                <p className="text-sm text-slate-400">
                  Elevation graphs, delay predictions, and punctuality statistics.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:bg-slate-800/50">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  Route Timeline
                </h3>
                <p className="text-sm text-slate-400">
                  Complete station-by-station journey with times and weather updates.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-violet-500/40 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:bg-slate-800/50">
                <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                  Real-Time Updates
                </h3>
                <p className="text-sm text-slate-400">
                  Auto-refresh every 20 seconds with live GPS tracking and alerts.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-pink-500/40 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:bg-slate-800/50">
                <div className="w-12 h-12 rounded-xl bg-pink-600/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                  Delay Predictions
                </h3>
                <p className="text-sm text-slate-400">
                  AI-powered delay forecasts and historical punctuality data.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-orange-500/40 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:bg-slate-800/50">
                <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  Share Journey
                </h3>
                <p className="text-sm text-slate-400">
                  Share live tracking links with friends and family.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center pt-8 border-t border-slate-800">
          <p className="text-slate-400 text-sm mb-4">
            Start your journey by selecting departure and arrival stations above
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-500">Popular routes:</span>
            {[
              { from: 'Delhi', to: 'Mumbai', label: 'Delhi → Mumbai' },
              { from: 'Chennai', to: 'Bangalore', label: 'Chennai → Bangalore' },
              { from: 'Kolkata', to: 'Guwahati', label: 'Kolkata → Guwahati' },
            ].map((route) => (
              <button
                key={route.label}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-blue-300 border border-slate-700 transition-all"
              >
                {route.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
