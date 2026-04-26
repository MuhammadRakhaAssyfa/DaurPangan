import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import { ProviderLayout } from "@/components/layouts/ProviderLayout";
import { RecipientLayout } from "@/components/layouts/RecipientLayout";
import ProviderDashboard from "./pages/ProviderDashboard.tsx";
import ProviderListings from "./pages/provider/ProviderListings.tsx";
import ProviderMarketplace from "./pages/provider/ProviderMarketplace.tsx";
import ProviderHistory from "./pages/provider/ProviderHistory.tsx";
import ProviderProfile from "./pages/provider/ProviderProfile.tsx";
import RecipientHome from "./pages/recipient/RecipientHome.tsx";
import RecipientHistory from "./pages/recipient/RecipientHistory.tsx";
import RecipientNotifications from "./pages/recipient/RecipientNotifications.tsx";
import RecipientProfile from "./pages/recipient/RecipientProfile.tsx";
import ProviderPublicProfile from "./pages/recipient/ProviderPublicProfile.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Public provider profile — accessible to recipients & guests.
                Declared BEFORE the /provider ProviderLayout so the more
                specific path wins and is not hijacked by the auth guard. */}
            <Route path="/provider/:id/profile" element={<ProviderPublicProfile />} />

            {/* Provider app — guarded inside layout */}
            <Route path="/provider" element={<ProviderLayout />}>
              <Route index element={<Navigate to="/provider/dashboard" replace />} />
              <Route path="dashboard" element={<ProviderDashboard />} />
              <Route path="listings" element={<ProviderListings />} />
              <Route path="marketplace" element={<ProviderMarketplace />} />
              <Route path="history" element={<ProviderHistory />} />
              <Route path="profile" element={<ProviderProfile />} />
            </Route>

            {/* Recipient app — guarded inside layout */}
            <Route path="/recipient" element={<RecipientLayout />}>
              <Route index element={<RecipientHome />} />
              <Route path="history" element={<RecipientHistory />} />
              <Route path="notifications" element={<RecipientNotifications />} />
              <Route path="profile" element={<RecipientProfile />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
