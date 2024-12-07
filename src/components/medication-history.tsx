"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, AlertCircle } from "lucide-react";

// Type definition for Medication
interface Medication {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  startDate: string;
  endDate: string;
  processed: boolean;
}

export function MedicationHistory() {
  // State management
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch medication history
  const fetchMedicationHistory = async () => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/medication-history", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to fetch medication history"
        );
      }

      const medicationHistory = await response.json();
      setMedications(medicationHistory);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching medication history:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMedicationHistory();
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <span>Loading medication history...</span>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication History</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center text-red-500 h-48">
          <AlertCircle className="mr-2 h-8 w-8" />
          <div>
            <p>Error: {error}</p>
            <button
              onClick={fetchMedicationHistory}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render empty state
  if (medications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication History</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-500 h-48 flex items-center justify-center">
          No medication history found.
        </CardContent>
      </Card>
    );
  }

  // Render medication history table
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
              <TableHead>Quantity</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell>{medication.name}</TableCell>
                <TableCell>{medication.dosage}</TableCell>
                <TableCell>{medication.quantity}</TableCell>
                <TableCell>
                  {new Date(medication.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(medication.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      medication.processed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {medication.processed ? "Processed" : "Pending"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default MedicationHistory;
