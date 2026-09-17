"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Users,
  PlayCircle,
  Loader2,
  Image as ImageIcon
} from "lucide-react";

// Shadcn UI Components (أفترض أنك قمت بتثبيتها)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserRole, Course } from "@/lib/types";
import { coursesApi } from "@/features/courses/api";
import { enrollmentsApi } from "@/features/enrollments/api";
import { toast } from "sonner";


export function CoursesView({ role }: { role: UserRole }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // حالات النوافذ المنبثقة (Modals)
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", track: "BOTH" ,subjectId:""});

  // جلب البيانات الأولية
  useEffect(() => {
    function FetchCourses() {
      fetchCourses();
    }
    FetchCourses();
  }, [role]);

  async function fetchCourses() {
    setLoading(true);
    try {
      if (role === "TEACHER") {
        const data = await coursesApi.getMyCourses();
        setCourses(data);
      } else {
        const enrollments = await enrollmentsApi.getMyEnrollments();
        const studentCourses = enrollments.map((e) => ({ ...e.course, progress: e.paymentStatus === "APPROVED" ? 100 : 0 }));
        setCourses(studentCourses);
      }
    } catch {
      // errors toasted by api-client
    } finally {
      setLoading(false);
    }
  }

  // دوال المعالجة (CRUD)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await coursesApi.createCourse({
        name: formData.title,
        description: formData.description,
        track: formData.track as any,
        subjectId: formData.subjectId || undefined,
      });
      toast.success("تم إنشاء الكورس بنجاح");
      setIsCreateOpen(false);
      setFormData({ title: "", description: "", track: "BOTH", subjectId: "" });
      fetchCourses();
    } catch {
      // errors toasted
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setIsSubmitting(true);
    try {
      await coursesApi.updateCourse(selectedCourse.id, {
        name: formData.title,
        description: formData.description,
        track: formData.track as any,
      });
      toast.success("تم تعديل الكورس بنجاح");
      setIsUpdateOpen(false);
      fetchCourses();
    } catch {
      // errors toasted
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    setIsSubmitting(true);
    try {
      await coursesApi.deleteCourse(selectedCourse.id);
      toast.success("تم حذف الكورس بنجاح");
      setIsDeleteOpen(false);
      fetchCourses();
    } catch {
      // errors toasted
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // دالة مساعدة لترجمة المسار (Track)
  const getTrackBadge = (track: string) => {
    const tracks: Record<string, { label: string; color: string }> = {
      SCIENCE: { label: "علمي", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
      ART: { label: "أدبي", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
      BOTH: { label: "مشترك", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    };
    const t = tracks[track] || tracks.BOTH;
    return <Badge variant="outline" className={`${t.color} border-none`}>{t.label}</Badge>;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* 1. الشريط العلوي (Header & Actions) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass p-4 rounded-xl border border-border">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            {role === "TEACHER" ? "إدارة الكورسات" : "كورساتي الدراسية"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {role === "TEACHER"
              ? "قم بإضافة وتعديل الكورسات والمقررات الخاصة بك."
              : "تابع تقدمك في المقررات التي اشتركت بها."}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن كورس..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 bg-background/50 border-border"
            />
          </div>
          {role === "TEACHER" && (
            <Button onClick={() => {
              setFormData({ title: "", description: "", track: "BOTH", subjectId:"" });
              setIsCreateOpen(true);
            }} className="shadow-md">
              <Plus className="h-4 w-4 ml-2" />
              كورس جديد
            </Button>
          )}
        </div>
      </div>

      {/* 2. شبكة الكورسات (Courses Grid) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>جاري تحميل البيانات...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground">لا توجد كورسات</h3>
          <p className="text-sm text-muted-foreground mt-1">لم يتم العثور على أي كورسات تطابق بحثك.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 flex flex-col">

              {/* صورة الكورس الوهمية (Thumbnail) */}
              <div className="h-40 bg-muted relative overflow-hidden flex items-center justify-center border-b border-border/50">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground/40 group-hover:scale-110 transition-transform duration-500" />
                )}
                <div className="absolute top-3 right-3 z-20">
                  {getTrackBadge(course.track)}
                </div>
              </div>

              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg font-bold leading-tight line-clamp-1">
                    {course.name}
                  </CardTitle>

                  {role === "TEACHER" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 text-muted-foreground hover:text-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedCourse(course);
                          setFormData({ title: course.name, description: course.description || "", track: course.track, subjectId: "" }); // يمكنك إضافة subjectId إذا كان متاحاً
                          setIsUpdateOpen(true);
                        }}>
                          <Edit className="h-4 w-4 ml-2" /> تعديل
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedCourse(course);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 ml-2" /> حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <CardDescription className="line-clamp-2 text-sm mt-1">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-2 flex-1">
                {role === "TEACHER" ? (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/30 w-fit px-2.5 py-1 rounded-md">
                    <Users className="h-4 w-4 text-secondary" />
                    <span className="font-medium text-foreground">{course.enrollmentsCount}</span> طالب مشترك
                  </div>
                ) : (
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>نسبة الإنجاز</span>
                      <span className="font-bold text-primary">{course.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-4 pt-0 border-t border-border/50 mt-auto bg-muted/10">
                {role === "TEACHER" ? (
                  <Button variant="outline" className="w-full mt-3 bg-background hover:bg-primary hover:text-primary-foreground transition-colors">
                    إدارة الدروس (المنهج)
                  </Button>
                ) : (
                  <Button variant={course.progress === 100 ? "outline" : "default"} className="w-full mt-3 group-hover:shadow-md transition-all gap-2">
                    {course.progress === 100 ? (
                      <>مراجعة الكورس</>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4" /> متابعة التعلم
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* ================= MODALS (Dialogs) ================= */}

      {/* 1. إضافة كورس */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إنشاء كورس جديد</DialogTitle>
            <DialogDescription>أدخل البيانات الأساسية للمقرر. يمكنك إضافة الدروس لاحقاً.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">عنوان الكورس</label>
              <Input required placeholder="مثال: الرياضيات المتقدمة" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">المسار (Track)</label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value as any })}
              >
                <option value="SCIENCE">مسار علمي</option>
                <option value="ART">مسار أدبي</option>
                <option value="BOTH">مشترك للجميع</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">الوصف</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="وصف مختصر لمحتوى الكورس..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <DialogFooter className="mt-6 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>إلغاء</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                حفظ وإنشاء
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. تعديل كورس */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل الكورس</DialogTitle>
            <DialogDescription>تحديث البيانات الأساسية للكورس.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">عنوان الكورس</label>
              <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">المسار (Track)</label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value as any })}
              >
                <option value="SCIENCE">مسار علمي</option>
                <option value="ART">مسار أدبي</option>
                <option value="BOTH">مشترك للجميع</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">الوصف</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <DialogFooter className="mt-6 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsUpdateOpen(false)}>إلغاء</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                تحديث البيانات
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. تأكيد الحذف */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> تأكيد الحذف
            </DialogTitle>
            <DialogDescription className="pt-2">
              هل أنت متأكد من رغبتك في حذف كورس <strong className="text-foreground">{selectedCourse?.name}</strong>؟
              هذا الإجراء سيؤدي إلى حذف جميع الدروس المتعلقة به ولا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              نعم، قم بالحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}