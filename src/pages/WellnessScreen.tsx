import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BottomNav from "@/components/BottomNav";
import {
  Activity,
  Moon,
  Utensils,
  Target,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WellnessScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [nutritionNotes, setNutritionNotes] = useState("");
  const [wellnessGoal, setWellnessGoal] = useState("");

  const handleSaveExercise = () => {
    if (!exerciseMinutes) return;
    // TODO: Save to storage
    toast({
      title: "Exercise logged",
      description: `Recorded ${exerciseMinutes} minutes of exercise.`,
    });
    setExerciseMinutes("");
  };

  const handleSaveSleep = () => {
    if (!sleepHours) return;
    // TODO: Save to storage
    toast({
      title: "Sleep logged",
      description: `Recorded ${sleepHours} hours of sleep.`,
    });
    setSleepHours("");
  };

  const handleSaveNutrition = () => {
    if (!nutritionNotes) return;
    // TODO: Save to storage
    toast({
      title: "Nutrition logged",
      description: "Meal notes saved.",
    });
    setNutritionNotes("");
  };

  const handleSaveGoal = () => {
    if (!wellnessGoal) return;
    // TODO: Save to storage
    toast({
      title: "Goal set",
      description: "Wellness goal updated.",
    });
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
            Wellness
          </h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Track your health and wellness
        </p>
      </header>

      <main className="px-6 space-y-6">
        {/* Exercise Tracking */}
        <Card variant="glass" className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Exercise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Minutes exercised"
                value={exerciseMinutes}
                onChange={(e) => setExerciseMinutes(e.target.value)}
              />
              <Button onClick={handleSaveExercise}>Log</Button>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Tracking */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Sleep
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.5"
                placeholder="Hours slept"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
              />
              <Button onClick={handleSaveSleep}>Log</Button>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Tracking */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Nutrition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Log your meals and nutrition notes..."
              value={nutritionNotes}
              onChange={(e) => setNutritionNotes(e.target.value)}
              rows={3}
            />
            <Button onClick={handleSaveNutrition} className="w-full">Save Notes</Button>
          </CardContent>
        </Card>

        {/* Wellness Goals */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4" />
              Wellness Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Set your wellness goals..."
              value={wellnessGoal}
              onChange={(e) => setWellnessGoal(e.target.value)}
              rows={3}
            />
            <Button onClick={handleSaveGoal} className="w-full">Set Goal</Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default WellnessScreen;