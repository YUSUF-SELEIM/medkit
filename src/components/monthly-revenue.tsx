import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export function MonthlyRevenue() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-green-500">
          Total Monthly Revenue
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$10,000</div>
        <p className="text-xs text-muted-foreground text-green-500">
          +20.1% from last month
        </p>
        <div className="mt-4 h-[60px]">
          {/* We'll add a chart here later */}
        </div>
      </CardContent>
    </Card>
  );
}
