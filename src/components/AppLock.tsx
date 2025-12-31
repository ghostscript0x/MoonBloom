import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Fingerprint } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { unlockApp } from "@/lib/biometricAuth";

interface AppLockProps {
  onUnlock: () => void;
}

const AppLock: React.FC<AppLockProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState("");
  const [hasBiometric, setHasBiometric] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const lockType = localStorage.getItem('app_lock_type');
    setHasBiometric(lockType === 'biometric');
  }, []);

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    try {
      const success = await unlockApp();
      if (success) {
        toast({
          title: "Authenticated",
          description: "Welcome back!",
        });
        onUnlock();
      } else {
        toast({
          title: "Authentication failed",
          description: "Please try again or use PIN.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please try again or use PIN.",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length === 4) {
      setIsAuthenticating(true);
      try {
        // For now, we'll use a simple check since we removed the complex auth
        // In a real app, this would use proper PIN verification
        const success = pin === localStorage.getItem('app_lock_pin');
        if (success) {
          toast({
            title: "Authenticated",
            description: "Welcome back!",
          });
          onUnlock();
        } else {
          toast({
            title: "Invalid PIN",
            description: "Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setIsAuthenticating(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl">App Locked</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your PIN or use biometric authentication
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasBiometric && (
            <Button
              onClick={handleBiometricAuth}
              className="w-full"
              size="lg"
              disabled={isAuthenticating}
            >
              <Fingerprint className="w-5 h-5 mr-2" />
              {isAuthenticating ? "Authenticating..." : "Use Biometric"}
            </Button>
          )}

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter your PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              className="text-center text-lg tracking-widest"
              disabled={isAuthenticating}
            />
            <Button
              onClick={handlePinSubmit}
              className="w-full"
              disabled={pin.length !== 4 || isAuthenticating}
            >
              {isAuthenticating ? "Authenticating..." : "Unlock"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppLock;