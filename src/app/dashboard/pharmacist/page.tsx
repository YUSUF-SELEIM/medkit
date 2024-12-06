"use client";

import { useState } from "react";
import { PharmacistSidebar } from "@/components/pharmacist-sidebar";
import { PharmacyDashboardMetrics } from "@/components/pharmacy-dashboard-metrics";
import InventoryManagement from "@/components/inventory-management";
import SupplierManagement from "@/components/supplier-management";
import PrescriptionsManagement from "@/components/prescription-management";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function PharmacistDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen md:flex-row w-full">
        <PharmacistSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            {activeTab === "dashboard" && <PharmacyDashboardMetrics />}
            {activeTab === "inventory" && <InventoryManagement />}
            {activeTab === "prescriptions" && <PrescriptionsManagement />}
            {activeTab === "suppliers" && <SupplierManagement />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default PharmacistDashboard;
