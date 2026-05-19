import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, TrendingUp, IndianRupee, Package, Truck, ArrowUpRight,
  Flame, CheckCircle2, Clock, Inbox, BarChart3, Activity
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from "axios";

export default function AdminDashboard() {
  const [kpis, setKpis] = useState({ total_customers: 0, todays_bookings: 0, pending_deliveries: 0, todays_revenue: 0 });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [kpiRes, revRes, bookRes] = await Promise.all([
          axios.get('/api/admin/stats/overview', config).catch(() => ({ data: { kpis: {} } })),
          axios.get('/api/admin/stats/revenue', config).catch(() => ({ data: [] })),
          axios.get('/api/bookings', config).catch(() => ({ data: { data: [] } })),
        ]);

        setKpis(kpiRes.data.kpis || {});
        setRevenueData(Array.isArray(revRes.data) ? revRes.data : []);
        const bData = Array.isArray(bookRes.data) ? bookRes.data : (bookRes.data?.data || []);
        setRecentBookings(bData.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const userName = (() => {
    try { return JSON.parse(localStorage.getItem('user_data') || '{}')?.name || 'Admin'; } catch { return 'Admin'; }
  })();

  const kpiCards = [
    { label: "Total Revenue", value: `₹${(kpis.todays_revenue || 0).toLocaleString()}`, icon: IndianRupee, color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-500/5", glow: "shadow-emerald-500/5" },
    { label: "Pending Deliveries", value: kpis.pending_deliveries || 0, icon: Truck, color: "text-brand-orange-400", bg: "from-brand-orange-500/10 to-brand-orange-500/5", glow: "shadow-brand-orange-500/5" },
    { label: "Total Customers", value: (kpis.total_customers || 0).toLocaleString(), icon: Users, color: "text-blue-400", bg: "from-blue-500/10 to-blue-500/5", glow: "shadow-blue-500/5" },
    { label: "Today's Bookings", value: kpis.todays_bookings || 0, icon: Flame, color: "text-amber-400", bg: "from-amber-500/10 to-amber-500/5", glow: "shadow-amber-500/5" },
  ];

  const EmptyState = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
        <Icon size={28} className="text-muted-foreground/40" />
      </div>
      <p className="font-semibold text-foreground/60 mb-1">{title}</p>
      <p className="text-sm text-muted-foreground/50 max-w-xs">{desc}</p>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1600px] mx-auto">
      {/* Welcome Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-sm font-medium text-muted-foreground mb-1">{greeting} 👋</p>
        <h1 className="text-3xl font-bold tracking-tight">{userName}</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening at Amrutha BharatGas today.</p>
      </motion.div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 rounded-2xl skeleton" />
          ))}
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpiCards.map((kpi, i) => (
            <motion.div 
              variants={item} 
              key={i} 
              className={`glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-all duration-300 cursor-default ${kpi.glow}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color}`} style={{ background: 'var(--muted)' }}>
                  <kpi.icon size={20} />
                </div>
                <ArrowUpRight size={14} className="text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-bold mb-0.5">{kpi.value}</h3>
              <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="xl:col-span-2 glass-card rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <BarChart3 size={16} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-base">Revenue Trends</h3>
                <p className="text-xs text-muted-foreground">Last 7 days performance</p>
              </div>
            </div>
          </div>
          
          {revenueData.length > 0 ? (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '13px' }}
                    itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState icon={BarChart3} title="No revenue data yet" desc="Revenue trends will appear here once bookings start flowing in." />
          )}
        </motion.div>

        {/* Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Activity size={16} className="text-blue-400" />
            </div>
            <h3 className="font-bold text-base">Live Activity</h3>
          </div>

          {recentBookings.length > 0 ? (
            <div className="flex-1 space-y-3 overflow-y-auto">
              {recentBookings.map((booking: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    booking.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' : 
                    booking.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {booking.status === 'delivered' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{booking.customer_name || `Booking #${booking.id}`}</p>
                    <p className="text-[11px] text-muted-foreground">{booking.status || 'processing'}</p>
                  </div>
                  <span className="text-xs text-muted-foreground/50 font-mono">#{booking.id}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Inbox} title="No recent activity" desc="Booking activity and notifications will show up here." />
          )}
        </motion.div>
      </div>
    </div>
  );
}