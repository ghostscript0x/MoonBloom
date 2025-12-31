import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Auto-navigate after animation
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-32 right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-secondary blur-2xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        {/* Logo */}
        <div className="relative mb-8 animate-scale-in">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary via-accent to-period flex items-center justify-center shadow-glow">
            <Heart className="w-14 h-14 text-primary-foreground animate-pulse-soft" fill="currentColor" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-accent animate-float" />
        </div>

        {/* App name */}
        <h1 className="text-4xl font-bold font-display text-foreground mb-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Bloom
        </h1>

        {/* Tagline */}
        <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.6s" }}>
          Your gentle cycle companion
        </p>

        {/* Loading indicator */}
        <div className="mt-12 flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.9s" }}>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>

      {/* Footer text */}
      <p className="absolute bottom-12 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "1.2s" }}>
        Made with 💕 for you
      </p>
    </div>
  );
};

export default SplashScreen;
