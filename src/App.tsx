/**
 * App.tsx
 * --------
 * Root component that sets up routing for all Kwendi screens.
 * Uses AnimatePresence from framer-motion for smooth page transitions.
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AcessibilidadeProvider } from "@/contexts/AcessibilidadeContext";
import { PremiumProvider } from "@/contexts/PremiumContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useBackendSync } from "@/hooks/useBackendSync";

/* Screen imports */
import SplashScreen from "./screens/SplashScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import ApresentationScreen from "./screens/ApresentationScreen";
import FeaturesScreen from "./screens/FeaturesScreen";
import FronteirasIntroScreen from "./screens/FronteirasIntroScreen";
import FronteirasScreen from "./screens/FronteirasScreen";
import FronteirasJogoScreen from "./screens/FronteirasJogoScreen";
import SignupFlow from "./screens/SignupFlow";
import LoginScreen from "./screens/LoginScreen";
import StealthModeScreen from "./screens/StealthModeScreen";
import HomeScreen from "./screens/HomeScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import VerifyOtpScreen from "./screens/VerifyOtpScreen";
import ProcessingResultsScreen from "./screens/ProcessingResultsScreen";
import NivelamentoScreen from "./screens/NivelamentoScreen";
import LessonScreen from "./screens/LessonScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MissoesScreen from "./screens/MissoesScreen";
import HistoriasScreen from "./screens/HistoriasScreen";
import HistoriaDetalheScreen from "./screens/HistoriaDetalheScreen";
import HistoriaLeituraScreen from "./screens/HistoriaLeituraScreen";
import HistoriaFimScreen from "./screens/HistoriaFimScreen";
import CuriosidadesScreen from "./screens/CuriosidadesScreen";
import SecaoScreen from "./screens/SecaoScreen";
import LojaScreen from "./screens/LojaScreen";
import DicionarioScreen from "./screens/DicionarioScreen";
import CadernoScreen from "./screens/CadernoScreen";
import ContaScreen from "./screens/definicoes/ContaScreen";
import NotificacoesScreen from "./screens/definicoes/NotificacoesScreen";
import SobreScreen from "./screens/definicoes/SobreScreen";
import DefinicoesScreen from "./screens/definicoes/DefinicoesScreen";
import AcessibilidadeScreen from "./screens/definicoes/AcessibilidadeScreen";
import NotFound from "./pages/NotFound";

/* Admin panel (rota secreta, sem link em fluxos do app) */
import AdminLoginScreen from "./screens/admin/AdminLoginScreen";
import AdminDashboardScreen from "./screens/admin/AdminDashboardScreen";
import AdminUsersScreen from "./screens/admin/AdminUsersScreen";
import AdminProgressScreen from "./screens/admin/AdminProgressScreen";
import AdminSessionsScreen from "./screens/admin/AdminSessionsScreen";
import AdminAchievementsScreen from "./screens/admin/AdminAchievementsScreen";
import AdminRegionsScreen from "./screens/admin/AdminRegionsScreen";
import { AdminLayout } from "./components/admin/AdminLayout";
import { RequireAdmin } from "./components/admin/RequireAdmin";
import { AdminTestingBanner } from "./components/admin/AdminTestingBanner";
import { useAdminShortcut } from "./hooks/useAdminShortcut";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { installSessionTracker } from "./lib/sessionTracker";

const queryClient = new QueryClient();

/** Animated routes wrapper — uses location key for AnimatePresence */
const AnimatedRoutes = () => {
  const location = useLocation();
  useAdminShortcut();
  useBackendSync();
  useEffect(() => {
    installSessionTracker();
  }, []);

  return (
    <AnimatePresence mode="wait">
      <AdminTestingBanner />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/apresentation" element={<ApresentationScreen />} />
        <Route path="/features" element={<FeaturesScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/signup" element={<SignupFlow />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password" element={<ResetPasswordScreen />} />
        <Route path="/verify-otp" element={<VerifyOtpScreen />} />
        <Route path="/processing" element={<ProcessingResultsScreen />} />
        <Route path="/nivelamento" element={<NivelamentoScreen />} />
        <Route path="/stealth" element={<StealthModeScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/lesson/:id" element={<LessonScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/profile/definicoes" element={<DefinicoesScreen />} />
        <Route path="/profile/conta" element={<ContaScreen />} />
        <Route path="/profile/notificacoes" element={<NotificacoesScreen />} />
        <Route path="/profile/acessibilidade" element={<AcessibilidadeScreen />} />
        <Route path="/profile/sobre" element={<SobreScreen />} />
        <Route path="/missoes" element={<MissoesScreen />} />
        <Route path="/historias" element={<HistoriasScreen />} />
        <Route path="/historias/:id" element={<HistoriaDetalheScreen />} />
        <Route path="/historias/:id/ler" element={<HistoriaLeituraScreen />} />
        <Route path="/historias/:id/fim" element={<HistoriaFimScreen />} />
        <Route path="/curiosidades" element={<CuriosidadesScreen />} />
        <Route path="/secao/:tipo" element={<SecaoScreen />} />
        <Route path="/loja" element={<LojaScreen />} />
        <Route path="/dicionario" element={<DicionarioScreen />} />
        <Route path="/secao/caderno" element={<CadernoScreen />} />
        <Route path="/fronteiras-intro" element={<FronteirasIntroScreen />} />
        <Route path="/para-alem-fronteiras" element={<FronteirasScreen />} />
        <Route path="/para-alem-fronteiras/jogo" element={<FronteirasJogoScreen />} />

        {/* Admin — rota secreta, não linkada */}
        <Route path="/grupo16Kwendi" element={<Navigate to="/grupo16Kwendi/dashboard" replace />} />
        <Route path="/grupo16Kwendi/login" element={<AdminLoginScreen />} />
        <Route
          path="/grupo16Kwendi/*"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route path="dashboard" element={<AdminDashboardScreen />} />
          <Route path="usuarios" element={<AdminUsersScreen />} />
          <Route path="regioes" element={<AdminRegionsScreen />} />
          <Route path="progresso" element={<AdminProgressScreen />} />
          <Route path="sessoes" element={<AdminSessionsScreen />} />
          <Route path="conquistas" element={<AdminAchievementsScreen />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <AcessibilidadeProvider>
      <PremiumProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
        </TooltipProvider>
      </PremiumProvider>
    </AcessibilidadeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
