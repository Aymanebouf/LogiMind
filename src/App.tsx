import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { SidebarProvider } from "@/components/ui/SidebarProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import SupabaseProvider from "@/providers/SupabaseProvider"; // ✅ import du provider

import "@/lib/i18n";

import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Previsions from "./pages/Previsions";
import CarteLogistique from "./pages/CarteLogistique";
import RapportIA from "./pages/RapportIA";
import Profil from "./pages/Profil";
import Parametres from "./pages/Parametres";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { RequireAuth } from "@/components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseProvider> {/* ✅ toute l'app est dans SupabaseProvider */}
      <AuthProvider>
        <SettingsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SidebarProvider>
                <Routes>
                  {/* Route de connexion sans protection */}
                  <Route path="/login" element={<Login />} />

                  {/* Routes principales protégées */}
                  <Route
                    path="/"
                    element={
                      <RequireAuth>
                        <Layout />
                      </RequireAuth>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="previsions" element={<Previsions />} />
                    <Route path="carte" element={<CarteLogistique />} />
                    <Route path="rapport" element={<RapportIA />} />
                    <Route path="profil" element={<Profil />} />
                    <Route path="parametres" element={<Parametres />} />
                  </Route>

                  {/* Route 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SidebarProvider>
            </BrowserRouter>
          </TooltipProvider>
        </SettingsProvider>
      </AuthProvider>
    </SupabaseProvider>
  </QueryClientProvider>
);

export default App;
