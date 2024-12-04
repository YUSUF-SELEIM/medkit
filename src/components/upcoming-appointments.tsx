import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const appointments = [
  {
    id: 1,
    date: "2023-07-15",
    time: "10:00 AM",
    doctor: "Dr. Smith",
    type: "Check-up",
  },
  {
    id: 2,
    date: "2023-07-22",
    time: "2:30 PM",
    doctor: "Dr. Johnson",
    type: "Follow-up",
  },
  {
    id: 3,
    date: "2023-08-05",
    time: "11:15 AM",
    doctor: "Dr. Williams",
    type: "Consultation",
  },
];

export function UpcomingAppointments() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <CardTitle>
              {appointment.date} at {appointment.time}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Doctor:</strong> {appointment.doctor}
            </p>
            <p>
              <strong>Type:</strong> {appointment.type}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
