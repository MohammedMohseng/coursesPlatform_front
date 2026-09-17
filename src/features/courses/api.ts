import { api } from "@/lib/api-client";
import type { Course, CreateCourseRequest } from "@/lib/types";

export const coursesApi = {
  getCourses: () => api.get<Course[]>("course"),
  getCourse: (id: string) => api.get<Course>(`course/${id}`),
  getMyCourses: () => api.get<Course[]>("course/my"),
  createCourse: (data: CreateCourseRequest) => api.post<Course>("course", data),
  updateCourse: (id: string, data: Partial<CreateCourseRequest>) => api.patch<Course>(`course/${id}`, data),
  deleteCourse: (id: string) => api.delete<void>(`course/${id}`),
};
