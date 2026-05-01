import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import Index from "./pages/Index";
import RealEstatePage from "./pages/RealEstate";
import CarsPage from "./pages/Cars";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

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
                <Route path="/" element={<Index />} />
                {/* Marketplace Routes */}
                <Route path="/real-estate" element={<RealEstatePage />} />
                <Route path="/cars" element={<CarsPage />} />
                <Route path="/search" element={<div>Unified Search</div>} />
                <Route path="/dashboard" element={<div>Dashboard</div>} />
                <Route path="/auth" element={<Auth />} />
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
