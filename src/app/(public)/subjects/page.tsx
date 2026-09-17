"use client";

import { useEffect, useState } from "react";
import { BookOpen, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { subjectsApi } from "@/features/subjects/api";
import type { Subject } from "@/lib/types";

const TRACK_LABELS: Record<string, string> = {
  SCIENCE: "علمي",
  ART: "أدبي",
  BOTH: "مشترك",
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await subjectsApi.getSubjects();
        setSubjects(Array.isArray(data) ? data : []);
      } catch {
        // handled
      } finally {
        setLoading(false);
      }
    }
    loadSubjects();
  }, []);

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.code && s.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          المواد الدراسية
        </h1>
        <p className="text-lg text-muted-foreground">
          تصفح قائمة المواد الدراسية المتاحة في المنصة لكافة المسارات.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto relative">
        <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="ابحث عن مادة..."
          className="pl-4 pr-10 py-6 rounded-xl border-border bg-background shadow-sm text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl max-w-2xl mx-auto">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg">لا توجد مواد مطابقة للبحث.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((subject) => (
            <Card key={subject.id} className="hover:shadow-md transition-all hover:border-primary/50 group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="bg-muted">
                    {TRACK_LABELS[subject.track] || subject.track}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                {subject.code && (
                  <Badge variant="outline" className="w-fit font-mono text-xs">{subject.code}</Badge>
                )}
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3">
                  {subject.description || "لا يوجد وصف متاح لهذه المادة."}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
