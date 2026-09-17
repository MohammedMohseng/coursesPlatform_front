import { api } from "@/lib/api-client";
import type { Notification } from "@/lib/types";

export const notificationsApi = {
  getNotifications: () => api.get<Notification[]>("notification"),
  getUnreadCount: () => api.get<{ count: number }>("notification/unread-count"),
  markAsRead: (id: string) => api.patch<Notification>(`notification/${id}/read`),
  deleteNotification: (id: string) => api.delete<void>(`notification/${id}`),
};
