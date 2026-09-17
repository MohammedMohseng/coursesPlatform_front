import { api } from "@/lib/api-client";
import type { Subject, CreateSubjectRequest } from "@/lib/types";

export const subjectsApi = {
  getSubjects: () => api.get<Subject[]>("subject"),
  getSubject: (id: string) => api.get<Subject>(`subject/${id}`),
  createSubject: (data: CreateSubjectRequest) => api.post<Subject>("subject", data),
  updateSubject: (id: string, data: Partial<CreateSubjectRequest>) => api.patch<Subject>(`subject/${id}`, data),
  deleteSubject: (id: string) => api.delete<void>(`subject/${id}`),
};
