import { useTrainStore } from '../../store/useTrainStore.js';
import { Train, Clock, MapPin, TrendingUp, AlertCircle } from 'lucide-react';

interface AvailableTrain {
  trainNumber: string;
  trainName: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  delay: number;
  distance: number;
}

// Mock available trains for demonstration
const MOCK_TRAINS: AvailableTrain[] = [
  {
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    departure: '06:00 AM',
    arrival: '02:15 PM',
    duration: '8h 15m',
    stops: 8,
    delay: 5,
    distance: 680,
  },
  {
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani',
    departure: '04:25 PM',
    arrival: '10:00 PM',
    duration: '5h 35m',
    stops: 5,
    delay: -2,
    distance: 680,
  },
  {
    trainNumber: '12002',
    trainName: 'Bhopal Shatabdi',
    departure: '02:15 PM',
    arrival: '08:30 PM',
    duration: '6h 15m',
    stops: 6,
    delay: 12,
    distance: 680,
  },
];

export default function JourneyDisplay() {
  const { fromStation, toStation, setSelectedTrainNumber, setActiveTab } = useTrainStore();

  if (!fromStation || !toStation) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">Select stations to view available trains</p>
      </div>
    );
  }

  const handleSelectTrain = (trainNumber: string) => {
    setSelectedTrainNumber(trainNumber);
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Journey Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl p-6 border border-blue-500/30 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Available Trains</h3>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="font-semibold text-blue-300">{fromStation.name}</span>
              <span className="text-slate-500">→</span>
              <span className="font-semibold text-blue-300">{toStation.name}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 mb-1">Distance</div>
            <div className="text-2xl font-bold text-white">680 km</div>
          </div>
        </div>
      </div>

      {/* Trains List */}
      <div className="grid gap-4">
        {MOCK_TRAINS.map((train) => (
          <button
            key={train.trainNumber}
            onClick={() => handleSelectTrain(train.trainNumber)}
            className="group bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 text-left"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Train Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30 group-hover:border-blue-400/50">
                    <Train className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-blue-300">
                      #{train.trainNumber} {train.trainName}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {train.stops} stops • {train.distance} km
                    </p>
                  </div>
                </div>
              </div>

              {/* Journey Timeline */}
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                {/* Departure */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{train.departure}</div>
                    <div className="text-xs text-slate-400">Depart</div>
                  </div>
                  <Clock className="w-4 h-4 text-slate-500" />
                </div>

                {/* Duration Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-200">{train.duration}</span>
                </div>

                {/* Arrival */}
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-lg font-bold text-white">{train.arrival}</div>
                    <div className="text-xs text-slate-400">Arrive</div>
                  </div>
                </div>

                {/* Delay Status */}
                <div className="flex items-center gap-2">
                  {train.delay > 0 ? (
                    <div className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-semibold text-orange-300">+{train.delay}m avg</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-xs font-semibold text-emerald-300">On time</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Select Button */}
              <div className="ml-auto">
                <div className="px-4 py-2 rounded-lg bg-blue-600 group-hover:bg-blue-500 text-white font-medium text-sm transition-colors">
                  Track →
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Alternative Routes Info */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
        <p className="text-xs text-slate-400">
          💡 Showing 3 fastest direct trains. Multiple connecting routes and more options are available in the full search.
        </p>
      </div>
    </div>
  );
}
