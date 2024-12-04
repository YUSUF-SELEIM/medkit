import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const prescriptions = [
  {
    id: 1,
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "3 times a day",
    status: "active",
    progress: 60,
  },
  {
    id: 2,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    status: "active",
    progress: 80,
  },
  {
    id: 3,
    name: "Metformin",
    dosage: "1000mg",
    frequency: "Twice daily",
    status: "completed",
    progress: 100,
  },
];

export function CurrentPrescriptions() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Current Prescriptions</h2>
      {prescriptions.map((prescription) => (
        <Card key={prescription.id}>
          <CardHeader>
            <CardTitle>{prescription.name}</CardTitle>
            <CardDescription>
              {prescription.dosage} - {prescription.frequency}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <Badge
                variant={
                  prescription.status === "active" ? "default" : "secondary"
                }
              >
                {prescription.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {prescription.progress}% completed
              </span>
            </div>
            <Progress value={prescription.progress} className="w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
