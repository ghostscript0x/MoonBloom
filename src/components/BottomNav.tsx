import { Home, Calendar, PlusCircle, User, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: PlusCircle, label: "Log", path: "/log" },
  { icon: Sparkles, label: "Insights", path: "/insights" },
  { icon: User, label: "Me", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          const isLog = path === "/log";

          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-2 px-2 rounded-xl transition-all duration-200",
                isActive && !isLog && "text-primary",
                !isActive && !isLog && "text-muted-foreground hover:text-foreground",
                isLog && "relative"
              )}
            >
              {isLog ? (
                <div className={cn(
                  "flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200",
                  "bg-gradient-to-br from-primary to-accent shadow-soft",
                  isActive && "shadow-glow scale-110"
                )}>
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
              ) : (
                <>
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )} />
                  <span className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
