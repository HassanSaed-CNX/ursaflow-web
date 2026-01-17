import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/layouts/AppLayout";

// Pages
import { ControlTower } from "./pages/ControlTower";
import { WorkOrders } from "./pages/WorkOrders";
import { Kitting } from "./pages/Kitting";
import { Assembly } from "./pages/Assembly";
import { InProcessQC } from "./pages/InProcessQC";
import { TestBench } from "./pages/TestBench";
import { FinalQC } from "./pages/FinalQC";
import { Serialization } from "./pages/Serialization";
import { PackingHandover } from "./pages/PackingHandover";
import { Notifications } from "./pages/Notifications";
import { NcrCapa } from "./pages/NcrCapa";
import { Admin } from "./pages/Admin";
import { ThemeGuide } from "./pages/ThemeGuide";
import { SparesAging } from "./pages/SparesAging";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout>
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<ControlTower />} />
                <Route path="/work-orders" element={<WorkOrders />} />
                <Route path="/kitting" element={<Kitting />} />
                <Route path="/assembly" element={<Assembly />} />
                <Route path="/in-process-qc" element={<InProcessQC />} />
                <Route path="/test-bench" element={<TestBench />} />
                <Route path="/final-qc" element={<FinalQC />} />
                <Route path="/serialization" element={<Serialization />} />
                <Route path="/packing-handover" element={<PackingHandover />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/ncr-capa" element={<NcrCapa />} />
                <Route path="/spares-aging" element={<SparesAging />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/theme-guide" element={<ThemeGuide />} />
                
                {/* Placeholder Routes */}
                <Route path="/reports" element={<PlaceholderPage />} />
                <Route path="/users" element={<PlaceholderPage />} />
                <Route path="/settings" element={<PlaceholderPage />} />
                <Route path="/inventory" element={<PlaceholderPage />} />
                <Route path="/maintenance" element={<PlaceholderPage />} />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;