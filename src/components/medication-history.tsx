import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const medicationHistory = [
  { id: 1, name: "Amoxicillin", dosage: "500mg", startDate: "2023-01-15", endDate: "2023-01-25" },
  { id: 2, name: "Lisinopril", dosage: "10mg", startDate: "2023-02-01", endDate: "2023-07-31" },
  { id: 3, name: "Metformin", dosage: "1000mg", startDate: "2023-03-10", endDate: "2023-09-10" },
]

export function MedicationHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicationHistory.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell>{medication.name}</TableCell>
                <TableCell>{medication.dosage}</TableCell>
                <TableCell>{medication.startDate}</TableCell>
                <TableCell>{medication.endDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

