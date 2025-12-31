import { Cloud, CloudOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SyncIndicatorProps {
  showLabel?: boolean;
  className?: string;
}

const SyncIndicator = ({ showLabel = false, className }: SyncIndicatorProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={cn(
      "flex items-center gap-2 text-xs",
      className
    )}>
      {isOnline ? (
        <>
          <Cloud className="w-3.5 h-3.5 text-primary" />
          {showLabel && <span className="text-muted-foreground">Online</span>}
        </>
      ) : (
        <>
          <CloudOff className="w-3.5 h-3.5 text-muted-foreground" />
          {showLabel && <span className="text-muted-foreground">Offline</span>}
        </>
      )}
    </div>
  );
};

export default SyncIndicator;
