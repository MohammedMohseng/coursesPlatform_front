"use client";

import { useEffect, useState } from "react";
import { BookOpen, CreditCard, Bell, Loader2, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { enrollmentsApi } from "@/features/enrollments/api";
import { paymentsApi } from "@/features/payments/api";
import { notificationsApi } from "@/features/notifications/api";
import { Loading } from "@/components/ui/custom/loading";

export default function StudentOverviewPage() {
  const { user, isLoading } = useUser();
  const [stats, setStats] = useState({
    totalCourses: 0,
    approvedCourses: 0,
    pendingPayments: 0,
    unreadNotifications: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [enrollments, payments, unread] = await Promise.allSettled([
          enrollmentsApi.getMyEnrollments(),
          paymentsApi.getMyPayments(),
          notificationsApi.getUnreadCount(),
        ]);

        setStats({
          totalCourses:
            enrollments.status === "fulfilled" ? enrollments.value?.length ?? 0 : 0,
          approvedCourses:
            enrollments.status === "fulfilled"
              ? enrollments.value?.filter((e) => e.paymentStatus === "APPROVED").length ?? 0
              : 0,
          pendingPayments:
            payments.status === "fulfilled"
              ? payments.value?.filter((p) => p.status === "PENDING").length ?? 0
              : 0,
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
      href: "/student/courses",
    },
    {
      label: "كورسات مفعّلة",
      value: stats.approvedCourses,
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      href: "/student/lessons",
    },
    {
      label: "دفعات معلقة",
      value: stats.pendingPayments,
      icon: <CreditCard className="w-6 h-6 text-amber-500" />,
      href: "/student/payments",
    },
    {
      label: "إشعارات جديدة",
      value: stats.unreadNotifications,
      icon: <Bell className="w-6 h-6 text-purple-500" />,
      href: "/student/notifications",
    },
  ];

  const links = [
    { label: "تصفح كورساتي", href: "/student/courses" },
    { label: "رفع إيصال دفع", href: "/student/payments" },
    { label: "الدروس المتاحة", href: "/student/lessons" },
    { label: "تعديل الملف الشخصي", href: "/student/profile" },
  ];

  return (
    <div className="space-y-6">

      {loadingStats ? (
        <div className="flex justify-center py-10">
          <Loading />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Quick links */}
      <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground">روابط سريعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {links.map((link) => (
            <Link key={link.label} href={link.href}>
              <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="px-4 py-2 flex gap-3">
                  <p className="text-sm text-center font-medium">{link.label}</p>
                  <ArrowLeft className="w-5 h-5 text-foreground mx-auto" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
