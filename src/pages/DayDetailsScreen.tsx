import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Droplets, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile, useCycles } from "@/hooks/useApi";
import { moodOptions, availableSymptoms } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const DayDetailsScreen = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { data: cycles } = useCycles();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedDate = useMemo(() => {
    if (!date) return new Date();
    return new Date(date);
  }, [date]);

  const currentUser = userProfile || user;

  const dayLog = useMemo(() => {
    if (!cycles || !currentUser) return null;

    // Find cycle data for this specific date
    const cycleForDate = cycles.find(cycle => {
      const cycleDate = new Date(cycle.date);
      return cycleDate.toDateString() === selectedDate.toDateString();
    });

    if (!cycleForDate) return null;

    // Calculate cycle day for predictions
    const daysSinceLastPeriod = currentUser.lastPeriodStart ?
      Math.floor((selectedDate.getTime() - new Date(currentUser.lastPeriodStart).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const cycleDay = daysSinceLastPeriod > 0 ? (daysSinceLastPeriod % (currentUser.cycleLength || 28)) + 1 : undefined;
    const isPeriod = cycleDay && cycleDay <= (currentUser.periodLength || 5);
    const isFertile = cycleDay && cycleDay >= 10 && cycleDay <= 16;
    const isOvulation = cycleDay === 14;

    return {
      date: selectedDate,
      mood: cycleForDate.mood,
      symptoms: cycleForDate.symptoms,
      notes: cycleForDate.notes,
      periodDay: isPeriod ? cycleDay : undefined,
      isPredictedPeriod: isPeriod && selectedDate > new Date(),
      isFertile,
      isOvulation,
    };
  }, [selectedDate, cycles, currentUser]);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isPast = selectedDate < new Date();
  const isPeriod = dayLog?.periodDay !== undefined;
  const isFertile = dayLog?.isFertile && !isPeriod;
  const isOvulation = dayLog?.isOvulation;

  const moodData = dayLog?.mood
    ? moodOptions.find((m) => m.value === dayLog.mood)
    : null;

  const symptomData = dayLog?.symptoms?.map((s) =>
    availableSymptoms.find((sym) => sym.id === s)
  ).filter(Boolean);

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast({
      title: "Deleted",
      description: "Your log has been removed.",
    });
    setIsDeleting(false);
    navigate("/calendar");
  };

  const hasAnyLog = moodData || (symptomData && symptomData.length > 0) || dayLog?.notes;

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/calendar")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold font-display text-foreground">
              {isToday ? "Today" : formatDate(selectedDate)}
            </h1>
            {isToday && (
              <p className="text-sm text-muted-foreground">
                {formatDate(selectedDate)}
              </p>
            )}
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {isPeriod && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-period-light text-period text-sm font-medium">
              <Droplets className="w-4 h-4" />
              Period day {dayLog?.periodDay}
            </span>
          )}
          {isFertile && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fertile-light text-fertile text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Fertile window
            </span>
          )}
          {isOvulation && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ovulation-light text-ovulation text-sm font-medium">
              ✨ Ovulation
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="px-6 space-y-4 pb-8">
        {/* Mood Card */}
        {moodData ? (
          <Card variant="glass" className="animate-slide-up">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                Mood
                <Link to={`/log?tab=mood`}>
                  <Button variant="ghost" size="icon-sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-3xl">
                  {moodData.emoji}
                </div>
                <div>
                  <p className="font-medium text-foreground capitalize">
                    {moodData.label}
                  </p>
                  {dayLog?.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      "{dayLog.notes}"
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card variant="interactive" className="animate-slide-up">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-3">No mood logged</p>
              <Link to="/log?tab=mood">
                <Button variant="soft" size="sm">
                  Log your mood
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Symptoms Card */}
        {symptomData && symptomData.length > 0 ? (
          <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                Symptoms
                <Link to={`/log?tab=symptoms`}>
                  <Button variant="ghost" size="icon-sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {symptomData.map((symptom) => (
                  <span
                    key={symptom?.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm"
                  >
                    <span>{symptom?.emoji}</span>
                    <span className="text-foreground">{symptom?.label}</span>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card variant="interactive" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-3">No symptoms logged</p>
              <Link to="/log?tab=symptoms">
                <Button variant="soft" size="sm">
                  Log symptoms
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Notes Card */}
        {dayLog?.notes && (
          <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">{dayLog.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {hasAnyLog && (
          <div className="pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete all logs for this day
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90%] rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this day's logs?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all mood, symptom, and note entries for this day.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Empty state for future dates */}
        {!isPast && !isToday && !hasAnyLog && (
          <Card variant="cozy" className="animate-slide-up">
            <CardContent className="p-6 text-center">
              <p className="text-foreground/80 mb-2">
                This day is in the future 🌸
              </p>
              <p className="text-sm text-muted-foreground">
                Come back when the day arrives to log how you're feeling.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default DayDetailsScreen;
