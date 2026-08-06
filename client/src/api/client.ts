import type { LiveTrainStatus, TrainSearchResult, WeatherInfo, Landmark, ElevationAnalytics } from '../types/index.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchTrainSearch(query: string): Promise<TrainSearchResult[]> {
  if (!query.trim()) return [];
  const res = await fetch(`${API_BASE}/trains/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search trains');
  return res.json();
}

export async function fetchLiveStatus(trainNumber: string): Promise<LiveTrainStatus> {
  const res = await fetch(`${API_BASE}/trains/${encodeURIComponent(trainNumber)}/status`);
  if (!res.ok) throw new Error('Failed to fetch train status');
  return res.json();
}

export async function fetchStationWeather(code: string, name: string, lat: number, lng: number): Promise<WeatherInfo> {
  const res = await fetch(`${API_BASE}/weather/${encodeURIComponent(code)}?name=${encodeURIComponent(name)}&lat=${lat}&lng=${lng}`);
  if (!res.ok) throw new Error('Failed to fetch weather');
  return res.json();
}

export async function fetchNearbyLandmarks(lat: number, lng: number): Promise<Landmark[]> {
  const res = await fetch(`${API_BASE}/companion/landmarks?lat=${lat}&lng=${lng}`);
  if (!res.ok) throw new Error('Failed to fetch landmarks');
  return res.json();
}

export async function fetchElevationAnalytics(trainNumber: string): Promise<ElevationAnalytics> {
  const res = await fetch(`${API_BASE}/analytics/${encodeURIComponent(trainNumber)}/elevation`);
  if (!res.ok) throw new Error('Failed to fetch elevation analytics');
  return res.json();
}
