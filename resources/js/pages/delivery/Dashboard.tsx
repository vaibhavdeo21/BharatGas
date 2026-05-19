import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Map, Truck, Navigation, PhoneCall, CheckCircle2, 
  MapPin, Clock, Camera, ChevronRight, AlertCircle, X,
  IndianRupee, TrendingUp, Package, Shield
} from "lucide-react";
import axios from "axios";

export default function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, completed: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);
  const [activeDelivery, setActiveDelivery] = useState<any>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  const userData = (() => {
    try { return JSON.parse(localStorage.getItem('user_data') || '{}'); } catch { return {}; }
  })();

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/deliveries/assigned', config).catch(() => ({ data: [] }));
      
      const assignedDeliveries = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setDeliveries(assignedDeliveries);
      
      // Calculate Stats
      const completed = assignedDeliveries.filter((d: any) => d.status === 'delivered').length;
      const pending = assignedDeliveries.filter((d: any) => d.status !== 'delivered' && d.status !== 'cancelled').length;
      
      setStats({
        pending,
        completed,
        earnings: completed * 45 // Dummy earning calculation per delivery
      });

    } catch (error) {
      console.error("Failed to fetch deliveries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleMarkDelivered = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`/api/deliveries/${id}/status`, { status: 'delivered' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDeliveries();
      setIsPhotoModalOpen(false);
      setActiveDelivery(null);
    } catch (error) {
      console.error("Failed to mark delivered", error);
    }
  };

  const pendingDeliveriesList = deliveries.filter(d => d.status !== 'delivered' && d.status !== 'cancelled');
  const todaysRoute = pendingDeliveriesList.slice(0, 3); // Just taking first 3 for the route placeholder

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{greeting} 👋</p>
          <h1 className="text-3xl font-bold tracking-tight">{userData.name || "Delivery Partner"}</h1>
          <p className="text-sm text-muted-foreground mt-1">JH-14 Area • ID: {userData.id || "EMP001"}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-500">On Duty</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Earnings Card */}
        <motion.div variants={item} className="relative overflow-hidden rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-white/70 text-sm font-medium mb-0.5">Today's Earnings</p>
                <h3 className="text-3xl font-bold">₹{stats.earnings}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md">
                <IndianRupee size={20} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-50 font-medium">
              <TrendingUp size={16} /> +₹120 from yesterday
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-0.5">Completed</p>
              <h3 className="text-2xl font-bold">{stats.completed}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mb-1 mt-auto">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (stats.completed / Math.max(1, stats.completed + stats.pending)) * 100)}%` }}></div>
          </div>
          <p className="text-xs text-muted-foreground text-right">{stats.completed} of {stats.completed + stats.pending} done</p>
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-2xl p-5 flex flex-col justify-between border-brand-orange-500/30">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-brand-orange-500 text-sm font-medium mb-0.5">Pending</p>
              <h3 className="text-2xl font-bold text-foreground">{stats.pending}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-orange-500/10 flex items-center justify-center text-brand-orange-500">
              <Package size={20} />
            </div>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-brand-orange-500/10 text-brand-orange-500 text-sm font-semibold hover:bg-brand-orange-500/20 transition-colors mt-auto">
            View Map Route
          </button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active / Next Delivery Card */}
          {pendingDeliveriesList.length > 0 && (
            <motion.div variants={item} className="glass-card rounded-2xl p-6 border-brand-orange-500/20 shadow-lg shadow-brand-orange-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Navigation size={120} />
              </div>
              
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-orange-500"></span>
                </span>
                <span className="text-sm font-bold tracking-wide uppercase text-brand-orange-500">Next Stop</span>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">{pendingDeliveriesList[0].customer_name || 'Customer'}</h3>
                  <div className="flex items-start gap-2 text-muted-foreground mb-4">
                    <MapPin size={16} className="shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">{pendingDeliveriesList[0].address || '123 Main St, Anytown'}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-sm font-medium">
                      <PhoneCall size={16} /> Call
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors text-sm font-medium">
                      <Navigation size={16} /> Navigate
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-between border-l border-border/50 pl-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Order ID</span>
                      <span className="font-mono text-sm">#{pendingDeliveriesList[0].id}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <span className="text-sm font-medium">Standard Refill</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-muted-foreground">Collect</span>
                      <span className="text-sm font-bold text-emerald-500">₹{pendingDeliveriesList[0].amount || 0}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setActiveDelivery(pendingDeliveriesList[0]);
                      setIsPhotoModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 text-white font-bold hover:shadow-lg hover:shadow-brand-orange-500/20 transition-all hover:-translate-y-0.5"
                  >
                    <CheckCircle2 size={18} /> Mark Delivered
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Today's Route / Queue */}
          <motion.div variants={item} className="glass-card rounded-2xl p-5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Map size={18} className="text-muted-foreground" /> Route Queue
              </h3>
              <span className="badge-info">{pendingDeliveriesList.length} Stops</span>
            </div>

            {pendingDeliveriesList.length > 0 ? (
              <div className="space-y-4">
                {pendingDeliveriesList.slice(1).map((delivery, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors group">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-brand-orange-500/10 group-hover:text-brand-orange-500 transition-colors">
                        {i + 2}
                      </div>
                      {i !== pendingDeliveriesList.slice(1).length - 1 && (
                        <div className="w-px h-full bg-border mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold">{delivery.customer_name || 'Customer'}</h4>
                        <span className="text-xs font-mono text-muted-foreground">#{delivery.id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 flex items-start gap-1">
                        <MapPin size={14} className="shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{delivery.address || 'Delivery Address'}</span>
                      </p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-muted/80 transition-colors">Contact</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="font-bold mb-1">All Caught Up!</h4>
                <p className="text-sm text-muted-foreground">You have completed all deliveries for today.</p>
              </div>
            )}
          </motion.div>

        </div>

        {/* Right Sidebar Area */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <motion.div variants={item} className="glass-card rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-4">Driver Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-muted/30 hover:bg-muted border border-transparent hover:border-border/50 transition-all text-sm font-medium">
                <Shield size={20} className="text-blue-400" /> SOS Alert
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-muted/30 hover:bg-muted border border-transparent hover:border-border/50 transition-all text-sm font-medium">
                <AlertCircle size={20} className="text-amber-400" /> Support
              </button>
            </div>
          </motion.div>

          {/* Completed Today */}
          <motion.div variants={item} className="glass-card rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-4">Completed Today</h3>
            <div className="space-y-3">
              {deliveries.filter(d => d.status === 'delivered').length > 0 ? (
                deliveries.filter(d => d.status === 'delivered').slice(0, 5).map((delivery, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{delivery.customer_name || 'Customer'}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(delivery.updated_at).toLocaleTimeString()}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-500">+₹45</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No completed deliveries yet.</p>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Proof of Delivery Modal */}
      <AnimatePresence>
        {isPhotoModalOpen && activeDelivery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 backdrop-blur-md" style={{ background: 'var(--overlay-bg)' }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-5 border-b border-border/50 bg-muted/30">
                <h2 className="font-bold">Proof of Delivery</h2>
                <button onClick={() => setIsPhotoModalOpen(false)} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border/50 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Delivering to</p>
                  <p className="font-bold text-lg">{activeDelivery.customer_name || 'Customer'}</p>
                  <p className="text-xs text-brand-orange-500 mt-1">#{activeDelivery.id}</p>
                </div>

                <div className="w-full aspect-video rounded-xl bg-black border border-border/50 flex flex-col items-center justify-center mb-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Click to take photo</span>
                  </div>
                  <Camera size={32} className="text-white/50 mb-2" />
                  <p className="text-white/50 text-sm font-medium">Capture cylinder delivery</p>
                </div>

                <p className="text-xs text-muted-foreground text-center mb-6">
                  Taking a photo of the delivered cylinder is mandatory for the OTP-less workflow.
                </p>

                <button 
                  onClick={() => handleMarkDelivered(activeDelivery.id)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Confirm Delivery
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
