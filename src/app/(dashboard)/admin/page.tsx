"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users, CreditCard, Bell, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { usersApi } from "@/features/users/api";
import { subjectsApi } from "@/features/subjects/api";
import { paymentsApi } from "@/features/payments/api";
import { notificationsApi } from "@/features/notifications/api";
import { ChartContainer } from "@/components/ui/chart";

interface Stats {
  totalUsers: number;
  pendingUsers: number;
  pendingPayments: number;
  totalSubjects: number;
  unreadNotifications: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [users, subjects, payments, unread] = await Promise.allSettled([
          usersApi.getAllUsers(),
          subjectsApi.getSubjects(),
          paymentsApi.getPendingPayments(),
          notificationsApi.getUnreadCount(),
        ]);

        setStats({
          totalUsers:
            users.status === "fulfilled" && Array.isArray(users.value)
              ? users.value.length
              : 0,
          pendingUsers:
            users.status === "fulfilled" && Array.isArray(users.value)
              ? users.value.filter((u) => u.status === "PENDING").length
              : 0,
          pendingPayments:
            payments.status === "fulfilled" && Array.isArray(payments.value)
              ? payments.value.length
              : 0,
          totalSubjects:
            subjects.status === "fulfilled" && Array.isArray(subjects.value)
              ? subjects.value.length
              : 0,
          unreadNotifications:
            unread.status === "fulfilled" ? unread.value?.count ?? 0 : 0,
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);


  const cards = stats
    ? [
      {
        label: "إجمالي المستخدمين",
        value: stats.totalUsers,
        icon: <Users className="w-6 h-6 text-blue-500" />,
        href: "/admin/users",
      },
      {
        label: "حسابات معلقة",
        value: stats.pendingUsers,
        icon: <Users className="w-6 h-6 text-amber-500" />,
        href: "/admin/users",
      },
      {
        label: "دفعات تنتظر المراجعة",
        value: stats.pendingPayments,
        icon: <CreditCard className="w-6 h-6 text-red-500" />,
        href: "/admin/payments",
      },
      {
        label: "إجمالي المواد",
        value: stats.totalSubjects,
        icon: <BookOpen className="w-6 h-6 text-green-500" />,
        href: "/admin/subjects",
      },
      {
        label: "إشعارات غير مقروءة",
        value: stats.unreadNotifications,
        icon: <Bell className="w-6 h-6 text-purple-500" />,
        href: "/admin/notifications",
      },
    ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
        <p className="text-muted-foreground mt-1">ملخص عام لحالة المنصة</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <a key={card.label} href={card.href}>
              <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col gap-3">
                  {card.icon}
                  <div>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {card.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

      )}

      <div className="border-primary radius-md w-full min-h-[30vh]">
      {/* <ChartContainer config={{}}>
        
      </ChartContainer> */}
      </div>
    </div>
  );
}
