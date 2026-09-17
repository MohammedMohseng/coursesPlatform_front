'use client';

import {
  // User,
  // BookOpen,
  // Video,
  // Users,
  // CreditCard,
  // BarChart3,
  // StickyNote,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/custom/logo";
import { clearAuth } from "@/lib/auth";

import { UserRole, User } from "@/lib/types";
export function CustomSidebar({
  role,
  activeTab,
  setActiveTab,
  user,
  tabs
}: {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  tabs: { id: string; label: string; icon: any }[];
}) {

  const menuItems = tabs
  function signOut() {
    clearAuth(true);
  }
  return (
    <Sidebar collapsible="icon" className="absolute right-0">
      {/* Brand/Logo */}
      <SidebarHeader className="flex gap-3 py-3 border-b border-sidebar-border">
        <Logo className="max-w-12" />
      </SidebarHeader>
      <SidebarContent className="!justify-between h-full">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                }`}
                      variant={!isActive ? "outline" : "default"}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={signOut}
                  variant={"outline"}
                  className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                >
                  <LogOut className="w-5 h-5" />
                  <span>تسجيل الخروج</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
