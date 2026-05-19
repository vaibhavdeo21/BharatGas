import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, AlertTriangle, Truck, ArrowDownToLine, 
  ArrowUpFromLine, Search, History, 
  CheckCircle2, X, Loader2, ShieldCheck, RefreshCw, Inbox
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Inventory() {
  const [stock, setStock] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [truckForm, setTruckForm] = useState({
    truckNo: "",
    domestic_14_2_full: "", domestic_14_2_empty: "",
    commercial_19_full: "", commercial_19_empty: "",
    domestic_5_full: "", domestic_5_empty: ""
  });

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

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
      await axios.post('/api/admin/inventory/truck/receive', payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Truck manifest recorded and stock updated!");
      fetchData();
      setIsTruckModalOpen(false); 
      setTruckForm({ truckNo: "", domestic_14_2_full: "", domestic_14_2_empty: "", commercial_19_full: "", commercial_19_empty: "", domestic_5_full: "", domestic_5_empty: "" }); 
      setSubmitting(false);
    } catch {
      toast.error("Failed to update inventory.");
      setSubmitting(false);
    }
  };

  const formatType = (type: string) => { if (type === 'domestic_14_2') return "14.2kg Domestic"; if (type === 'commercial_19') return "19kg Commercial"; if (type === 'domestic_5') return "5kg FTL"; return type; };
  const getCapacity = (type: string) => { if (type === 'domestic_14_2') return 1000; if (type === 'commercial_19') return 300; return 150; };
  const getColor = (type: string) => { if (type === 'domestic_14_2') return { text: "text-brand-orange-400", bar: "from-brand-orange-500 to-brand-orange-400", bg: "from-brand-orange-500/10 to-brand-orange-500/5" }; if (type === 'commercial_19') return { text: "text-blue-400", bar: "from-blue-500 to-blue-400", bg: "from-blue-500/10 to-blue-500/5" }; return { text: "text-purple-400", bar: "from-purple-500 to-purple-400", bg: "from-purple-500/10 to-purple-500/5" }; };

  return (
    <div className="p-4 lg:p-8 w-full max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Godown Inventory</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage plant shipments and live cylinder tracking.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="btn-glass flex items-center gap-2 text-sm"><RefreshCw size={14} /> Sync</button>
          <button onClick={() => setIsTruckModalOpen(true)} className="btn-primary flex items-center gap-2 text-sm !py-2.5"><Truck size={14} /> Receive Truck</button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-brand-orange-500" size={28}/></div>
      ) : (
        <>
          {/* Stock Cards */}
          {stock.length > 0 ? (
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {stock.map((s: any) => {
                const capacity = getCapacity(s.cylinder_type);
                const fillPercentage = Math.round((s.full_cylinders / capacity) * 100);
                const colors = getColor(s.cylinder_type);
                return (
                  <motion.div variants={item} key={s.id} className="glass-card rounded-2xl p-5 relative overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-40`} />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${colors.bg} ${colors.text} group-hover:scale-105 transition-transform`}>
                          <Package size={20} />
                        </div>
                        {fillPercentage < 30 && (
                          <span className="badge-warning text-[10px]"><AlertTriangle size={10} /> Low</span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">{formatType(s.cylinder_type)}</p>
                      <div className="flex items-end gap-2 mb-4">
                        <h3 className="text-3xl font-bold">{s.full_cylinders}</h3>
                        <span className="text-xs text-muted-foreground mb-1.5">/ {capacity}</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${fillPercentage}%` }} transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${colors.bar} rounded-full`} />
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className="text-[11px] text-muted-foreground">Empties: {s.empty_cylinders}</p>
                        <p className="text-[11px] text-muted-foreground">{fillPercentage}%</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl p-16 flex flex-col items-center justify-center mb-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Package size={28} className="text-muted-foreground/30" />
              </div>
              <p className="font-semibold text-foreground/60 mb-1">No inventory data</p>
              <p className="text-sm text-muted-foreground/50 max-w-xs">Receive your first plant truck to populate stock levels.</p>
            </div>
          )}

          {/* Transaction Ledger */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <History size={16} className="text-blue-400" />
              </div>
              <h3 className="font-bold text-base">Transaction Ledger</h3>
            </div>
            {transactions.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {transactions.map((trx: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${
                        trx.type?.includes('Inward') || trx.type?.includes('Return') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-brand-orange-500/10 text-brand-orange-400'
                      }`}>
                        {trx.type?.includes('Inward') || trx.type?.includes('Return') ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{trx.type}</p>
                        <p className="text-[11px] text-muted-foreground">Ref: {trx.truckNo} • {trx.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-semibold ${trx.qty?.includes('+') ? 'text-emerald-400' : 'text-brand-orange-400'}`}>{trx.qty}</span>
                      <span className="badge-success text-[10px]"><CheckCircle2 size={10} /> {trx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Inbox size={24} className="text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground/50">No transactions recorded yet.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Receive Truck Modal */}
      <AnimatePresence>
        {isTruckModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !submitting && setIsTruckModalOpen(false)} className="absolute inset-0 backdrop-blur-sm" style={{ background: 'var(--overlay-bg)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl glass-panel p-6 z-10 rounded-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div><h3 className="text-xl font-bold">Inward Plant Truck</h3><p className="text-sm text-muted-foreground">Log received cylinders and returned empties.</p></div>
                <button onClick={() => setIsTruckModalOpen(false)} className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground"><X size={16} /></button>
              </div>
                <form onSubmit={handleReceiveTruck} className="overflow-y-auto pr-2 space-y-5 pb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Vehicle Number</label>
                    <div className="relative">
                      <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={16} />
                      <input type="text" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/50 bg-muted/30 outline-none focus:ring-1 focus:ring-brand-orange-500/30 uppercase font-mono text-sm" placeholder="e.g. PB 08 AB 1234" value={truckForm.truckNo} onChange={(e) => setTruckForm({...truckForm, truckNo: e.target.value})} />
                    </div>
                  </div>
                  {[
                    { label: "14.2kg Domestic", color: "brand-orange", fullKey: "domestic_14_2_full", emptyKey: "domestic_14_2_empty" },
                    { label: "19kg Commercial", color: "blue", fullKey: "commercial_19_full", emptyKey: "commercial_19_empty" },
                    { label: "5kg FTL", color: "purple", fullKey: "domestic_5_full", emptyKey: "domestic_5_empty" },
                  ].map((section) => (
                    <div key={section.label}>
                      <h4 className={`font-semibold text-${section.color}-400 text-sm mb-2`}>{section.label}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                          <label className="block text-[11px] font-semibold text-emerald-400 mb-1.5 flex items-center gap-1.5"><ArrowDownToLine size={12}/> Received</label>
                          <input type="number" min="0" className="w-full px-3 py-2 rounded-lg border border-border/50 bg-muted/30 outline-none font-bold text-sm" placeholder="0" value={(truckForm as any)[section.fullKey]} onChange={(e) => setTruckForm({...truckForm, [section.fullKey]: e.target.value})} />
                        </div>
                        <div className="bg-muted/30 border border-border/30 p-3 rounded-xl">
                          <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5"><ArrowUpFromLine size={12}/> Empties</label>
                          <input type="number" min="0" className="w-full px-3 py-2 rounded-lg border border-border/50 bg-muted/30 outline-none font-bold text-sm" placeholder="0" value={(truckForm as any)[section.emptyKey]} onChange={(e) => setTruckForm({...truckForm, [section.emptyKey]: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="submit" disabled={submitting || !truckForm.truckNo} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : "Verify & Update Inventory"}
                  </button>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}