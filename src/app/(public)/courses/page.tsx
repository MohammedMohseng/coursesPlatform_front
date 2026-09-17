"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { Course, Enrollment } from "@/lib/types";
import { coursesApi } from "@/features/courses/api";
import { enrollmentsApi } from "@/features/enrollments/api";
import { GraduationCap, Clock, BookOpen, User, Eye, PlusCircle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const TRACK_LABELS: Record<string, string> = {
  SCIENCE: "علمي",
  ART: "أدبي",
  BOTH: "مشترك",
};

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: userLoading } = useUser();

  const fetchData = async () => {
    try {
      setLoading(true);
      const coursesData = await coursesApi.getCourses();
      setCourses(Array.isArray(coursesData) ? coursesData : []);

      if (user && user.role === "STUDENT") {
        const enrollmentsData = await enrollmentsApi.getMyEnrollments();
        setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
      }
    } catch (error) {
      toast.error("فشل في تحميل الكورسات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading) {
      fetchData();
    }
  }, [user, userLoading]);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast.info("يجب تسجيل الدخول كطالب للاشتراك في هذا الكورس");
      router.push("/auth/login");
      return;
    }
    if (user.role !== "STUDENT") {
      toast.error("حسابات الطلاب فقط يمكنها الاشتراك في الكورسات");
      return;
    }

    try {
      setLoading(true);
      await enrollmentsApi.enroll(courseId);
      toast.success("تم تسجيل الاشتراك بنجاح! يرجى رفع إيصال الدفع لاحقاً.");
      fetchData();
    } catch {
      // errors toasted by client
    } finally {
      setLoading(false);
    }
  };

  const getEnrollmentStatus = (courseId: string) => {
    const found = enrollments.find((e) => e.course?.id === courseId);
    return found ? found.paymentStatus : null;
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الكورسات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3 py-1 text-sm font-medium rounded-full">
          الدورات والمسارات التعليمية
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          {user?.role === "STUDENT" ? "المناهج والكورسات المتاحة" : "تصفح الكورسات"}
        </h1>
        <p className="text-lg text-muted-foreground">
          اختر الكورس المناسب لك وابدأ رحلتك التعليمية اليوم مع أفضل الأساتذة.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl max-w-2xl mx-auto">
          <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-medium mb-1">لا توجد كورسات متاحة</h3>
          <p className="text-muted-foreground">
            لم يتم إضافة كورسات جديدة في الوقت الحالي. يرجى مراجعة الصفحة لاحقاً.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const status = getEnrollmentStatus(course.id);
            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow border border-border bg-card flex flex-col justify-between">
                <div>
                  <div className="h-3 bg-primary" />
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <Badge variant="secondary" className="bg-muted">
                        {TRACK_LABELS[course.track] || course.track}
                      </Badge>
                      {course.subject && (
                        <Badge variant="outline" className="text-xs">
                          {course.subject.name}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold line-clamp-1">{course.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {course.description || "لا يوجد وصف متوفر لهذا الكورس حالياً."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-3">
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <User className="h-4 w-4 text-primary shrink-0" />
                      <span>الأستاذ: {course.teacher?.fullName || "غير محدد"}</span>
                    </div>
                    {course.length && (
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <Clock className="h-4 w-4 text-primary shrink-0" />
                        <span>المدة: {course.length} ساعة</span>
                      </div>
                    )}
                  </CardContent>
                </div>

                <div className="p-6 pt-0 border-t border-border/50 mt-4 flex flex-col gap-2 bg-muted/10">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-xs text-muted-foreground">
                      المسجلين: {course.enrollmentsCount || 0} طالب
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary gap-1 p-0 h-auto"
                      onClick={() => router.push(`/courses/${course.id}`)}
                    >
                      <Eye className="w-4 h-4" /> عرض التفاصيل
                    </Button>
                  </div>

                  {!user ? (
                    <Button className="w-full gap-2" onClick={() => handleEnroll(course.id)}>
                      <PlusCircle className="w-4 h-4" /> اشترك الآن
                    </Button>
                  ) : user.role === "STUDENT" ? (
                    !status ? (
                      <Button className="w-full gap-2" onClick={() => handleEnroll(course.id)}>
                        <PlusCircle className="w-4 h-4" /> اشترك في الكورس
                      </Button>
                    ) : status === "APPROVED" ? (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                        onClick={() => router.push("/student/lessons")}
                      >
                        <ArrowLeft className="w-4 h-4" /> اذهب للدروس
                      </Button>
                    ) : status === "PENDING" ? (
                      <Button variant="secondary" className="w-full cursor-not-allowed" disabled>
                        في انتظار الموافقة...
                      </Button>
                    ) : (
                      <Button variant="destructive" className="w-full cursor-not-allowed" disabled>
                        الاشتراك مرفوض
                      </Button>
                    )
                  ) : (
                    <div className="text-center text-xs text-muted-foreground bg-muted p-2 rounded">
                      حساب {user.role === "ADMIN" ? "مدير" : "معلم"} (للمشاهدة فقط)
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
