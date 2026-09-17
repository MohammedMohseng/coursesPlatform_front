import { api } from "@/lib/api-client";
import type { Payment } from "@/lib/types";

export const paymentsApi = {
  uploadPayment: (enrollmentId: string, file: File, amount?: number) => {
    const formData = new FormData();
    formData.append("file", file);
    if (amount !== undefined) {
      formData.append("amount", amount.toString());
    }
    return api.upload<Payment>(`payment/${enrollmentId}/upload`, formData);
  },
  getMyPayments: () => api.get<Payment[]>("payment/my"),
  getPendingPayments: () => api.get<Payment[]>("payment/pending"),
  approvePayment: (id: string, note?: string) => api.patch<Payment>(`payment/${id}/approve${note ? `?note=${encodeURIComponent(note)}` : ''}`),
  rejectPayment: (id: string, note?: string) => api.patch<Payment>(`payment/${id}/reject${note ? `?note=${encodeURIComponent(note)}` : ''}`),
};
