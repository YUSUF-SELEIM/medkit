"use client";

import { useState } from "react";
import { PatientSidebar } from "@/components/patient-sidebar";
import { CurrentPrescriptions } from "@/components/current-prescriptions";
import { MedicationHistory } from "@/components/medication-history";
import { UpcomingAppointments } from "@/components/upcoming-appointments";
import { HealthMetrics } from "@/components/health-metrics";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("prescriptions");

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen md:flex-row w-full">
        <PatientSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            {activeTab === "prescriptions" && <CurrentPrescriptions />}
            {activeTab === "history" && <MedicationHistory />}
            {activeTab === "appointments" && <UpcomingAppointments />}
            {activeTab === "metrics" && <HealthMetrics />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
export default PatientDashboard;
