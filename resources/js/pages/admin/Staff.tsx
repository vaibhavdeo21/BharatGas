import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Trash2, Shield, Flame, X, Loader2, Search, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form States
  const [formData, setFormData] = useState({ name: "", phone: "", role: "delivery", password: "" });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.get('/api/admin/staff', { headers: { Authorization: `Bearer ${token}` } });
      setStaff(res.data.staff);
    } catch (err) {
      console.error("Failed to load staff", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.post('/api/admin/staff', formData, { headers: { Authorization: `Bearer ${token}` } });
      
      setStaff([...staff, res.data.user]);
      setSuccessMsg("Staff account activated!");
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg("");
        setFormData({ name: "", phone: "", role: "delivery", password: "" });
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to add staff.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this staff member? They will lose all access.")) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`/api/admin/staff/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setStaff(staff.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete staff.");
    }
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Add, update, and remove agency staff and delivery drivers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-orange-500 hover:bg-brand-orange-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-orange-500/20 flex items-center gap-2"
        >
          <UserPlus size={18} /> Add New Staff
        </button>
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-muted-foreground"><Loader2 className="animate-spin" size={32} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Staff Member</th>
                  <th className="px-6 py-4 font-semibold">Phone Number</th>
                  <th className="px-6 py-4 font-semibold">Role Access</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {staff.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                          <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
                        </div>
                        <p className="font-bold text-foreground">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">+91 {user.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase ${
                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {user.role === 'admin' ? <Shield size={12} /> : <Flame size={12} />}
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                        title="Revoke Access"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- ADD STAFF MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2"><UserPlus size={24} className="text-brand-orange-500" /> New Staff</h3>
                <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              {successMsg ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4"><CheckCircle2 size={32} /></div>
                  <h4 className="text-xl font-bold text-foreground mb-2">{successMsg}</h4>
                  <p className="text-sm text-muted-foreground">They can now log in using their phone number.</p>
                </div>
              ) : (
                <form onSubmit={handleAddStaff} className="space-y-4">
                  {errorMsg && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-xl">{errorMsg}</p>}
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input required type="text" className="w-full p-3 rounded-xl border border-input bg-background outline-none focus:border-brand-orange-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Ramesh Kumar" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number (Login ID)</label>
                    <input required type="text" maxLength={10} className="w-full p-3 rounded-xl border border-input bg-background outline-none focus:border-brand-orange-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} placeholder="10-digit mobile number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Role</label>
                    <select className="w-full p-3 rounded-xl border border-input bg-background outline-none focus:border-brand-orange-500" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                      <option value="delivery">Delivery Agent (Fleet App)</option>
                      <option value="admin">Agency Admin (Full Dashboard)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Temporary Password</label>
                    <input required type="text" className="w-full p-3 rounded-xl border border-input bg-background outline-none focus:border-brand-orange-500" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Minimum 6 characters" />
                    <p className="text-xs text-muted-foreground mt-1">Used as a fallback if OTP SMS fails.</p>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-3.5 mt-4 rounded-xl bg-foreground text-background font-bold hover:bg-foreground/90 disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
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