"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, User, Loader2, ArrowRight, Video, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { coursesApi } from "@/features/courses/api";
import { enrollmentsApi } from "@/features/enrollments/api";
import type { Course } from "@/lib/types";

const TRACK_LABELS: Record<string, string> = {
  SCIENCE: "علمي",
  ART: "أدبي",
  BOTH: "مشترك",
};

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!params?.id) return;
      try {
        setLoading(true);
        const data = await coursesApi.getCourse(params.id as string);
        setCourse(data);

        // Check if user is enrolled
        if (user && user.role === "STUDENT") {
          const enrollments = await enrollmentsApi.getMyEnrollments();
          const myEnrollment = enrollments.find(e => e.course?.id === data.id);
          if (myEnrollment) {
            setEnrollmentStatus(myEnrollment.paymentStatus);
          }
        }
      } catch (err) {
        toast.error("حدث خطأ أثناء تحميل تفاصيل الكورس");
        router.push("/courses");
      } finally {
        setLoading(false);
      }
    }
    if (!userLoading) {
      loadData();
    }
  }, [params?.id, user, userLoading, router]);

  const handleEnroll = async () => {
    if (!user) {
      toast.info("يجب تسجيل الدخول كطالب للاشتراك في هذا الكورس");
      router.push("/auth/login");
      return;
    }
    if (user.role !== "STUDENT") {
      toast.error("حسابات الطلاب فقط يمكنها الاشتراك في الكورسات");
      return;
    }
    
    setEnrolling(true);
    try {
      await enrollmentsApi.enroll(course!.id);
      toast.success("تم تسجيل الاشتراك بنجاح! يرجى رفع إيصال الدفع لاحقاً.");
      setEnrollmentStatus("PENDING");
    } catch {
      // errors toasted by api-client
    } finally {
      setEnrolling(false);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4 gap-2">
        <ArrowRight className="w-4 h-4" /> عودة
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {TRACK_LABELS[course.track] || course.track}
              </Badge>
              {course.subjectName && (
                <Badge variant="outline">{course.subjectName}</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.name}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
              {course.description || "لا يوجد وصف متاح لهذا الكورس."}
            </p>
          </div>

          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                ماذا ستتعلم في هذا الكورس؟
              </h2>
              <ul className="space-y-3">
                {[
                  "شرح مفصل ومبسط لجميع أجزاء المنهج",
                  "تدريبات عملية وأسئلة امتحانات سابقة",
                  "متابعة مستمرة مع المعلم والإجابة على الاستفسارات",
                  "ملخصات ومذكرات قابلة للتحميل"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              {/* Teacher Info */}
              <div className="flex items-center gap-4 border-b pb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">مقدم الكورس</p>
                  <p className="font-bold">{course.teacher?.fullName || "معلم غير محدد"}</p>
                </div>
              </div>

              {/* Course Meta */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">المادة</p>
                    <p className="text-sm text-muted-foreground">{course.subjectName || "عام"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">الدروس</p>
                    <p className="text-sm text-muted-foreground">دروس مسجلة</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">شهادة</p>
                    <p className="text-sm text-muted-foreground">شهادة إتمام متوفرة</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {!user ? (
                  <Button className="w-full text-lg h-12" onClick={handleEnroll}>
                    سجل الآن كطالب
                  </Button>
                ) : user.role === "STUDENT" ? (
                  !enrollmentStatus ? (
                    <Button 
                      className="w-full text-lg h-12" 
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? <Loader2 className="w-5 h-5 animate-spin" /> : "اشترك في الكورس"}
                    </Button>
                  ) : enrollmentStatus === "APPROVED" ? (
                    <Button className="w-full text-lg h-12 bg-green-600 hover:bg-green-700" onClick={() => router.push("/student/lessons")}>
                      الذهاب للدروس
                    </Button>
                  ) : enrollmentStatus === "PENDING" ? (
                    <Button variant="secondary" className="w-full text-lg h-12 pointer-events-none">
                      في انتظار التأكيد...
                    </Button>
                  ) : (
                    <Button variant="destructive" className="w-full text-lg h-12 pointer-events-none">
                      الاشتراك مرفوض
                    </Button>
                  )
                ) : (
                  <Button variant="outline" className="w-full text-lg h-12 pointer-events-none">
                    حساب {user.role === "TEACHER" ? "معلم" : "مدير"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
