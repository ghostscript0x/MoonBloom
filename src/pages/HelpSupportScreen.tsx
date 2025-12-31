import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, HelpCircle, Mail, Phone, MessageCircle, Book, Bug, Lightbulb, ExternalLink, Shield, FileText } from "lucide-react";

// WhatsApp icon component
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
  </svg>
);

const HelpSupportScreen = () => {
  const navigate = useNavigate();

  const handleEmailContact = () => {
    window.location.href = "mailto:ghostscript.dev@gmail.com?subject=Moon Bloom Tracker Support";
  };

  const handlePhoneContact = () => {
    window.location.href = "tel:+2347035656882";
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("I build tools that solve problems. Independent developer passionate about creating innovative technology solutions. Based in Nigeria, building technology solutions for global impact.");
    window.open(`https://wa.me/2347035656882?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Help & Support
          </h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Get help with Moon Bloom Tracker
        </p>
      </header>

      <main className="px-6 space-y-6">
        {/* Contact Developer */}
        <Card variant="glass" className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Contact Developer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground/80 leading-relaxed">
              Need help or have questions? Get in touch with the developer directly.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">ghostscript.dev@gmail.com</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleEmailContact}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">+234 703 565 6882</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handlePhoneContact}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <WhatsAppIcon />
                  <div>
                    <p className="font-medium text-foreground">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">Quick chat & support</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleWhatsAppContact}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-b border-border/50 pb-3">
                  <h4 className="font-medium text-foreground mb-2">🤖 How do AI insights work?</h4>
                  <p className="text-sm text-muted-foreground">
                    AI analyzes your logged symptoms, mood, health metrics, and cycle patterns to provide personalized insights and predictions. More data = better insights!
                  </p>
                </div>

                <div className="border-b border-border/50 pb-3">
                  <h4 className="font-medium text-foreground mb-2">🌙 How accurate are the cycle predictions?</h4>
                  <p className="text-sm text-muted-foreground">
                    Predictions improve with regular logging. The calendar shows fertility windows and cycle phases based on your historical data.
                  </p>
                </div>

                <div className="border-b border-border/50 pb-3">
                  <h4 className="font-medium text-foreground mb-2">🔒 How does app lock work?</h4>
                  <p className="text-sm text-muted-foreground">
                    App lock uses device biometric authentication (fingerprint/face) or PIN. Set it up in Profile → App lock for enhanced privacy.
                  </p>
                </div>

                <div className="border-b border-border/50 pb-3">
                  <h4 className="font-medium text-foreground mb-2">🌓 How do I change the theme?</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to Profile → Settings → Theme. Choose Light, Dark, or System (follows your device preference).
                  </p>
                </div>

                <div className="border-b border-border/50 pb-3">
                  <h4 className="font-medium text-foreground mb-2">📊 What health metrics can I track?</h4>
                  <p className="text-sm text-muted-foreground">
                    Track pain levels, energy, sleep quality, temperature, water intake, exercise, medications, and supplements for comprehensive insights.
                  </p>
                </div>

                <div className="border-b border-border/50 pb-3">
                  <h4 className="font-medium text-foreground mb-2">🗑️ How do I delete my account?</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to Profile → Delete account. This permanently removes your account and all data from the server.
                  </p>
                </div>

                <div className="border-b border-border/50 pb-3">
                  <h4 className="font-medium text-foreground mb-2">📱 Is my data secure?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! Data is encrypted and stored securely. The app works online-only with no local storage of sensitive information.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">🐛 The app isn't working correctly</h4>
                  <p className="text-sm text-muted-foreground">
                    Try refreshing the page, checking your internet connection, or clearing browser cache. For persistent issues, contact support.
                  </p>
                </div>
              </div>
            </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bug className="w-4 h-4 text-primary" />
              Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">🌐 Internet Connection</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  The app requires an internet connection to save data and load insights. Check your connection if features aren't working.
                </p>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">🔒 App Lock Issues</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  If biometric authentication fails, try using PIN instead. Make sure your device supports biometrics.
                </p>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">🌓 Theme Problems</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Theme changes should apply immediately. If not working, try refreshing the page or clearing browser cache.
                </p>
              </div>

              <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">🤖 AI Insights Not Loading</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  AI insights require logged cycle data. Start logging your symptoms and health metrics to unlock personalized insights.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Book className="w-4 h-4 text-primary" />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/privacy-policy')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/terms-of-service')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Terms of Service
              </Button>

              <div className="p-3 bg-primary/5 rounded-lg">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  New Features
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AI-powered health insights</li>
                  <li>• Comprehensive health metrics tracking</li>
                  <li>• Biometric app lock</li>
                  <li>• Light/Dark/System themes</li>
                  <li>• Account deletion</li>
                </ul>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  Health Disclaimer
                </h4>
                <p className="text-sm text-muted-foreground">
                  Moon Bloom Tracker provides informational insights only. Always consult healthcare professionals
                  for medical advice and concerns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Info */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              About the Developer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-foreground">GhostScript</h3>
              <p className="text-sm text-muted-foreground">
                Independent developer passionate about creating innovative technology solutions.
              </p>
              <p className="text-sm text-muted-foreground">
                Based in Nigeria, building technology solutions for global impact.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={handleEmailContact}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={handlePhoneContact}>
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2" onClick={handleWhatsAppContact}>
              <WhatsAppIcon />
              <span className="ml-2">WhatsApp</span>
            </Button>
          </CardContent>
        </Card>

        {/* Version */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <CardContent className="p-4">
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">Moon Bloom Tracker v2.0.0</p>
              <p className="text-xs text-muted-foreground">
                AI-powered insights • Enhanced health tracking • Biometric security
              </p>
              <p className="text-xs text-muted-foreground">Made with 💕 by GhostScript</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default HelpSupportScreen;