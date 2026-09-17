// ==========================================
// 1. Enums
// ==========================================

export type UserRole = "TEACHER" | "STUDENT" | "ADMIN";
export type Track = "SCIENCE" | "ART" | "BOTH";
export type AccountStatus = "ACTIVE" | "PENDING" | "SUSPENDED";
export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED";
export type NotificationType = "PAYMENT" | "SYSTEM" | "COURSE";

// ==========================================
// 2. Entities (Matching Java Models)
// ==========================================

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  track: Track;
  description?: string;
  createdAt: string;
}


export interface Course {
  id: string;
  name: string;
  description: string;
  track: Track;
  length: number | null; // 👈 تمت الإضافة
  subjectName: string | null; // 👈 تمت الإضافة
  teacher: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  }; // 👈 تمت الإضافة
  thumbnailUrl?: string;
  enrollmentsCount?: number;
  progress?: number; // 👈 تم إضافة حقل التقدم
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  lessonOrder: number;
  courseId?: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  student: User;
  course: Course;
  paymentStatus: PaymentStatus;
  enrolledAt: string;
}

export interface Payment {
  id: string;
  student?:User;
  course?:Course; 
  amount?: number;
  proofImageUrl?: string;
  status: PaymentStatus;
  adminNote?: string;
  user?: User;
  enrollmentId?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

// ==========================================
// 3. API Response Wrapper
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

// ==========================================
// 4. Request DTOs
// ==========================================

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
}

export interface CreateSubjectRequest {
  name: string;
  code: string;
  track: Track;
  description?: string;
}

export interface CreateCourseRequest {
  name: string;
  description?: string;
  track: Track;
  subjectId?: string;
  length?: number;
}

export interface CreateLessonRequest {
  title: string;
  description?: string;
  lessonOrder?: number;
}

// public static <T> ApiResponse<T> success(int status, String message, T data) {
//         return ApiResponse.<T>builder()
//                 .success(true)
//                 .status(status)
//                 .message(message)
//                 .data(data)
//                 .build();
//     }

//     public static <T> ApiResponse<T> error(int status, String message) {
//         return ApiResponse.<T>builder()
//                 .success(false)
//                 .status(status)
//                 .message(message)
//                 .build();
//     }