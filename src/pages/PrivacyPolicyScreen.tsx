import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Mail, Phone } from "lucide-react";

const PrivacyPolicyScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Privacy Policy
          </h1>
        </div>
        <p className="text-muted-foreground mt-1">
          How we protect your personal information
        </p>
      </header>

      <main className="px-6 space-y-6">
        {/* Last Updated */}
        <Card variant="glass" className="animate-slide-up">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              Last updated: December 31, 2025
            </p>
          </CardContent>
        </Card>

        {/* Overview */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Privacy Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground/80 leading-relaxed">
              At Moon Bloom Tracker, we are committed to protecting your privacy and personal information.
              This privacy policy explains how we collect, use, and safeguard your data when you use our menstrual cycle tracking application.
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Your health data is sensitive and personal. We implement industry-standard security measures
              to ensure your information remains private and secure.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Personal Information:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Name and email address (for account creation)</li>
                <li>• Age and location (optional, for personalized insights)</li>
                <li>• App usage preferences and settings</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Health Data:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Menstrual cycle dates and flow information</li>
                <li>• Mood and symptom tracking data</li>
                <li>• Wellness information (exercise, sleep, nutrition)</li>
                <li>• Cycle prediction calculations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-foreground/80 leading-relaxed">
              Your data is used exclusively to provide you with personalized menstrual cycle tracking and health insights:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Generate accurate cycle predictions and insights</li>
              <li>• Provide personalized health recommendations</li>
              <li>• Sync data across your devices (with your permission)</li>
              <li>• Improve app functionality and user experience</li>
              <li>• Ensure app security and prevent unauthorized access</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-foreground/80 leading-relaxed">
              We implement multiple layers of security to protect your personal and health information:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• End-to-end encryption for data transmission</li>
              <li>• Secure local storage on your device</li>
              <li>• Optional cloud backup with encryption</li>
              <li>• Regular security audits and updates</li>
              <li>• Access controls and authentication requirements</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Data Sharing and Third Parties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong>We do NOT sell, trade, or rent your personal information to third parties.</strong>
              Your health data remains private and is only used to provide our services.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Limited Sharing:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Aggregated, anonymized data for research and improvement</li>
                <li>• Service providers (hosting, analytics) under strict contracts</li>
                <li>• Legal requirements (court orders, safety concerns)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Your Rights and Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-foreground/80 leading-relaxed">
              You have complete control over your data:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Access:</strong> View all your stored data anytime</li>
              <li>• <strong>Export:</strong> Download your data in JSON format</li>
              <li>• <strong>Delete:</strong> Permanently remove all your data</li>
              <li>• <strong>Opt-out:</strong> Disable analytics and cloud sync</li>
              <li>• <strong>Update:</strong> Modify your preferences and settings</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.7s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-foreground/80 leading-relaxed">
              If you have any questions about this privacy policy or our data practices:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">ghostscript.dev@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">+234 703 565 6882</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.8s" }}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              We may update this privacy policy occasionally. Significant changes will be communicated
              through the app or email. Continued use of the app constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default PrivacyPolicyScreen;