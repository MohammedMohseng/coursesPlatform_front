"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Payment } from "@/lib/types";
import { paymentsApi } from "@/features/payments/api";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Payment | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentsApi.getPendingPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch {
      // errors toasted
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleAction = async () => {
    if (!selected || !actionType) return;
    setIsSubmitting(true);
    try {
      if (actionType === "approve") {
        await paymentsApi.approvePayment(selected.id, note);
        toast.success("تمت الموافقة على الدفعة بنجاح");
      } else {
        await paymentsApi.rejectPayment(selected.id, note);
        toast.success("تم رفض الدفعة");
      }
      setSelected(null);
      setActionType(null);
      setNote("");
      fetchPayments();
    } catch {
      // errors toasted
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">مراجعة الدفعات</h1>
          <p className="text-muted-foreground mt-1">مراجعة والبت في دفعات الطلاب المعلقة</p>
        </div>
        <Button variant="outline" onClick={fetchPayments} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">دفعات معلقة</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
            <Clock className="w-6 h-6 text-amber-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>قائمة الدفعات المعلقة</CardTitle></CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الطالب</TableHead>
                  <TableHead className="text-right">الكورس</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">إثبات الدفع</TableHead>
                  <TableHead className="text-center">الإجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      لا توجد دفعات معلقة ✓
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.student?.fullName || "—"}</TableCell>
                      <TableCell>{payment.course?.name || "—"}</TableCell>
                      <TableCell>{payment.amount ? `${payment.amount} SDG` : "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(payment.createdAt).toLocaleDateString("ar-SD")}
                      </TableCell>
                      <TableCell>
                        {payment.proofImageUrl ? (
                          <a href={`${process.env.NEXT_PUBLIC_API_URL}/${payment.proofImageUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">
                            عرض الإيصال
                          </a>
                        ) : <span className="text-muted-foreground text-sm">لا يوجد</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="default"
                            className="gap-1 bg-green-600 hover:bg-green-700"
                            onClick={() => { setSelected(payment); setActionType("approve"); setNote(""); }}
                          >
                            <CheckCircle className="w-4 h-4" /> قبول
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                            onClick={() => { setSelected(payment); setActionType("reject"); setNote(""); }}
                          >
                            <XCircle className="w-4 h-4" /> رفض
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Action Dialog */}
      <Dialog open={!!selected && !!actionType} onOpenChange={() => { setSelected(null); setActionType(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "✅ تأكيد الموافقة على الدفعة" : "❌ تأكيد رفض الدفعة"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "سيتم تفعيل وصول الطالب إلى دروس الكورس بعد الموافقة."
                : "سيتم إخطار الطالب برفض الدفعة."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-2">
            <Label>ملاحظة (اختياري)</Label>
            <Textarea
              placeholder="اكتب ملاحظة للطالب..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => { setSelected(null); setActionType(null); }}>إلغاء</Button>
            <Button
              onClick={handleAction}
              disabled={isSubmitting}
              variant={actionType === "approve" ? "default" : "destructive"}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {actionType === "approve" ? "تأكيد الموافقة" : "تأكيد الرفض"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
