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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";

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
    { id: "orders", label: "Orders", icon: Truck },
  ];

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-4 border-b flex">
        <div className="flex">
          <SidebarTrigger className="mr-2 md:hidden " />
          <Image
            src="/images/logo.png"
            alt="Pharmacist"
            width={32}
            height={32}
            className="h-8 w-8 mr-2"
          />
          <h2 className="text-2xl font-bold">Pharmacist</h2>
        </div>
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
