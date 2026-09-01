export interface Station {
  code: string;
  name: string;
  state?: string;
  lat: number;
  lng: number;
  scheduledArrival?: string;
  scheduledDeparture?: string;
  actualArrival?: string;
  actualDeparture?: string;
  delayMinutes: number;
  platform?: string;
  distanceFromSourceKm: number;
  status: 'passed' | 'current' | 'upcoming';
  elevationMeters?: number;
}

export interface LiveTrainStatus {
  trainNumber: string;
  trainName: string;
  sourceStation: string;
  destinationStation: string;
  currentStation: Station;
  nextStation: Station;
  lastUpdated: string;
  isStale: boolean;
  delayMinutes: number;
  speedKmh: number;
  progressPercent: number;
  distanceCoveredKm: number;
  distanceRemainingKm: number;
  totalDistanceKm: number;
  currentLat: number;
  currentLng: number;
  bearing: number;
  stations: Station[];
  routeCoordinates: [number, number][]; // [lng, lat]
}

export interface TrainSearchResult {
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  runsOn: string[];
  departureTime?: string;
  arrivalTime?: string;
}

export interface WeatherInfo {
  stationCode: string;
  stationName: string;
  tempC: number;
  condition: string;
  description: string;
  humidityPercent: number;
  windSpeedKmh: number;
  rainProbabilityPercent: number;
  icon: string;
}

export interface Landmark {
  id: string;
  name: string;
  type: 'river' | 'lake' | 'mountain' | 'bridge' | 'tunnel' | 'attraction' | 'city';
  lat: number;
  lng: number;
  distanceKm: number;
  description?: string;
}

export interface ElevationPoint {
  distanceKm: number;
  elevationM: number;
  stationName?: string;
}
