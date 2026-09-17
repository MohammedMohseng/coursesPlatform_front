"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getUserRole, clearAuth } from "@/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { BookOpen, User, CreditCard, Bell, LayoutDashboard, LogOut } from "lucide-react";
import {Logo} from '@/components/ui/custom/logo';
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const getNavigationConfig = (role: string | null) => {
  
  if (role === "STUDENT") {
    return [
      { title: "نظرة عامة", url: "/student", icon: LayoutDashboard },
      { title: "دوراتي", url: "/student/courses", icon: BookOpen },
      { title: "الدروس", url: "/student/lessons", icon: BookOpen },
      { title: "المدفوعات", url: "/student/payments", icon: CreditCard },
      { title: "الإشعارات", url: "/student/notifications", icon: Bell },
      { title: "الملف الشخصي", url: "/student/profile", icon: User },
    ];
  }

  if (role === "TEACHER") {
    return [
      { title: "نظرة عامة", url: "/teacher", icon: LayoutDashboard },
      { title: "دوراتي", url: "/teacher/courses", icon: BookOpen },
      { title: "الدروس", url: "/teacher/lessons", icon: BookOpen },
      { title: "الطلاب", url: "/teacher/students", icon: User },
      { title: "الإشعارات", url: "/teacher/notifications", icon: Bell },
      { title: "الملف الشخصي", url: "/teacher/profile", icon: User },
    ];
  }

  if (role === "ADMIN") {
    return [
      { title: "نظرة عامة", url: "/admin", icon: LayoutDashboard },
      { title: "المستخدمون", url: "/admin/users", icon: User },
      { title: "المواد الدراسية", url: "/admin/subjects", icon: BookOpen },
      { title: "المدفوعات", url: "/admin/payments", icon: CreditCard },
      { title: "التسجيلات", url: "/admin/enrollments", icon: BookOpen },
      { title: "الإشعارات", url: "/admin/notifications", icon: Bell },
      { title: "الملف الشخصي", url: "/admin/profile", icon: User },
    ];
  }

  return [];
};

export function AppSidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
 
  useEffect(() => {
    async function name() {
      setRole(getUserRole());
    }
    name()
  }, []);

  const navItems = getNavigationConfig(role);

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader className="p-2 font-bold text-xl">
        <Button variant="ghost" className="w-full justify-start gap-2">
        <Logo className="max-w-12 bg-primary text-primary-foreground m-0" />
        <span>Edu paatfform</span>
        </Button>
      </SidebarHeader>
      <SidebarContent className='p-2'>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => clearAuth(true)}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
