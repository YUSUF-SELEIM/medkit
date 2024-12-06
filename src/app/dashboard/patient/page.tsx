"use client";

import { useState } from "react";
import { PatientSidebar } from "@/components/patient-sidebar";
import { CurrentPrescriptions } from "@/components/current-prescriptions";
import { MedicationHistory } from "@/components/medication-history";
import { PendingPrescriptions } from "@/components/pending-prescriptions";
import { HealthMetrics } from "@/components/health-metrics";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("Prescriptions");

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen md:flex-row w-full">
        <PatientSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            {activeTab === "Prescriptions" && <CurrentPrescriptions />}
            {activeTab === "History" && <MedicationHistory />}
            {activeTab === "Pending" && <PendingPrescriptions />}
            {activeTab === "Metrics" && <HealthMetrics />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
export default PatientDashboard;
