"use client";

import { useState, useEffect } from "react";
import { Bell, Trash2, Loader2, CheckCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Notification } from "@/lib/types";
import { notificationsApi } from "@/features/notifications/api";

export function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const [data, countData] = await Promise.all([
        notificationsApi.getNotifications(),
        notificationsApi.getUnreadCount(),
      ]);
      setNotifications(Array.isArray(data) ? data : []);
      setUnreadCount(countData?.count ?? 0);
    } catch {
      // errors toasted
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // errors toasted
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationsApi.deleteNotification(id);
      const notif = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (notif && !notif.isRead) setUnreadCount((c) => Math.max(0, c - 1));
      toast.success("تم حذف الإشعار");
    } catch {
      // errors toasted
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.allSettled(unread.map((n) => notificationsApi.markAsRead(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast.success("تم تعليم جميع الإشعارات كمقروءة");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">الإشعارات</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} جديد</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchNotifications} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            تحديث
          </Button>
          {unreadCount > 0 && (
            <Button variant="secondary" onClick={handleMarkAllRead} className="gap-2">
              <CheckCheck className="w-4 h-4" />
              تعليم الكل كمقروء
            </Button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>لا توجد إشعارات.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`transition-all ${!notif.isRead ? "border-primary/40 bg-primary/5" : ""}`}
            >
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                      notif.isRead ? "bg-muted" : "bg-primary"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.isRead ? "font-semibold" : ""}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notif.createdAt).toLocaleDateString("ar-SD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!notif.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:text-primary"
                      onClick={() => handleMarkRead(notif.id)}
                      title="تعليم كمقروء"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(notif.id)}
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
