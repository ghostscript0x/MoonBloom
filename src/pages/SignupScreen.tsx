import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Eye, EyeOff, Shield, Check } from "lucide-react";


const SignupScreen = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(name, email, password);
      navigate("/onboarding");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const privacyPoints = [
    "Your data is encrypted and stored securely",
    "We never share your information with third parties",
    "You can delete your data anytime",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-secondary blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft mb-4">
            <Heart className="w-8 h-8 text-primary-foreground" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">Join Bloom</h1>
          <p className="text-muted-foreground mt-1">Begin your gentle journey 🌸</p>
        </div>

        <Card variant="glass">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-xl">Create account</CardTitle>
            <CardDescription className="text-center">
              We're so happy you're here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button
                type="submit"
                variant="cozy"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Get started"}
              </Button>
            </form>

            {/* Privacy points */}
            <div className="mt-6 space-y-2">
              {privacyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="w-4 h-4 text-fertile flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span>Your privacy is our priority</span>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupScreen;
