import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Shield, Bell, Phone, Mail, Key, LogOut, 
  CheckCircle2, AlertCircle, Loader2, X, Smartphone, ArrowRight
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneStep, setPhoneStep] = useState<"request" | "verify">("request");
  const [newPhone, setNewPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  const handleRequestPhoneChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPhone.length !== 10) return;
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("auth_token");
      await axios.post('/api/admin/staff/change-number/request', { staff_id: user?.id, new_phone: newPhone }, { headers: { Authorization: `Bearer ${token}` } });
      setPhoneStep("verify");
      setSuccessMsg("OTP sent to your current number for verification.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) { setError(err.response?.data?.message || "Failed to request phone change."); }
    finally { setLoading(false); }
  };

  const handleVerifyPhoneChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const unifiedOtp = otp.join("");
    if (unifiedOtp.length !== 6) return;
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.post('/api/admin/staff/change-number/verify', { staff_id: user?.id, otp: unifiedOtp }, { headers: { Authorization: `Bearer ${token}` } });
      const updatedUser = { ...user, phone: res.data.new_phone };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccessMsg("Phone number updated!");
      setTimeout(() => { setIsPhoneModalOpen(false); setPhoneStep("request"); setNewPhone(""); setOtp(["","","","","",""]); setSuccessMsg(""); }, 2000);
    } catch (err: any) { setError(err.response?.data?.message || "Invalid OTP."); }
    finally { setLoading(false); }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) document.getElementById(`settings-otp-${index + 1}`)?.focus();
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      await axios.post('/api/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch {} finally { localStorage.clear(); navigate("/"); }
  };

  if (!user) return null;

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1200px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your profile, security, and notifications.</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile */}
        <motion.div variants={item} className="md:col-span-8 glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border/30">
            <div className="w-8 h-8 rounded-lg bg-brand-orange-500/10 flex items-center justify-center">
              <User size={16} className="text-brand-orange-400" />
            </div>
            <h2 className="font-bold">Personal Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "Full Name", value: user.name, icon: User },
              { label: "Email", value: user.email, icon: Mail },
              { label: "Role", value: user.role, icon: Shield, capitalize: true },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-1.5">{field.label}</label>
                <div className="px-3.5 py-2.5 bg-muted/30 rounded-xl border border-border/30 text-sm font-medium flex items-center gap-2.5">
                  <field.icon size={14} className="text-muted-foreground/40" />
                  <span className={field.capitalize ? "capitalize" : ""}>{field.value}</span>
                </div>
              </div>
            ))}
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-1.5">Phone</label>
              <div className="px-3.5 py-2.5 bg-muted/30 rounded-xl border border-border/30 text-sm font-medium flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-muted-foreground/40" />
                  +91 {user.phone}
                </div>
                <button onClick={() => setIsPhoneModalOpen(true)} className="text-[10px] font-bold text-brand-orange-500 hover:text-brand-orange-400 uppercase tracking-wider">Change</button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div variants={item} className="md:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <Key size={16} className="text-blue-400" />
              <h3 className="font-bold text-sm">Security</h3>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-xl border border-border/30 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all">
                <p className="font-semibold text-sm">Change Password</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Update credentials</p>
              </button>
              <button className="w-full text-left p-3 rounded-xl border border-border/30 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all">
                <p className="font-semibold text-sm flex justify-between">Two-Factor Auth <span className="badge-success text-[9px]">Active</span></p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Mandatory for admins</p>
              </button>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <button onClick={handleLogout} className="w-full py-2.5 rounded-xl bg-destructive/10 text-destructive font-bold text-sm hover:bg-destructive hover:text-white transition-all flex items-center justify-center gap-2">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={item} className="md:col-span-12 glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border/30">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Bell size={16} className="text-blue-400" />
            </div>
            <h2 className="font-bold">Notifications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: "New Booking Alerts", desc: "Get notified for new cylinder orders.", checked: true },
              { title: "Low Inventory Warnings", desc: "Alert when stock drops below threshold.", checked: true },
              { title: "Daily Revenue Summary", desc: "Consolidated email report at 8 PM.", checked: false },
              { title: "Fleet Logistics Updates", desc: "Delivery truck dispatch and arrivals.", checked: true },
            ].map((pref, i) => (
              <label key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border/30 cursor-pointer hover:bg-muted/20 transition-colors">
                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-border accent-brand-orange-500" defaultChecked={pref.checked} />
                <div>
                  <p className="font-semibold text-sm">{pref.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{pref.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Phone Change Modal */}
      <AnimatePresence>
        {isPhoneModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !loading && setIsPhoneModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md glass-panel p-6 z-10 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><Smartphone size={20} className="text-brand-orange-500" /> Update Phone</h3>
                <button onClick={() => !loading && setIsPhoneModalOpen(false)} className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground"><X size={16} /></button>
              </div>
              {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm flex items-start gap-2 border border-destructive/15"><AlertCircle size={14} className="shrink-0 mt-0.5" />{error}</div>}
              {successMsg && <div className="mb-4 p-3 rounded-xl badge-success text-sm"><CheckCircle2 size={14} /> {successMsg}</div>}
              {phoneStep === "request" ? (
                <form onSubmit={handleRequestPhoneChange} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">New Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-sm font-medium">+91</span>
                      <input type="text" className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-border/50 bg-muted/30 outline-none focus:ring-1 focus:ring-brand-orange-500/30 text-sm font-medium" placeholder="Enter 10 digits" value={newPhone} onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} autoFocus />
                    </div>
                  </div>
                  <button type="submit" disabled={loading || newPhone.length !== 10} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Authorize Change <ArrowRight size={16} /></>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneChange} className="space-y-5">
                  <div>
                    <p className="text-sm text-center text-muted-foreground mb-4">Enter 6-digit code sent to your <strong>current</strong> number</p>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, i) => (
                        <input key={i} id={`settings-otp-${i}`} type="text" maxLength={1} className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-border/50 bg-muted/30 outline-none focus:ring-1 focus:ring-brand-orange-500/30" value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} autoFocus={i === 0} />
                      ))}
                    </div>
                  </div>
                  <button type="submit" disabled={loading || otp.join("").length !== 6} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Verify & Save <CheckCircle2 size={16} /></>}
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