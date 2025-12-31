import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLock from "@/components/AppLock";
import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import SignupScreen from "./pages/SignupScreen";
import OTPVerificationScreen from "./pages/OTPVerificationScreen";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import HomeScreen from "./pages/HomeScreen";
import LogScreen from "./pages/LogScreen";
import CalendarScreen from "./pages/CalendarScreen";
import DayDetailsScreen from "./pages/DayDetailsScreen";
import ProfileScreen from "./pages/ProfileScreen";
import FertilityScreen from "./pages/FertilityScreen";
import InsightsScreen from "./pages/InsightsScreen";
import WellnessScreen from "./pages/WellnessScreen";
import PrivacyPolicyScreen from "./pages/PrivacyPolicyScreen";
import TermsOfServiceScreen from "./pages/TermsOfServiceScreen";
import HelpSupportScreen from "./pages/HelpSupportScreen";
import ResetPasswordScreen from "./pages/ResetPasswordScreen";
import NotFound from "./pages/NotFound";
import { getUser } from "@/lib/offlineStorage";

const queryClient = new QueryClient();

const AppContent = () => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Register service worker for notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Check if app lock is enabled on app start
    const user = getUser();
    if (user?.appLockEnabled) {
      // For demo, we'll show lock screen briefly on refresh
      // In production, this would check if app was backgrounded
      const shouldLock = sessionStorage.getItem('app_was_locked') === 'true' ||
                        !sessionStorage.getItem('app_unlocked_at');

      if (shouldLock) {
        setIsLocked(true);
      }
    }
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
    sessionStorage.setItem('app_unlocked_at', Date.now().toString());
    sessionStorage.removeItem('app_was_locked');
  };

  // Show lock screen if app is locked
  if (isLocked) {
    return (
      <TooltipProvider>
        <AppLock onUnlock={handleUnlock} />
        <Toaster />
        <Sonner />
      </TooltipProvider>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/verify-otp" element={<OTPVerificationScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/log" element={<LogScreen />} />
        <Route path="/calendar" element={<CalendarScreen />} />
        <Route path="/day/:date" element={<DayDetailsScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/wellness" element={<WellnessScreen />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
          <Route path="/terms-of-service" element={<TermsOfServiceScreen />} />
          <Route path="/help-support" element={<HelpSupportScreen />} />
          <Route path="/reset-password" element={<ResetPasswordScreen />} />
          <Route path="/fertility" element={<FertilityScreen />} />
          <Route path="/insights" element={<InsightsScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
