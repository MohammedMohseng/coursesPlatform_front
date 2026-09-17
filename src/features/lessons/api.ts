import { api } from "@/lib/api-client";
import type { Lesson, CreateLessonRequest } from "@/lib/types";

export const lessonsApi = {
  getLessons: (courseId: string) => api.get<Lesson[]>(`course/${courseId}/lessons`),
  getLesson: (courseId: string, id: string) => api.get<Lesson>(`course/${courseId}/lessons/${id}`),
  createLesson: (courseId: string, data: CreateLessonRequest) => api.post<Lesson>(`course/${courseId}/lessons`, data),
  updateLesson: (courseId: string, id: string, data: Partial<CreateLessonRequest>) => api.patch<Lesson>(`course/${courseId}/lessons/${id}`, data),
  deleteLesson: (courseId: string, id: string) => api.delete<void>(`course/${courseId}/lessons/${id}`),
  uploadVideo: (courseId: string, id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.upload<void>(`course/${courseId}/lessons/${id}/upload-video`, formData);
  }
};
