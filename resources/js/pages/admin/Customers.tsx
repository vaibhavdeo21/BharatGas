import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle, XCircle, Search, Loader2 } from "lucide-react";
import axios from "axios";

export default function Customers() {
  const [pendingCustomers, setPendingCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchPendingCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/customers/pending');
      setPendingCustomers(response.data.customers);
      setError("");
    } catch (err) {
      setError("Failed to load pending customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCustomers();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await axios.post(`/api/admin/customers/${id}/approve`);
      setSuccessMsg("Customer approved successfully!");
      fetchPendingCustomers();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("Failed to approve customer");
    }
  };

  const handleReject = async (id: number) => {
    if (!window.confirm("Are you sure you want to reject and delete this registration?")) return;
    try {
      await axios.delete(`/api/admin/customers/${id}/reject`);
      setSuccessMsg("Customer registration rejected.");
      fetchPendingCustomers();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("Failed to reject customer");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-brand-orange-500" /> Customer Approvals
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Review and manage new customer registrations.</p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-xl flex items-center gap-2">
          <XCircle size={20} /> {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 p-4 rounded-xl flex items-center gap-2">
          <CheckCircle size={20} /> {successMsg}
        </div>
      )}

      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Pending Registrations</h2>
          <span className="bg-brand-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {pendingCustomers.length} Pending
          </span>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-brand-orange-500" size={32} />
          </div>
        ) : pendingCustomers.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <CheckCircle size={48} className="mb-4 text-green-500/50" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm">There are no pending customer registrations.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer Details</th>
                  <th className="px-6 py-4 font-medium">Contact Info</th>
                  <th className="px-6 py-4 font-medium">Address</th>
                  <th className="px-6 py-4 font-medium">Registration Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingCustomers.map((customer) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={customer.id} 
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{customer.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">ID: {customer.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{customer.phone}</div>
                      <div className="text-xs text-muted-foreground">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={customer.address}>
                      {customer.address}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(customer.id)}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-medium flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(customer.id)}
                          className="px-3 py-1.5 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors text-xs font-medium flex items-center gap-1"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
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
