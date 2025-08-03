import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Alert {
  id: string;
  type: "delay" | "stockout" | "warning";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
}

interface AlertItemProps {
  alert: Alert;
}

export function AlertItem({ alert }: AlertItemProps) {
  const getIcon = () => {
    switch (alert.type) {
      case "delay":
        return <Clock className="h-4 w-4" />;
      case "stockout":
        return <Package className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = () => {
    switch (alert.priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  const getCardBorder = () => {
    switch (alert.priority) {
      case "high":
        return "border-l-4 border-l-destructive";
      case "medium":
        return "border-l-4 border-l-warning";
      default:
        return "border-l-4 border-l-muted";
    }
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", getCardBorder())}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2 rounded-full",
              alert.priority === "high" ? "bg-destructive/10 text-destructive" :
              alert.priority === "medium" ? "bg-warning/10 text-warning" :
              "bg-muted text-muted-foreground"
            )}>
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-foreground">{alert.title}</h4>
                <Badge variant={getBadgeVariant()} className="text-xs">
                  {alert.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{alert.description}</p>
              <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}