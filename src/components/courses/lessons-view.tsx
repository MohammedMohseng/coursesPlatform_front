"use client";

import React, { useState, useEffect } from "react";
import { Video, Plus, Loader2, UploadCloud, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { UserRole, Course, Lesson } from "@/lib/types";
import { coursesApi } from "@/features/courses/api";
import { enrollmentsApi } from "@/features/enrollments/api";
import { lessonsApi } from "@/features/lessons/api";

export function LessonsView({ role }: { role: UserRole }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", lessonOrder: 1 });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      try {
        if (role === "TEACHER") {
          const data = await coursesApi.getMyCourses();
          setCourses(data);
          if (data.length > 0) setSelectedCourseId(data[0].id);
        } else {
          // Students: only approved enrollments
          const data = await enrollmentsApi.getMyEnrollments();
          const approved = data
            .filter((e) => e.paymentStatus === "APPROVED")
            .map((e) => e.course);
          setCourses(approved);
          if (approved.length > 0) setSelectedCourseId(approved[0].id);
        }
      } catch {
        // errors toasted by api-client
      }
    }
    fetchCourses();
  }, [role]);

  useEffect(() => {
    if (!selectedCourseId) return;
    async function fetchLessons() {
      setLoading(true);
      try {
        const data = await lessonsApi.getLessons(selectedCourseId);
        setLessons(data);
      } catch {
        // errors toasted
      } finally {
        setLoading(false);
      }
    }
    fetchLessons();
  }, [selectedCourseId]);

  const refreshLessons = async () => {
    const data = await lessonsApi.getLessons(selectedCourseId);
    setLessons(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await lessonsApi.createLesson(selectedCourseId, {
        title: formData.title,
        description: formData.description,
        lessonOrder: Number(formData.lessonOrder),
      });
      toast.success("تم إنشاء الدرس بنجاح");
      setIsCreateOpen(false);
      setFormData({ title: "", description: "", lessonOrder: lessons.length + 2 });
      await refreshLessons();
    } catch {
      // errors toasted
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !selectedLesson) return;
    setIsSubmitting(true);
    try {
      await lessonsApi.uploadVideo(selectedCourseId, selectedLesson.id, videoFile);
      toast.success("تم رفع الفيديو بنجاح");
      setIsUploadOpen(false);
      setVideoFile(null);
      await refreshLessons();
    } catch {
      // errors toasted
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الدرس؟")) return;
    try {
      await lessonsApi.deleteLesson(selectedCourseId, lessonId);
      toast.success("تم الحذف بنجاح");
      setLessons(lessons.filter((l) => l.id !== lessonId));
    } catch {
      // errors toasted
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Video className="w-6 h-6 text-primary" />
          {role === "TEACHER" ? "إدارة الدروس والمحتوى" : "الدروس المتاحة"}
        </h2>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="" disabled>اختر الكورس...</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {role === "TEACHER" && selectedCourseId && (
            <Button onClick={() => { setFormData({ title: "", description: "", lessonOrder: lessons.length + 1 }); setIsCreateOpen(true); }} className="whitespace-nowrap">
              <Plus className="w-4 h-4 ml-2" /> إضافة درس
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : !selectedCourseId ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl">الرجاء اختيار كورس لعرض الدروس.</div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl">لا توجد دروس مضافة لهذا الكورس بعد.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="overflow-hidden border-border bg-card hover:shadow-md transition-all">
              <div className="h-40 bg-muted relative flex items-center justify-center">
                {lesson.videoUrl ? (
                  <video
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${lesson.videoUrl}`}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                  />
                ) : (
                  <div className="text-center text-muted-foreground/50">
                    <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <span>لا يوجد فيديو</span>
                  </div>
                )}
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-primary mb-1 block">الدرس {lesson.lessonOrder}</span>
                    <CardTitle className="text-lg font-bold">{lesson.title}</CardTitle>
                  </div>
                  {role === "TEACHER" && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => { setSelectedLesson(lesson); setIsUploadOpen(true); }}>
                        <UploadCloud className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(lesson.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {lesson.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{lesson.description}</p>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Create Lesson Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>إضافة درس جديد</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">عنوان الدرس</label>
              <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ترتيب الدرس</label>
              <Input type="number" min={1} required value={formData.lessonOrder} onChange={(e) => setFormData({ ...formData, lessonOrder: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">وصف الدرس</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>إلغاء</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                حفظ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Video Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>رفع فيديو للدرس: {selectedLesson?.title}</DialogTitle></DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">اختر ملف الفيديو (MP4, MKV, WebM, MOV — حد أقصى 500MB)</label>
              <Input
                type="file"
                accept="video/mp4,video/x-matroska,video/webm,video/quicktime"
                required
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>إلغاء</Button>
              <Button type="submit" disabled={isSubmitting || !videoFile}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                رفع
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}