"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useUser } from "@/hooks/useUser";
import { User } from "lucide-react";
import ThemeToggle from "@/components/themes/theme-manager";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen overflow-y-auto flex flex-col bg-background">
        <header className="p-4 border-b flex items-center">
          <SidebarTrigger />
          <div className="flex items-center justify-between w-full  mx-4">
            <h1 className="text-lg font-semibold">لوحة التحكم</h1>
            <div className="flex gap-3 max-w-[200px] items-center">
              <ThemeToggle />
              <div className="relative w-10 h-10 rounded-full bg-muted border-2 border-primary flex items-center justify-center overflow-hidden">
                {user?.avatarUrl ? (
                  <img
                    src={user?.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-muted-foreground" />
                )}
              </div>
              <h2 className="text-m">{user?.fullName || "Student"}</h2>
            </div>
          </div>

        </header>
        <div className="p-4 flex-1">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
