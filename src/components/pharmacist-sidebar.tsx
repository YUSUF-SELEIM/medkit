"use client";

import { Home, Package, Users, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface PharmacistSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function PharmacistSidebar({
  activeTab,
  setActiveTab,
}: PharmacistSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "prescriptions", label: "Prescriptions Management", icon: Users },
    { id: "suppliers", label: "Suppliers", icon: Truck },
  ];

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-2xl font-bold">Pharmacist</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full",
                      activeTab === item.id && "bg-muted"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
