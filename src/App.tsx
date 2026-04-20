import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Location from "./pages/Location";
import SoldRented from "./pages/SoldRented";
import Auth from "./pages/Auth";
import PropertyDetail from "./pages/PropertyDetail";
import NotFound from "./pages/NotFound";

// Buyer dashboard
import DashboardHome from "./pages/dashboard/DashboardHome";
import MyTransactions from "./pages/dashboard/MyTransactions";
import TransactionDetail from "./pages/dashboard/TransactionDetail";
import SavedProperties from "./pages/dashboard/SavedProperties";
import Notifications from "./pages/dashboard/Notifications";
import Profile from "./pages/dashboard/Profile";

// Seller pages
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerListings from "./pages/seller/SellerListings";
import NewListing from "./pages/seller/NewListing";
import SellerTransactions from "./pages/seller/SellerTransactions";

// Partner pages
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import PartnerTransactions from "./pages/partner/PartnerTransactions";
import PartnerTransactionDetail from "./pages/partner/PartnerTransactionDetail";
import PartnerProfile from "./pages/partner/PartnerProfile";
import PartnerPayouts from "./pages/partner/PartnerPayouts";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminListings from "./pages/admin/AdminListings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminTransactions from "./pages/admin/AdminTransactions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/location" element={<Location />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/:id" element={<PropertyDetail />} />
              <Route path="/sold" element={<SoldRented />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
            </Route>

            {/* Buyer dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['buyer', 'seller', 'law_firm', 'tax_consultant', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="transactions" element={<MyTransactions />} />
              <Route path="transactions/:id" element={<TransactionDetail />} />
              <Route path="saved" element={<SavedProperties />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Seller routes */}
            <Route
              path="/seller"
              element={
                <ProtectedRoute roles={['seller', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<SellerDashboard />} />
              <Route path="listings" element={<SellerListings />} />
              <Route path="listings/new" element={<NewListing />} />
              <Route path="listings/:id/edit" element={<NewListing />} />
              <Route path="transactions" element={<SellerTransactions />} />
            </Route>

            {/* Partner routes */}
            <Route
              path="/partner"
              element={
                <ProtectedRoute roles={['law_firm', 'tax_consultant', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PartnerDashboard />} />
              <Route path="transactions" element={<PartnerTransactions />} />
              <Route path="transactions/:id" element={<PartnerTransactionDetail />} />
              <Route path="profile" element={<PartnerProfile />} />
              <Route path="payouts" element={<PartnerPayouts />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="listings" element={<AdminListings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="partners" element={<AdminPartners />} />
              <Route path="transactions" element={<AdminTransactions />} />
            </Route>

            {/* Legacy redirects */}
            <Route path="/agents" element={<Navigate to="/location" replace />} />
            <Route path="/partners" element={<Navigate to="/about" replace />} />
            <Route path="/how-it-works" element={<Navigate to="/about" replace />} />
            <Route path="/pricing" element={<Navigate to="/about" replace />} />
            <Route path="/terms" element={<Navigate to="/" replace />} />
            <Route path="/privacy" element={<Navigate to="/" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
