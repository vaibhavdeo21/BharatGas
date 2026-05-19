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
  
  // Parse active user from local storage
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // --- Phone Change State ---
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneStep, setPhoneStep] = useState<"request" | "verify">("request");
  const [newPhone, setNewPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  // --- API: Request OTP for Phone Change ---
  const handleRequestPhoneChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPhone.length !== 10) return;
    
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token");
      await axios.post('/api/admin/staff/change-number/request', {
        staff_id: user?.id,
        new_phone: newPhone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPhoneStep("verify");
      setSuccessMsg("OTP sent to your CURRENT number for security authorization.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to request phone change.");
    } finally {
      setLoading(false);
    }
  };

  // --- API: Verify OTP and Save New Phone ---
  const handleVerifyPhoneChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const unifiedOtp = otp.join("");
    if (unifiedOtp.length !== 6) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.post('/api/admin/staff/change-number/verify', {
        staff_id: user?.id,
        otp: unifiedOtp
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update LocalStorage to reflect new phone immediately without logout
      const updatedUser = { ...user, phone: res.data.new_phone };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccessMsg("Phone number successfully updated!");
      setTimeout(() => {
        setIsPhoneModalOpen(false);
        setPhoneStep("request");
        setNewPhone("");
        setOtp(["", "", "", "", "", ""]);
        setSuccessMsg("");
      }, 2000);

    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`settings-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      await axios.post('/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1200px] mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground">Manage your personal profile, security, and notifications.</p>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Profile Card */}
        <motion.div variants={item} className="md:col-span-8 bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
             <div className="w-10 h-10 rounded-full bg-brand-orange-500/10 text-brand-orange-500 flex items-center justify-center">
                <User size={20} />
             </div>
             <h2 className="text-xl font-bold text-foreground">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
              <div className="px-4 py-3 bg-muted/50 rounded-xl border border-border text-foreground font-medium flex items-center gap-3">
                <User size={16} className="text-muted-foreground" />
                {user.name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
              <div className="px-4 py-3 bg-muted/50 rounded-xl border border-border text-foreground font-medium flex items-center gap-3">
                <Mail size={16} className="text-muted-foreground" />
                {user.email}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Registered Phone</label>
              <div className="px-4 py-3 bg-muted/50 rounded-xl border border-border text-foreground font-medium flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <Phone size={16} className="text-muted-foreground" />
                   +91 {user.phone}
                </div>
                <button 
                  onClick={() => setIsPhoneModalOpen(true)}
                  className="text-xs font-bold text-brand-orange-500 hover:text-brand-orange-600 uppercase tracking-wider"
                >
                  Change
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Account Role</label>
              <div className="px-4 py-3 bg-muted/50 rounded-xl border border-border text-foreground font-medium flex items-center gap-3 capitalize">
                <Shield size={16} className="text-muted-foreground" />
                {user.role}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security & Danger Zone */}
        <motion.div variants={item} className="md:col-span-4 space-y-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
              <Key size={18} className="text-brand-blue-500" /> Security
            </h3>
            <button className="w-full text-left p-4 rounded-xl border border-border hover:border-brand-blue-500 hover:bg-brand-blue-500/5 transition-all mb-3 group">
              <p className="font-bold text-sm text-foreground">Change Password</p>
              <p className="text-xs text-muted-foreground mt-0.5">Update your account credentials.</p>
            </button>
            <button className="w-full text-left p-4 rounded-xl border border-border hover:border-brand-blue-500 hover:bg-brand-blue-500/5 transition-all group">
              <p className="font-bold text-sm text-foreground flex justify-between">
                Two-Factor Auth <span className="text-green-500 bg-green-500/10 px-2 rounded text-[10px] uppercase">Active</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Mandatory for all admin profiles.</p>
            </button>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <button 
              onClick={handleLogout}
              className="w-full py-3.5 rounded-xl bg-destructive/10 text-destructive font-bold text-sm hover:bg-destructive hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Sign Out of Agency Console
            </button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={item} className="md:col-span-12 bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
             <div className="w-10 h-10 rounded-full bg-brand-blue-500/10 text-brand-blue-500 flex items-center justify-center">
                <Bell size={20} />
             </div>
             <h2 className="text-xl font-bold text-foreground">Notification Preferences</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <label className="flex items-start gap-4 p-4 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors">
               <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-orange-500 focus:ring-brand-orange-500" defaultChecked />
               <div>
                 <p className="font-bold text-sm text-foreground">New Booking Alerts</p>
                 <p className="text-xs text-muted-foreground mt-0.5">Get notified when a customer places a new cylinder order.</p>
               </div>
             </label>
             <label className="flex items-start gap-4 p-4 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors">
               <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-orange-500 focus:ring-brand-orange-500" defaultChecked />
               <div>
                 <p className="font-bold text-sm text-foreground">Low Inventory Warnings</p>
                 <p className="text-xs text-muted-foreground mt-0.5">Receive an alert when godown stock drops below 15 units.</p>
               </div>
             </label>
             <label className="flex items-start gap-4 p-4 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors">
               <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-orange-500 focus:ring-brand-orange-500" />
               <div>
                 <p className="font-bold text-sm text-foreground">Daily Revenue Summary</p>
                 <p className="text-xs text-muted-foreground mt-0.5">Receive a consolidated email report at 8:00 PM everyday.</p>
               </div>
             </label>
             <label className="flex items-start gap-4 p-4 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors">
               <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-orange-500 focus:ring-brand-orange-500" defaultChecked />
               <div>
                 <p className="font-bold text-sm text-foreground">Fleet Logistics Updates</p>
                 <p className="text-xs text-muted-foreground mt-0.5">Alerts for delivery truck dispatch and arrival statuses.</p>
               </div>
             </label>
          </div>
        </motion.div>
      </motion.div>

      {/* --- PHONE CHANGE MODAL --- */}
      <AnimatePresence>
        {isPhoneModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => !loading && setIsPhoneModalOpen(false)} />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2"><Smartphone size={24} className="text-brand-orange-500" /> Update Phone</h3>
                <button onClick={() => !loading && setIsPhoneModalOpen(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 text-green-500 text-sm flex items-start gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {phoneStep === "request" ? (
                <form onSubmit={handleRequestPhoneChange} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">New Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">+91</span>
                      <input
                        type="text"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 outline-none font-medium"
                        placeholder="Enter 10 digits"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        autoFocus
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading || newPhone.length !== 10} className="w-full py-3.5 rounded-xl bg-brand-orange-500 text-white font-bold hover:bg-brand-orange-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Authorize Change <ArrowRight size={18} /></>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneChange} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-center text-muted-foreground">Enter 6-digit Security Code</label>
                    <p className="text-xs text-center text-muted-foreground mb-4">Sent to your <strong>old</strong> number for security.</p>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`settings-otp-${i}`}
                          type="text"
                          maxLength={1}
                          className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 outline-none"
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>
                  </div>
                  <button type="submit" disabled={loading || otp.join("").length !== 6} className="w-full py-3.5 rounded-xl bg-foreground text-background font-bold hover:bg-foreground/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Verify & Save <CheckCircle2 size={18} /></>}
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