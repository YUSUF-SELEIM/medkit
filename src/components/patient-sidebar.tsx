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
} from "@/components/ui/sidebar";

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
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-2xl font-bold">Patient</h2>
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
