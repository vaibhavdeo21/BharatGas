import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MoreVertical, 
  Download,
  Loader2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Inbox
} from "lucide-react";
import axios from "axios";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Fetch data from Laravel API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // If the API returns an object with a 'data' property, extract it
      // Otherwise, assume the response is the array itself
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setBookings(data);
      setError(null);
    } catch (err: any) {
      setError("Failed to load bookings. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Safe filtering: ensure bookings is an array before calling filter
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  
  const filteredBookings = safeBookings.filter((b: any) => 
    (statusFilter === "All" || b.status === statusFilter) &&
    (b.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || b.id?.toString().includes(searchTerm))
  );

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "Delivered": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "En Route": return "bg-brand-orange-500/10 text-brand-orange-600 border-brand-orange-500/20";
      case "Pending": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted text-foreground";
    }
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
          <p className="text-muted-foreground">Manage, track, and process customer orders.</p>
        </div>
        <button 
          onClick={fetchBookings}
          className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-foreground/90 transition-colors"
        >
          <Download size={16} /> Refresh Data
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search orders, customers..." 
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border rounded-lg focus:ring-2 focus:ring-brand-orange-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          {["All", "Pending", "En Route", "Delivered"].map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status ? 'bg-brand-orange-500 text-white' : 'bg-muted hover:bg-muted/80'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Loader2 size={48} className="animate-spin mb-4" />
          <p>Loading bookings...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 text-destructive">
          <AlertCircle size={48} className="mb-4" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="p-4 font-bold text-sm text-muted-foreground">Order ID</th>
                  <th className="p-4 font-bold text-sm text-muted-foreground">Customer</th>
                  <th className="p-4 font-bold text-sm text-muted-foreground">Type</th>
                  <th className="p-4 font-bold text-sm text-muted-foreground">Date</th>
                  <th className="p-4 font-bold text-sm text-muted-foreground">Status</th>
                  <th className="p-4 font-bold text-sm text-muted-foreground text-right">Amount</th>
                  <th className="p-4 font-bold text-sm text-muted-foreground text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((order: any) => (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 font-mono font-bold text-foreground">{order.id}</td>
                      <td className="p-4 font-medium text-foreground">{order.customer_name}</td>
                      <td className="p-4 text-muted-foreground">{order.type}</td>
                      <td className="p-4 text-muted-foreground">{order.date}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-right text-foreground">{order.amount}</td>
                      
                      <td className="p-4 text-center relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                          className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>

                        <AnimatePresence>
                          {openMenuId === order.id && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute right-12 top-2 z-50 w-40 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1"
                            >
                              <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2">
                                <Eye size={16} /> View Details
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2">
                                <Edit size={16} /> Edit Order
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2">
                                <Trash2 size={16} /> Cancel
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Inbox size={48} className="text-muted" />
                        <p>No bookings found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}