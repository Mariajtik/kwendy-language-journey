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
import SignupFlow from "./screens/SignupFlow";
import LoginScreen from "./screens/LoginScreen";
import StealthModeScreen from "./screens/StealthModeScreen";
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
        <Route path="/stealth" element={<StealthModeScreen />} />
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
