import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Clock, UserCheck, Users, Search, Loader2, Inbox, AlertTriangle, Shield, AlertCircle, CheckCircle, Eye, Edit, UserX, CheckCircle2, XCircle, Trash2, X } from "lucide-react";

type Tab = "pending" | "approved" | "all";

export default function Customers() {
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [pendingCustomers, setPendingCustomers] = useState<any[]>([]);
  const [approvedCustomers, setApprovedCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [pendRes, appRes] = await Promise.all([
        axios.get('/api/admin/customers/pending', config),
        axios.get('/api/admin/customers/approved', config).catch(() => ({ data: { customers: [] } })),
      ]);
      
      setPendingCustomers(pendRes.data.customers || []);
      setApprovedCustomers(appRes.data.customers || []);
    } catch (err) {
      toast.error("Failed to load customer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`/api/admin/customers/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Customer approved successfully!");
      fetchData();
    } catch { toast.error("Failed to approve customer"); }
  };

  const handleReject = async (id: number) => {
    if (!window.confirm("Reject and permanently delete this registration?")) return;
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`/api/admin/customers/${id}/reject`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Registration rejected.");
      fetchData();
    } catch { toast.error("Failed to reject customer"); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this customer account? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`/api/admin/customers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Customer deleted successfully.");
      setSelectedCustomer(null);
      fetchData();
    } catch { toast.error("Failed to delete customer"); }
  };

  const handleSuspend = async (customer: any) => {
    const newStatus = customer.account_status === 'suspended' ? 'active' : 'suspended';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'reactivate'} this account?`)) return;
    try {
      const token = localStorage.getItem('auth_token');
      await axios.put(`/api/admin/customers/${customer.id}`, { account_status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Customer account ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}.`);
      setSelectedCustomer(null);
      fetchData();
    } catch { toast.error("Failed to update account status"); }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      await axios.put(`/api/admin/customers/${editingCustomer.id}`, editingCustomer, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Customer updated successfully.");
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
      fetchData();
    } catch {
      toast.error("Failed to update customer.");
    }
  };

  const openEditModal = (customer: any) => {
    setEditingCustomer({ ...customer });
    setIsEditModalOpen(true);
  };

  const getDisplayList = () => {
    let list = activeTab === "pending" ? pendingCustomers : activeTab === "approved" ? approvedCustomers : [...pendingCustomers, ...approvedCustomers];
    if (searchTerm) {
      list = list.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id?.toString().includes(searchTerm)
      );
    }
    return list;
  };

  const displayList = getDisplayList();

  const tabs: { key: Tab; label: string; count: number; icon: any }[] = [
    { key: "pending", label: "Pending", count: pendingCustomers.length, icon: Clock },
    { key: "approved", label: "Approved", count: approvedCustomers.length, icon: UserCheck },
    { key: "all", label: "All", count: pendingCustomers.length + approvedCustomers.length, icon: Users },
  ];

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Approve, manage, and monitor customer accounts.</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="glass-card rounded-2xl p-1.5 mb-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-brand-orange-500/10 text-brand-orange-500"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeTab === tab.key ? "bg-brand-orange-500/20" : "bg-muted"
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={14} />
          <input
            type="text"
            placeholder="Search customers..."
            className="pl-9 pr-4 py-2 bg-muted/40 border border-border/50 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-orange-500/30 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-brand-orange-500 mb-3" size={28} />
            <p className="text-sm text-muted-foreground">Loading customers...</p>
          </div>
        ) : displayList.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Inbox size={28} className="text-muted-foreground/30" />
            </div>
            <p className="font-semibold text-foreground/60 mb-1">
              {activeTab === "pending" ? "No pending approvals" : "No customers found"}
            </p>
            <p className="text-sm text-muted-foreground/50 max-w-xs">
              {activeTab === "pending" 
                ? "All registrations have been processed. New requests will appear here." 
                : "Customer accounts will be listed here once registered and approved."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Contact</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">KYC Status</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Account Status</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Registered</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {displayList.map((customer) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={customer.id} 
                    className={`hover:bg-muted/20 transition-colors group ${customer.account_status === 'suspended' ? 'opacity-50' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange-400/20 to-brand-orange-500/10 flex items-center justify-center text-brand-orange-500 text-xs font-bold shrink-0">
                          {customer.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm flex items-center gap-1">
                            {customer.name}
                            {customer.account_status === 'suspended' && <AlertTriangle size={12} className="text-amber-500" />}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono">ID: {customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-sm">{customer.phone}</p>
                      <p className="text-[11px] text-muted-foreground">{customer.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      {customer.aadhaar_number ? (
                        <span className="badge-success"><Shield size={10} /> Verified</span>
                      ) : (
                        <span className="badge-pending"><Clock size={10} /> Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {customer.is_approved ? (
                        customer.account_status === 'suspended' ? (
                          <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase rounded-md flex items-center gap-1 w-max">
                            <AlertCircle size={10} /> Suspended
                          </span>
                        ) : (
                          <span className="badge-success"><CheckCircle size={10} /> Approved</span>
                        )
                      ) : (
                        <span className="badge-pending"><Clock size={10} /> Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        {customer.is_approved && (
                          <button
                            onClick={() => openEditModal(customer)}
                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        {!customer.is_approved && (
                          <>
                            <button
                              onClick={() => handleApprove(customer.id)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                              title="Approve"
                            >
                              <UserCheck size={14} />
                            </button>
                            <button
                              onClick={() => handleReject(customer.id)}
                              className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                              title="Reject"
                            >
                              <UserX size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setSelectedCustomer(null)} className="absolute inset-0 backdrop-blur-sm" style={{ background: 'var(--overlay-bg)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-panel p-6 z-10 rounded-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange-400 to-brand-orange-600 flex items-center justify-center text-white text-lg font-bold">
                    {selectedCustomer.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      {selectedCustomer.name}
                      {selectedCustomer.account_status === 'suspended' && <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase rounded-md">Suspended</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">ID: {selectedCustomer.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Phone", value: `+91 ${selectedCustomer.phone}` },
                  { label: "Email", value: selectedCustomer.email },
                  { label: "Address", value: selectedCustomer.address || "Not provided" },
                  { label: "Aadhaar", value: selectedCustomer.aadhaar_number ? `XXXX-XXXX-${selectedCustomer.aadhaar_number.slice(-4)}` : "Pending" },
                  { label: "PAN", value: selectedCustomer.pan_number || "Pending" },
                  { label: "KYC Status", value: selectedCustomer.aadhaar_number ? "Verified" : "Pending" },
                  { label: "Status", value: selectedCustomer.is_approved ? "Approved" : "Pending Approval" },
                  { label: "Registered", value: new Date(selectedCustomer.created_at).toLocaleString() },
                ].map((field, i) => (
                  <div key={i} className="flex justify-between items-start py-2 border-b border-border/30 last:border-0">
                    <span className="text-sm text-muted-foreground">{field.label}</span>
                    <span className="text-sm font-medium text-right max-w-[200px]">{field.value}</span>
                  </div>
                ))}
              </div>

              {!selectedCustomer.is_approved ? (
                <div className="flex gap-2 mt-6">
                  <button onClick={() => { handleApprove(selectedCustomer.id); setSelectedCustomer(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-sm hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button onClick={() => { handleReject(selectedCustomer.id); setSelectedCustomer(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-destructive/10 text-destructive font-bold text-sm hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2">
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mt-6 pt-6 border-t border-border/50">
                   <button onClick={() => { handleSuspend(selectedCustomer); }}
                    className="flex-1 py-2 rounded-xl bg-amber-500/10 text-amber-500 text-sm hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2">
                    <AlertTriangle size={14} /> {selectedCustomer.account_status === 'suspended' ? 'Reactivate' : 'Suspend'}
                  </button>
                  <button onClick={() => { handleDelete(selectedCustomer.id); }}
                    className="flex-1 py-2 rounded-xl bg-destructive/10 text-destructive text-sm hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Customer Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 backdrop-blur-sm" style={{ background: 'var(--overlay-bg)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-panel p-6 z-10 rounded-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Edit Customer</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Name</label>
                    <input type="text" required value={editingCustomer.name || ''} onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})} className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-orange-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Phone</label>
                    <input type="text" required value={editingCustomer.phone || ''} onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})} className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-orange-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" required value={editingCustomer.email || ''} onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})} className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-orange-500" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Address</label>
                  <textarea rows={2} required value={editingCustomer.address || ''} onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})} className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-orange-500"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Aadhaar Number</label>
                    <input type="text" value={editingCustomer.aadhaar_number || ''} onChange={(e) => setEditingCustomer({...editingCustomer, aadhaar_number: e.target.value})} placeholder="12-digit number" className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-orange-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">PAN Number</label>
                    <input type="text" value={editingCustomer.pan_number || ''} onChange={(e) => setEditingCustomer({...editingCustomer, pan_number: e.target.value})} placeholder="Alphanumeric" className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-orange-500 uppercase" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-brand-orange-500 text-white text-sm font-bold hover:bg-brand-orange-600 transition-colors">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
