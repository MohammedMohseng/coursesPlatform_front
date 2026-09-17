"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Enrollment, PaymentStatus } from "@/lib/types";
import { enrollmentsApi } from "@/features/enrollments/api";
import { coursesApi } from "@/features/courses/api";
import type { Course } from "@/lib/types";

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  APPROVED: { label: "مقبول", variant: "default" },
  PENDING: { label: "معلق", variant: "secondary" },
  REJECTED: { label: "مرفوض", variant: "destructive" },
};

export default function AdminEnrollmentsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toDelete, setToDelete] = useState<Enrollment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load all courses once
  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await coursesApi.getCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch {
        // errors toasted
      }
    }
    loadCourses();
  }, []);

  // Load enrollments when a course is selected
  const fetchEnrollments = async (courseId: string) => {
    if (!courseId) return;
    setLoading(true);
    try {
      const data = await enrollmentsApi.getCourseEnrollments(courseId);
      setEnrollments(Array.isArray(data) ? data : []);
    } catch {
      // errors toasted
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSearchQuery("");
    fetchEnrollments(courseId);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await enrollmentsApi.deleteEnrollment(toDelete.id);
      toast.success("تم حذف الاشتراك بنجاح");
      setToDelete(null);
      fetchEnrollments(selectedCourseId);
    } catch {
      // errors toasted
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = enrollments.filter((e) =>
    e.student?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.student?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">إدارة الاشتراكات</h1>
          <p className="text-muted-foreground mt-1">عرض وإدارة اشتراكات الطلاب في الكورسات</p>
        </div>
      </div>

      {/* Course selector */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedCourseId} onValueChange={handleCourseChange}>
          <SelectTrigger className="w-full sm:w-80">
            <SelectValue placeholder="اختر كورساً لعرض المشتركين..." />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCourseId && (
          <Button variant="outline" onClick={() => fetchEnrollments(selectedCourseId)} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            تحديث
          </Button>
        )}
      </div>

      {selectedCourseId && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <CardTitle>الطلاب المشتركون ({filtered.length})</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="البحث بالاسم أو البريد..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-8" />
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
                    <TableHead className="text-right">حالة الدفع</TableHead>
                    <TableHead className="text-right">تاريخ الاشتراك</TableHead>
                    <TableHead className="text-center">حذف</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        لا يوجد طلاب مشتركون في هذا الكورس
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
                            {enrollment.student?.fullName || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{enrollment.student?.email || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={PAYMENT_STATUS_CONFIG[enrollment.paymentStatus]?.variant || "outline"}>
                            {PAYMENT_STATUS_CONFIG[enrollment.paymentStatus]?.label || enrollment.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(enrollment.enrolledAt).toLocaleDateString("ar-SD")}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setToDelete(enrollment)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد حذف الاشتراك</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف اشتراك{" "}
              <strong className="text-foreground">{toDelete?.student?.fullName}</strong>؟
              هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setToDelete(null)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
