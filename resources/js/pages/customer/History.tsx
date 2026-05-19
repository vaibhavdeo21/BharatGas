import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, Clock, Truck, ShieldCheck, Download, Loader2, XCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get('/api/customer/bookings/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data.data || res.data || []);
      } catch (err) {
        toast.error("Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="badge-success"><CheckCircle2 size={12} /> Delivered</span>;
      case 'out_for_delivery':
      case 'dispatched':
        return <span className="badge-warning text-brand-orange-500 bg-brand-orange-500/10"><Truck size={12} /> Out for Delivery</span>;
      case 'cancelled':
        return <span className="badge-danger"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="badge-pending"><Clock size={12} /> Processing</span>;
    }
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground text-sm mt-1">View your past cylinder bookings and invoices.</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 w-full rounded-xl skeleton" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <ClipboardList size={28} className="text-muted-foreground/30" />
            </div>
            <p className="font-semibold text-foreground/60 mb-1">No orders found</p>
            <p className="text-sm text-muted-foreground/50 max-w-xs">Your completed and past orders will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Booking ID</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Item</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {history.map((order, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={order.id} 
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono font-medium text-brand-orange-500">#{order.id}</td>
                    <td className="px-5 py-4 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{order.cylinder_type?.replace('_', ' ')?.toUpperCase()}</p>
                      <p className="text-[10px] text-muted-foreground">Qty: {order.quantity}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold">₹{order.total_amount}</td>
                    <td className="px-5 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-5 py-4 text-right">
                      {order.status === 'delivered' ? (
                        <button className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors inline-flex items-center gap-1.5 text-xs font-semibold" title="Download Invoice">
                          <Download size={14} /> PDF
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">Pending</span>
                      )}
                    </td>
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
