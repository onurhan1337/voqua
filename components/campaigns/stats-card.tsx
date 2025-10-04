import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  isPrimary?: boolean;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  isPrimary = false,
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div
            className={`h-8 w-8 rounded-md flex items-center justify-center shadow-inner ${
              isPrimary
                ? "bg-primary/10 border border-primary/20"
                : "bg-muted border border-neutral-200"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${
                isPrimary ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
