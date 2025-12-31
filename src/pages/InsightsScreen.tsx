import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile, useCycles, useAnalytics } from "@/hooks/useApi";
import { getCycleInfo } from "@/lib/cycleUtils";
import { moodOptions, availableSymptoms } from "@/lib/constants";
import { Brain, TrendingUp, Lightbulb, Zap, Moon, Heart, Activity, Sparkles, Droplets, Battery, Thermometer, Pill } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCard {
  id: string;
  type: 'pattern' | 'prediction' | 'tip' | 'energy' | 'health' | 'wellness';
  icon: React.ReactNode;
  title: string;
  message: string;
  confidence?: number;
  color: string;
}

const InsightsScreen = () => {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { data: cycles } = useCycles();
  const { data: analytics } = useAnalytics();

  const currentUser = userProfile || user;
  const cycleInfo = useMemo(() => {
    if (!currentUser) return null;
    return getCycleInfo({
      ...currentUser,
      periodLength: currentUser.periodLength || 5,
      lastPeriodStart: currentUser.lastPeriodStart || new Date(),
    });
  }, [currentUser]);

  // Mock AI-generated insights based on logged data
  const insights: InsightCard[] = useMemo(() => [
    {
      id: '1',
      type: 'pattern',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Cramp Pattern Detected',
      message: 'Your cramps usually peak 2 days before your period starts. Consider preparing with a heating pad and pain relief.',
      confidence: 87,
      color: 'period',
    },
    {
      id: '2',
      type: 'energy',
      icon: <Zap className="w-5 h-5" />,
      title: 'Energy Forecast',
      message: "You're entering your follicular phase! Many people feel more energetic and focused during this time.",
      color: 'fertile',
    },
    {
      id: '3',
      type: 'prediction',
      icon: <Moon className="w-5 h-5" />,
      title: 'Sleep Quality Alert',
      message: 'Based on your logs, you may experience lighter sleep 3-4 days before your period. Try winding down earlier.',
      confidence: 72,
      color: 'primary',
    },
    {
      id: '4',
      type: 'tip',
      icon: <Lightbulb className="w-5 h-5" />,
      title: 'Mood Boost Tip',
      message: 'Your mood logs show improvement on days with physical activity. Even a short walk could help today!',
      color: 'accent',
    },
    {
      id: '5',
      type: 'pattern',
      icon: <Heart className="w-5 h-5" />,
      title: 'Headache Pattern',
      message: 'You logged headaches during the last 3 cycles around day 26-28. Stay hydrated and consider magnesium.',
      confidence: 65,
      color: 'destructive',
    },
    {
      id: '6',
      type: 'health',
      icon: <Battery className="w-5 h-5" />,
      title: 'Energy Pattern',
      message: 'Your energy levels are typically lowest during menstruation. Consider light exercise and iron-rich foods.',
      confidence: 78,
      color: 'primary',
    },
    {
      id: '7',
      type: 'wellness',
      icon: <Droplets className="w-5 h-5" />,
      title: 'Hydration Reminder',
      message: 'Women need more water during their period. Aim for 8-10 glasses daily, especially on heavy flow days.',
      confidence: 85,
      color: 'blue',
    },
    {
      id: '8',
      type: 'health',
      icon: <Moon className="w-5 h-5" />,
      title: 'Sleep Quality Insight',
      message: 'Your sleep quality improves during the follicular phase. This is a great time for important tasks!',
      confidence: 72,
      color: 'indigo',
    },
  ], []);

  // Mock mood trend data for chart
  const moodTrendData = useMemo(() => {
    const phases = ['Menstrual', 'Follicular', 'Ovulation', 'Luteal'];
    return phases.map((phase, index) => ({
      phase,
      avgMood: [2.5, 4.2, 4.5, 3.1][index], // 1-5 scale
      color: ['period', 'fertile', 'ovulation', 'primary'][index],
    }));
  }, []);

  // Mock symptom frequency data
  const symptomFrequency = useMemo(() => {
    return [
      { symptom: 'Cramps', count: 8, emoji: '😣' },
      { symptom: 'Fatigue', count: 12, emoji: '😴' },
      { symptom: 'Headache', count: 5, emoji: '🤕' },
      { symptom: 'Cravings', count: 9, emoji: '🍫' },
      { symptom: 'Bloating', count: 6, emoji: '🎈' },
    ];
  }, []);

  const maxCount = Math.max(...symptomFrequency.map(s => s.count));

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              AI Insights
            </h1>
            <p className="text-sm text-muted-foreground">
              {cycles && cycles.length > 0 ? 'Personalized just for you ✨' : 'Discover your patterns'}
            </p>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* Summary Card */}
        {(cycles && cycles.length > 0) ? (
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 animate-slide-up">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-primary mt-0.5" />
                <div>
                  <h2 className="font-semibold font-display text-foreground mb-1">
                    Your Cycle Summary
                  </h2>
                  <p className="text-sm text-foreground/80">
                    Based on {cycles.length} cycle entries,
                    I've found some patterns that might help you understand your body better.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 animate-slide-up">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-primary mt-0.5" />
                <div>
                  <h2 className="font-semibold font-display text-foreground mb-1">
                    Welcome to AI Insights!
                  </h2>
                  <p className="text-sm text-foreground/80">
                    Start logging your cycles to unlock personalized insights and patterns about your body.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Only show insights when user has logged cycles */}
        {(cycles && cycles.length > 0) && (
          <>
            {/* Mood Trend Chart */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Mood by Cycle Phase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-32 gap-3 mb-2">
              {moodTrendData.map(({ phase, avgMood, color }) => (
                <div key={phase} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className={cn(
                      "w-full rounded-t-lg transition-all duration-500",
                      color === 'period' && "bg-period",
                      color === 'fertile' && "bg-fertile",
                      color === 'ovulation' && "bg-ovulation",
                      color === 'primary' && "bg-primary"
                    )}
                    style={{ height: `${(avgMood / 5) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {moodTrendData.map(({ phase }) => (
                <span key={phase} className="flex-1 text-center truncate px-1">
                  {phase}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              You tend to feel best during ovulation 🌟
            </p>
          </CardContent>
        </Card>

        {/* Symptom Frequency */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Symptoms (Last 3 Cycles)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {symptomFrequency.map(({ symptom, count, emoji }) => (
              <div key={symptom} className="flex items-center gap-3">
                <span className="text-lg w-6">{emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{symptom}</span>
                    <span className="text-xs text-muted-foreground">{count} days</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/60 rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insight Cards */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground px-1">
            Personalized Insights
          </h2>
          
          {insights.map((insight, index) => (
            <Card 
              key={insight.id}
              className={cn(
                "animate-slide-up transition-all hover:shadow-soft",
                insight.color === 'period' && "border-l-4 border-l-period",
                insight.color === 'fertile' && "border-l-4 border-l-fertile",
                insight.color === 'primary' && "border-l-4 border-l-primary",
                insight.color === 'accent' && "border-l-4 border-l-accent",
                insight.color === 'destructive' && "border-l-4 border-l-destructive/60"
              )}
              style={{ animationDelay: `${0.2 + index * 0.05}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    insight.color === 'period' && "bg-period-light text-period",
                    insight.color === 'fertile' && "bg-fertile-light text-fertile",
                    insight.color === 'primary' && "bg-primary/10 text-primary",
                    insight.color === 'accent' && "bg-accent/20 text-accent-foreground",
                    insight.color === 'destructive' && "bg-destructive/10 text-destructive"
                  )}>
                    {insight.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-medium text-foreground text-sm">
                        {insight.title}
                      </h3>
                      {insight.confidence && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {insight.confidence}% confidence
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Health Metrics Summary */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Health Metrics Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <Battery className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Avg Energy</p>
                <p className="text-lg font-bold text-green-800 dark:text-green-200">7.2/10</p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Avg Hydration</p>
                <p className="text-lg font-bold text-blue-800 dark:text-blue-200">6.8</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">glasses/day</p>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <Moon className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Sleep Quality</p>
                <p className="text-lg font-bold text-purple-800 dark:text-purple-200">Good</p>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <Thermometer className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg Temp</p>
                <p className="text-lg font-bold text-orange-800 dark:text-orange-200">98.2°F</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-muted/50 border-0 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground text-center">
              💕 These insights are based on your logged data and general patterns.
              They're meant to help you understand your body better, not replace medical advice.
            </p>
          </CardContent>
        </Card>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default InsightsScreen;
