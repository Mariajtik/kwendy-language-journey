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
import ProcessingResultsScreen from "./screens/ProcessingResultsScreen";
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
import FalaEscutaScreen from "./screens/FalaEscutaScreen";
import CadernoScreen from "./screens/CadernoScreen";
import ContaScreen from "./screens/definicoes/ContaScreen";
import NotificacoesScreen from "./screens/definicoes/NotificacoesScreen";
import SobreScreen from "./screens/definicoes/SobreScreen";
import DefinicoesScreen from "./screens/definicoes/DefinicoesScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/** Animated routes wrapper — uses location key for AnimatePresence */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/apresentation" element={<ApresentationScreen />} />
        <Route path="/features" element={<FeaturesScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/signup" element={<SignupFlow />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/processing" element={<ProcessingResultsScreen />} />
        <Route path="/stealth" element={<StealthModeScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/lesson/:id" element={<LessonScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/profile/definicoes" element={<DefinicoesScreen />} />
        <Route path="/profile/conta" element={<ContaScreen />} />
        <Route path="/profile/notificacoes" element={<NotificacoesScreen />} />
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
        <Route path="/secao/fala-escuta" element={<FalaEscutaScreen />} />
        <Route path="/secao/caderno" element={<CadernoScreen />} />
        <Route path="/fronteiras-intro" element={<FronteirasIntroScreen />} />
        <Route path="/para-alem-fronteiras" element={<FronteirasScreen />} />
        <Route path="/para-alem-fronteiras/jogo" element={<FronteirasJogoScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
