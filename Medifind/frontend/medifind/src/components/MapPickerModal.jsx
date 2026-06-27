import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, Loader2, Navigation, Check } from 'lucide-react';

const MapPickerModal = ({ isOpen, onClose, onConfirm, initialLat, initialLng }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainerId = 'map-picker-canvas';

  // Selected state
  const [lat, setLat] = useState(parseFloat(initialLat) || 28.6139); // Default to Delhi center
  const [lng, setLng] = useState(parseFloat(initialLng) || 77.2090);
  const [address, setAddress] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Geocoding: Coordinate to Address
  const reverseGeocode = async (latitude, longitude) => {
    setLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (response.ok) {
        const data = await response.json();
        setAddress(data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      } else {
        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    } finally {
      setLoadingAddress(false);
    }
  };

  // Get current GPS and center map
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          setLat(newLat);
          setLng(newLng);
          reverseGeocode(newLat, newLng);

          if (mapRef.current) {
            mapRef.current.setView([newLat, newLng], 16);
            if (markerRef.current) {
              markerRef.current.setLatLng([newLat, newLng]);
            }
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!isOpen) return;

    // Small delay to ensure modal div is fully rendered and has dimensions
    const timer = setTimeout(() => {
      if (window.L && !mapRef.current) {
        const L = window.L;

        // Create Leaflet map instance
        const map = L.map(mapContainerId, {
          zoomControl: true,
          attributionControl: false
        }).setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        // Add a draggable marker
        const marker = L.marker([lat, lng], { draggable: true }).addTo(map);

        mapRef.current = map;
        markerRef.current = marker;

        // Try to reverse geocode initial position
        if (!initialLat && !initialLng) {
          locateUser();
        } else {
          reverseGeocode(lat, lng);
        }

        // Click on map to place marker
        map.on('click', (e) => {
          const clickedLat = e.latlng.lat;
          const clickedLng = e.latlng.lng;
          setLat(clickedLat);
          setLng(clickedLng);
          marker.setLatLng([clickedLat, clickedLng]);
          reverseGeocode(clickedLat, clickedLng);
        });

        // Drag marker handler
        marker.on('dragend', () => {
          const position = marker.getLatLng();
          setLat(position.lat);
          setLng(position.lng);
          reverseGeocode(position.lat, position.lng);
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-955/65 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden transition-all duration-300 animate-toast-in flex flex-col h-[90vh] max-h-[600px] text-left relative z-50">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-2 text-slate-850 dark:text-white">
            <MapPin className="w-5 h-5 text-cyan-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Locate Pharmacy on Map</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        {/* Map Area */}
        <div className="flex-grow relative bg-slate-100 dark:bg-slate-950 min-h-[200px]">
          <div id={mapContainerId} className="w-full h-full absolute inset-0 z-10" />
          
          {/* Locate Me Button Overlay */}
          <button
            type="button"
            onClick={locateUser}
            className="absolute bottom-6 right-6 z-20 p-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl shadow-xl hover:scale-105 active:scale-95 text-cyan-500 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all cursor-pointer"
            title="My Location"
          >
            <Navigation className="w-4 h-4 fill-cyan-500/20" />
          </button>
        </div>

        {/* Info & Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 shrink-0 space-y-4">
          <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div className="leading-tight text-xs">
                <span className="font-bold text-slate-850 dark:text-white block mb-0.5">Selected Address</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {loadingAddress ? (
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching address details...</span>
                    </span>
                  ) : (
                    address || 'Drag the marker or click on the map to select your shop location.'
                  )}
                </span>
              </div>
            </div>
            <div className="flex gap-4 border-t border-slate-100 dark:border-slate-850 pt-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              <span>Lat: <span className="font-extrabold text-slate-700 dark:text-slate-300">{lat.toFixed(6)}</span></span>
              <span>Lng: <span className="font-extrabold text-slate-700 dark:text-slate-300">{lng.toFixed(6)}</span></span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-750 hover:bg-slate-100 dark:border-slate-750 dark:text-slate-350 dark:hover:bg-slate-800 transition-all text-xs font-bold cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm({ latitude: lat, longitude: lng, address })}
              disabled={loadingAddress}
              className="flex-grow py-2.5 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-cyan-500/15 transition-all text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Location</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MapPickerModal;
