import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useApi";
import { getCycleInfo } from "@/lib/cycleUtils";
import { Baby, Sparkles, Heart, Calendar, Info, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const FertilityScreen = () => {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();

  const currentUser = userProfile || user;
  const cycleInfo = useMemo(() => {
    if (!currentUser) return null;
    return getCycleInfo({
      ...currentUser,
      periodLength: currentUser.periodLength || 5,
      lastPeriodStart: currentUser.lastPeriodStart || new Date(),
    });
  }, [currentUser]);

  // Calculate fertility data
  const fertileWindowStart = 10;
  const fertileWindowEnd = 16;
  const ovulationDay = 14;
  const currentCycleDay = cycleInfo.cycleDay;

  const isInFertileWindow = currentCycleDay >= fertileWindowStart && currentCycleDay <= fertileWindowEnd;
  const isOvulationDay = currentCycleDay === ovulationDay;
  const daysUntilFertile = fertileWindowStart - currentCycleDay;
  const daysUntilOvulation = ovulationDay - currentCycleDay;

  // Mock pregnancy probability based on cycle day
  const getPregnancyProbability = (day: number): number => {
    if (day === ovulationDay) return 33;
    if (day === ovulationDay - 1 || day === ovulationDay + 1) return 25;
    if (day >= fertileWindowStart && day <= fertileWindowEnd) return 15;
    return 3;
  };

  const pregnancyProbability = getPregnancyProbability(currentCycleDay);

  // Fertility timeline data
  const fertilityDays = Array.from({ length: 7 }, (_, i) => {
    const day = fertileWindowStart + i;
    const isToday = day === currentCycleDay;
    const isPast = day < currentCycleDay;
    const isOvulation = day === ovulationDay;
    const probability = getPregnancyProbability(day);

    return { day, isToday, isPast, isOvulation, probability };
  });

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fertile to-fertile/60 flex items-center justify-center">
            <Baby className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Fertility Insights
            </h1>
            <p className="text-sm text-muted-foreground">
              Understanding your fertile window 🌸
            </p>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* Current Status Card */}
        <Card 
          className={cn(
            "animate-slide-up border-2",
            isOvulationDay && "bg-ovulation-light border-ovulation/30",
            isInFertileWindow && !isOvulationDay && "bg-fertile-light border-fertile/30",
            !isInFertileWindow && "bg-secondary/50 border-transparent"
          )}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                isOvulationDay && "bg-ovulation",
                isInFertileWindow && !isOvulationDay && "bg-fertile",
                !isInFertileWindow && "bg-muted"
              )}>
                <Sparkles className={cn(
                  "w-8 h-8",
                  (isOvulationDay || isInFertileWindow) ? "text-primary-foreground" : "text-muted-foreground"
                )} />
              </div>
              <div className="flex-1">
                <h2 className={cn(
                  "text-lg font-semibold font-display",
                  isOvulationDay && "text-ovulation",
                  isInFertileWindow && !isOvulationDay && "text-fertile",
                  !isInFertileWindow && "text-foreground"
                )}>
                  {isOvulationDay 
                    ? "Ovulation Day! ✨" 
                    : isInFertileWindow 
                    ? "Fertile Window" 
                    : daysUntilFertile > 0 
                    ? `${daysUntilFertile} days until fertile window`
                    : "Post-ovulation phase"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isOvulationDay
                    ? "Peak fertility - your most fertile day"
                    : isInFertileWindow
                    ? "Higher chance of conception during this time"
                    : "Lower fertility during this phase of your cycle"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pregnancy Probability */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-period" />
              Conception Probability Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={pregnancyProbability > 20 ? "hsl(var(--fertile))" : "hsl(var(--primary))"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${pregnancyProbability * 2.51} 251`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold font-display text-foreground">
                    {pregnancyProbability}%
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground/80">
                  {pregnancyProbability > 25 
                    ? "Today has the highest chance of conception if you're trying to conceive."
                    : pregnancyProbability > 10
                    ? "Moderate fertility today. Conception is possible."
                    : "Lower fertility today. Conception is less likely but not impossible."}
                </p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Based on typical cycle patterns
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fertile Window Timeline */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-fertile" />
              Your Fertile Window
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-1 mb-3">
              {fertilityDays.map(({ day, isToday, isPast, isOvulation, probability }) => (
                <div key={day} className="flex-1 text-center">
                  <div
                    className={cn(
                      "aspect-square rounded-xl flex flex-col items-center justify-center mb-1 transition-all",
                      isOvulation && "bg-ovulation text-primary-foreground shadow-soft",
                      !isOvulation && isToday && "bg-fertile text-primary-foreground ring-2 ring-fertile ring-offset-2",
                      !isOvulation && !isToday && !isPast && "bg-fertile-light text-fertile",
                      isPast && !isToday && "bg-muted text-muted-foreground"
                    )}
                  >
                    <span className="text-xs font-medium">Day</span>
                    <span className="text-sm font-bold">{day}</span>
                  </div>
                  <div 
                    className="h-1 rounded-full mx-1"
                    style={{ 
                      backgroundColor: `hsl(var(--fertile) / ${probability / 40})`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Fertile window starts</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-ovulation" />
                Ovulation
              </span>
              <span>Window ends</span>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="bg-secondary/30 border-0 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-5">
            <h3 className="font-semibold font-display text-foreground mb-3 flex items-center gap-2">
              💡 Gentle Reminders
            </h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-fertile">•</span>
                Every body is unique - these are estimates based on typical patterns
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fertile">•</span>
                Stress, sleep, and health can affect your fertile window
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fertile">•</span>
                For conception or prevention, consider additional tracking methods
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Link to Insights */}
        <Link to="/insights">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">AI Insights</p>
                  <p className="text-xs text-muted-foreground">Personalized recommendations</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </main>

      <BottomNav />
    </div>
  );
};

export default FertilityScreen;
