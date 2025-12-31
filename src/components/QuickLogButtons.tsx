import { Link } from "react-router-dom";
import { Droplets, Smile, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const quickActions = [
  {
    icon: Droplets,
    label: "Period",
    path: "/log?tab=period",
    gradient: "from-period to-period/80",
    bgLight: "bg-period-light",
  },
  {
    icon: Smile,
    label: "Mood",
    path: "/log?tab=mood",
    gradient: "from-primary to-primary/80",
    bgLight: "bg-primary/10",
  },
  {
    icon: Stethoscope,
    label: "Symptoms",
    path: "/log?tab=symptoms",
    gradient: "from-accent to-accent/80",
    bgLight: "bg-accent/10",
  },
];

const QuickLogButtons = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      {quickActions.map(({ icon: Icon, label, path, gradient, bgLight }) => (
        <Link
          key={label}
          to={path}
          className={cn(
            "flex flex-col items-center gap-2 group"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center",
            "transition-all duration-200",
            "group-hover:scale-105 group-active:scale-95",
            "bg-gradient-to-br shadow-soft",
            gradient
          )}>
            <Icon className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default QuickLogButtons;
