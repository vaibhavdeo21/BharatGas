import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, AlertTriangle, Truck, ArrowDownToLine, 
  ArrowUpFromLine, Search, Filter, History, 
  CheckCircle2, X, Plus, Loader2, ShieldCheck,
  RefreshCw
} from "lucide-react";
import axios from "axios";

export default function Inventory() {
  const [stock, setStock] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Modal State
  const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Form state expanded for mixed truck loads
  const [truckForm, setTruckForm] = useState({
    truckNo: "",
    domestic_14_2_full: "",
    domestic_14_2_empty: "",
    commercial_19_full: "",
    commercial_19_empty: "",
    domestic_5_full: "",
    domestic_5_empty: ""
  });

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  const fetchData = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [stockRes, trxRes] = await Promise.all([
            axios.get('/api/admin/inventory/stock', config),
            axios.get('/api/admin/inventory/transactions', config)
        ]);
        
        setStock(Array.isArray(stockRes.data) ? stockRes.data : []);
        setTransactions(Array.isArray(trxRes.data) ? trxRes.data : []);
    } catch (err) {
        console.error("Sync Error:", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleReceiveTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Format the payload as an array of items for the backend
    const payload = {
        truckNo: truckForm.truckNo,
        items: [
            { cylinder_type: 'domestic_14_2', fullReceived: Number(truckForm.domestic_14_2_full) || 0, emptyReturned: Number(truckForm.domestic_14_2_empty) || 0 },
            { cylinder_type: 'commercial_19', fullReceived: Number(truckForm.commercial_19_full) || 0, emptyReturned: Number(truckForm.commercial_19_empty) || 0 },
            { cylinder_type: 'domestic_5', fullReceived: Number(truckForm.domestic_5_full) || 0, emptyReturned: Number(truckForm.domestic_5_empty) || 0 },
        ]
    };

    try {
        const token = localStorage.getItem('auth_token');
        await axios.post('/api/admin/inventory/truck/receive', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setSuccessMsg("Truck manifest recorded and stock updated!");
        fetchData();

        setTimeout(() => {
            setIsTruckModalOpen(false);
            setTruckForm({
                truckNo: "",
                domestic_14_2_full: "", domestic_14_2_empty: "",
                commercial_19_full: "", commercial_19_empty: "",
                domestic_5_full: "", domestic_5_empty: ""
            });
            setSuccessMsg("");
            setSubmitting(false);
        }, 2000);
    } catch (err) {
        alert("Failed to update inventory.");
        setSubmitting(false);
    }
  };

  // Helper to match your exact UI text
  const formatType = (type: string) => {
    if (type === 'domestic_14_2') return "14.2kg Domestic";
    if (type === 'commercial_19') return "19kg Commercial";
    if (type === 'domestic_5') return "5kg FTL";
    return type;
  };

  // Helper to maintain your progress bars
  const getCapacity = (type: string) => {
    if (type === 'domestic_14_2') return 1000;
    if (type === 'commercial_19') return 300;
    return 150;
  };

  // Helper for UI colors
  const getColor = (type: string) => {
    if (type === 'domestic_14_2') return { text: "text-brand-orange-500", bg: "bg-brand-orange-500" };
    if (type === 'commercial_19') return { text: "text-blue-500", bg: "bg-blue-500" };
    return { text: "text-purple-500", bg: "bg-purple-500" };
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Godown Inventory</h1>
          <p className="text-muted-foreground">Manage plant shipments and live cylinder tracking.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={fetchData} className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
              <RefreshCw size={16} /> Sync ERP
           </button>
           <button 
             onClick={() => setIsTruckModalOpen(true)}
             className="px-4 py-2 bg-brand-orange-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-orange-500/20 hover:bg-brand-orange-600 transition-colors flex items-center gap-2"
           >
              <Truck size={16} /> Receive Plant Truck
           </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin" size={40}/></div>
      ) : (
        <>
          {/* Stock Level Cards */}
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {stock.map((s: any) => {
               const capacity = getCapacity(s.cylinder_type);
               const fillPercentage = Math.round((s.full_cylinders / capacity) * 100);
               const colors = getColor(s.cylinder_type);

               return (
                 <motion.div variants={item} key={s.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                   <div className="flex justify-between items-start mb-6">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-muted group-hover:scale-110 transition-transform ${colors.text}`}>
                        <Package size={24} />
                     </div>
                     <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-500/10 text-green-500">Active</span>
                   </div>
                   
                   <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">{formatType(s.cylinder_type)}</p>
                     <div className="flex items-end gap-2 mb-4">
                        <h3 className="text-4xl font-black text-foreground">{s.full_cylinders}</h3>
                        <span className="text-sm font-medium text-muted-foreground mb-1">/ {capacity}</span>
                     </div>

                     {/* Capacity Progress Bar */}
                     <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${fillPercentage}%` }}
                         transition={{ duration: 1, ease: "easeOut" }}
                         className={`h-full ${colors.bg}`}
                       />
                     </div>
                     <div className="flex justify-between mt-2">
                        <p className="text-xs text-muted-foreground font-medium">Empties: {s.empty_cylinders}</p>
                        <p className="text-xs text-muted-foreground font-medium">{fillPercentage}% Capacity</p>
                     </div>
                   </div>
                 </motion.div>
               )
            })}
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Side - Alerts & Quick Actions */}
            <div className="xl:col-span-1 space-y-6">
               <motion.div variants={item} initial="hidden" animate="show" className="bg-brand-orange-500/10 border border-brand-orange-500/20 rounded-3xl p-6">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-brand-orange-500/20 flex items-center justify-center text-brand-orange-500">
                     <AlertTriangle size={20} />
                   </div>
                   <h3 className="font-bold text-brand-orange-600 dark:text-brand-orange-400 text-lg">Reorder Alert</h3>
                 </div>
                 <p className="text-sm text-foreground mb-4 leading-relaxed">
                   19kg Commercial cylinder stock is dropping below the minimum threshold of 200. Projected to run out in 2 days.
                 </p>
                 <button className="w-full py-2.5 bg-background border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors">
                   Generate Indent Request
                 </button>
               </motion.div>

               <motion.div variants={item} initial="hidden" animate="show" className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                 <h3 className="font-bold text-lg mb-6">Today's Summary</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-2xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <ArrowDownToLine size={18} className="text-green-500" />
                        <span className="text-sm font-medium">Inward from Plant</span>
                      </div>
                      <span className="font-bold text-foreground">306 Cyl</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-2xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <ArrowUpFromLine size={18} className="text-brand-orange-500" />
                        <span className="text-sm font-medium">Dispatched to Fleet</span>
                      </div>
                      <span className="font-bold text-foreground">142 Cyl</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-2xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Package size={18} className="text-slate-500" />
                        <span className="text-sm font-medium">Empty Returns</span>
                      </div>
                      <span className="font-bold text-foreground">118 Cyl</span>
                    </div>
                 </div>
               </motion.div>
            </div>

            {/* Right Side - Transaction Ledger */}
            <motion.div variants={item} initial="hidden" animate="show" className="xl:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col h-[600px]">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-border pb-4">
                 <div className="flex items-center gap-2">
                   <History className="text-muted-foreground" size={20} />
                   <h3 className="font-bold text-xl">Transaction Ledger</h3>
                 </div>
                 <div className="flex gap-2 w-full sm:w-auto">
                   <div className="relative flex-1 sm:w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                     <input type="text" placeholder="Search TRX ID or Truck..." className="w-full pl-9 pr-4 py-2 bg-muted border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-orange-500/20" />
                   </div>
                   <button className="p-2 bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Filter size={18} /></button>
                 </div>
               </div>

               <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  {transactions.map((trx: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-transparent hover:border-border hover:bg-muted/50 transition-colors gap-4">
                       <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
                            trx.type?.includes('Inward') || trx.type?.includes('Return') ? 'bg-green-500/10 text-green-500' : 'bg-brand-orange-500/10 text-brand-orange-500'
                          }`}>
                             {trx.type?.includes('Inward') || trx.type?.includes('Return') ? <ArrowDownToLine size={18} /> : <ArrowUpFromLine size={18} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-sm text-foreground">{trx.type}</p>
                              <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-mono text-muted-foreground">{trx.id}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Ref: {trx.truckNo} • {trx.date}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                         <div className="text-left sm:text-right">
                           <p className={`font-bold text-sm mb-1 ${trx.qty?.includes('+') ? 'text-green-500' : 'text-brand-orange-500'}`}>{trx.qty}</p>
                           <p className="text-xs text-muted-foreground">{trx.item}</p>
                         </div>
                         <div className="flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg shrink-0">
                           <CheckCircle2 size={14} /> {trx.status}
                         </div>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        </>
      )}

      {/* --- RECEIVE TRUCK MODAL (Mixed Load Design) --- */}
      <AnimatePresence>
        {isTruckModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !submitting && setIsTruckModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10 p-6 flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Inward Plant Truck</h3>
                  <p className="text-sm text-muted-foreground">Log received cylinders and returned empties for all types.</p>
                </div>
                <button onClick={() => setIsTruckModalOpen(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              {successMsg ? (
                <div className="flex flex-col items-center justify-center py-12 shrink-0">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                     <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Manifest Verified</h4>
                  <p className="text-muted-foreground text-center">{successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleReceiveTruck} className="overflow-y-auto pr-2 space-y-6 pb-4 custom-scrollbar">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Plant Truck Vehicle Number</label>
                    <div className="relative">
                      <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input type="text" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 outline-none uppercase font-mono" placeholder="e.g. PB 08 AB 1234" value={truckForm.truckNo} onChange={(e) => setTruckForm({...truckForm, truckNo: e.target.value})} />
                    </div>
                  </div>

                  {/* 14.2kg Section */}
                  <div>
                    <h4 className="font-bold text-brand-orange-500 mb-2">14.2kg Domestic</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-2xl">
                        <label className="block text-sm font-bold text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-2"><ArrowDownToLine size={16}/> Received (Fulls)</label>
                        <input type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none font-bold text-lg" placeholder="0" value={truckForm.domestic_14_2_full} onChange={(e) => setTruckForm({...truckForm, domestic_14_2_full: e.target.value})} />
                      </div>
                      <div className="bg-slate-500/5 border border-slate-500/20 p-4 rounded-2xl">
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-2"><ArrowUpFromLine size={16}/> Returned (Empties)</label>
                        <input type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none font-bold text-lg" placeholder="0" value={truckForm.domestic_14_2_empty} onChange={(e) => setTruckForm({...truckForm, domestic_14_2_empty: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* 19kg Section */}
                  <div>
                    <h4 className="font-bold text-blue-500 mb-2">19kg Commercial</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-2xl">
                        <label className="block text-sm font-bold text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-2"><ArrowDownToLine size={16}/> Received (Fulls)</label>
                        <input type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none font-bold text-lg" placeholder="0" value={truckForm.commercial_19_full} onChange={(e) => setTruckForm({...truckForm, commercial_19_full: e.target.value})} />
                      </div>
                      <div className="bg-slate-500/5 border border-slate-500/20 p-4 rounded-2xl">
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-2"><ArrowUpFromLine size={16}/> Returned (Empties)</label>
                        <input type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none font-bold text-lg" placeholder="0" value={truckForm.commercial_19_empty} onChange={(e) => setTruckForm({...truckForm, commercial_19_empty: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* 5kg Section */}
                  <div>
                    <h4 className="font-bold text-purple-500 mb-2">5kg FTL</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-2xl">
                        <label className="block text-sm font-bold text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-2"><ArrowDownToLine size={16}/> Received (Fulls)</label>
                        <input type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none font-bold text-lg" placeholder="0" value={truckForm.domestic_5_full} onChange={(e) => setTruckForm({...truckForm, domestic_5_full: e.target.value})} />
                      </div>
                      <div className="bg-slate-500/5 border border-slate-500/20 p-4 rounded-2xl">
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-2"><ArrowUpFromLine size={16}/> Returned (Empties)</label>
                        <input type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background outline-none font-bold text-lg" placeholder="0" value={truckForm.domestic_5_empty} onChange={(e) => setTruckForm({...truckForm, domestic_5_empty: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-xl flex items-start gap-3 mt-4 shrink-0">
                    <ShieldCheck size={20} className="text-brand-orange-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      By verifying this manifest, your Godown capacities will automatically adjust for all logged cylinder types. This action is permanently logged to your ERP.
                    </p>
                  </div>

                  <button type="submit" disabled={submitting || !truckForm.truckNo} className="w-full py-3.5 mt-2 rounded-xl bg-brand-orange-500 text-white font-bold text-lg shadow-lg hover:bg-brand-orange-600 disabled:opacity-70 flex items-center justify-center gap-2 shrink-0">
                    {submitting ? <Loader2 className="animate-spin" size={24} /> : "Verify & Update Inventory"}
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