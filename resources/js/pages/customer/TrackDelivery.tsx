import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Phone, MessageSquare, Star, ArrowLeft, Clock, ShieldCheck, CheckCircle2, Flame, Loader2 } from "lucide-react";
import axios from "axios";

export default function TrackDelivery() {
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('/api/customer/bookings/history', config).catch(() => ({ data: [] }));
        const bookings = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        
        // Find active booking (not delivered/cancelled)
        const active = bookings.find((b: any) => b.status !== 'delivered' && b.status !== 'cancelled');
        setActiveBooking(active || null);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col lg:flex-row h-full absolute inset-0 pt-16">
      {/* Sidebar with Timeline */}
      <div className="w-full lg:w-[450px] bg-card border-r flex flex-col z-20 h-full overflow-y-auto shrink-0 shadow-2xl">
        <div className="p-6 border-b bg-muted/30">
          <Link to="/dashboard/customer" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-start mb-2">
            <div>
               <h1 className="text-2xl font-bold tracking-tight">Track Order</h1>
               <p className="text-muted-foreground font-medium">#{activeBooking?.id || 'ORD-8921'}</p>
            </div>
            <div className="px-3 py-1 bg-brand-orange-500/10 text-brand-orange-600 dark:text-brand-orange-400 text-xs font-bold uppercase tracking-wider rounded-full border border-brand-orange-500/20">
               {activeBooking?.status === 'pending' ? 'Processing' : activeBooking?.status === 'in_transit' ? 'En Route' : 'Preparing'}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border font-bold text-lg">
               14
            </div>
            <div>
               <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Arriving In</p>
               <p className="text-xl font-extrabold text-brand-orange-500">Mins</p>
            </div>
          </div>
        </div>

        {/* Delivery Agent Profile */}
        <div className="p-6 border-b">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Delivery Executive</p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?img=11" alt="Delivery Agent" className="w-16 h-16 rounded-full border-2 border-brand-orange-500 object-cover" />
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-card flex items-center gap-0.5">
                <Star size={10} className="fill-current" /> 4.9
              </div>
            </div>
            <div className="flex-1">
               <h3 className="font-bold text-lg leading-tight">Ramesh Kumar</h3>
               <p className="text-sm text-muted-foreground mb-2">Vehicle: AP 16 XY 1234</p>
               <div className="flex items-center gap-2">
                 <button className="flex-1 py-2 rounded-lg bg-brand-orange-50 dark:bg-brand-orange-950/30 text-brand-orange-600 dark:text-brand-orange-400 font-bold text-sm flex items-center justify-center gap-2 border border-brand-orange-500/20 hover:bg-brand-orange-100 transition-colors">
                   <Phone size={16} /> Call
                 </button>
                 <button className="w-10 h-10 shrink-0 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors border">
                   <MessageSquare size={16} />
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* OTP Section */}
        <div className="p-6 border-b bg-brand-orange-500 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <p className="text-sm font-medium text-white/80 mb-1 relative z-10">Delivery PIN / OTP</p>
          <div className="flex items-center justify-between relative z-10">
             <h2 className="text-4xl font-black tracking-widest">7 4 9 2</h2>
             <ShieldCheck size={32} className="text-white/50" />
          </div>
          <p className="text-xs text-brand-orange-100 mt-2 relative z-10">Share this PIN only when the cylinder is delivered.</p>
        </div>

        {/* Timeline */}
        <div className="p-6 flex-1 bg-muted/10">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Delivery Updates</p>
          
          <div className="relative border-l-2 border-muted ml-3 space-y-8">
            <div className="relative pl-6">
              <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-card bg-brand-orange-500 animate-pulse shadow-[0_0_10px_rgba(247,91,17,0.5)]"></span>
              <h4 className="font-bold text-foreground">Agent approaching</h4>
              <p className="text-sm text-brand-orange-500 font-medium mb-1">Ramesh is 1.2km away</p>
              <p className="text-xs text-muted-foreground font-medium">14:16 PM</p>
            </div>
            
            <div className="relative pl-6">
              <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-card bg-brand-orange-500 flex items-center justify-center"><CheckCircle2 size={10} className="text-white relative right-[1px]" /></span>
              <h4 className="font-bold text-foreground">Out for Delivery</h4>
              <p className="text-sm text-muted-foreground mb-1">Cylinder has left the agency.</p>
              <p className="text-xs text-muted-foreground font-medium">10:45 AM</p>
            </div>

            <div className="relative pl-6">
              <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-card bg-brand-orange-500 flex items-center justify-center"><CheckCircle2 size={10} className="text-white relative right-[1px]" /></span>
              <h4 className="font-bold text-foreground">Safety Checked</h4>
              <p className="text-sm text-muted-foreground mb-1">Passed 5-point inspection.</p>
              <p className="text-xs text-muted-foreground font-medium">09:12 AM</p>
            </div>

            <div className="relative pl-6">
              <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-card bg-brand-orange-500 flex items-center justify-center"><CheckCircle2 size={10} className="text-white relative right-[1px]" /></span>
              <h4 className="font-bold text-foreground">Order Confirmed</h4>
              <p className="text-sm text-muted-foreground mb-1">Booking reference generated.</p>
              <p className="text-xs text-muted-foreground font-medium">Yesterday, 18:30 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Area Placeholder */}
      <div className="flex-1 bg-muted relative overflow-hidden h-full hidden lg:block">
         <div className="absolute inset-0 bg-[#e5e7eb] dark:bg-[#1a1c23]">
            {/* Fake Map Grid */}
            <div className="w-full h-full opacity-20" style={{ backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px), linear-gradient(90deg, #9ca3af 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
            
            {/* Fake Route */}
            <svg className="absolute inset-0 w-full h-full drop-shadow-xl" pointerEvents="none">
              <path 
                d="M 200 400 Q 300 200 500 350 T 800 200" 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeDasharray="12 12"
                className="animate-[dash_1s_linear_infinite]"
              />
              <style>{`
                @keyframes dash {
                  to { stroke-dashoffset: -24; }
                }
              `}</style>
            </svg>

            {/* Origin Pin */}
            <div className="absolute top-[380px] left-[180px] w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white z-10">
              <Flame size={20} className="fill-brand-orange-500 text-brand-orange-500" />
            </div>

            {/* Destination Pin */}
            <div className="absolute top-[180px] left-[780px] w-12 h-12 bg-card text-card-foreground rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-brand-orange-500 z-10">
              <MapPin size={24} className="fill-brand-orange-100 text-brand-orange-500" />
            </div>

            {/* Moving Truck */}
            <motion.div 
               className="absolute z-20 w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(247,91,17,0.4)] border-2 border-brand-orange-500 pointer-events-none"
               animate={{ 
                 x: [200, 350, 650, 750], 
                 y: [400, 275, 275, 200] 
               }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               style={{ top: -32, left: -32 }}
            >
              <img src="https://i.pravatar.cc/150?img=11" className="w-12 h-12 rounded-full border border-border" alt="agent" />
            </motion.div>
         </div>

         {/* Map Overlay Controls */}
         <div className="absolute top-6 right-6 flex flex-col gap-2">
            <button className="w-12 h-12 bg-card rounded-2xl shadow-lg border flex items-center justify-center hover:bg-muted text-foreground transition-colors">+</button>
            <button className="w-12 h-12 bg-card rounded-2xl shadow-lg border flex items-center justify-center hover:bg-muted text-foreground transition-colors">-</button>
            <button className="w-12 h-12 bg-card rounded-2xl shadow-lg border flex items-center justify-center hover:bg-muted mt-4 text-brand-orange-500 transition-colors"><MapPin size={20} className="fill-current" /></button>
         </div>
      </div>
    </div>
  );
}
