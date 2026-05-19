import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, TrendingUp, IndianRupee, Package, Truck, AlertCircle, ArrowUpRight,
  MoreVertical, Flame, Activity, CheckCircle2, Clock, Plus, X, Phone, User, 
  Loader2, ShieldCheck, Edit3
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import axios from "axios";

const revenueData = [
  { name: 'Mon', revenue: 4000 }, { name: 'Tue', revenue: 3000 }, { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 }, { name: 'Fri', revenue: 1890 }, { name: 'Sat', revenue: 2390 }, { name: 'Sun', revenue: 3490 },
];
const stockData = [
  { name: '14.2kg Full', value: 850, color: 'var(--primary)' }, { name: '14.2kg Empty', value: 320, color: 'var(--muted)' },
  { name: '19kg Comm.', value: 150, color: '#0ea5e9' }, { name: '5kg FTL', value: 80, color: '#f59e0b' },
];

export default function AdminDashboard() {
  // Add Staff Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", phone: "" });
  
  // Change Phone OTP Modal State
  const [changePhoneModal, setChangePhoneModal] = useState<{
    isOpen: boolean; step: 1 | 2; staffId: number | null; staffName: string; currentPhone: string; newPhone: string;
  }>({ isOpen: false, step: 1, staffId: null, staffName: "", currentPhone: "", newPhone: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Lifted staff list with phone numbers
  const [staffList, setStaffList] = useState([
    { id: 1, name: "Ramesh Kumar", role: "Delivery", count: 42, rating: 4.9, avatar: "11", phone: "9876543210" },
    { id: 2, name: "Suresh Patel", role: "Delivery", count: 38, rating: 4.8, avatar: "12", phone: "8765432109" },
    { id: 3, name: "Mahesh T.", role: "Delivery", count: 35, rating: 4.7, avatar: "13", phone: "7654321098" },
    { id: 4, name: "Kiran R.", role: "Mechanic", count: 12, rating: 5.0, avatar: "15", phone: "6543210987" },
  ]);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  // --- Add New Staff Logic ---
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

        setStaffList([...staffList, { 
            id: Date.now(), name: newStaff.name, role: "Delivery", count: 0, rating: 5.0, avatar: Math.floor(Math.random() * 50).toString(), phone: newStaff.phone 
        }]);
        
        setStatusMessage({ type: "success", text: "Delivery Agent added successfully. They can now log in." });
        setTimeout(() => {
            setIsAddModalOpen(false);
            setNewStaff({ name: "", phone: "" });
            setStatusMessage({ type: "", text: "" });
        }, 2000);
    } catch (err: any) {
        setStatusMessage({ type: "error", text: "Failed to add staff. Number might already exist." });
    } finally {
        setLoading(false);
    }
  };

  // --- Change Phone Request Logic ---
  const handleRequestNumberChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.post('/api/admin/staff/change-number/request', 
            { staff_id: changePhoneModal.staffId, new_phone: changePhoneModal.newPhone },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setStatusMessage({ type: "success", text: response.data.message });
        setChangePhoneModal(prev => ({ ...prev, step: 2 }));
    } catch (err: any) {
        setStatusMessage({ type: "error", text: err.response?.data?.message || "Failed to initiate number change." });
    } finally {
        setLoading(false);
    }
  };

  // --- Change Phone Verify OTP Logic ---
  const handleVerifyNumberChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
        const token = localStorage.getItem('auth_token');
        const otpString = otp.join("");
        
        await axios.post('/api/admin/staff/change-number/verify', 
            { staff_id: changePhoneModal.staffId, otp: otpString },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update local UI
        setStaffList(staffList.map(s => s.id === changePhoneModal.staffId ? { ...s, phone: changePhoneModal.newPhone } : s));
        
        setStatusMessage({ type: "success", text: "Phone number securely updated!" });
        setTimeout(() => {
            setChangePhoneModal({ isOpen: false, step: 1, staffId: null, staffName: "", currentPhone: "", newPhone: "" });
            setOtp(["", "", "", "", "", ""]);
            setStatusMessage({ type: "", text: "" });
        }, 2000);
    } catch (err: any) {
        setStatusMessage({ type: "error", text: err.response?.data?.message || "Invalid OTP." });
    } finally {
        setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agency Overview</h1>
          <p className="text-muted-foreground">Here's what's happening today at Amrutha BharatGas.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-card border rounded-lg text-sm font-medium hover:bg-muted transition-colors">Today</button>
           <button className="px-4 py-2 bg-card border rounded-lg text-sm font-medium hover:bg-muted transition-colors">Last 7 Days</button>
           <button className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-bold shadow-md hover:bg-foreground/90 transition-colors flex items-center gap-2">
              <DownloadIcon size={16} /> Export
           </button>
        </div>
      </div>

      {/* KPI Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Revenue (Today)", value: "₹2.4L", icon: IndianRupee, trend: "+12.5%", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Pending Deliveries", value: "142", icon: Truck, trend: "-5.2%", color: "text-brand-orange-500", bg: "bg-brand-orange-50 dark:bg-brand-orange-950/20" },
          { label: "Active Customers", value: "52,430", icon: Users, trend: "+0.8%", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Stock Available", value: "850 Cyl", icon: Package, trend: "Stable", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map((kpi, i) => (
          <motion.div variants={item} key={i} className="bg-card border rounded-3xl p-6 shadow-sm relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4">
               <div className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
                 <kpi.icon size={24} />
               </div>
               <span className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full"><TrendingUp size={12} className="mr-1" /> {kpi.trend}</span>
             </div>
             <h3 className="text-3xl font-black mb-1">{kpi.value}</h3>
             <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div variants={item} initial="hidden" animate="show" className="xl:col-span-2 bg-card border rounded-3xl p-6 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <div>
               <h3 className="font-bold text-xl">Revenue Trends</h3>
               <p className="text-sm text-muted-foreground">+24% from last week</p>
             </div>
             <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground"><MoreVertical size={20} /></button>
           </div>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                    itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </motion.div>

        {/* Inventory Status */}
        <motion.div variants={item} initial="hidden" animate="show" className="col-span-1 bg-card border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
           <div>
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-xl">Godown Inventory</h3>
               <Package size={20} className="text-muted-foreground" />
             </div>
             
             <div className="h-[200px] w-full mb-2">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart layout="vertical" data={stockData} margin={{ top: 0, right: 10, left: 15, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                   <XAxis type="number" hide />
                   {/* 🟢 FIXED: Added tickFormatter to append the actual number to the label string */}
                   <YAxis 
                     dataKey="name" 
                     type="category" 
                     axisLine={false} 
                     tickLine={false} 
                     width={130}
                     style={{ textAnchor: 'end' }}
                     tickFormatter={(value) => {
                       const item = stockData.find(d => d.name === value);
                       return item ? `${value} (${item.value})` : value;
                     }}
                     tick={{ fontSize: 11, fill: 'var(--foreground)', fontWeight: 700 }} 
                   />
                   <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px' }} />
                   <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                     {stockData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="bg-brand-orange-50/50 dark:bg-brand-orange-950/20 border border-brand-orange-500/20 rounded-2xl p-4 flex gap-3 text-sm">
             <AlertCircle className="text-brand-orange-500 shrink-0" size={18} />
             <div>
               <p className="font-bold text-brand-orange-600 dark:text-brand-orange-400 mb-1">Low Stock Alert</p>
               <p className="text-muted-foreground text-xs leading-relaxed">19kg Commercial cylinders are running below the 200 threshold. Request truck dispatch.</p>
             </div>
           </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Deliveries */}
        <motion.div variants={item} initial="hidden" animate="show" className="bg-card border rounded-3xl p-6 shadow-sm">
           <div className="flex justify-between items-center mb-6 border-b pb-4">
             <h3 className="font-bold text-xl">Active Deliveries</h3>
             <button className="text-sm font-medium text-brand-orange-500 hover:underline">View Map</button>
           </div>
           
           <div className="space-y-4">
             {[
               { id: "ORD-9912", name: "Rahul Verma", area: "Sector 14", agent: "Ramesh K.", status: "En Route", time: "10 mins" },
               { id: "ORD-9913", name: "Anita Desai", area: "Green Park", agent: "Suresh P.", status: "Delivered", time: "Just now" },
               { id: "ORD-9914", name: "Vikram Singh", area: "Cyberville", agent: "Ramesh K.", status: "Pending", time: "In Queue" },
               { id: "ORD-9915", name: "Priya Sharma", area: "Old Town", agent: "Mahesh T.", status: "En Route", time: "25 mins" },
             ].map((delivery, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 transition-colors group cursor-pointer border border-transparent hover:border-border">
                 <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${delivery.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : delivery.status === 'En Route' ? 'bg-brand-orange-500/10 text-brand-orange-500' : 'bg-muted text-muted-foreground'}`}>
                     {delivery.status === 'Delivered' ? <CheckCircle2 size={18} /> : delivery.status === 'En Route' ? <Truck size={18} /> : <Clock size={18} />}
                   </div>
                   <div>
                     <p className="font-bold text-sm mb-0.5">{delivery.name}</p>
                     <p className="text-xs text-muted-foreground">{delivery.id} • {delivery.area}</p>
                   </div>
                 </div>
                 <div className="text-right flex flex-col items-end">
                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-1 ${delivery.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : delivery.status === 'En Route' ? 'bg-brand-orange-500/10 text-brand-orange-500' : 'bg-muted text-muted-foreground'}`}>
                     {delivery.status}
                   </span>
                   <span className="text-xs text-muted-foreground flex items-center gap-1"><User size={12} /> {delivery.agent}</span>
                 </div>
               </div>
             ))}
           </div>
        </motion.div>

        {/* Staff Performance */}
        <motion.div variants={item} initial="hidden" animate="show" className="bg-card border rounded-3xl p-6 shadow-sm">
           <div className="flex justify-between items-center mb-6 border-b pb-4">
             <h3 className="font-bold text-xl">Staff Leaderboard</h3>
             <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-orange-500/10 text-sm font-medium text-brand-orange-500 hover:bg-brand-orange-500 hover:text-white transition-colors"
             >
                <Plus size={16} /> Add Agent
             </button>
           </div>
           
           <div className="space-y-4">
             {staffList.map((staff, i) => (
               <div key={staff.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 transition-colors">
                 <div className="flex gap-4 items-center">
                   <div className="relative">
                     <img src={`https://i.pravatar.cc/150?img=${staff.avatar}`} className="w-12 h-12 rounded-full border" alt="staff" />
                     {i === 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-[10px] border-2 border-card">1</div>}
                   </div>
                   <div>
                     <p className="font-bold text-sm mb-0.5">{staff.name}</p>
                     <p className="text-xs text-muted-foreground font-mono">{staff.phone}</p>
                   </div>
                 </div>
                 <div className="flex items-center justify-end gap-4 text-sm">
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Tasks</p>
                      <p className="font-bold">{staff.count}</p>
                    </div>
                    <button 
                        onClick={() => setChangePhoneModal({ isOpen: true, step: 1, staffId: staff.id, staffName: staff.name, currentPhone: staff.phone, newPhone: "" })}
                        className="p-2 rounded-lg bg-muted text-foreground hover:bg-brand-orange-500 hover:text-white transition-all shadow-sm border"
                        title="Change Registered Number"
                    >
                        <Edit3 size={16} />
                    </button>
                 </div>
               </div>
             ))}
           </div>
        </motion.div>
      </div>

      {/* --- ADD STAFF MODAL --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-card border rounded-3xl shadow-2xl overflow-hidden z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Add Delivery Agent</h3>
                  <p className="text-sm text-muted-foreground">Register staff via phone number.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>

              {statusMessage.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-medium ${statusMessage.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                   <ShieldCheck size={18} /> {statusMessage.text}
                </div>
              )}

              <form onSubmit={handleAddStaff} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Agent Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="text" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 outline-none transition-all font-medium text-foreground" placeholder="e.g. Rahul Sharma" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="text" required maxLength={10} className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 outline-none transition-all font-medium text-foreground" placeholder="10-digit number" value={newStaff.phone} onChange={(e) => setNewStaff({...newStaff, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} />
                  </div>
                </div>
                <button type="submit" disabled={loading || newStaff.phone.length < 10 || !newStaff.name} className="w-full py-3.5 mt-2 rounded-xl bg-brand-orange-500 text-white font-bold text-lg hover:bg-brand-orange-600 transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : "Authorize Agent"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- REAL OTP CHANGE NUMBER MODAL --- */}
      <AnimatePresence>
        {changePhoneModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setChangePhoneModal({ ...changePhoneModal, isOpen: false })} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-card border rounded-3xl shadow-2xl overflow-hidden z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Update Number</h3>
                  <p className="text-sm text-muted-foreground">For: <span className="font-bold text-foreground">{changePhoneModal.staffName}</span></p>
                </div>
                <button onClick={() => setChangePhoneModal({ ...changePhoneModal, isOpen: false })} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              {statusMessage.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-medium ${statusMessage.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                   <ShieldCheck size={18} /> {statusMessage.text}
                </div>
              )}

              {changePhoneModal.step === 1 ? (
                  <form onSubmit={handleRequestNumberChange} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">New Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input type="text" required maxLength={10} autoFocus className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 outline-none transition-all font-medium" placeholder="Enter new 10-digit number" value={changePhoneModal.newPhone} onChange={(e) => setChangePhoneModal({...changePhoneModal, newPhone: e.target.value.replace(/\D/g, '').slice(0, 10)})} />
                      </div>
                    </div>
                    <div className="bg-brand-orange-500/10 p-4 rounded-xl flex items-start gap-3">
                      <ShieldCheck size={20} className="text-brand-orange-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-brand-orange-600 dark:text-brand-orange-400">Security protocol: An OTP will be sent to their <strong>current</strong> number ({changePhoneModal.currentPhone.slice(0, 2)}******{changePhoneModal.currentPhone.slice(-2)}) to authorize this change.</p>
                    </div>
                    <button type="submit" disabled={loading || changePhoneModal.newPhone.length < 10} className="w-full py-3.5 rounded-xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center justify-center">
                      {loading ? <Loader2 className="animate-spin" size={24} /> : "Request Change via OTP"}
                    </button>
                  </form>
              ) : (
                  <form onSubmit={handleVerifyNumberChange} className="space-y-6">
                    <p className="text-sm text-center text-muted-foreground">Enter the 6-digit code sent to <br/><span className="font-bold text-foreground">{changePhoneModal.currentPhone}</span></p>
                    <div className="flex gap-2 justify-between px-2">
                        {otp.map((digit, i) => (
                          <input key={i} id={`otp-${i}`} type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 outline-none" value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} autoFocus={i === 0} />
                        ))}
                    </div>
                    <button type="submit" disabled={loading || otp.join("").length < 6} className="w-full py-3.5 rounded-xl bg-brand-orange-500 text-white font-bold text-lg shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="animate-spin" size={24} /> : <><CheckCircle2 size={20} /> Verify & Update</>}
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

// Icons needed internally
function DownloadIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> }