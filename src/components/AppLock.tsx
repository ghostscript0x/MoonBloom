import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Fingerprint } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppLockProps {
  onUnlock: () => void;
}

const AppLock: React.FC<AppLockProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState("");
  const [hasBiometric, setHasBiometric] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    if ('credentials' in navigator && 'get' in navigator.credentials) {
      try {
        const available = await navigator.credentials.get({
          publicKey: {
            challenge: new Uint8Array([1, 2, 3, 4]),
            rp: { name: 'Moon Bloom Tracker' },
            user: { id: new Uint8Array([1]), name: 'user', displayName: 'User' },
            pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
            authenticatorSelection: { authenticatorAttachment: 'platform' }
          }
        } as CredentialRequestOptions);
        setHasBiometric(available !== null);
      } catch {
        setHasBiometric(false);
      }
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array([1, 2, 3, 4, 5]),
          rpId: window.location.hostname,
          userVerification: 'required'
        }
      } as CredentialRequestOptions);

      if (credential) {
        toast({
          title: "Authenticated",
          description: "Welcome back!",
        });
        onUnlock();
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please try again or use PIN.",
        variant: "destructive",
      });
    }
  };

  const handlePinSubmit = () => {
    // For demo purposes, accept any 4-digit PIN
    if (pin.length === 4) {
      toast({
        title: "Authenticated",
        description: "Welcome back!",
      });
      onUnlock();
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please enter a 4-digit PIN.",
        variant: "destructive",
      });
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
            >
              <Fingerprint className="w-5 h-5 mr-2" />
              Use Biometric
            </Button>
          )}

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              className="text-center text-lg tracking-widest"
            />
            <Button
              onClick={handlePinSubmit}
              className="w-full"
              disabled={pin.length !== 4}
            >
              Unlock
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            For demo: Enter any 4 digits
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppLock;