"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  BarChart2, 
  Calendar, 
  Lightbulb, 
  AlertCircle, 
  BrainCircuit,
  LayoutDashboard
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Meetings", href: "/meetings", icon: Calendar },
  { name: "Alerts", href: "/alerts", icon: AlertCircle },
  { name: "Memory", href: "/memory", icon: BrainCircuit },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" className="border-r shadow-sm border-slate-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BarChart2 className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">OmniSync</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Intelligence
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      isActive={isActive} 
                      tooltip={item.name}
                      onClick={() => window.location.href = item.href}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3 py-2 text-sm font-medium w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
