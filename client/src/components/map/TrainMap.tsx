import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Navigation, Layers, ZoomIn, ZoomOut, RotateCcw, Mountain, Globe } from 'lucide-react';
import type { LiveTrainStatus, Station } from '../../types/index.js';
import { useTrainStore } from '../../store/useTrainStore.js';

interface TrainMapProps {
  status: LiveTrainStatus;
  selectedStation?: Station | null;
}

type MapTilerTheme = 'dark' | 'satellite' | 'terrain' | 'streets';

export default function TrainMap({ status, selectedStation }: TrainMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const trainMarkerRef = useRef<maplibregl.Marker | null>(null);

  const { followTrainOnMap, setFollowTrainOnMap } = useTrainStore();
  const [mapTheme, setMapTheme] = useState<MapTilerTheme>('dark');

  const maptilerKey = import.meta.env.VITE_MAPTILER_API_KEY || 'ftFFfZuNUZ7O0nfpxW5g';

  const getStyleUrl = (theme: MapTilerTheme) => {
    switch (theme) {
      case 'satellite':
        return `https://api.maptiler.com/maps/hybrid/style.json?key=${maptilerKey}`;
      case 'terrain':
        return `https://api.maptiler.com/maps/topo-v2/style.json?key=${maptilerKey}`;
      case 'streets':
        return `https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilerKey}`;
      case 'dark':
      default:
        return `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${maptilerKey}`;
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const styleUrl = getStyleUrl(mapTheme);

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [status.currentLng, status.currentLat],
      zoom: 7.5,
      pitch: mapTheme === 'terrain' ? 60 : 45,
      bearing: status.bearing || 0,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      try {
        map.addSource('maptiler-dem', {
          type: 'raster-dem',
          url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${maptilerKey}`,
          tileSize: 512,
          maxzoom: 14,
        });
        
        if (mapTheme === 'terrain') {
          map.setTerrain({ source: 'maptiler-dem', exaggeration: 1.8 });
        }
      } catch (e) {
        console.warn('MapTiler 3D terrain initialization note:', e);
      }

      const routeGeoJSON: any = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: status.routeCoordinates,
        },
      };

      map.addSource('route', {
        type: 'geojson',
        data: routeGeoJSON,
      });

      map.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#2563eb',
          'line-width': 12,
          'line-opacity': 0.4,
        },
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 4.5,
        },
      });

      status.stations.forEach((st: Station) => {
        const el = document.createElement('div');
        el.className = 'w-6 h-6 flex items-center justify-center cursor-pointer group';
        
        const inner = document.createElement('div');
        const isCurrent = st.code === status.currentStation.code;
        inner.className = isCurrent 
          ? 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md ring-4 ring-blue-500/30'
          : st.status === 'passed'
          ? 'w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900'
          : 'w-3 h-3 bg-slate-500 rounded-full border-2 border-slate-900';

        el.appendChild(inner);

        const popupHTML = `
          <div style="font-family: sans-serif;">
            <div style="font-size: 10px; color: #94a3b8; font-weight: 600;">STATION (${st.code})</div>
            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-top: 2px;">${st.name}</div>
            <div style="font-size: 11px; color: #cbd5e1; margin-top: 6px;">
              Platform: <b style="color: #38bdf8;">#${st.platform || '1'}</b><br/>
              Status: <b style="color: ${st.status === 'passed' ? '#34d399' : st.status === 'current' ? '#60a5fa' : '#94a3b8'};">${st.status.toUpperCase()}</b><br/>
              Delay: <b style="color: ${st.delayMinutes > 0 ? '#f87171' : '#34d399'};">${st.delayMinutes}m</b>
            </div>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 12 }).setHTML(popupHTML);

        new maplibregl.Marker({ element: el })
          .setLngLat([st.lng, st.lat])
          .setPopup(popup)
          .addTo(map);
      });

      const trainEl = document.createElement('div');
      trainEl.className = 'relative flex items-center justify-center cursor-pointer';
      trainEl.innerHTML = `
        <div class="train-marker-ring"></div>
        <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs z-10">
          🚆
        </div>
      `;

      const trainMarker = new maplibregl.Marker({ element: trainEl })
        .setLngLat([status.currentLng, status.currentLat])
        .addTo(map);

      trainMarkerRef.current = trainMarker;
    });

    return () => {
      map.remove();
    };
  }, [mapTheme, status.trainNumber]);

  useEffect(() => {
    if (selectedStation && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedStation.lng, selectedStation.lat],
        zoom: 11,
        duration: 1800,
        pitch: 50,
      });
    }
  }, [selectedStation]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (trainMarkerRef.current) {
      trainMarkerRef.current.setLngLat([status.currentLng, status.currentLat]);
    }

    if (followTrainOnMap && mapRef.current && !selectedStation) {
      mapRef.current.easeTo({
        center: [status.currentLng, status.currentLat],
        zoom: 8.5,
        duration: 1500,
      });
    }
  }, [status.currentLat, status.currentLng, followTrainOnMap, selectedStation]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetBearing = () => mapRef.current?.resetNorthPitch();

  return (
    <div className="relative w-full h-[550px] md:h-[650px] rounded-3xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900">
      
      {/* MapLibre Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* MapTiler Theme Switcher Overlay Bar */}
      <div className="absolute top-4 right-4 z-10 flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-700 rounded-xl shadow-md">
        
        <button
          onClick={() => setMapTheme('dark')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
            mapTheme === 'dark' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
          title="MapTiler Dataviz Dark"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>

        <button
          onClick={() => setMapTheme('satellite')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
            mapTheme === 'satellite' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
          title="MapTiler Hybrid Satellite"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>

        <button
          onClick={() => setMapTheme('terrain')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
            mapTheme === 'terrain' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
          title="MapTiler 3D Terrain & Topo"
        >
          <Mountain className="w-3.5 h-3.5 text-amber-400" />
          <span>3D Terrain</span>
        </button>

        <button
          onClick={() => setMapTheme('streets')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
            mapTheme === 'streets' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
          title="MapTiler Streets"
        >
          <span>Streets</span>
        </button>

        <div className="h-4 w-px bg-slate-700 my-auto mx-1"></div>
        <button
          onClick={() => setFollowTrainOnMap(!followTrainOnMap)}
          className={`p-1.5 rounded-lg transition-all ${
            followTrainOnMap ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
          title="Follow Train Camera"
        >
          <Navigation className={`w-4 h-4 ${followTrainOnMap ? 'animate-pulse' : ''}`} />
        </button>

      </div>

      {/* Map Control Buttons */}
      <div className="absolute bottom-6 right-4 z-10 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg border border-slate-700 shadow-md transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg border border-slate-700 shadow-md transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetBearing}
          className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg border border-slate-700 shadow-md transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* MapTiler Cloud Badge */}
      <div className="absolute bottom-6 left-4 z-10 p-2.5 bg-slate-900 border border-slate-700 rounded-xl shadow-md text-[11px] flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
        <span className="text-slate-300 font-medium">Powered by <strong>MapTiler Cloud</strong> Vector API</span>
      </div>

    </div>
  );
}
