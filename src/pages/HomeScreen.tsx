import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useApi";
import { getCycleInfo, getGreeting, getPhaseMessage } from "@/lib/cycleUtils";
import BottomNav from "@/components/BottomNav";
import CycleRing from "@/components/CycleRing";
import DailyCard from "@/components/DailyCard";
import QuickLogButtons from "@/components/QuickLogButtons";
import SyncIndicator from "@/components/SyncIndicator";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Baby, Brain } from "lucide-react";

const HomeScreen = () => {
  const { user } = useAuth();
  const { data: userProfile, isLoading } = useUserProfile();

  // Use user from context if available, otherwise from API
  const currentUser = userProfile || user;

  const cycleInfo = useMemo(() => {
    if (!currentUser) return null;
    return getCycleInfo({
      ...currentUser,
      periodLength: currentUser.periodLength || 5,
      lastPeriodStart: currentUser.lastPeriodStart || new Date(),
    });
  }, [currentUser]);

  const greeting = useMemo(() => {
    if (!currentUser) return "Loading...";
    return getGreeting(currentUser.name);
  }, [currentUser]);

  const dailyMessage = useMemo(() => {
    if (!cycleInfo) return "Loading your cycle information...";
    return getPhaseMessage(cycleInfo.daysUntilNextPeriod, cycleInfo.isPeriod, cycleInfo.periodDay);
  }, [cycleInfo]);

  if (isLoading || !currentUser || !cycleInfo) {
    return (
      <div className="min-h-screen bg-background pb-24 safe-top flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground animate-fade-in">
              {greeting}
            </h1>
            <p className="text-muted-foreground mt-1 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              How are you feeling today?
            </p>
          </div>
          <SyncIndicator />
        </div>
      </header>

      {/* Main content */}
      <main className="px-6 space-y-6">
        {/* Cycle Ring */}
        <div className="flex justify-center py-6">
          <CycleRing
            cycleDay={cycleInfo.cycleDay}
            cycleLength={currentUser.cycleLength}
            isPeriod={cycleInfo.isPeriod}
            isFertile={cycleInfo.isFertile}
            daysUntilPeriod={cycleInfo.daysUntilNextPeriod}
          />
        </div>

        {/* Cycle Status Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-soft animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {cycleInfo.isPeriod
                    ? `Day ${cycleInfo.periodDay} of your period`
                    : cycleInfo.isFertile
                    ? "You're in your fertile window"
                    : `Period in ${cycleInfo.daysUntilNextPeriod} days`}
                </p>
                 <p className="text-sm text-muted-foreground">
                   Cycle day {cycleInfo.cycleDay} of {currentUser.cycleLength}
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Log Buttons */}
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-sm font-medium text-muted-foreground mb-4 text-center">
            Quick log
          </h2>
          <QuickLogButtons />
        </div>

        {/* Feature Cards Row */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "0.35s" }}>
          {/* Fertility Insights Card */}
          <Link to="/fertility">
            <Card className="hover:bg-muted/50 transition-all cursor-pointer h-full hover:shadow-soft border-fertile/20">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-fertile-light flex items-center justify-center">
                    <Baby className="w-6 h-6 text-fertile" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Fertility</p>
                    <p className="text-xs text-muted-foreground">Track ovulation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* AI Insights Card */}
          <Link to="/insights">
            <Card className="hover:bg-muted/50 transition-all cursor-pointer h-full hover:shadow-soft border-primary/20">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">AI Insights</p>
                    <p className="text-xs text-muted-foreground">Personalized tips</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Daily Supportive Message */}
        <div style={{ animationDelay: "0.4s" }}>
          <DailyCard message={dailyMessage} />
        </div>

        {/* Today's summary (if any logs exist) */}
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer shadow-card hover:shadow-soft animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-2">Today's log</h3>
            <p className="text-sm text-muted-foreground">
              You haven't logged anything yet today. Tap the + button to start.
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default HomeScreen;
