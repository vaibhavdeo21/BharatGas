import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Map, Truck, MapPin, Clock, CheckCircle2, Navigation,
  X, Loader2, Inbox
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customMarkerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

export default function Logistics() {
  const [liveTrucks, setLiveTrucks] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([24.3228, 83.5670]); 
  const [loading, setLoading] = useState(true);

  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await axios.get("/api/admin/fleet/gps-telemetry", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.trackers && res.data.trackers.length > 0) {
          setLiveTrucks(res.data.trackers);
        }
      } catch (err) {
        console.error("Telemetry sync failure", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTelemetry();
    const mapThread = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(mapThread);
  }, []);

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1600px] mx-auto h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fleet Logistics</h1>
          <p className="text-muted-foreground text-sm mt-1">Live dispatch, routing, and fleet monitoring.</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-xl text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            GPS Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Live Map */}
        <motion.div variants={item} initial="hidden" animate="show" className="lg:col-span-8 glass-card rounded-2xl p-5 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Map size={16} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Fleet Tracker</h3>
                <p className="text-[11px] text-muted-foreground">Live SeTrack telemetry</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setMapCenter([24.3228, 83.5670])} className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-brand-orange-500/20 hover:text-brand-orange-500 transition-colors text-muted-foreground" title="Center to Garhwa">
                <MapPin size={14} />
              </button>
            </div>
          </div>

          <div className="w-full flex-1 rounded-xl overflow-hidden border border-border/30 bg-muted">
            <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
              <TileLayer
                attribution='&copy; <a href="https://carto.com">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <MapRecenter center={mapCenter} />
              {liveTrucks.map((truck) => (
                truck.latitude && truck.longitude && (
                  <Marker key={truck.id} position={[parseFloat(truck.latitude), parseFloat(truck.longitude)]} icon={customMarkerIcon}>
                    <Popup>
                      <div className="p-1 font-sans">
                        <h4 className="font-bold text-sm">{truck.vehicle_no}</h4>
                        <p className="text-xs mt-0.5">Speed: <strong>{truck.speed} km/h</strong></p>
                        <p className="text-xs mt-0.5">Engine: {truck.is_ignited ? "🟢 ON" : "🔴 OFF"}</p>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>

          {/* Stats Overlay */}
          <div className="mt-3 grid grid-cols-3 gap-2 shrink-0">
            {[
              { label: "Active Vehicles", value: `${liveTrucks.length}`, color: "text-blue-400" },
              { label: "Avg. ETA", value: "—", color: "text-amber-400" },
              { label: "Delivered Today", value: "—", color: "text-emerald-400" },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-xl p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-0.5">{stat.label}</p>
                <p className={`font-bold text-sm ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Fleet Status */}
        <motion.div variants={item} initial="hidden" animate="show" className="lg:col-span-4 glass-card rounded-2xl p-5 flex flex-col min-h-0">
          <div className="flex items-center gap-3 mb-4 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-orange-500/10 flex items-center justify-center">
              <Truck size={16} className="text-brand-orange-400" />
            </div>
            <h3 className="font-bold text-sm">Fleet Vehicles</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {liveTrucks.length > 0 ? (
              liveTrucks.map((truck) => (
                <div key={truck.id} className="p-3 rounded-xl border border-border/30 hover:bg-muted/20 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">{truck.vehicle_no}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block ${
                        truck.speed > 0 ? 'badge-success' : 'badge-warning'
                      }`}>
                        {truck.speed > 0 ? 'Moving' : 'Stationary'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-2">
                    <Navigation size={10} className="text-brand-orange-500" />
                    {truck.speed} km/h
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Inbox size={24} className="text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground/50">No active vehicles detected</p>
                <p className="text-[11px] text-muted-foreground/30 mt-1">GPS data will appear when fleet is operational</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}