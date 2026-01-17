import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/layouts/AppLayout";
import Index from "./pages/Index";
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
                <Route path="/" element={<Index />} />
                <Route path="/work-orders" element={<PlaceholderPage />} />
                <Route path="/inventory" element={<PlaceholderPage />} />
                <Route path="/test-bench" element={<PlaceholderPage />} />
                <Route path="/test-results" element={<PlaceholderPage />} />
                <Route path="/qa-review" element={<PlaceholderPage />} />
                <Route path="/spares-aging" element={<PlaceholderPage />} />
                <Route path="/packaging" element={<PlaceholderPage />} />
                <Route path="/shipping" element={<PlaceholderPage />} />
                <Route path="/maintenance" element={<PlaceholderPage />} />
                <Route path="/reports" element={<PlaceholderPage />} />
                <Route path="/users" element={<PlaceholderPage />} />
                <Route path="/settings" element={<PlaceholderPage />} />
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
