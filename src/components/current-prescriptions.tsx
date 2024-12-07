"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PillIcon, Clipboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "./ui/spinner";

interface Medication {
  med_id: string;
  name: string;
  quantity: number;
}

interface Prescription {
  prescription_id: string;
  issue_date: string;
  end_date: string;
  processed: boolean;
  Prescription_Medication?: {
    Medication: Medication;
    dosage: string;
    quantity: number;
  }[];
}

export function CurrentPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrescriptions() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User is not authenticated");
        }

        const response = await fetch("/api/prescriptions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch prescriptions");
        }

        const data = await response.json();
        setPrescriptions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchPrescriptions();
  }, []);

  if (isLoading) {
    return <Spinner className="h-20 w-20 mx-auto mt-52" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center">
        <Clipboard className="mr-2 h-6 w-6 text-muted-foreground" />
        Current Prescriptions
      </h2>
      {prescriptions.length === 0 ? (
        <p className="text-muted-foreground">No current prescriptions</p>
      ) : (
        prescriptions.map((prescription) => {
          // Safely handle prescriptions without medications
          const medications = prescription.Prescription_Medication || [];

          return (
            <Card key={prescription.prescription_id} className="w-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <PillIcon className="h-5 w-5" />
                  Prescription Details
                </CardTitle>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">Start:</span>{" "}
                    {new Date(prescription.issue_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">End:</span>{" "}
                    {new Date(prescription.end_date).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medications.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No medications associated with this prescription
                    </p>
                  ) : (
                    medications.map((item, index) => (
                      <React.Fragment key={item.Medication?.med_id || index}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base">
                              {item.Medication?.name || "Unknown Medication"}
                            </h3>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {item.dosage}
                          </Badge>
                        </div>
                      </React.Fragment>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
