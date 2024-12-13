import { Pill, Clock, Calendar, Activity } from "lucide-react";
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

interface PatientSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function PatientSidebar({
  activeTab,
  setActiveTab,
}: PatientSidebarProps) {
  const menuItems = [
    { id: "Prescriptions", label: "Current Prescriptions", icon: Pill },
    { id: "History", label: "Medication History", icon: Clock },
    { id: "Pending", label: "Pending Prescriptions", icon: Calendar },
    { id: "Metrics", label: "Health Metrics", icon: Activity },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center">
          <SidebarTrigger className="mr-2 md:hidden " />
          <Image
            src="/images/logo.png"
            alt="Pharmacist"
            width={32}
            height={32}
            className="mr-2 h-8 w-8"
          />
          <h2 className="text-2xl font-bold">Patient</h2>
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
