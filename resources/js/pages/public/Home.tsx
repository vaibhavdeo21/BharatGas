import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Flame, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Star,
  ChevronRight,
  Award,
  User,
  Phone,
  Info,
  AlertTriangle
} from "lucide-react";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.2 }
  };

  const childFadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange-500/10 border border-brand-orange-500/20 text-brand-orange-600 dark:text-brand-orange-400 font-semibold text-sm mb-6 shadow-[0_0_20px_rgba(247,91,17,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange-500"></span>
                </span>
                #1 Rated BharatGas Distributor
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-foreground">
                Energy that fuels <br />
                <span className="text-brand-orange-500">your life.</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                Amrutha BharatGas Gramin Vitrak provides lightning-fast LPG delivery, smart tracking, and 24/7 premium support for the modern household.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-semibold shadow-lg shadow-brand-orange-500/30 transition-all hover:scale-105 active:scale-95 text-lg">
                  Book Cylinder
                  <Flame size={20} className="fill-white/20" />
                </Link>
                <Link to="/login" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-card border border-border hover:bg-muted text-foreground font-semibold transition-all hover:scale-105 active:scale-95 text-lg">
                  Track Delivery
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6 text-sm font-medium text-muted-foreground">
                  <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                     </div>
                   ))}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-yellow-500">
                      {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-current" />)}
                    </div>
                    <span>Trusted by 50,000+ families</span>
                  </div>
              </div>
            </motion.div>

            {/* Hero Image / Illustration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                 <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange-600 to-brand-orange-300 rounded-[3rem] rotate-12 blur-3xl opacity-30 animate-pulse"></div>
                 <div className="absolute inset-0 bg-card border border-border rounded-[3rem] shadow-xl overflow-hidden flex flex-col p-8 rotate-3 transition-transform hover:rotate-0 duration-500">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-brand-orange-500/10 flex items-center justify-center">
                            <Flame className="text-brand-orange-500" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">BharatGas Select</p>
                            <p className="text-xs text-muted-foreground">Premium Service</p>
                          </div>
                       </div>
                       <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold border border-green-500/20">Active</div>
                    </div>
                    
                    <div className="flex-1 bg-muted rounded-2xl border border-border p-6 flex flex-col justify-center items-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                       <motion.div 
                         animate={{ y: [-5, 5, -5] }}
                         transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                         className="relative z-10 w-24 h-40 bg-gradient-to-b from-red-500 to-red-700 rounded-[2rem] shadow-2xl flex flex-col items-center pt-2"
                       >
                         <div className="w-12 h-6 border-4 border-red-800 rounded-t-xl mb-1"></div>
                         <div className="w-full text-center text-white/50 text-[10px] uppercase font-bold tracking-widest mt-auto mb-4 font-mono">LPG</div>
                       </motion.div>
                    </div>

                    <div className="mt-8 flex justify-between items-end">
                       <div>
                         <p className="text-sm text-muted-foreground mb-1">Status</p>
                         <p className="font-bold text-lg text-foreground">En Route</p>
                       </div>
                       <div className="text-right">
                         <p className="text-sm text-muted-foreground mb-1">ETA</p>
                         <p className="font-bold text-lg text-brand-orange-500">14 Mins</p>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div {...fadeInUp}>
                    <h2 className="text-brand-orange-500 font-bold uppercase tracking-widest text-sm mb-3">About Us</h2>
                    <h3 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Serving Garhwa with dedication since 2010.</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        Amrutha BharatGas Gramin Vitrak is more than just a gas agency. We are a team committed to providing reliable, safe, and efficient energy solutions to thousands of households in the Jharkhand region. Our mission is to ensure that no home in our network ever runs out of fuel.
                    </p>
                    <div className="flex gap-4">
                        <div className="p-4 border-l-4 border-brand-orange-500 bg-background rounded-r-xl">
                            <p className="font-bold text-foreground">50,000+ Happy Customers</p>
                        </div>
                    </div>
                </motion.div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-3xl bg-card border p-8 flex flex-col gap-4">
                        <Award className="text-brand-orange-500" size={32} />
                        <h4 className="font-bold text-foreground">Certified Agency</h4>
                    </div>
                    <div className="rounded-3xl bg-card border p-8 flex flex-col gap-4 mt-8">
                        <Flame className="text-brand-orange-500" size={32} />
                        <h4 className="font-bold text-foreground">Authorized Distributor</h4>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div {...fadeInUp} className="mb-16">
                <ShieldCheck size={48} className="mx-auto text-brand-orange-500 mb-6" />
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Your Safety is Our Priority</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Follow these guidelines to ensure a safe home environment. We perform strict quality checks on every cylinder delivered.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Ventilation", desc: "Always keep your kitchen well-ventilated to prevent gas accumulation.", icon: Flame },
                    { title: "Regulator Off", desc: "Turn off the regulator knob when the stove is not in use, especially at night.", icon: Clock },
                    { title: "Check Leakage", desc: "Perform a soap-water test on hose pipes regularly. If you smell gas, don't light matches.", icon: AlertTriangle }
                ].map((tip, i) => (
                    <motion.div key={i} className="p-8 rounded-3xl bg-card border border-border shadow-sm">
                        <tip.icon className="mx-auto text-brand-orange-500 mb-4" size={40} />
                        <h4 className="font-bold text-xl mb-2 text-foreground">{tip.title}</h4>
                        <p className="text-muted-foreground">{tip.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border"
            >
              {[
                { label: "Active Customers", value: "50K+" },
                { label: "Daily Deliveries", value: "1,200+" },
                { label: "Avg. Delivery Time", value: "< 24 Hrs" },
                { label: "Safety Rating", value: "4.9/5" },
              ].map((stat, i) => (
                <motion.div variants={childFadeInUp} key={i} className={`text-center ${i===0 ? 'pl-0' : ''}`}>
                  <h3 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">{stat.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
        </div>
      </section>

      {/* Services Showcase */}
      <section id="services" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-brand-orange-500 font-bold uppercase tracking-widest text-sm mb-3">Our Logistics Console</h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Designed for speed. <br/>Built for scale.</h3>
              <p className="text-lg text-muted-foreground">Experience the next generation of LPG delivery management. Real-time tracking, seamless booking, and absolute transparency.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "1-Click Booking", desc: "Order your refill with a single tap. Our system automatically processes and queues your request instantly." },
                { icon: MapPin, title: "Live Tracking", desc: "Watch your delivery agent arrive in real-time on our interactive map. No more guessing when your cylinder will arrive." },
                { icon: ShieldCheck, title: "Digital Safety Checks", desc: "Every cylinder undergoes a strict multi-point digital inspection before leaving our warehouse." },
                { icon: Clock, title: "Predictive Ordering", desc: "Our AI learns your usage patterns and reminds you exactly when you need to order next to avoid running out." },
                { icon: TrendingUp, title: "Subsidy Tracking", desc: "Monitor your government subsidy deposits directly within the app. Full financial transparency." },
                { icon: Award, title: "Premium Support", desc: "24/7 dedicated customer success team ready to assist with emergencies, address changes, or queries." },
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-foreground mb-6">
                     <feature.icon size={28} />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* App Promo */}
      <section className="py-24 bg-card relative overflow-hidden border-y border-border">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Your personal energy logistics hub.</h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  We've completely reimagined what a gas agency portal should look like. Manage connections, track deliveries, and view invoices in our beautiful, dark-mode ready dashboard.
                </p>
                <ul className="space-y-4 mb-10">
                  {['Real-time delivery ETA', 'Automated billing & GST invoices', 'Multi-connection management', 'Secure UPI/Card payments'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-orange-500/20 flex items-center justify-center text-brand-orange-500">
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="font-medium text-lg text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/login" className="inline-flex items-center gap-2 text-brand-orange-500 font-bold hover:text-brand-orange-600 transition-colors text-lg">
                  Explore the Dashboard <ChevronRight size={20} />
                </Link>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 50, rotateY: -10 }}
               whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
               transition={{ duration: 1, type: "spring" }}
               viewport={{ once: true }}
               className="perspective-1000"
             >
               <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                   <div className="h-12 border-b border-border flex items-center px-4 gap-2 bg-muted">
                     <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                     <div className="mx-auto w-48 h-6 bg-background rounded-md flex items-center justify-center text-[10px] text-muted-foreground font-mono">dashboard.amruthagas.in</div>
                   </div>
                   <div className="p-6 grid grid-cols-3 gap-6 bg-muted/20">
                      <div className="col-span-1 space-y-4">
                         <div className="h-8 w-24 bg-card rounded-lg border border-border"></div>
                         <div className="space-y-2 mt-8">
                           {[1,2,3,4,5].map(i => <div key={i} className={`h-10 rounded-lg ${i===2 ? 'bg-brand-orange-500/20' : 'bg-card border'}`}></div>)}
                         </div>
                      </div>
                      <div className="col-span-2 space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                           <div className="h-24 bg-card rounded-xl border border-border p-4 flex flex-col justify-between">
                             <div className="w-8 h-8 rounded-full bg-blue-500/10"></div>
                             <div className="h-4 w-1/2 bg-muted rounded"></div>
                           </div>
                           <div className="h-24 bg-card rounded-xl border border-border p-4 flex flex-col justify-between">
                             <div className="w-8 h-8 rounded-full bg-brand-orange-500/10"></div>
                             <div className="h-4 w-2/3 bg-brand-orange-100 rounded"></div>
                           </div>
                         </div>
                         <div className="h-48 bg-card rounded-xl border border-border p-4 relative overflow-hidden">
                           <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-orange-500/10 to-transparent"></div>
                           <svg className="w-full h-full text-brand-orange-500/30" viewBox="0 0 100 50" preserveAspectRatio="none">
                             <path d="M0,50 L0,30 Q20,40 40,20 T80,10 L100,20 L100,50 Z" fill="currentColor"></path>
                             <path d="M0,30 Q20,40 40,20 T80,10 L100,20" fill="none" stroke="currentColor" strokeWidth="2"></path>
                           </svg>
                         </div>
                      </div>
                   </div>
               </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative text-center px-4">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-foreground">Ready to experience <br/>the future of LPG?</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">Join over 50,000 satisfied households today. Contact our agency or your local delivery staff to link your consumer number.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/login" className="px-10 py-5 rounded-full bg-foreground text-background font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
                Secure Portal Login
              </Link>
              <button className="px-10 py-5 rounded-full border border-border text-foreground font-bold text-lg hover:bg-muted transition-colors">
                Contact Agency
              </button>
            </div>
         </div>
      </section>
    </div>
  );
}