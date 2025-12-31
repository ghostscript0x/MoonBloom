import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Shield, Calendar, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { setOnboardingComplete, saveUser } from "@/lib/offlineStorage";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [cycleLength, setCycleLength] = useState("28");

  const handleComplete = () => {
    // Save user data with onboarding info
    const user = {
      name: "User", // This will be updated from auth context
      email: "", // This will be updated from auth context
      cycleLength: parseInt(cycleLength) || 28,
      periodLength: 5,
      lastPeriodStart: lastPeriodDate ? new Date(lastPeriodDate) : new Date(),
      notificationsEnabled: true,
      appLockEnabled: false,
    };
    saveUser(user);
    setOnboardingComplete(true);
    navigate("/home");
  };

  const steps: OnboardingStep[] = [
    {
      title: "Welcome to Bloom",
      subtitle: "Your gentle cycle companion is here for you",
      icon: <Heart className="w-12 h-12 text-primary-foreground" fill="currentColor" />,
      content: (
        <div className="text-center space-y-4 px-4">
          <p className="text-foreground/80">
            Track your cycle with care, understand your body better, and receive daily support tailored just for you.
          </p>
          <div className="flex items-center justify-center gap-2 pt-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground">Made with love, for you</span>
          </div>
        </div>
      ),
    },
    {
      title: "Your Privacy Matters",
      subtitle: "We promise to keep your data safe",
      icon: <Shield className="w-12 h-12 text-primary-foreground" />,
      content: (
        <div className="space-y-4 px-4">
          <div className="bg-secondary/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-fertile mt-2" />
              <p className="text-sm text-foreground/80">All data is encrypted and stored securely on your device</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-fertile mt-2" />
              <p className="text-sm text-foreground/80">We never sell or share your personal information</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-fertile mt-2" />
              <p className="text-sm text-foreground/80">You can delete all your data anytime you want</p>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Your body, your data, your control 💕
          </p>
        </div>
      ),
    },
    {
      title: "Quick Setup",
      subtitle: "Help us personalize your experience",
      icon: <Calendar className="w-12 h-12 text-primary-foreground" />,
      content: (
        <div className="space-y-6 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              When did your last period start?
            </label>
            <Input
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              className="text-center"
            />
            <p className="text-xs text-muted-foreground text-center">
              It's okay if you don't remember exactly
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              How long is your typical cycle?
            </label>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="icon"
                size="icon"
                onClick={() => setCycleLength(String(Math.max(21, parseInt(cycleLength) - 1)))}
              >
                -
              </Button>
              <div className="w-20 text-center">
                <span className="text-2xl font-bold font-display text-foreground">{cycleLength}</span>
                <span className="text-sm text-muted-foreground ml-1">days</span>
              </div>
              <Button
                variant="icon"
                size="icon"
                onClick={() => setCycleLength(String(Math.min(45, parseInt(cycleLength) + 1)))}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Most cycles are between 21-35 days
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="min-h-screen flex flex-col bg-background safe-top safe-bottom">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-40 right-10 w-48 h-48 rounded-full bg-accent/5 blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-8 pb-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentStep
                ? "w-8 bg-primary"
                : index < currentStep
                ? "w-2 bg-primary/50"
                : "w-2 bg-muted"
            )}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 animate-fade-in" key={currentStep}>
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow mb-8 animate-scale-in">
          {currentStepData.icon}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold font-display text-foreground text-center mb-2">
          {currentStepData.title}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {currentStepData.subtitle}
        </p>

        {/* Content */}
        <div className="w-full max-w-sm">
          {currentStepData.content}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 space-y-4">
        <div className="flex items-center gap-3">
          {!isFirstStep && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <Button
            variant="cozy"
            size="lg"
            onClick={isLastStep ? handleComplete : () => setCurrentStep(currentStep + 1)}
            className={isFirstStep ? "w-full" : "flex-1"}
          >
            {isLastStep ? "Get Started" : "Continue"}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>

        {isFirstStep && (
          <button
            onClick={() => {
              setOnboardingComplete(true);
              navigate("/home");
            }}
            className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
