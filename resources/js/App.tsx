import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import NotFound from "./pages/public/NotFound";

// App Pages
import CustomerDashboard from "./pages/customer/Dashboard";
import BookCylinder from "./pages/customer/BookCylinder";
import TrackDelivery from "./pages/customer/TrackDelivery";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInventory from "./pages/admin/Inventory";
import AdminLogistics from "./pages/admin/Logistics";
import AdminSettings from "./pages/admin/Settings";
import StaffManagement from "./pages/admin/Staff";
import Bookings from "./pages/admin/Bookings";
import AdminCustomers from "./pages/admin/Customers";

// Temporary Placeholder Component for unfinished pages
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[60vh] p-8 text-center">
    <div className="w-20 h-20 bg-brand-orange-500/10 rounded-full flex items-center justify-center mb-6">
      <svg className="w-10 h-10 text-brand-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    </div>
    <h2 className="text-3xl font-bold mb-2 text-foreground">{title}</h2>
    <p className="text-muted-foreground max-w-md">This enterprise module is currently under construction and will be wired to the Laravel API shortly.</p>
  </div>
);

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="bharatgas-theme">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          
          <Route path="/login" element={<Login />} />

          {/* Secure Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            
            {/* Customer Routes */}
            <Route path="customer" element={<CustomerDashboard />} />
            <Route path="customer/book" element={<BookCylinder />} />
            <Route path="customer/track" element={<TrackDelivery />} />
            <Route path="customer/history" element={<ComingSoon title="Order History" />} />
            <Route path="customer/support" element={<ComingSoon title="Support Tickets" />} />
            <Route path="customer/safety" element={<ComingSoon title="Safety Guidelines" />} />
            <Route path="customer/settings" element={<ComingSoon title="Account Settings" />} />

            {/* Admin Routes */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/bookings" element={<Bookings />} />
            <Route path="admin/customers" element={<AdminCustomers />} />
            <Route path="admin/inventory" element={<AdminInventory />} />
            <Route path="admin/logistics" element={<AdminLogistics />} />
            <Route path="admin/settings" element={<AdminSettings />} />
            <Route path="admin/staff" element={<StaffManagement />} />
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}