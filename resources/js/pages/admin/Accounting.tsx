import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee, TrendingUp, TrendingDown, ArrowUpRight,
  Wallet, Receipt, CreditCard, BarChart3, Inbox
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from "axios";

export default function Accounting() {
  const [stats, setStats] = useState({ total_revenue: 0, monthly_revenue: 0, outstanding_dues: 0, total_payments: 0 });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const revRes = await axios.get('/api/admin/stats/revenue', config).catch(() => ({ data: [] }));
        setRevenueData(Array.isArray(revRes.data) ? revRes.data : []);
      } catch { } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const kpis = [
    { label: "Total Revenue", value: `₹${stats.total_revenue.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-500/5" },
    { label: "This Month", value: `₹${stats.monthly_revenue.toLocaleString()}`, icon: TrendingUp, color: "text-blue-400", bg: "from-blue-500/10 to-blue-500/5" },
    { label: "Outstanding Dues", value: `₹${stats.outstanding_dues.toLocaleString()}`, icon: TrendingDown, color: "text-amber-400", bg: "from-amber-500/10 to-amber-500/5" },
    { label: "Payments Received", value: stats.total_payments, icon: CreditCard, color: "text-purple-400", bg: "from-purple-500/10 to-purple-500/5" },
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Accounting</h1>
        <p className="text-muted-foreground text-sm mt-1">Revenue tracking, payments, and financial analytics.</p>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-2xl skeleton" />)}
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <motion.div variants={item} key={i} className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bg} opacity-50`} />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.bg} flex items-center justify-center ${kpi.color} group-hover:scale-105 transition-transform`}>
                    <kpi.icon size={20} />
                  </div>
                  <ArrowUpRight size={14} className="text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold mb-0.5">{kpi.value}</h3>
                <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="xl:col-span-2 glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <BarChart3 size={16} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground">Financial performance over time</p>
            </div>
          </div>

          {revenueData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevAcct" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '13px' }} itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevAcct)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState icon={BarChart3} title="No revenue data yet" desc="Revenue trends will appear here once payments are processed." />
          )}
        </motion.div>

        {/* Quick Summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Wallet size={16} className="text-purple-400" />
            </div>
            <h3 className="font-bold text-base">Financial Summary</h3>
          </div>

          <div className="space-y-3 flex-1">
            {[
              { label: "Total Collections", value: "₹0", icon: Receipt, color: "text-emerald-400 bg-emerald-500/10" },
              { label: "Pending Payments", value: "₹0", icon: CreditCard, color: "text-amber-400 bg-amber-500/10" },
              { label: "GST Payable", value: "₹0", icon: IndianRupee, color: "text-blue-400 bg-blue-500/10" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                    <item.icon size={14} />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="font-bold text-sm">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border/30">
            <p className="text-[11px] text-muted-foreground/50 text-center">Financial data populated from booking and payment records</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
