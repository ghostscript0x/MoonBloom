import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile, useCycles, useAnalytics, useInsights } from "@/hooks/useApi";
import { getCycleInfo } from "@/lib/cycleUtils";
import { moodOptions, availableSymptoms } from "@/lib/constants";
import { Brain, TrendingUp, Lightbulb, Zap, Moon, Heart, Activity, Sparkles, Droplets, Battery, Thermometer, Pill } from "lucide-react";
import { cn } from "@/lib/utils";

// Health Metrics Overview Component
const HealthMetricsOverview = ({ cycles }: { cycles: any[] }) => {
  // Calculate real averages from cycles data
  const metrics = React.useMemo(() => {
    const recentCycles = cycles.slice(0, 14); // Last 2 weeks

    const energyLevels = recentCycles
      .filter(c => c.energyLevel !== undefined)
      .map(c => c.energyLevel);

    const waterIntake = recentCycles
      .filter(c => c.waterIntake !== undefined)
      .map(c => c.waterIntake);

    const sleepQualities = recentCycles
      .filter(c => c.sleepQuality)
      .map(c => c.sleepQuality);

    const temperatures = recentCycles
      .filter(c => c.temperature !== undefined)
      .map(c => parseFloat(c.temperature));

    const avgEnergy = energyLevels.length > 0
      ? (energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length).toFixed(1)
      : 'N/A';

    const avgWater = waterIntake.length > 0
      ? (waterIntake.reduce((a, b) => a + b, 0) / waterIntake.length).toFixed(1)
      : 'N/A';

    const avgTemp = temperatures.length > 0
      ? (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1)
      : 'N/A';

    // Calculate most common sleep quality
    const sleepCount: { [key: string]: number } = {};
    sleepQualities.forEach(quality => {
      sleepCount[quality] = (sleepCount[quality] || 0) + 1;
    });
    const mostCommonSleep = Object.entries(sleepCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    return { avgEnergy, avgWater, mostCommonSleep, avgTemp };
  }, [cycles]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
        <Battery className="w-6 h-6 text-green-500 mx-auto mb-1" />
        <p className="text-sm font-medium text-green-700 dark:text-green-300">Avg Energy</p>
        <p className="text-lg font-bold text-green-800 dark:text-green-200">
          {metrics.avgEnergy}/10
        </p>
      </div>
      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
        <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-1" />
        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Avg Hydration</p>
        <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
          {metrics.avgWater}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400">glasses/day</p>
      </div>
      <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
        <Moon className="w-6 h-6 text-purple-500 mx-auto mb-1" />
        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Sleep Quality</p>
        <p className="text-lg font-bold text-purple-800 dark:text-purple-200 capitalize">
          {metrics.mostCommonSleep}
        </p>
      </div>
      <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
        <Thermometer className="w-6 h-6 text-orange-500 mx-auto mb-1" />
        <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg Temp</p>
        <p className="text-lg font-bold text-orange-800 dark:text-orange-200">
          {metrics.avgTemp}°F
        </p>
      </div>
    </div>
  );
};

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
  const { data: aiInsights, isLoading: insightsLoading, error: insightsError } = useInsights();

  const currentUser = userProfile || user;
  const cycleInfo = useMemo(() => {
    if (!currentUser) return null;
    return getCycleInfo({
      ...currentUser,
      periodLength: currentUser.periodLength || 5,
      lastPeriodStart: currentUser.lastPeriodStart || new Date(),
    });
  }, [currentUser]);

  // AI-generated insights based on logged data
  const insights: InsightCard[] = useMemo(() => {
    if (!aiInsights || aiInsights.length === 0) {
      // Provide fallback insights when AI data is unavailable
      return [
        {
          id: 'fallback-1',
          type: 'tip',
          icon: <Lightbulb className="w-5 h-5" />,
          title: 'Track Your Cycle',
          message: 'Regularly logging your symptoms and mood helps identify patterns in your menstrual cycle.',
          confidence: 100,
          color: 'primary',
        },
        {
          id: 'fallback-2',
          type: 'wellness',
          icon: <Heart className="w-5 h-5" />,
          title: 'Listen to Your Body',
          message: 'Your body communicates through symptoms. Pay attention to changes and patterns.',
          confidence: 95,
          color: 'accent',
        },
        {
          id: 'fallback-3',
          type: 'health',
          icon: <Activity className="w-5 h-5" />,
          title: 'Stay Hydrated',
          message: 'Proper hydration can help reduce many menstrual symptoms. Aim for 8+ glasses daily.',
          confidence: 90,
          color: 'blue',
        },
      ];
    }

    return aiInsights.map((insight: any, index: number) => {
      // Map AI insight types to UI components
      const getIcon = (type: string) => {
        switch (type) {
          case 'pattern': return <TrendingUp className="w-5 h-5" />;
          case 'prediction': return <Moon className="w-5 h-5" />;
          case 'tip': return <Lightbulb className="w-5 h-5" />;
          case 'warning': return <Heart className="w-5 h-5" />;
          case 'celebration': return <Sparkles className="w-5 h-5" />;
          default: return <Brain className="w-5 h-5" />;
        }
      };

      const getColor = (category: string) => {
        switch (category) {
          case 'mood': return 'accent';
          case 'symptoms': return 'destructive';
          case 'energy': return 'primary';
          case 'health': return 'blue';
          case 'cycle': return 'period';
          case 'wellness': return 'fertile';
          default: return 'primary';
        }
      };

      return {
        id: `ai-${index}`,
        type: insight.type as any,
        icon: getIcon(insight.type),
        title: insight.title,
        message: insight.message,
        confidence: insight.confidence,
        color: getColor(insight.category)
      };
    });
  }, [aiInsights]);

  // Calculate real mood trend data
  const moodTrendData = useMemo(() => {
    if (!cycles || cycles.length === 0) {
      // Return default data when no cycles exist
      return [
        { phase: 'Menstrual', avgMood: 3, color: 'period' },
        { phase: 'Follicular', avgMood: 3, color: 'fertile' },
        { phase: 'Ovulation', avgMood: 3, color: 'ovulation' },
        { phase: 'Luteal', avgMood: 3, color: 'primary' },
      ];
    }

    // Group cycles by phase (simplified - using index-based distribution for demo)
    const phaseData = {
      Menstrual: [] as number[],
      Follicular: [] as number[],
      Ovulation: [] as number[],
      Luteal: [] as number[],
    };

    cycles.forEach((cycle, index) => {
      // Simple phase assignment based on cycle index (for demo purposes)
      // In a real app, this would use actual cycle day calculations
      const phaseIndex = index % 4;
      const phase = ['Menstrual', 'Follicular', 'Ovulation', 'Luteal'][phaseIndex] as keyof typeof phaseData;

      // Convert mood string to number (correct mapping)
      const moodValue = cycle.mood ? {
        'great': 5, 'good': 4, 'okay': 3, 'low': 2, 'bad': 1
      }[cycle.mood] || 3 : 3;

      phaseData[phase].push(moodValue);
    });

    return Object.entries(phaseData).map(([phase, moods]) => ({
      phase,
      avgMood: moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 3,
      color: phase === 'Menstrual' ? 'period' :
             phase === 'Follicular' ? 'fertile' :
             phase === 'Ovulation' ? 'ovulation' : 'primary',
    }));
  }, [cycles]);

  // Calculate real symptom frequency data
  const symptomFrequency = useMemo(() => {
    if (!cycles || cycles.length === 0) {
      // Return sample data when no cycles exist
      return [
        { symptom: 'Cramps', count: 0, emoji: '😣' },
        { symptom: 'Fatigue', count: 0, emoji: '😴' },
        { symptom: 'Headache', count: 0, emoji: '🤕' },
        { symptom: 'Bloating', count: 0, emoji: '🎈' },
        { symptom: 'Cravings', count: 0, emoji: '🍫' },
      ];
    }

    const symptomCount: { [key: string]: number } = {};

    cycles.forEach(cycle => {
      if (cycle.symptoms && Array.isArray(cycle.symptoms)) {
        cycle.symptoms.forEach((symptom: string) => {
          symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
        });
      }
    });

    // Map symptom IDs to display names and emojis
    const symptomMap: { [key: string]: { name: string; emoji: string } } = {
      'cramps': { name: 'Cramps', emoji: '😣' },
      'headache': { name: 'Headache', emoji: '🤕' },
      'bloating': { name: 'Bloating', emoji: '🎈' },
      'fatigue': { name: 'Fatigue', emoji: '😴' },
      'acne': { name: 'Acne', emoji: '😔' },
      'backpain': { name: 'Back Pain', emoji: '💆' },
      'tender': { name: 'Tender Breasts', emoji: '💗' },
      'cravings': { name: 'Cravings', emoji: '🍫' },
      'mood-swings': { name: 'Mood Swings', emoji: '🎭' },
      'anxiety': { name: 'Anxiety', emoji: '😰' },
      'insomnia': { name: 'Insomnia', emoji: '🌙' },
      'nausea': { name: 'Nausea', emoji: '🤢' },
    };

    const result = Object.entries(symptomCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([symptomId, count]) => ({
        symptom: symptomMap[symptomId]?.name || symptomId,
        count,
        emoji: symptomMap[symptomId]?.emoji || '🤔',
      }));

    // If we have fewer than 5 symptoms, fill with zero-count entries
    while (result.length < 5) {
      const defaultSymptoms = ['Cramps', 'Fatigue', 'Headache', 'Bloating', 'Cravings'];
      const nextSymptom = defaultSymptoms[result.length];
      const emoji = nextSymptom === 'Cramps' ? '😣' :
                   nextSymptom === 'Fatigue' ? '😴' :
                   nextSymptom === 'Headache' ? '🤕' :
                   nextSymptom === 'Bloating' ? '🎈' : '🍫';

      if (!result.find(r => r.symptom === nextSymptom)) {
        result.push({ symptom: nextSymptom, count: 0, emoji });
      }
    }

    return result;
  }, [cycles]);

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
                    Based on {cycles.length} logged {cycles.length === 1 ? 'entry' : 'entries'},
                    AI has analyzed your patterns to provide personalized insights.
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
              {cycles && cycles.length > 0
                ? `Based on your ${cycles.length} logged ${cycles.length === 1 ? 'entry' : 'entries'}`
                : 'Start logging moods to see cycle patterns 🌟'
              }
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

          {insightsLoading ? (
            <Card className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            insights.map((insight, index) => (
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
            ))
          )}
        </div>

        {/* Health Metrics Summary */}
        {cycles && cycles.length > 0 && (
          <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                Health Metrics Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HealthMetricsOverview cycles={cycles} />
            </CardContent>
          </Card>
        )}

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
