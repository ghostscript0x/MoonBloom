import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const OTPVerificationScreen = () => {
  const navigate = useNavigate();
  const { user, verifyOTP, resendOTP } = useAuth();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!user?.email) {
      navigate("/signup");
      return;
    }

    // Start countdown for resend
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, navigate]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(otp);
      navigate("/onboarding");
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");

    try {
      await resendOTP();
      setCountdown(60);
      setError("OTP sent successfully! Check your email.");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft mb-4">
            <Mail className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">Verify your email</h1>
          <p className="text-muted-foreground mt-1 text-center">
            We've sent a 6-digit code to<br />
            <span className="font-medium text-foreground">{user?.email}</span>
          </p>
        </div>

        <Card variant="glass">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-xl">Enter verification code</CardTitle>
            <CardDescription className="text-center">
              Check your email for the verification code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  className="text-center text-2xl font-mono tracking-widest"
                  autoComplete="one-time-code"
                  maxLength={6}
                />
              </div>

              {error && (
                <p className={`text-sm text-center ${
                  error.includes("successfully") ? "text-green-600" : "text-destructive"
                }`}>
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="cozy"
                size="lg"
                className="w-full"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="flex items-center justify-center gap-4 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || isResending}
                  className="text-primary"
                >
                  {isResending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Privacy note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Your email is secure and private</span>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationScreen;