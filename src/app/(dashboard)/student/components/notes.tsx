'use client';

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotesView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">الملاحظات والمفكرة</h2>
        <Button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          <Plus className="w-4 h-4" /> إضافة ملاحظة
        </Button>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
        لا توجد ملاحظات محفوظة حالياً.
      </div>
    </div>
  );
}
