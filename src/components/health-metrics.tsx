import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart, Thermometer, Droplet } from "lucide-react";

const metrics = [
  { id: 1, name: "Blood Pressure", value: "120/80 mmHg", icon: Activity },
  { id: 2, name: "Heart Rate", value: "72 bpm", icon: Heart },
  { id: 3, name: "Temperature", value: "98.6°F", icon: Thermometer },
  { id: 4, name: "Blood Sugar", value: "100 mg/dL", icon: Droplet },
];

export function HealthMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
