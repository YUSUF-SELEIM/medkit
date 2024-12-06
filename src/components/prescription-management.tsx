"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

interface Medication {
  med_id: string;
  name: string;
  quantity: number;
}

interface Prescription {
  prescription_id: string;
  patient_id: string;
  patient_name: string;
  issue_date: string;
  processed: boolean;
  Prescription_Medication: Medication[];
}

export default function PrescriptionsManagement() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [isProcessingDialog, setIsProcessingDialog] = useState(false);

  // Fetch pending prescriptions
  const fetchPendingPrescriptions = async () => {
    try {
      const response = await fetch("/api/pharmacist/pending-prescriptions");
      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch pending prescriptions",
        variant: "destructive",
      });
    }
  };

  // Handle prescription acceptance
  const handleAcceptPrescription = async () => {
    if (!selectedPrescription) return;

    try {
      const response = await fetch("/api/pharmacist/process-prescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prescription_id: selectedPrescription.prescription_id,
          medications: selectedPrescription.Prescription_Medication,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process prescription");
      }

      const result = await response.json();

      // Update local state
      setPrescriptions(
        prescriptions.filter(
          (p) => p.prescription_id !== selectedPrescription.prescription_id
        )
      );

      toast({
        title: "Success",
        description: "Prescription processed successfully",
        variant: "default",
      });

      setIsProcessingDialog(false);
      setSelectedPrescription(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process prescription",
        variant: "destructive",
      });
    }
  };

  // Handle prescription rejection
  const handleRejectPrescription = async () => {
    if (!selectedPrescription) return;

    try {
      const response = await fetch("/api/pharmacist/reject-prescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prescription_id: selectedPrescription.prescription_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject prescription");
      }

      // Update local state
      setPrescriptions(
        prescriptions.filter(
          (p) => p.prescription_id !== selectedPrescription.prescription_id
        )
      );

      toast({
        title: "Prescription Rejected",
        description: "Prescription has been rejected",
        variant: "default",
      });

      setIsProcessingDialog(false);
      setSelectedPrescription(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not reject prescription",
        variant: "destructive",
      });
    }
  };

  // Fetch prescriptions on component mount
  useEffect(() => {
    fetchPendingPrescriptions();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pending Prescriptions</h2>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prescription ID</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Medications</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((prescription) => (
              <TableRow key={prescription.prescription_id}>
                <TableCell>{prescription.prescription_id}</TableCell>
                <TableCell>{prescription.patient_name}</TableCell>
                <TableCell>
                  {new Date(prescription.issue_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {prescription.Prescription_Medication.map((med) => (
                    <div key={med.med_id}>
                      {med.name} (Qty: {med.quantity})
                    </div>
                  ))}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => {
                      setSelectedPrescription(prescription);
                      setIsProcessingDialog(true);
                    }}
                    className="mr-2"
                  >
                    Process
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Prescription Processing Dialog */}
      <Dialog
        open={isProcessingDialog}
        onOpenChange={(open) => {
          if (!open) {
            setIsProcessingDialog(false);
            setSelectedPrescription(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Prescription</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Prescription Details
              </h3>
              <div className="space-y-2 mb-4">
                <p>Patient: {selectedPrescription.patient_name}</p>
                <p>
                  Issue Date:{" "}
                  {new Date(
                    selectedPrescription.issue_date
                  ).toLocaleDateString()}
                </p>
                <div>
                  <strong>Medications:</strong>
                  {selectedPrescription.Prescription_Medication.map((med) => (
                    <div key={med.med_id} className="ml-4">
                      {med.name} - Quantity: {med.quantity}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={handleAcceptPrescription}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle className="mr-2 h-5 w-5" /> Accept
                </Button>
                <Button
                  onClick={handleRejectPrescription}
                  variant="destructive"
                >
                  <XCircle className="mr-2 h-5 w-5" /> Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
