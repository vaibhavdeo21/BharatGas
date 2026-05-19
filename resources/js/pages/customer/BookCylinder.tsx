import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, CheckCircle2, MapPin, Truck, ShieldCheck, ChevronRight, CreditCard, Banknote, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function BookCylinder() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState<any>(null);

  const userData = (() => {
    try { return JSON.parse(localStorage.getItem('user_data') || '{}'); } catch { return {}; }
  })();

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Book LPG Refill</h1>
        <p className="text-muted-foreground">Select your preferences and confirm your booking instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Form Steps */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Confirmation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-3xl p-6 transition-all duration-300 ${step === 1 ? 'bg-card shadow-lg ring-1 ring-brand-orange-500/20' : 'bg-muted/50'}`}
          >
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 ? 'bg-brand-orange-500 text-white' : 'bg-foreground text-background'}`}>1</div>
                 <h2 className="text-xl font-bold">Delivery Details</h2>
               </div>
               {step > 1 && <button onClick={() => setStep(1)} className="text-sm font-medium text-brand-orange-500 hover:underline">Edit</button>}
             </div>
             
             {step === 1 ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div className="bg-muted p-4 rounded-2xl border flex gap-4 items-start">
                    <div className="mt-1"><MapPin className="text-brand-orange-500" /></div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Default Address</span>
                      <p className="font-semibold text-lg leading-tight mb-1">{userData.name || "Customer"}</p>
                      <p className="text-muted-foreground text-sm">{userData.address || "Address not updated"}</p>
                     <button className="text-sm font-bold text-brand-blue-500 mt-2 hover:underline">Change Address</button>
                   </div>
                 </div>
                 
                 <div className="bg-muted p-4 rounded-2xl border flex gap-4 items-center">
                   <div className="w-12 h-12 rounded-full bg-brand-orange-500/10 flex items-center justify-center border border-brand-orange-500/20">
                     <Flame className="text-brand-orange-500" />
                   </div>
                   <div className="flex-1">
                     <p className="font-bold">14.2 kg Domestic Cylinder</p>
                     <p className="text-sm text-muted-foreground">Standard Refill</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-lg">₹942.00</p>
                   </div>
                 </div>

                 <button 
                   onClick={() => setStep(2)}
                   className="w-full py-4 rounded-xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-colors shadow-lg"
                 >
                   Confirm Details
                 </button>
               </motion.div>
             ) : (
               <div className="pl-11 text-muted-foreground text-sm flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-green-500" /> Details confirmed
               </div>
             )}
          </motion.div>

          {/* Step 2: Payment */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`border rounded-3xl p-6 transition-all duration-300 ${step === 2 ? 'bg-card shadow-lg ring-1 ring-brand-orange-500/20' : 'bg-muted/50'}`}
          >
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-brand-orange-500 text-white' : 'bg-muted-foreground text-muted text-white'}`}>2</div>
                 <h2 className={`text-xl font-bold ${step < 2 ? 'text-muted-foreground' : ''}`}>Payment Method</h2>
               </div>
             </div>

             {step === 2 && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                 
                 <button 
                   onClick={() => setPaymentMethod('cod')}
                   className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-brand-orange-500 bg-brand-orange-50 dark:bg-brand-orange-950/20' : 'border-border hover:border-brand-orange-300'}`}
                 >
                   <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-brand-orange-500/20 text-brand-orange-600' : 'bg-muted text-muted-foreground'}`}>
                       <Banknote size={24} />
                     </div>
                     <div className="text-left">
                       <span className="font-bold block text-lg">Cash on Delivery</span>
                       <span className="text-sm text-muted-foreground">Pay when you receive the cylinder</span>
                     </div>
                   </div>
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-orange-500 bg-brand-orange-500' : 'border-muted-foreground'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                   </div>
                 </button>

                 <button 
                   onClick={() => setPaymentMethod('online')}
                   className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'online' ? 'border-brand-orange-500 bg-brand-orange-50 dark:bg-brand-orange-950/20' : 'border-border hover:border-brand-orange-300'}`}
                 >
                   <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'online' ? 'bg-brand-orange-500/20 text-brand-orange-600' : 'bg-muted text-muted-foreground'}`}>
                       <CreditCard size={24} />
                     </div>
                     <div className="text-left">
                       <span className="font-bold block text-lg">Pay Online Now</span>
                       <span className="text-sm text-muted-foreground">UPI, Credit/Debit Card, Netbanking</span>
                     </div>
                   </div>
                   <div className={`flex items-center gap-2`}>
                      <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">Recommended</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-brand-orange-500 bg-brand-orange-500' : 'border-muted-foreground'}`}>
                         {paymentMethod === 'online' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                      </div>
                   </div>
                 </button>

                 <div className="pt-6 space-y-3">
                   {error && <p className="text-sm text-destructive text-center font-medium">{error}</p>}
                   <button 
                     onClick={async () => {
                       setLoading(true);
                       setError("");
                       try {
                         const token = localStorage.getItem('auth_token');
                         const res = await axios.post('/api/bookings', {
                           cylinder_type: 'domestic_14_2',
                           quantity: 1
                         }, { headers: { Authorization: `Bearer ${token}` } });
                         setBookingData(res.data.booking);
                         setStep(3);
                       } catch (err: any) {
                         setError(err.response?.data?.message || "Booking failed. Ensure you have an active connection.");
                       } finally {
                         setLoading(false);
                       }
                     }}
                     disabled={loading}
                     className="w-full py-4 rounded-xl bg-brand-orange-500 text-white font-bold text-lg hover:bg-brand-orange-600 transition-colors shadow-lg shadow-brand-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
                   >
                     {loading ? <Loader2 className="animate-spin" /> : paymentMethod === 'online' ? 'Proceed to Pay ₹942' : 'Book Cylinder Now'} 
                     {!loading && <ChevronRight size={20} />}
                   </button>
                 </div>
               </motion.div>
             )}

             {step === 3 && (
               <div className="pl-11 text-muted-foreground text-sm flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-green-500" /> {paymentMethod === 'cod' ? 'Cash on Delivery selected' : 'Payment successful'}
               </div>
             )}
          </motion.div>

          {/* Step 3: Success State */}
          <AnimatePresence>
            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-brand-orange-500 text-white rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl shadow-brand-orange-500/40"
              >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                 
                 <motion.div 
                   initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, delay: 0.2 }}
                   className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                 >
                   <CheckCircle2 size={40} className="text-brand-orange-500" />
                 </motion.div>
                 
                 <h2 className="text-3xl font-extrabold mb-2 relative z-10">Booking Confirmed!</h2>
                 <p className="text-white/80 font-medium mb-8 relative z-10">Order Reference: {bookingData?.booking_reference || '#ORD-8922'}</p>

                 <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-left border border-white/20 mb-8 relative z-10">
                   <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                     <span className="text-white/70">Expected Delivery</span>
                     <span className="font-bold text-lg">{bookingData ? new Date(bookingData.expected_delivery_date).toLocaleDateString() : 'Tomorrow'}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-white/70">Est. Subsidy</span>
                     <span className="font-bold text-lg text-green-300">₹320 crediting soon</span>
                   </div>
                 </div>

                 <Link to="/dashboard/customer/track" className="inline-block w-full py-4 rounded-xl bg-white text-brand-orange-600 font-bold text-lg hover:bg-white/90 transition-colors relative z-10 shadow-lg">
                   Track Live Order
                 </Link>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Side - Summary */}
        <div className="lg:col-span-1">
           <div className="bg-card border rounded-3xl p-6 sticky top-24 shadow-sm">
             <h3 className="font-bold text-lg mb-6 border-b pb-4">Booking Summary</h3>
             
             <div className="space-y-4 mb-6">
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Base Price (14.2kg)</span>
                 <span className="font-medium">₹842.00</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">CGST (2.5%)</span>
                 <span className="font-medium">₹21.05</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">SGST (2.5%)</span>
                 <span className="font-medium">₹21.05</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Delivery Charges</span>
                 <span className="font-medium">₹57.90</span>
               </div>
             </div>

             <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg">Total Amount</span>
                  <span className="font-extrabold text-3xl text-brand-orange-500">₹942</span>
                </div>
                <p className="text-xs text-right text-muted-foreground mt-1">Inclusive of all taxes</p>
             </div>

             <div className="bg-muted rounded-2xl p-4 flex gap-3 items-start border">
               <ShieldCheck className="text-green-500 shrink-0 mt-0.5" size={20} />
               <div>
                 <p className="text-sm font-bold leading-tight mb-1">Subsidy Eligible</p>
                 <p className="text-xs text-muted-foreground leading-relaxed">Based on your Pahel linkage, ₹320 will be credited to your HDFC bank account ending in 4567 within 48 hours of delivery.</p>
               </div>
             </div>

             <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
               <Truck size={14} /> Express Free Delivery Active
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
