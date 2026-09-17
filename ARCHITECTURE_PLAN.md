# Frontend Architecture & Implementation Plan

Based on the Java Spring Boot API documentation, here is the full component architecture and plan for developing the Next.js frontend. The frontend will be fully responsive (Mobile-First), in Arabic (RTL), supporting dark/light themes, and utilizing `shadcn/ui` with Tailwind CSS.

## 📁 1. Folder Structure (Next.js App Router)

```text
src/
├── app/
│   ├── layout.tsx                # Root layout (RTL direction, ThemeProvider, ToastProvider)
│   ├── page.tsx                  # Landing page
│   ├── auth/
│   │   ├── login/page.tsx        # Login page (TEACHER/STUDENT)
│   │   └── register/page.tsx     # Registration page
│   ├── dashboard/                # Unified Dashboard (content changes based on role)
│   │   ├── page.tsx
│   │   ├── courses/
│   │   ├── payments/
│   │   └── profile/
│   └── admin/
│       └── dashboard/            # Admin Dashboard (Manage Subjects, Users, Pending Payments)
├── components/
│   ├── ui/                       # shadcn/ui components (Buttons, Inputs, Dialogs, etc.)
│   ├── layout/
│   │   ├── Sidebar.tsx           # Dashboard sidebar
│   │   └── Navbar.tsx            # Top navigation bar
│   └── shared/
│       ├── CourseCard.tsx        # Course display component
│       ├── LessonItem.tsx        # Lesson display component
│       └── UploadDropzone.tsx    # Drag & drop for video/payment proofs
├── lib/
│   ├── api-client.ts             # Centralized API requests with caching & validation
│   ├── auth.ts                   # Token & Cookie management
│   ├── types.ts                  # Shared TypeScript interfaces (aligned with Java backend)
│   └── utils.ts                  # Tailwind merge & helper functions
└── hooks/
    ├── useUser.ts                # Fetch & cache current user profile
    ├── useCourses.ts             # Course fetching hooks
    └── useUpload.ts              # File upload logic
```

## 🏗️ 2. Component Architecture

### **Global Layout**
- **`RootLayout`**: Wraps the app in `<html dir="rtl" lang="ar">`, injects `ThemeProvider` for dark/light mode, and `Toaster` for notifications.

### **Authentication (`auth/`)**
- **`LoginForm`**: Validates email/password, uses `api-client.ts` to call `POST /api/v1/auth/login`, stores JWT in cookies, redirects based on user role.
- **`RegisterForm`**: Registers a new user (`TEACHER` or `STUDENT`), handles API validation errors (e.g., duplicated email).

### **Student Dashboard**
- **`MyCoursesList`**: Fetches enrollments.
- **`CourseCatalog`**: Displays all available courses. Student can click "Enroll".
- **`PaymentUploadDialog`**: Dialog to upload payment proof (`multipart/form-data`) using `api-client.ts` upload method.
- **`LessonViewer`**: Displays lessons if payment is approved.

### **Teacher Dashboard**
- **`TeacherCourses`**: Fetches teacher's courses.
- **`CourseManager`**: Form to Create/Update a course.
- **`LessonManager`**: Manage lessons within a course. Includes `VideoUploadForm`.
- **`EnrolledStudents`**: View students enrolled in their courses.

### **Admin Dashboard**
- **`SubjectManager`**: CRUD for Subjects.
- **`PaymentApprovals`**: List of pending payments. Admin can Approve or Reject.
- **`UserManagement`**: List users, change status (ACTIVE, SUSPENDED).

## 🔌 3. API Client Improvements (`api-client.ts`)

1. **Strict Typing**: Wrap all responses with the `ApiResponse<T>` interface matching the backend format (`{ success, status, message, data }`).
2. **Error Handling**: Automatically catch `401 Unauthorized` and redirect to login, or `403 Forbidden`. Display `toast` notifications for `400` validation errors.
3. **Caching & Validation**: Add options to support Next.js `fetch` caching mechanisms (`next: { revalidate: 60 }`, etc.) to minimize unnecessary API calls.
4. **Multipart Uploads**: Add a dedicated `.upload()` function for handling `FormData` (Video & Payment proofs) without overriding the browser's automatic `Content-Type` boundary.

## 🎨 4. Styling & Theming
- **RTL Support**: All Tailwind classes will naturally flow correctly because of `dir="rtl"`. We will use logical properties (e.g., `ms-`, `me-` for margin-start, margin-end).
- **Mobile-First**: Default Tailwind classes will target mobile, with `md:`, `lg:` prefixes for larger screens.
- **Dark Mode**: Retain existing `theme-provider.tsx` and Shadcn UI's CSS variables.

## 🚀 5. Development Phases

- [x] **Phase 1**: Enhance `api-client.ts` and `types.ts` to strictly match the Java API.
- [ ] **Phase 2**: Implement Authentication UI & State (Login, Register).
- [ ] **Phase 3**: Develop common layout components (Sidebar, Navbar, RTL wrapper).
- [ ] **Phase 4**: Implement Student and Teacher Dashboards.
- [ ] **Phase 5**: Implement Admin features (Approvals, Subjects).
