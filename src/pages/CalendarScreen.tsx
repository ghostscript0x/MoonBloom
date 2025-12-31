import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useCycles } from "@/hooks/useApi";
import { moodOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CalendarScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: cycles, isLoading } = useCycles();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate calendar data from real cycles
  const calendarData = useMemo(() => {
    if (!user || !cycles) return [];

    // Don't show predictions if user hasn't completed onboarding
    if (!user.lastPeriodStart) return [];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const logs = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);

      // Find cycle data for this date
      const cycleForDate = cycles.find(cycle => {
        const cycleDate = new Date(cycle.date);
        return cycleDate.toDateString() === date.toDateString();
      });

      // Calculate cycle day (simplified - would need more complex logic for real prediction)
      const daysSinceLastPeriod = user.lastPeriodStart ?
        Math.floor((date.getTime() - new Date(user.lastPeriodStart).getTime()) / (1000 * 60 * 60 * 24)) : 0;
      const cycleDay = daysSinceLastPeriod > 0 ? (daysSinceLastPeriod % (user.cycleLength || 28)) + 1 : undefined;
      const isPeriod = cycleDay && cycleDay <= (user.periodLength || 5);
      const isFertile = cycleDay && cycleDay >= 10 && cycleDay <= 16;
      const isOvulation = cycleDay === 14;

      logs.push({
        date,
        mood: cycleForDate?.mood,
        symptoms: cycleForDate?.symptoms,
        notes: cycleForDate?.notes,
        periodDay: isPeriod ? cycleDay : undefined,
        isPredictedPeriod: isPeriod && date > new Date(),
        isFertile,
        isOvulation,
      });
    }

    return logs;
  }, [year, month, user, cycles]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(year, month, day);
    navigate(`/day/${selectedDate.toISOString().split('T')[0]}`);
  };

  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  // Create calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayLog = calendarData.find(
      (d) => d.date.getDate() === day
    );
    calendarDays.push({ day, log: dayLog });
  }

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold font-display text-foreground">
            Calendar
          </h1>
          {!isCurrentMonth && (
            <Button variant="soft" size="sm" onClick={goToToday}>
              Today
            </Button>
          )}
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold font-display text-foreground">
            {monthNames[month]} {year}
          </h2>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Legend */}
      <div className="px-6 mb-4">
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-period" />
            <span className="text-muted-foreground">Period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-fertile" />
            <span className="text-muted-foreground">Fertile</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border-2 border-dashed border-period/50" />
            <span className="text-muted-foreground">Predicted</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <main className="px-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayData, index) => {
            if (!dayData) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const { day, log } = dayData;
            const isToday =
              isCurrentMonth && today.getDate() === day;
            const isPeriod = log?.periodDay !== undefined;
            const isPredicted = log?.isPredictedPeriod;
            const isFertile = log?.isFertile && !isPeriod;
            const isOvulation = log?.isOvulation;
            const hasMood = log?.mood;

            const moodEmoji = hasMood
              ? moodOptions.find((m) => m.value === log.mood)?.emoji
              : null;

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200",
                  "hover:bg-muted/50 active:scale-95",
                  isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                  isPeriod && !isPredicted && "bg-period-light",
                  isPredicted && "border-2 border-dashed border-period/50",
                  isFertile && "bg-fertile-light",
                  isOvulation && "bg-ovulation-light"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    isToday && "text-primary font-bold",
                    isPeriod && !isPredicted && "text-period",
                    isFertile && "text-fertile",
                    !isToday && !isPeriod && !isFertile && "text-foreground"
                  )}
                >
                  {day}
                </span>
                {moodEmoji && (
                  <span className="text-[10px]">{moodEmoji}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Info card */}
        <div className="mt-6 p-4 bg-secondary/50 rounded-2xl">
          <p className="text-sm text-center text-muted-foreground">
            Tap any day to see details or add a log 💕
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CalendarScreen;
