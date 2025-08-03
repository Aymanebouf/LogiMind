import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface ChartData {
  name: string;
  reel?: number;
  predit?: number;
  demande?: number;
}

interface ChartWrapperProps {
  title: string;
  data: ChartData[];
  className?: string;
  type?: "demand" | "forecast";
}

export function ChartWrapper({ title, data, className, type = "demand" }: ChartWrapperProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-xs" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--card-foreground))'
              }}
            />
            <Legend />
            
            {type === "demand" && (
              <Line 
                type="monotone" 
                dataKey="demande" 
                stroke="hsl(var(--chart-primary))" 
                strokeWidth={2}
                name="Demande"
                dot={{ fill: 'hsl(var(--chart-primary))', strokeWidth: 2, r: 4 }}
              />
            )}
            
            {type === "forecast" && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="reel" 
                  stroke="hsl(var(--chart-primary))" 
                  strokeWidth={2}
                  name="Réel"
                  dot={{ fill: 'hsl(var(--chart-primary))', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predit" 
                  stroke="hsl(var(--chart-secondary))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Prédit"
                  dot={{ fill: 'hsl(var(--chart-secondary))', strokeWidth: 2, r: 4 }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}