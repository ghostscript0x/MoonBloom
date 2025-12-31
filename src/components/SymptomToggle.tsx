import { cn } from "@/lib/utils";
import { availableSymptoms } from "@/lib/constants";

interface SymptomToggleProps {
  selectedSymptoms: string[];
  onSymptomToggle: (symptomId: string) => void;
}

const SymptomToggle = ({ selectedSymptoms, onSymptomToggle }: SymptomToggleProps) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {availableSymptoms.map((symptom) => {
        const isSelected = selectedSymptoms.includes(symptom.id);
        return (
          <button
            key={symptom.id}
            onClick={() => onSymptomToggle(symptom.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all duration-200",
              "border-2 min-h-[80px]",
              "hover:scale-[1.02] active:scale-[0.98]",
              isSelected
                ? "bg-secondary border-primary/30 shadow-soft"
                : "bg-muted/50 border-transparent hover:bg-muted"
            )}
            aria-pressed={isSelected}
          >
            <span className="text-xl">{symptom.emoji}</span>
            <span className={cn(
              "text-xs font-medium text-center leading-tight",
              isSelected ? "text-foreground" : "text-muted-foreground"
            )}>
              {symptom.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SymptomToggle;
