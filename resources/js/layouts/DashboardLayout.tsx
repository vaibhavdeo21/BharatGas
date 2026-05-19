import { Link, Outlet, useLocation } from "react-router-dom";
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
  ShieldAlert,
  ClipboardList,
  History,
  Users // <-- Added the Users icon here
} from "lucide-react";

export default function DashboardLayout() {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine user role roughly based on path for mock purposes
  const role = location.pathname.includes("/admin") ? "admin" : "customer";

  const customerLinks = [
    { name: "My Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
    { name: "Book Cylinder", href: "/dashboard/customer/book", icon: Flame },
    { name: "Track Delivery", href: "/dashboard/customer/track", icon: MapPin },
    { name: "Order History", href: "/dashboard/customer/history", icon: History },
    { name: "Support Tickets", href: "/dashboard/customer/support", icon: ClipboardList },
    { name: "Safety Info", href: "/dashboard/customer/safety", icon: ShieldAlert },
    { name: "Settings", href: "/dashboard/customer/settings", icon: Settings },
  ];

  const adminLinks = [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Bookings", href: "/dashboard/admin/bookings", icon: ClipboardList },
    { name: "Inventory", href: "/dashboard/admin/inventory", icon: Package },
    { name: "Logistics", href: "/dashboard/admin/logistics", icon: MapPin },
    { name: "Team & Staff", href: "/dashboard/admin/staff", icon: Users }, // <-- Added your new Staff Page link here
    { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ];

  const links = role === "admin" ? adminLinks : customerLinks;

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-muted/30 flex font-sans">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden lg:flex flex-col border-r bg-card z-20 h-screen sticky top-0"
      >
        <div className="h-16 flex items-center px-4 border-b shrink-0 justify-between">
          <Link to="/" className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange-400 to-brand-orange-600 flex items-center justify-center shrink-0">
              <Flame size={18} className="fill-white text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg tracking-tight">Amrutha Gas</span>
            )}
          </Link>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hidden lg:block"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {sidebarOpen && (
             <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
               {role === "admin" ? "Management" : "Consumer Services"}
             </div>
          )}
          

          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-brand-orange-500 text-white shadow-md shadow-brand-orange-500/20" 
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
                title={!sidebarOpen ? link.name : undefined}
              >
                <Icon size={20} className={`shrink-0 ${isActive ? "" : "group-hover:text-brand-orange-500"}`} />
                {sidebarOpen && <span className="font-medium whitespace-nowrap">{link.name}</span>}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t">
          <Link to="/login" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors ${!sidebarOpen && "justify-center"}`}>
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </Link>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-72 bg-card border-r z-50 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="h-16 flex items-center px-4 border-b justify-between shrink-0">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange-400 to-brand-orange-600 flex items-center justify-center">
                    <Flame size={18} className="fill-white text-white" />
                  </div>
                  <span className="font-bold text-lg">Amrutha Gas</span>
                </Link>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-2 rounded-md hover:bg-muted">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        location.pathname === link.href 
                          ? "bg-brand-orange-500 text-white shadow-md shadow-brand-orange-500/20" 
                          : "text-foreground/70 hover:bg-muted"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="p-4 border-t">
                <Link to="/login" className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-md hover:bg-muted lg:hidden"
            >
              <Menu size={20} />
            </button>
            
            {/* Search */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 text-muted-foreground" size={18} />
              <input 
                type="text" 
                placeholder="Search bookings, invoices..." 
                className="pl-10 pr-4 py-2 bg-muted/50 border-transparent focus:bg-background focus:border-brand-orange-500 rounded-full w-64 text-sm outline-none transition-all focus:ring-2 focus:ring-brand-orange-500/20 focus:w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-orange-500 rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-border mx-1"></div>
            <button className="flex items-center gap-3 pl-2 sm:pl-0 sm:pr-2 rounded-full hover:bg-muted transition-colors py-1">
              <div className="w-8 h-8 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900 border border-brand-blue-200 dark:border-brand-blue-800 flex items-center justify-center text-brand-blue-600 dark:text-brand-blue-300">
                <User size={16} />
              </div>
              <div className="hidden sm:block text-left mr-2">
                <p className="text-sm font-medium leading-none">{role === "admin" ? "Admin User" : "Sumit Sharma"}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-none">{role === "admin" ? "Manager" : "Consumer No: 7098231"}</p>
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto w-full">
           <Outlet />
        </div>
      </main>
    </div>
  );
}