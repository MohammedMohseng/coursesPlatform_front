"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users, Bell, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { coursesApi } from "@/features/courses/api";
import { enrollmentsApi } from "@/features/enrollments/api";
import { notificationsApi } from "@/features/notifications/api";
import { DashboardChart } from "@/components/ui/custom/charts";

export default function TeacherOverviewPage() {
  const { user, isLoading } = useUser();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    unreadNotifications: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [courses, unread] = await Promise.allSettled([
          coursesApi.getMyCourses(),
          notificationsApi.getUnreadCount(),
        ]);

        const myCourses =
          courses.status === "fulfilled" ? courses.value ?? [] : [];

        // Fetch enrollments per course and sum them up
        let totalStudents = 0;
        if (myCourses.length > 0) {
          const enrollmentResults = await Promise.allSettled(
            myCourses.map((c) => enrollmentsApi.getCourseEnrollments(c.id))
          );
          totalStudents = enrollmentResults.reduce((acc, r) => {
            if (r.status === "fulfilled" && Array.isArray(r.value)) {
              return acc + r.value.length;
            }
            return acc;
          }, 0);
        }

        setStats({
          totalCourses: myCourses.length,
          totalStudents,
          unreadNotifications:
            unread.status === "fulfilled" ? unread.value?.count ?? 0 : 0,
        });
      } finally {
        setLoadingStats(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    {
      label: "كورساتي",
      value: stats.totalCourses,
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      href: "/teacher/courses",
    },
    {
      label: "إجمالي الطلاب",
      value: stats.totalStudents,
      icon: <Users className="w-6 h-6 text-green-500" />,
      href: "/teacher/students",
    },
    {
      label: "إشعارات جديدة",
      value: stats.unreadNotifications,
      icon: <Bell className="w-6 h-6 text-purple-500" />,
      href: "/teacher/notifications",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">مرحباً أستاذ {user?.fullName ?? "..."} 👋</h1>
        <p className="text-muted-foreground mt-1">لوحة التحكم الخاصة بك</p>
      </div>

      {loadingStats ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link key={card.label} href={card.href}>
              <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col gap-3">
                  {card.icon}
                  <div>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <DashboardChart
        title="مؤشرات التدريس"
        description="تقدير سريع للأداء الأكاديمي والإشعارات"
        type="line"
        data={[
          { name: "الكورسات", total: stats.totalCourses },
          { name: "الطلاب", total: stats.totalStudents },
          { name: "الإشعارات", total: stats.unreadNotifications },
        ]}
        xKey="name"
        dataKeys={["total"]}
        config={{
          total: { label: "المجموع", color: "#22c55e" },
        }}
        summary={[
          { label: "الكورسات", value: stats.totalCourses },
          { label: "الطلاب", value: stats.totalStudents },
          { label: "الإشعارات", value: stats.unreadNotifications },
        ]}
      />

      <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground">روابط سريعة</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/teacher/courses" className="text-sm text-primary underline">إنشاء كورس جديد</Link>
          <span className="text-muted-foreground">·</span>
          <Link href="/teacher/lessons" className="text-sm text-primary underline">إدارة الدروس</Link>
          <span className="text-muted-foreground">·</span>
          <Link href="/teacher/students" className="text-sm text-primary underline">عرض الطلاب</Link>
          <span className="text-muted-foreground">·</span>
          <Link href="/teacher/profile" className="text-sm text-primary underline">تعديل الملف الشخصي</Link>
        </div>
      </div>
    </div>
  );
}
