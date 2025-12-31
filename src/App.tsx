import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLock from "@/components/AppLock";
import SplashScreen from "./pages/SplashScreen";

// Component to handle root route redirection based on auth status
const RootRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />; // Show loading while checking auth
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <SplashScreen />;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />; // Show loading while checking auth
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
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


const queryClient = new QueryClient();

const AppContent = () => {
  const [isLocked, setIsLocked] = useState(false);
  const { user, isLoading } = useAuth();

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

    // App lock disabled - no local storage
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
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/verify-otp" element={<OTPVerificationScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingScreen />
          </ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomeScreen />
          </ProtectedRoute>
        } />
        <Route path="/log" element={
          <ProtectedRoute>
            <LogScreen />
          </ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <CalendarScreen />
          </ProtectedRoute>
        } />
        <Route path="/day/:date" element={
          <ProtectedRoute>
            <DayDetailsScreen />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        } />
        <Route path="/wellness" element={
          <ProtectedRoute>
            <WellnessScreen />
          </ProtectedRoute>
        } />
        <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
        <Route path="/terms-of-service" element={<TermsOfServiceScreen />} />
        <Route path="/help-support" element={<HelpSupportScreen />} />
        <Route path="/reset-password" element={<ResetPasswordScreen />} />
        <Route path="/fertility" element={
          <ProtectedRoute>
            <FertilityScreen />
          </ProtectedRoute>
        } />
        <Route path="/insights" element={
          <ProtectedRoute>
            <InsightsScreen />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
