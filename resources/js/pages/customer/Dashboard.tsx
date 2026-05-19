import { motion } from "framer-motion";
import { 
  Flame, 
  TrendingUp, 
  CreditCard, 
  AlertCircle, 
  MapPin, 
  Clock, 
  ChevronRight,
  Download,
  IndianRupee,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const usageData = [
  { month: 'Jan', usage: 1.2 },
  { month: 'Feb', usage: 1.0 },
  { month: 'Mar', usage: 0.8 },
  { month: 'Apr', usage: 1.1 },
  { month: 'May', usage: 1.3 },
  { month: 'Jun', usage: 0.9 },
  { month: 'Jul', usage: 1.2 },
];

export default function CustomerDashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Consumer No: #7098231</p>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Sumit!</h1>
        </div>
        <Link 
          to="/dashboard/customer/book"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold shadow-lg shadow-brand-orange-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <Flame size={18} className="fill-current" /> Auto-Book Refill
        </Link>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Connection Status Card */}
        <motion.div variants={item} className="bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 p-6 rounded-3xl text-white shadow-xl shadow-brand-orange-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <p className="text-white/80 font-medium mb-1">Current Status</p>
              <h3 className="text-2xl font-bold">Active Line</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
              <CheckCircle2 size={24} className="text-white" />
            </div>
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div>
               <p className="text-white/70 text-sm mb-1">Last Delivery</p>
               <p className="font-bold text-lg">12 Oct 2026</p>
            </div>
            <div className="text-right">
               <p className="text-white/70 text-sm mb-1">Est. Empty In</p>
               <p className="font-bold text-lg">~14 Days</p>
            </div>
          </div>
        </motion.div>

        {/* Subsidy Info */}
        <motion.div variants={item} className="bg-card border p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted-foreground font-medium mb-1">Total Subsidy Savings</p>
              <h3 className="text-3xl font-extrabold flex items-center gap-1">
                <IndianRupee size={28} /> 4,250
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
               <TrendingUp size={20} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 w-fit px-3 py-1 rounded-full mb-3">
              <CheckCircle2 size={14} /> Bank Acc linked (****4567)
            </div>
            <Link to="#" className="text-sm font-bold text-brand-blue-600 dark:text-brand-blue-400 flex items-center gap-1 hover:underline">
               View Subsidy Ledger <ChevronRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Safety Check */}
        <motion.div variants={item} className="glass-card border p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-muted-foreground font-medium mb-1">Safety Inspection</p>
              <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-500">Due Soon</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-600 dark:text-yellow-500">
               <AlertCircle size={20} />
            </div>
          </div>
          <div className="relative z-10">
             <p className="text-sm text-muted-foreground mb-4">Mandatory 5-year hose & regulator check is pending next month.</p>
             <button className="w-full py-2.5 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity">Schedule Inspection</button>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* Active Order Card */}
          <motion.div variants={item} className="bg-card border rounded-3xl overflow-hidden shadow-sm">
             <div className="p-6 border-b flex justify-between items-center bg-muted/30">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">Out for Delivery</span>
                    <span className="text-sm font-medium text-muted-foreground">Order #ORD-8921</span>
                  </div>
                  <h3 className="font-bold text-xl">14.2kg Domestic Cylinder</h3>
               </div>
               <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Expected Today</p>
                  <p className="font-extrabold text-2xl text-brand-orange-500">02:30 PM</p>
               </div>
             </div>
             
             <div className="p-6">
                {/* Visual Progress Bar */}
                <div className="relative pt-4 pb-8">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full"></div>
                  <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-brand-orange-500 -translate-y-1/2 rounded-full transition-all duration-1000"></div>
                  
                  <div className="relative flex justify-between text-xs font-bold text-muted-foreground uppercase mt-4">
                     <div className="flex flex-col items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-brand-orange-500 text-white flex items-center justify-center -mt-[30px] shadow-lg shadow-brand-orange-500/40 border-4 border-card"><CheckCircle2 size={12} /></div>
                       <span className="text-foreground">Booked</span>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-brand-orange-500 text-white flex items-center justify-center -mt-[30px] shadow-lg shadow-brand-orange-500/40 border-4 border-card"><CheckCircle2 size={12} /></div>
                       <span className="text-foreground">Dispatched</span>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-brand-orange-500 text-white flex items-center justify-center -mt-[30px] shadow-lg shadow-brand-orange-500/40 border-4 border-card animate-pulse"><MapPin size={12} /></div>
                       <span className="text-brand-orange-500">En Route</span>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-muted border-4 border-card -mt-[30px]"></div>
                       <span>Delivered</span>
                     </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link to="/dashboard/customer/track" className="flex-1 py-3 rounded-xl bg-brand-orange-50/50 dark:bg-brand-orange-900/20 text-brand-orange-600 dark:text-brand-orange-400 font-bold border border-brand-orange-500/20 text-center hover:bg-brand-orange-50 dark:hover:bg-brand-orange-900/40 transition-colors">
                    Live Map Tracking
                  </Link>
                  <button className="flex-1 py-3 rounded-xl bg-muted border font-bold text-foreground hover:bg-muted/80 transition-colors">
                    Payment: ₹940 (COD)
                  </button>
                </div>
             </div>
          </motion.div>

          {/* Usage Analytics */}
          <motion.div variants={item} className="bg-card border rounded-3xl p-6 shadow-sm">
             <div className="flex justify-between items-center mb-8">
               <div>
                 <h3 className="font-bold text-xl mb-1">Consumption Analytics</h3>
                 <p className="text-sm text-muted-foreground">Your average usage is <span className="font-bold text-foreground">1.1 cylinders/month</span></p>
               </div>
               <select className="bg-muted px-4 py-2 rounded-lg text-sm font-medium outline-none border-0 ring-0 cursor-pointer">
                 <option>Last 6 Months</option>
                 <option>This Year</option>
               </select>
             </div>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="usage" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                  </AreaChart>
               </ResponsiveContainer>
             </div>
          </motion.div>

        </div>

        {/* Sidebar Space */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div variants={item} className="bg-card border rounded-3xl p-6 shadow-sm">
             <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
             <div className="grid grid-cols-2 gap-3">
               {[
                 { icon: CreditCard, label: "Pay Bill" },
                 { icon: Download, label: "Invoices" },
                 { icon: MapPin, label: "Address" },
                 { icon: AlertCircle, label: "Support" },
               ].map((action, i) => (
                 <button key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/50 hover:bg-muted border border-transparent hover:border-border transition-colors gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-background border shadow-sm flex items-center justify-center text-muted-foreground group-hover:text-brand-orange-500 group-hover:scale-110 transition-all">
                      <action.icon size={20} />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                 </button>
               ))}
             </div>
          </motion.div>

          {/* Recent History */}
          <motion.div variants={item} className="bg-card border rounded-3xl p-6 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg">Recent Orders</h3>
               <Link to="#" className="text-sm font-medium text-brand-orange-500 hover:underline">View All</Link>
             </div>
             
             <div className="space-y-5">
               {[
                 { date: "12 Oct 2026", type: "14.2kg Refill", amount: "₹942", status: "Delivered", statusColor: "text-green-500", bg: "bg-green-500/10" },
                 { date: "05 Sep 2026", type: "14.2kg Refill", amount: "₹942", status: "Delivered", statusColor: "text-green-500", bg: "bg-green-500/10" },
                 { date: "22 Jul 2026", type: "Mechanic Visit", amount: "₹150", status: "Completed", statusColor: "text-blue-500", bg: "bg-blue-500/10" },
               ].map((order, i) => (
                 <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-full ${order.bg} flex items-center justify-center ${order.statusColor}`}>
                         <CalendarCheck size={18} />
                       </div>
                       <div>
                         <p className="font-bold text-sm mb-0.5 group-hover:text-brand-orange-500 transition-colors">{order.type}</p>
                         <p className="text-xs text-muted-foreground">{order.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-sm mb-0.5">{order.amount}</p>
                       <p className={`text-[10px] font-bold uppercase tracking-wider ${order.statusColor}`}>{order.status}</p>
                    </div>
                 </div>
               ))}
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
