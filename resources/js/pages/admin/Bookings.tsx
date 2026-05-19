import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertCircle, Eye, Inbox, RefreshCw, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import axios from "axios";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setBookings(data);
      setError(null);
    } catch (err: any) {
      setError("Failed to load bookings. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const filteredBookings = safeBookings.filter((b: any) => 
    (statusFilter === "All" || b.status === statusFilter) &&
    (b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || b.id?.toString().includes(searchTerm) || b.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "delivered": case "Delivered": return "badge-success";
      case "en_route": case "En Route": return "badge-info";
      case "pending": case "Pending": return "badge-pending";
      case "cancelled": case "Cancelled": return "badge-danger";
      default: return "badge-info";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "delivered": case "Delivered": return <CheckCircle2 size={10} />;
      case "en_route": case "En Route": return <Truck size={10} />;
      case "cancelled": case "Cancelled": return <XCircle size={10} />;
      default: return <Clock size={10} />;
    }
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Booking Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage, track, and process customer orders.</p>
        </div>
        <button 
          onClick={fetchBookings}
          className="btn-glass flex items-center gap-2 text-sm"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-1.5 mb-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {["All", "Pending", "En Route", "Delivered", "Cancelled"].map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                statusFilter === status 
                  ? 'bg-brand-orange-500/10 text-brand-orange-500' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={14} />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="pl-9 pr-4 py-2 bg-muted/40 border border-border/50 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-orange-500/30 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 w-full rounded-xl skeleton" />
            ))}
          </div>
        ) : error ? (
          <div className="p-16 flex flex-col items-center justify-center text-destructive">
            <AlertCircle size={28} className="mb-3" />
            <p className="text-sm">{error}</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Inbox size={28} className="text-muted-foreground/30" />
            </div>
            <p className="font-semibold text-foreground/60 mb-1">No bookings found</p>
            <p className="text-sm text-muted-foreground/50 max-w-xs">Bookings will appear here once customers start placing orders.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Order ID</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredBookings.map((order: any) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-semibold text-sm">{order.booking_reference || order.id}</td>
                    <td className="px-5 py-3.5 font-medium">{order.user?.name || 'Unknown'}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{order.cylinder_type?.replace('_', ' ') || order.type}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{new Date(order.booking_date || order.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={getStatusBadge(order.status)}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-right">₹{order.total_amount || order.amount}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}