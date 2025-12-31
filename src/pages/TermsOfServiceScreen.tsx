import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, FileText, AlertTriangle, Heart, Shield, Mail, Phone } from "lucide-react";

const TermsOfServiceScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Terms of Service
          </h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Terms and conditions for using Moon Bloom Tracker
        </p>
      </header>

      <main className="px-6 space-y-6">
        <Card variant="glass" className="animate-slide-up">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              Last updated: December 31, 2025
            </p>
          </CardContent>
        </Card>

        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground/80 leading-relaxed">
              By downloading, installing, or using Moon Bloom Tracker ("the App"), you agree to be bound by these Terms of Service ("Terms").
              If you do not agree to these Terms, please do not use the App.
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              These Terms constitute a legally binding agreement between you and GhostScript ("we," "us," or "our").
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default TermsOfServiceScreen;