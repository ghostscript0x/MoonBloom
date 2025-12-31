import { cn } from "@/lib/utils";
import { moodOptions } from "@/lib/constants";

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const MoodSelector = ({ selectedMood, onMoodSelect, size = 'md' }: MoodSelectorProps) => {
  const sizeClasses = {
    sm: "w-12 h-12 text-xl",
    md: "w-16 h-16 text-2xl",
    lg: "w-20 h-20 text-3xl",
  };

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {moodOptions.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onMoodSelect(mood.value)}
          className={cn(
            "rounded-full flex items-center justify-center transition-all duration-200",
            "hover:scale-110 active:scale-95",
            "border-2 border-transparent",
            sizeClasses[size],
            selectedMood === mood.value
              ? "bg-primary/20 border-primary shadow-soft scale-105"
              : "bg-muted hover:bg-muted/80"
          )}
          aria-label={`Select mood: ${mood.label}`}
          title={mood.label}
        >
          <span className="transform transition-transform duration-200 hover:animate-bounce-soft">
            {mood.emoji}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
