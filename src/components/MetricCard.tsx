import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = "neutral",
  className 
}: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getTrendIcon = () => {
    if (!change) return null;
    const color = getTrendColor();
    return (
      <span className={cn("text-sm font-medium", color)}>
        {trend === "up" && "↗ "}
        {trend === "down" && "↘ "}
        {change}
      </span>
    );
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className="mt-1">
            {getTrendIcon()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}