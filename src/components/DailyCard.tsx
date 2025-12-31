import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface DailyCardProps {
  message: string;
}

const DailyCard = ({ message }: DailyCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-card to-secondary/30 shadow-soft border-primary/10 animate-slide-up">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary animate-pulse-soft" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground/90 leading-relaxed">
              {message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Daily reminder just for you
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyCard;
