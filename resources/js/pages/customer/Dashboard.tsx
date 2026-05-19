import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Flame, TrendingUp, CreditCard, MapPin, ChevronRight, Download,
  IndianRupee, CheckCircle2, Package, Clock, Inbox, AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CustomerDashboard() {
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  const userData = (() => {
    try { return JSON.parse(localStorage.getItem('user_data') || '{}'); } catch { return {}; }
  })();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('/api/customer/bookings/history', config).catch(() => ({ data: [] }));
        const bookings = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        
        // Find active booking (not delivered)
        const active = bookings.find((b: any) => b.status !== 'delivered' && b.status !== 'cancelled');
        setActiveBooking(active || null);
        setRecentOrders(bookings.slice(0, 5));
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{greeting} 👋</p>
          <h1 className="text-3xl font-bold tracking-tight">{userData.name || "Customer"}</h1>
        </div>
        <Link 
          to="/dashboard/customer/book"
          className="btn-primary inline-flex items-center justify-center gap-2 !rounded-full !px-6 hover:scale-105 active:scale-95 transition-transform"
        >
          <Flame size={16} className="fill-current" /> Book Refill
        </Link>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Connection Status */}
        <motion.div variants={item} className="relative overflow-hidden rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #f75b11, #e9430c)" }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-white/70 text-sm font-medium mb-0.5">Connection Status</p>
                <h3 className="text-xl font-bold">Active Line</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div><p className="text-white/60 text-[11px]">Consumer ID</p><p className="font-bold text-sm">#{userData.id || "—"}</p></div>
              <div className="text-right"><p className="text-white/60 text-[11px]">Type</p><p className="font-bold text-sm">Domestic</p></div>
            </div>
          </div>
        </motion.div>

        {/* Quick Booking */}
        <motion.div variants={item} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
          {activeBooking ? (
            <>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-0.5">Active Order</p>
                  <h3 className="text-lg font-bold">#{activeBooking.id}</h3>
                </div>
                <span className="badge-info"><Clock size={10} /> {activeBooking.status}</span>
              </div>
              <Link to="/dashboard/customer/track" className="mt-auto text-sm font-bold text-brand-orange-500 flex items-center gap-1 hover:underline">
                Track Delivery <ChevronRight size={14} />
              </Link>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-0.5">No Active Orders</p>
                  <h3 className="text-lg font-bold">Ready to Order?</h3>
                </div>
                <Package size={20} className="text-muted-foreground/30" />
              </div>
              <Link to="/dashboard/customer/book" className="mt-auto text-sm font-bold text-brand-orange-500 flex items-center gap-1 hover:underline">
                Book Cylinder <ChevronRight size={14} />
              </Link>
            </>
          )}
        </motion.div>

        {/* Safety */}
        <motion.div variants={item} className="glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-0.5">Safety Check</p>
                <h3 className="text-lg font-bold text-amber-400">Due Soon</h3>
              </div>
              <AlertCircle size={20} className="text-amber-400/50" />
            </div>
            <p className="text-[11px] text-muted-foreground mb-3">Mandatory 5-year hose & regulator inspection.</p>
            <button className="w-full py-2 rounded-xl bg-muted/50 border border-border/30 text-sm font-semibold hover:bg-muted/80 transition-colors">Schedule</button>
          </div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div variants={item} className="glass-card rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { icon: CreditCard, label: "Pay Bill", href: "#" },
                { icon: Download, label: "Invoices", href: "#" },
                { icon: MapPin, label: "Address", href: "#" },
                { icon: AlertCircle, label: "Support", href: "#" },
              ].map((action, i) => (
                <button key={i} className="flex flex-col items-center justify-center p-3 rounded-xl bg-muted/20 hover:bg-muted/40 border border-border/20 hover:border-border/40 transition-all gap-2 group">
                  <div className="w-9 h-9 rounded-lg bg-muted/50 border border-border/30 flex items-center justify-center text-muted-foreground group-hover:text-brand-orange-500 group-hover:scale-105 transition-all">
                    <action.icon size={16} />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <div>
          <motion.div variants={item} className="glass-card rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm">Recent Orders</h3>
            </div>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order: any, i: number) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        <CheckCircle2 size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-brand-orange-500 transition-colors">{order.type || `Order #${order.id}`}</p>
                        <p className="text-[11px] text-muted-foreground">{order.date || new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{order.amount || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center text-center">
                <Inbox size={24} className="text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground/50">No order history yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
