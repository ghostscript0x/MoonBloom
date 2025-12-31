import { cn } from "@/lib/utils";

interface CycleRingProps {
  cycleDay: number;
  cycleLength: number;
  isPeriod: boolean;
  isFertile: boolean;
  daysUntilPeriod: number;
  className?: string;
}

const CycleRing = ({
  cycleDay,
  cycleLength,
  isPeriod,
  isFertile,
  daysUntilPeriod,
  className,
}: CycleRingProps) => {
  const progress = (cycleDay / cycleLength) * 100;
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative w-48 h-48 animate-scale-in", className)}>
      {/* Background ring */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
        />
        {/* Progress ring */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke={isPeriod ? "hsl(var(--period))" : isFertile ? "hsl(var(--fertile))" : "hsl(var(--primary))"}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold font-display text-foreground">
          {isPeriod ? (
            <>Day {cycleDay}</>
          ) : (
            <>
              {daysUntilPeriod}
              <span className="text-lg font-normal text-muted-foreground ml-1">days</span>
            </>
          )}
        </span>
        <span className={cn(
          "text-sm font-medium mt-1 px-3 py-1 rounded-full",
          isPeriod && "bg-period-light text-period",
          isFertile && !isPeriod && "bg-fertile-light text-fertile",
          !isPeriod && !isFertile && "text-muted-foreground"
        )}>
          {isPeriod ? "Period" : isFertile ? "Fertile window" : "Until period"}
        </span>
      </div>

      {/* Decorative dots */}
      <div className="absolute inset-0 animate-pulse-soft">
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x = 100 + 75 * Math.cos(angle - Math.PI / 2);
          const y = 100 + 75 * Math.sin(angle - Math.PI / 2);
          return (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/20"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CycleRing;
