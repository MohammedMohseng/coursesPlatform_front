"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  BookOpen,
  RefreshCw,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Track, Subject } from "@/lib/types";
import { subjectsApi } from "@/features/subjects/api";

const SUBJECT_TRACKS: Record<string, string> = {
  SCIENCE: "علوم",
  ART: "فنون",
  BOTH: "كلاهما",
};

const EMPTY_FORM = { name: "", description: "", code: "", track: "SCIENCE" as Track };

export default function SubjectView() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const data = await subjectsApi.getSubjects();
      setSubjects(Array.isArray(data) ? data : []);
    } catch {
      // errors toasted by api-client
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await subjectsApi.createSubject(formData);
      toast.success("تم إنشاء المادة بنجاح");
      setIsCreateOpen(false);
      setFormData(EMPTY_FORM);
      fetchSubjects();
    } catch {
      // errors toasted by api-client
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;
    setIsSubmitting(true);
    try {
      await subjectsApi.updateSubject(selectedSubject.id, formData);
      toast.success("تم تحديث المادة بنجاح");
      setIsUpdateOpen(false);
      setSelectedSubject(null);
      fetchSubjects();
    } catch {
      // errors toasted by api-client
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSubject) return;
    setIsSubmitting(true);
    try {
      await subjectsApi.deleteSubject(selectedSubject.id);
      toast.success("تم حذف المادة بنجاح");
      setIsDeleteOpen(false);
      setSelectedSubject(null);
      fetchSubjects();
    } catch {
      // errors toasted by api-client
    } finally {
      setIsSubmitting(false);
    }
  };

  const openUpdateModal = (subject: Subject) => {
    setSelectedSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description || "",
      code: subject.code || "",
      track: subject.track || "SCIENCE",
    });
    setIsUpdateOpen(true);
  };

  const filteredSubjects = subjects.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.code && sub.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const TrackSelect = () => (
    <div className="space-y-2">
      <Label>المسار الدراسي (Track)</Label>
      <Select
        value={formData.track}
        onValueChange={(val: Track) => setFormData({ ...formData, track: val })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر المسار..." />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(SUBJECT_TRACKS) as Track[]).map((trackKey) => (
            <SelectItem key={trackKey} value={trackKey}>
              {SUBJECT_TRACKS[trackKey]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const SubjectForm = ({ onSubmit, title }: { onSubmit: (e: React.FormEvent) => void; title: string }) => (
    <form onSubmit={onSubmit} className="space-y-4 py-2">
      <div className="space-y-2">
        <Label>اسم المادة</Label>
        <Input required placeholder="مثال: الرياضيات المتقدمة" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>رمز المادة (Code)</Label>
        <Input placeholder="مثال: MATH101" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
      </div>
      <TrackSelect />
      <div className="space-y-2">
        <Label>الوصف</Label>
        <Input placeholder="وصف مختصر للمادة الدراسية..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      </div>
      <DialogFooter className="mt-4 gap-2">
        <Button type="button" variant="outline" onClick={() => { setIsCreateOpen(false); setIsUpdateOpen(false); }}>إلغاء</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          {title}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            إدارة المواد الدراسية
          </h1>
          <p className="text-muted-foreground mt-1">إضافة، تعديل، وحذف المواد الدراسية</p>
        </div>
        <Button onClick={() => { setFormData(EMPTY_FORM); setIsCreateOpen(true); }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة مادة جديدة
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>قائمة المواد ({filteredSubjects.length})</CardTitle>
              <CardDescription>عرض لجميع المواد المتاحة في النظام</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث باسم المادة أو الرمز..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-8"
                />
              </div>
              <Button variant="outline" size="icon" onClick={fetchSubjects} title="تحديث">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الرمز</TableHead>
                  <TableHead className="text-right">اسم المادة</TableHead>
                  <TableHead className="text-right">المسار</TableHead>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-center w-[100px]">العمليات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        جاري تحميل المواد...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSubjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      لا توجد مواد مسجلة حالياً
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell><Badge variant="secondary" className="font-mono">{subject.code || "N/A"}</Badge></TableCell>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{SUBJECT_TRACKS[subject.track as Track] || "غير محدد"}</TableCell>
                      <TableCell className="text-muted-foreground max-w-md truncate">{subject.description || "لا يوجد وصف"}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>الخيارات</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openUpdateModal(subject)}>
                              <Pencil className="ml-2 h-4 w-4" /> تعديل المادة
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => { setSelectedSubject(subject); setIsDeleteOpen(true); }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="ml-2 h-4 w-4" /> حذف المادة
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مادة جديدة</DialogTitle>
            <DialogDescription>أدخل تفاصيل المادة الجديدة</DialogDescription>
          </DialogHeader>
          <SubjectForm onSubmit={handleCreate} title="حفظ وإنشاء" />
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المادة: {selectedSubject?.name}</DialogTitle>
          </DialogHeader>
          <SubjectForm onSubmit={handleUpdate} title="تحديث البيانات" />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف مادة{" "}
              <strong className="text-foreground">{selectedSubject?.name}</strong>؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
