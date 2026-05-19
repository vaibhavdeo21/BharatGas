import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeProvider";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  User,
  LogOut,
  Moon,
  Sun,
  Flame,
  ClipboardList,
  Users,
  IndianRupee,
  ChevronRight
} from "lucide-react";
import axios from "axios";

export default function DashboardLayout() {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamic user info from localStorage
  const [userData, setUserData] = useState<any>(null);
  useEffect(() => {
    const stored = localStorage.getItem('user_data');
    if (stored) setUserData(JSON.parse(stored));
  }, []);

  const role = location.pathname.includes("/admin") ? "admin" : location.pathname.includes("/delivery") ? "delivery" : "customer";
  const userName = userData?.name || (role === "admin" ? "Admin" : role === "delivery" ? "Driver" : "Customer");

  const customerLinks = [
    { name: "Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
    { name: "Book Cylinder", href: "/dashboard/customer/book", icon: Flame },
    { name: "Track Delivery", href: "/dashboard/customer/track", icon: MapPin },
    { name: "Order History", href: "/dashboard/customer/history", icon: ClipboardList },
    { name: "Settings", href: "/dashboard/customer/settings", icon: Settings },
  ];

  const adminLinks = [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Bookings", href: "/dashboard/admin/bookings", icon: ClipboardList },
    { name: "Customers", href: "/dashboard/admin/customers", icon: User },
    { name: "Inventory", href: "/dashboard/admin/inventory", icon: Package },
    { name: "Logistics", href: "/dashboard/admin/logistics", icon: MapPin },
    { name: "Accounting", href: "/dashboard/admin/accounting", icon: IndianRupee },
    { name: "Team & Staff", href: "/dashboard/admin/staff", icon: Users },
    { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ];

  const deliveryLinks = [
    { name: "Today's Route", href: "/dashboard/delivery", icon: MapPin },
    { name: "History", href: "/dashboard/delivery/history", icon: ClipboardList },
    { name: "Earnings", href: "/dashboard/delivery/earnings", icon: IndianRupee },
    { name: "Settings", href: "/dashboard/delivery/settings", icon: Settings },
  ];

  const links = role === "admin" ? adminLinks : role === "delivery" ? deliveryLinks : customerLinks;

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post('/api/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {}
    localStorage.clear();
    navigate("/login");
  };

  // Get current page name for breadcrumb
  const currentPage = links.find(l => l.href === location.pathname)?.name || "Dashboard";

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border/50 shrink-0 justify-between">
        <Link to="/" className="flex items-center gap-3 overflow-hidden whitespace-nowrap group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange-400 to-brand-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-brand-orange-500/20 group-hover:shadow-brand-orange-500/40 transition-shadow">
            <Flame size={18} className="fill-white text-white" />
          </div>
          {(sidebarOpen || isMobile) && (
            <div>
              <span className="font-bold text-base tracking-tight block leading-none">Amrutha</span>
              <span className="text-[10px] text-brand-orange-500 font-bold uppercase tracking-widest">BharatGas</span>
            </div>
          )}
        </Link>
        {!isMobile && (
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-muted/80 text-muted-foreground hidden lg:flex items-center justify-center transition-colors"
          >
            <Menu size={18} />
          </button>
        )}
        {isMobile && (
          <button onClick={() => setMobileSidebarOpen(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5">
        {(sidebarOpen || isMobile) && (
          <div className="px-3 mb-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em]">
            {role === "admin" ? "Management" : "Services"}
          </div>
        )}

        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.name}
              to={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? "bg-brand-orange-500/10 text-brand-orange-500" 
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
              title={!sidebarOpen && !isMobile ? link.name : undefined}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-orange-500 rounded-r-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon size={18} className={`shrink-0 ${isActive ? "text-brand-orange-500" : "group-hover:text-foreground"}`} />
              {(sidebarOpen || isMobile) && (
                <span className="font-medium text-sm whitespace-nowrap">{link.name}</span>
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Bottom Actions */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full ${!(sidebarOpen || isMobile) && "justify-center"}`}
        >
          <LogOut size={18} />
          {(sidebarOpen || isMobile) && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className="hidden lg:flex flex-col border-r border-border bg-card z-20 h-screen sticky top-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 lg:hidden" style={{ background: 'var(--overlay-bg)', backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 flex flex-col shadow-2xl lg:hidden"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-muted lg:hidden text-muted-foreground"
            >
              <Menu size={18} />
            </button>
            
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground/50 font-medium">{role === "admin" ? "Admin" : "Customer"}</span>
              <ChevronRight size={12} className="text-muted-foreground/30" />
              <span className="font-semibold text-foreground">{currentPage}</span>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center relative ml-4">
              <Search className="absolute left-3 text-muted-foreground/50" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-muted/40 border border-border/50 rounded-lg w-48 text-sm outline-none transition-all focus:ring-1 focus:ring-brand-orange-500/30 focus:border-brand-orange-500/30 focus:w-64 placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground relative">
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-orange-500 rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-border/50 mx-1.5"></div>
            <div className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-orange-400 to-brand-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-none">{userName}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-none capitalize">{userData?.role || role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto w-full bg-gradient-mesh">
           <Outlet />
        </div>
      </main>
    </div>
  );
}