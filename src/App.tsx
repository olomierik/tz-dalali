import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";

// Public pages
import Index from "./pages/Index";
import RealEstatePage from "./pages/RealEstate";
import CarsPage from "./pages/Cars";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AISearch from "./pages/AISearch";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

// Dashboard pages
import BuyerDashboard from "./pages/dashboard/BuyerDashboard";
import BuyerDashboardPage from "./pages/dashboard/BuyerDashboardPage";
import SellerDashboardPage from "./pages/dashboard/SellerDashboardPage";
import SavedPropertiesPage from "./pages/dashboard/SavedPropertiesPage";
import TransactionsPage from "./pages/dashboard/TransactionsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Role-based redirect after login
function AuthRedirect() {
  const { user, role } = useAuthContext();
  
  if (user) {
    if (role === 'seller') {
      return <Navigate to="/seller" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return <AuthPage />;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <ComparisonProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/real-estate" element={<RealEstatePage />} />
                <Route path="/cars" element={<CarsPage />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/listings/:id" element={<PropertyDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/ai-search" element={<AISearch />} />
                
                {/* Auth routes */}
                <Route path="/auth" element={<AuthRedirect />} />
                
                {/* Protected dashboard routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }>
                  <Route index element={<BuyerDashboardPage />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                  <Route path="saved" element={<SavedPropertiesPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
                
                {/* Seller dashboard */}
                <Route path="/seller" element={
                  <ProtectedRoute>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }>
                  <Route index element={<SellerDashboardPage />} />
                  <Route path="listings" element={<SavedPropertiesPage />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ComparisonProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;