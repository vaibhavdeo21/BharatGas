import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Map, Truck, User, MapPin, Clock, CheckCircle2, Navigation,
  MoreVertical, X, Loader2, ShieldCheck, AlertCircle
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default marker asset icon resolution glitch
const customMarkerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", // Flat truck tracking pin
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

// Helper component to center map frame smoothly
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

// Mock Data for Dispatch Queues
const initialPendingOrders = [
  { id: "ORD-9921", customer: "Amit Sharma", area: "Sector 14, Urban Estate", time: "10 mins ago", type: "14.2kg Domestic" },
  { id: "ORD-9922", customer: "Priya Desai", area: "Model Town, Block B", time: "25 mins ago", type: "14.2kg Domestic" },
  { id: "ORD-9923", customer: "Ravi's Diner", area: "Highway Food Court", time: "1 hour ago", type: "19kg Commercial" },
  { id: "ORD-9924", customer: "Sunita Verma", area: "Green Park Avenue", time: "2 hours ago", type: "14.2kg Domestic" },
];

const activeAgents = [
  { id: 1, name: "Ramesh Kumar", phone: "9876543210", status: "On Route", currentLoad: 12, maxLoad: 24, location: "Near Sector 14" },
  { id: 2, name: "Suresh Patel", phone: "8765432109", status: "Idle", currentLoad: 0, maxLoad: 24, location: "Godown" },
  { id: 3, name: "Mahesh T.", phone: "7654321098", status: "Returning", currentLoad: 0, maxLoad: 24, location: "Highway" },
];

export default function Logistics() {
  const [pendingOrders, setPendingOrders] = useState(initialPendingOrders);
  const [agents, setAgents] = useState(activeAgents);
  
  // Real GPS State
  const [liveTrucks, setLiveTrucks] = useState<any[]>([]);
  // Anchored natively to Kathar Kalan, Sagma, Garhwa, Jharkhand
  const [mapCenter, setMapCenter] = useState<[number, number]>([24.3228, 83.5670]); 

  // Dispatch Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  // Fetch Live Telemetry from Laravel Proxy
  useEffect(() => {
    const fetchSeTrackTelemetry = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await axios.get("/api/admin/fleet/gps-telemetry", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.trackers && res.data.trackers.length > 0) {
          setLiveTrucks(res.data.trackers);
          
          // Optionally auto-center on the first active truck if moving
          // const trackingPivot = res.data.trackers[0];
          // if (trackingPivot.latitude && trackingPivot.longitude) {
          //   setMapCenter([parseFloat(trackingPivot.latitude), parseFloat(trackingPivot.longitude)]);
          // }
        }
      } catch (err) {
        console.error("Telemetry sync failure", err);
      }
    };

    fetchSeTrackTelemetry();
    const mapThread = setInterval(fetchSeTrackTelemetry, 5000); // Poll every 5 seconds
    return () => clearInterval(mapThread);
  }, []);

  const openAssignModal = (order: any) => {
    setSelectedOrder(order);
    setSelectedAgentId(null);
    setIsAssignModalOpen(true);
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId || !selectedOrder) return;
    
    setLoading(true);

    // Simulate API Call to Laravel Backend
    await new Promise(resolve => setTimeout(resolve, 1000));

    setPendingOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
    setAgents(prev => prev.map(a => 
      a.id === selectedAgentId ? { ...a, currentLoad: a.currentLoad + 1, status: "On Route" } : a
    ));

    setSuccessMsg(`Order successfully dispatched to agent!`);
    setTimeout(() => {
      setIsAssignModalOpen(false);
      setSuccessMsg("");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Logistics</h1>
          <p className="text-muted-foreground">Live dispatch, routing, and fleet monitoring.</p>
        </div>
        <div className="flex gap-3">
           <div className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              GPS Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* Left Column - Pending Dispatch Queue */}
        <motion.div variants={container} initial="hidden" animate="show" className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col min-h-0">
           <div className="flex justify-between items-center mb-6 shrink-0">
             <div className="flex items-center gap-2">
                <Clock className="text-brand-orange-500" size={20} />
                <h3 className="font-bold text-xl">Pending Dispatch</h3>
             </div>
             <span className="bg-brand-orange-500/10 text-brand-orange-500 text-xs font-bold px-2 py-1 rounded-md">
               {pendingOrders.length} Orders
             </span>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-2 space-y-3">
             {pendingOrders.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                 <CheckCircle2 size={32} className="mb-2 text-green-500/50" />
                 <p>All orders dispatched!</p>
               </div>
             ) : (
               pendingOrders.map((order, i) => (
                 <motion.div variants={item} key={order.id} className="bg-muted/30 border border-border rounded-2xl p-4 hover:border-brand-orange-500/50 transition-colors group">
                   <div className="flex justify-between items-start mb-2">
                     <p className="font-bold text-sm">{order.customer}</p>
                     <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase">{order.id}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                     <MapPin size={12} /> <span className="truncate">{order.area}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs font-medium text-foreground bg-background px-2 py-1 rounded-md border border-border">
                       {order.type}
                     </span>
                     <button 
                        onClick={() => openAssignModal(order)}
                        className="text-xs font-bold bg-brand-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-brand-orange-600 transition-colors shadow-sm"
                     >
                       Assign Truck
                     </button>
                   </div>
                 </motion.div>
               ))
             )}
           </div>
        </motion.div>

        {/* Middle Column - REAL LIVE MAP DASHBOARD */}
        <motion.div variants={item} initial="hidden" animate="show" className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
           <div className="relative z-10 flex justify-between items-start shrink-0 pointer-events-none mb-4">
             <div className="pointer-events-auto">
               <h3 className="font-bold text-xl flex items-center gap-2"><Map size={20} className="text-brand-blue-500" /> Fleet Tracker</h3>
               <p className="text-xs text-muted-foreground mt-1">Live SeTrack telemetry active</p>
             </div>
             <div className="bg-background/80 backdrop-blur-md border border-border p-2 rounded-xl flex gap-2 pointer-events-auto">
                <button onClick={() => setMapCenter([24.3228, 83.5670])} className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-brand-orange-500 hover:text-white transition-colors" title="Center to Garhwa"><MapPin size={16} /></button>
                <button className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-brand-orange-500 hover:text-white transition-colors"><Navigation size={16} /></button>
             </div>
           </div>

           {/* Leaflet Map Integration */}
           <div className="w-full flex-1 rounded-2xl overflow-hidden z-10 border border-border bg-muted">
             <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
               <TileLayer
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               />
               <MapRecenter center={mapCenter} />
               
               {liveTrucks.map((truck) => (
                 truck.latitude && truck.longitude && (
                   <Marker 
                     key={truck.id} 
                     position={[parseFloat(truck.latitude), parseFloat(truck.longitude)]}
                     icon={customMarkerIcon}
                   >
                     <Popup>
                       <div className="p-1 font-sans">
                         <h4 className="font-bold text-sm text-foreground">{truck.vehicle_no}</h4>
                         <p className="text-xs text-muted-foreground mt-0.5">Speed: <strong className="text-foreground">{truck.speed} km/h</strong></p>
                         <p className="text-xs text-muted-foreground mt-0.5">Engine: {truck.is_ignited ? "🟢 ON" : "🔴 OFF"}</p>
                       </div>
                     </Popup>
                   </Marker>
                 )
               ))}
             </MapContainer>
           </div>

           {/* Stats Overlay */}
           <div className="relative z-10 mt-4 grid grid-cols-3 gap-2 pointer-events-auto">
              <div className="bg-background/80 backdrop-blur-md border border-border rounded-2xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Active Pickups</p>
                <p className="font-bold text-foreground">{liveTrucks.length} / 2</p>
              </div>
              <div className="bg-background/80 backdrop-blur-md border border-border rounded-2xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Avg ETA</p>
                <p className="font-bold text-foreground">24 Min</p>
              </div>
              <div className="bg-background/80 backdrop-blur-md border border-border rounded-2xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Delivered Today</p>
                <p className="font-bold text-green-500">142</p>
              </div>
           </div>
        </motion.div>

        {/* Right Column - Active Fleet List */}
        <motion.div variants={container} initial="hidden" animate="show" className="lg:col-span-3 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col min-h-0">
           <div className="flex justify-between items-center mb-6 shrink-0">
             <div className="flex items-center gap-2">
                <Truck className="text-brand-blue-500" size={20} />
                <h3 className="font-bold text-xl">Active Fleet</h3>
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-2 space-y-4">
             {agents.map((agent) => (
               <motion.div variants={item} key={agent.id} className="border border-border rounded-2xl p-4">
                 <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                       <img src={`https://ui-avatars.com/api/?name=${agent.name}&background=random`} alt="Agent" />
                     </div>
                     <div>
                       <p className="font-bold text-sm text-foreground leading-none">{agent.name}</p>
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block ${
                         agent.status === 'Idle' ? 'bg-slate-500/10 text-slate-500' :
                         agent.status === 'On Route' ? 'bg-green-500/10 text-green-500' :
                         'bg-brand-orange-500/10 text-brand-orange-500'
                       }`}>
                         {agent.status}
                       </span>
                     </div>
                   </div>
                   <button className="text-muted-foreground hover:text-foreground"><MoreVertical size={16} /></button>
                 </div>
                 
                 <div className="bg-muted/50 rounded-xl p-3 space-y-2">
                   <div className="flex justify-between text-xs">
                     <span className="text-muted-foreground">Current Load</span>
                     <span className="font-bold text-foreground">{agent.currentLoad} / {agent.maxLoad} Cyl</span>
                   </div>
                   <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                     <div 
                       className={`h-full ${agent.currentLoad === agent.maxLoad ? 'bg-red-500' : 'bg-brand-blue-500'}`} 
                       style={{ width: `${(agent.currentLoad / agent.maxLoad) * 100}%` }}
                     ></div>
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
                     <Navigation size={10} className="text-brand-orange-500" /> {agent.location}
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </motion.div>
      </div>

      {/* --- DISPATCH MODAL --- */}
      <AnimatePresence>
        {isAssignModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !loading && setIsAssignModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Dispatch Order</h3>
                  <p className="text-sm text-muted-foreground font-mono mt-1">ID: {selectedOrder.id}</p>
                </div>
                <button onClick={() => setIsAssignModalOpen(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>

              {successMsg ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                     <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Dispatched!</h4>
                  <p className="text-muted-foreground text-center">{successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleDispatch} className="space-y-6">
                  
                  {/* Order Summary */}
                  <div className="bg-muted p-4 rounded-2xl flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-brand-orange-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{selectedOrder.customer}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{selectedOrder.area}</p>
                      <span className="text-[10px] font-bold bg-background border border-border px-2 py-0.5 rounded-md mt-2 inline-block">
                        {selectedOrder.type}
                      </span>
                    </div>
                  </div>

                  {/* Select Agent */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Assign to Delivery Agent</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {agents.map(agent => (
                        <div 
                          key={agent.id}
                          onClick={() => agent.currentLoad < agent.maxLoad && setSelectedAgentId(agent.id)}
                          className={`p-3 rounded-xl border-2 flex justify-between items-center transition-all ${
                            agent.currentLoad >= agent.maxLoad ? "opacity-50 cursor-not-allowed border-border bg-muted/30" :
                            selectedAgentId === agent.id ? "border-brand-orange-500 bg-brand-orange-500/5 cursor-pointer" : "border-border hover:border-brand-orange-500/30 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
                               <img src={`https://ui-avatars.com/api/?name=${agent.name}&background=random`} alt="Agent" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-foreground leading-none">{agent.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{agent.location}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xs font-bold text-foreground">{agent.currentLoad}/{agent.maxLoad}</p>
                            <p className="text-[10px] text-muted-foreground">Load</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={loading || !selectedAgentId} className="w-full py-3.5 mt-2 rounded-xl bg-brand-orange-500 text-white font-bold text-lg shadow-lg hover:bg-brand-orange-600 disabled:opacity-70 flex items-center justify-center gap-2 transition-all">
                    {loading ? <Loader2 className="animate-spin" size={24} /> : "Confirm Dispatch"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}