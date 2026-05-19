import { Outlet, Link } from "react-router-dom";
import { useTheme } from "../components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sun, Moon, Menu, X, ChevronRight, PhoneCall, MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function PublicLayout() {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about" },
    { name: "Services", href: "/#services" },
    { name: "Safety", href: "/#safety" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-96 bg-brand-orange-500/10 dark:bg-brand-orange-900/20 blur-[100px] rounded-full translate-y-[-50%]"></div>
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-cyan-500/10 dark:bg-brand-cyan-900/20 blur-[100px] rounded-full translate-x-[-50%]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-blue-500/10 dark:bg-brand-blue-900/20 blur-[120px] rounded-full translate-x-[20%] translate-y-[20%]"></div>
      </div>

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border py-3 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange-400 to-brand-orange-600 flex items-center justify-center text-white shadow-lg shadow-brand-orange-500/30 group-hover:scale-105 transition-transform">
                <Flame size={24} className="fill-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg md:text-xl leading-none tracking-tight text-foreground">Amrutha</h1>
                <p className="text-xs text-brand-orange-500 font-bold tracking-wider uppercase">BharatGas</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex flex-1 justify-center relative z-20">
              <div className="flex items-center gap-1 bg-card/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-sm">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-brand-orange-500 rounded-full hover:bg-muted transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:ring-offset-2 transition-transform hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-background/20" />
                </div>
                <span>Portal Login</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-4">
               <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -mr-2 text-foreground hover:bg-muted rounded-md"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 w-full pt-20">
        <Outlet />
      </main>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-20 bg-background/50 relative overflow-hidden z-10 border-t border-border">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange-500/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Visit Our Agency</h2>
            <p className="text-lg text-muted-foreground">We are dedicated to providing reliable LPG services. Visit our godown or contact us for support.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-6">Amrutha BharatGas <br/><span className="text-brand-orange-500 text-lg">Gramin Vitrak</span></h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange-500/10 text-brand-orange-500 flex items-center justify-center shrink-0 mt-1"><MapPin size={20} /></div>
                    <div>
                      <p className="font-bold text-foreground">Agency Office & Godown</p>
                      <p className="text-muted-foreground leading-relaxed mt-1">Kathar Kalan, Sagma, Garhwa, Jharkhand - 822121</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange-500/10 text-brand-orange-500 flex items-center justify-center shrink-0"><Phone size={20} /></div>
                    <div>
                      <p className="font-bold text-foreground">Phone / Support</p>
                      <p className="text-muted-foreground mt-0.5">+91 99999 99999</p> 
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-6 border-t border-border">
                <a href="https://share.google/VABGEulXhqdVdP49J" target="_blank" className="w-full py-3.5 rounded-xl bg-brand-orange-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-brand-orange-600 transition-all">Get Directions <ArrowRight size={18} /></a>
              </div>
            </div>
            <div className="lg:col-span-7 bg-muted rounded-3xl overflow-hidden border border-border min-h-[400px] shadow-sm">
              <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src="https://maps.google.com/maps?q=Kathar%20Kalan,%20Sagma,%20Garhwa,%20Jharkhand&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEMANTIC FOOTER --- */}
      <footer className="relative z-10 bg-card border-t border-border pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange-400 to-brand-orange-600 flex items-center justify-center text-white"><Flame size={28} /></div>
                 <div>
                   <h1 className="font-bold text-2xl text-foreground">Amrutha</h1>
                   <p className="text-sm text-brand-orange-500 font-bold tracking-wider uppercase">BharatGas</p>
                 </div>
              </Link>
              <p className="text-muted-foreground max-w-md text-lg">Empowering rural and urban households with clean, reliable energy solutions.</p>
              <div className="mt-8 flex gap-4">
                {['fb', 'ig', 'x'].map((social) => (
                    <div key={social} className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-brand-orange-500 hover:text-white transition-colors cursor-pointer text-foreground font-bold">
                      {social}
                    </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6 text-foreground">Quick Links</h3>
              <ul className="space-y-4">
                {['Book Cylinder', 'New Connection', 'Check Status', 'Safety Tips'].map(item => (
                  <li key={item}><a href="#" className="text-muted-foreground hover:text-brand-orange-500 transition-colors flex items-center gap-2"><ChevronRight size={14} /> {item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6 text-foreground">Emergency</h3>
              <div className="p-4 rounded-2xl bg-muted border border-border mb-4">
                <p className="text-muted-foreground text-sm mb-2">Leakage or Fire?</p>
                <div className="flex items-center gap-3 text-brand-orange-500 font-bold text-xl"><PhoneCall size={24} /> 1906</div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Amrutha BharatGas. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}