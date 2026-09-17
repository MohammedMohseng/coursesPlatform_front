import { api } from "@/lib/api-client";
import type { Enrollment } from "@/lib/types";

export const enrollmentsApi = {
  enroll: (courseId: string) => api.post<Enrollment>(`enrollment/${courseId}`),
  getMyEnrollments: () => api.get<Enrollment[]>("enrollment/my"),
  getCourseEnrollments: (courseId: string) => api.get<Enrollment[]>(`enrollment/course/${courseId}`),
  deleteEnrollment: (id: string) => api.delete<void>(`enrollment/${id}`),
};
