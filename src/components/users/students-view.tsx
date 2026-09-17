"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Loader2,
  RefreshCw,
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Course, Enrollment, UserRole } from "@/lib/types";
import { coursesApi } from "@/features/courses/api";
import { enrollmentsApi } from "@/features/enrollments/api";

const PAYMENT_STATUS_CONFIG = {
  APPROVED: { label: "مقبول", variant: "default" as const, icon: <CheckCircle className="w-3.5 h-3.5 text-green-500 ml-1" /> },
  PENDING: { label: "في الانتظار", variant: "secondary" as const, icon: <Clock className="w-3.5 h-3.5 text-amber-500 ml-1" /> },
  REJECTED: { label: "مرفوض", variant: "destructive" as const, icon: <XCircle className="w-3.5 h-3.5 text-red-500 ml-1" /> },
};

export function StudentsView({ role }: { role: UserRole }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch teacher's courses
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      if (role === "TEACHER") {
        const data = await coursesApi.getMyCourses();
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0].id);
        }
      }
    } catch {
      // Errors are handled by the API client toast
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch enrollments for selected course
  const fetchEnrollments = async (courseId: string) => {
    if (!courseId) return;
    setLoadingEnrollments(true);
    try {
      const data = await enrollmentsApi.getCourseEnrollments(courseId);
      setEnrollments(Array.isArray(data) ? data : []);
    } catch {
      // Errors handled by API client
    } finally {
      setLoadingEnrollments(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [role]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchEnrollments(selectedCourseId);
    } else {
      setEnrollments([]);
    }
  }, [selectedCourseId]);

  const handleRefresh = () => {
    if (selectedCourseId) {
      fetchEnrollments(selectedCourseId);
    } else {
      fetchCourses();
    }
  };

  const filtered = enrollments.filter((e) => {
    const name = e.student?.fullName?.toLowerCase() || "";
    const email = e.student?.email?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  const totalStudentsCount = enrollments.length;
  const approvedCount = enrollments.filter((e) => e.paymentStatus === "APPROVED").length;
  const pendingCount = enrollments.filter((e) => e.paymentStatus === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            {role === "TEACHER" ? "إدارة وشؤون الطلاب" : "زملاء الدراسة"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            متابعة الطلاب المسجلين وحالة تفعيل اشتراكاتهم
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {loadingCourses ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            courses.length > 0 && (
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="اختر الكورس..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          )}
          <Button variant="outline" size="icon" onClick={handleRefresh} title="تحديث">
            <RefreshCw className={`h-4 w-4 ${loadingEnrollments || loadingCourses ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {role === "TEACHER" && selectedCourseId && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">إجمالي الطلاب بالكورس</p>
                <p className="text-2xl font-bold mt-1">{totalStudentsCount} طالب</p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-80" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">الاشتراكات المفعلة</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{approvedCount} طالب</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-80" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">اشتراكات معلقة</p>
                <p className="text-2xl font-bold mt-1 text-amber-500">{pendingCount} طالب</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500 opacity-80" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Students List Table */}
      {selectedCourseId ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>قائمة الطلاب المسجلين</CardTitle>
                <CardDescription>
                  جدول يوضح تفاصيل الطلاب المشتركين في الكورس المحدد
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث بالاسم أو البريد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الطالب</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">حالة الاشتراك</TableHead>
                    <TableHead className="text-right">تاريخ الانضمام</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingEnrollments ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          جاري تحميل الطلاب...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                        لا يوجد طلاب يطابقون البحث أو مسجلين في هذا الكورس بعد.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {enrollment.student?.fullName?.charAt(0) || "?"}
                            </div>
                            <span>{enrollment.student?.fullName || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <Mail className="w-3.5 h-3.5" />
                            {enrollment.student?.email || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              PAYMENT_STATUS_CONFIG[enrollment.paymentStatus]?.variant || "outline"
                            }
                            className="inline-flex items-center"
                          >
                            {PAYMENT_STATUS_CONFIG[enrollment.paymentStatus]?.icon}
                            {PAYMENT_STATUS_CONFIG[enrollment.paymentStatus]?.label ||
                              enrollment.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(enrollment.enrolledAt).toLocaleDateString("ar-SD")}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>يرجى تحديد أو إنشاء كورس لعرض الطلاب المسجلين فيه.</p>
        </div>
      )}
    </div>
  );
}
