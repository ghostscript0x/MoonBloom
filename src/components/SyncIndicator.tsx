import { Cloud, CloudOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSyncStatus } from "@/lib/offlineStorage";
import { useEffect, useState } from "react";

interface SyncIndicatorProps {
  showLabel?: boolean;
  className?: string;
}

const SyncIndicator = ({ showLabel = false, className }: SyncIndicatorProps) => {
  const [status, setStatus] = useState(getSyncStatus());

  useEffect(() => {
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

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
      {status.isOnline ? (
        status.pendingChanges === 0 ? (
          <>
            <Check className="w-3.5 h-3.5 text-fertile" />
            {showLabel && <span className="text-muted-foreground">Synced</span>}
          </>
        ) : (
          <>
            <Cloud className="w-3.5 h-3.5 text-primary animate-pulse" />
            {showLabel && (
              <span className="text-muted-foreground">
                {status.pendingChanges} change{status.pendingChanges > 1 ? 's' : ''} to sync
              </span>
            )}
          </>
        )
      ) : (
        <>
          <CloudOff className="w-3.5 h-3.5 text-muted-foreground" />
          {showLabel && (
            <span className="text-muted-foreground">Saved on your device</span>
          )}
        </>
      )}
    </div>
  );
};

export default SyncIndicator;
