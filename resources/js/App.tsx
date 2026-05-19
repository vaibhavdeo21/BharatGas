import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import NotFound from "./pages/public/NotFound";

// Customer Pages
import CustomerDashboard from "./pages/customer/Dashboard";
import BookCylinder from "./pages/customer/BookCylinder";
import TrackDelivery from "./pages/customer/TrackDelivery";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInventory from "./pages/admin/Inventory";
import AdminLogistics from "./pages/admin/Logistics";
import AdminSettings from "./pages/admin/Settings";
import StaffManagement from "./pages/admin/Staff";
import Bookings from "./pages/admin/Bookings";
import AdminCustomers from "./pages/admin/Customers";
import Accounting from "./pages/admin/Accounting";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="bharatgas-theme">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          
          <Route path="/login" element={<Login />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Customer */}
            <Route path="customer" element={<CustomerDashboard />} />
            <Route path="customer/book" element={<BookCylinder />} />
            <Route path="customer/track" element={<TrackDelivery />} />

            {/* Admin */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/bookings" element={<Bookings />} />
            <Route path="admin/customers" element={<AdminCustomers />} />
            <Route path="admin/inventory" element={<AdminInventory />} />
            <Route path="admin/logistics" element={<AdminLogistics />} />
            <Route path="admin/accounting" element={<Accounting />} />
            <Route path="admin/staff" element={<StaffManagement />} />
            <Route path="admin/settings" element={<AdminSettings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}