import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Trash2, Shield, Flame, X, Loader2, CheckCircle2, Inbox } from "lucide-react";
import axios from "axios";

export default function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({ name: "", phone: "", role: "delivery", password: "" });

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.get('/api/admin/staff', { headers: { Authorization: `Bearer ${token}` } });
      setStaff(res.data.staff || []);
    } catch { } finally { setLoading(false); }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); setErrorMsg("");
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.post('/api/admin/staff', formData, { headers: { Authorization: `Bearer ${token}` } });
      setStaff([...staff, res.data.user]);
      setSuccessMsg("Staff account activated!");
      setTimeout(() => { setIsModalOpen(false); setSuccessMsg(""); setFormData({ name: "", phone: "", role: "delivery", password: "" }); }, 1500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to add staff.");
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this staff member? They will lose all access.")) return;
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`/api/admin/staff/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setStaff(staff.filter(s => s.id !== id));
    } catch (err: any) { alert(err.response?.data?.message || "Failed to delete staff."); }
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Add, update, and remove agency staff and delivery drivers.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 text-sm !py-2.5">
          <UserPlus size={14} /> Add Staff
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center"><Loader2 className="animate-spin text-brand-orange-500" size={28} /></div>
        ) : staff.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Users size={28} className="text-muted-foreground/30" />
            </div>
            <p className="font-semibold text-foreground/60 mb-1">No staff members</p>
            <p className="text-sm text-muted-foreground/50 max-w-xs">Add your first delivery agent or admin staff to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Staff Member</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Phone</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {staff.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange-400/20 to-brand-orange-500/10 flex items-center justify-center text-brand-orange-500 text-xs font-bold shrink-0">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <p className="font-semibold">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-sm text-muted-foreground">+91 {user.phone}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/15' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                      }`}>
                        {user.role === 'admin' ? <Shield size={10} /> : <Flame size={10} />}
                        {user.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => handleDelete(user.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Revoke Access"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md glass-panel p-6 z-10 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><UserPlus size={20} className="text-brand-orange-500" /> New Staff</h3>
                <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground"><X size={16} /></button>
              </div>
              {successMsg ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-4"><CheckCircle2 size={28} /></div>
                  <h4 className="text-lg font-bold mb-2">{successMsg}</h4>
                  <p className="text-sm text-muted-foreground">They can now log in using their phone number.</p>
                </div>
              ) : (
                <form onSubmit={handleAddStaff} className="space-y-4">
                  {errorMsg && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-xl border border-destructive/15">{errorMsg}</p>}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name</label>
                    <input required type="text" className="w-full p-2.5 rounded-xl border border-border/50 bg-muted/30 outline-none focus:ring-1 focus:ring-brand-orange-500/30 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Ramesh Kumar" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                    <input required type="text" maxLength={10} className="w-full p-2.5 rounded-xl border border-border/50 bg-muted/30 outline-none focus:ring-1 focus:ring-brand-orange-500/30 text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} placeholder="10-digit mobile" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Role</label>
                    <select className="w-full p-2.5 rounded-xl border border-border/50 bg-muted/30 outline-none focus:ring-1 focus:ring-brand-orange-500/30 text-sm" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                      <option value="delivery">Delivery Agent</option>
                      <option value="admin">Agency Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Temporary Password</label>
                    <input required type="text" className="w-full p-2.5 rounded-xl border border-border/50 bg-muted/30 outline-none focus:ring-1 focus:ring-brand-orange-500/30 text-sm" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Min. 6 characters" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Create Account"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}