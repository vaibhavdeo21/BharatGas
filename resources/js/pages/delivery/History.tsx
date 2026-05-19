import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, Clock, Inbox, MapPin } from "lucide-react";
import axios from "axios";

export default function History() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch - delivery history endpoint might not be fully fleshed out yet
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get('/api/deliveries', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }));
        
        // Filter out completed ones, or just use standard data
        setDeliveries(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Delivery History</h1>
        <p className="text-muted-foreground text-sm mt-1">Review your past completed deliveries.</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 w-full rounded-xl skeleton" />
            ))}
          </div>
        ) : deliveries.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <ClipboardList size={28} className="text-muted-foreground/30" />
            </div>
            <p className="font-semibold text-foreground/60 mb-1">No past deliveries</p>
            <p className="text-sm text-muted-foreground/50 max-w-xs">Your completed assignments will appear here once you finish your routes.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Order ID</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Location</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {deliveries.map((delivery, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={delivery.id} 
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono font-medium text-brand-orange-500">#{delivery.id}</td>
                    <td className="px-5 py-4 text-muted-foreground">{new Date(delivery.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{delivery.customer_name || 'N/A'}</p>
                    </td>
                    <td className="px-5 py-4 flex items-center gap-2">
                      <MapPin size={14} className="text-muted-foreground/60" />
                      <span className="truncate max-w-[200px] block">{delivery.delivery_address || 'Address hidden'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="badge-success"><CheckCircle2 size={12} /> Delivered</span>
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
