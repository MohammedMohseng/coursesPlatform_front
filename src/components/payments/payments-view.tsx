"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Payment, PaymentStatus, Enrollment } from "@/lib/types";
import { paymentsApi } from "@/features/payments/api";
import { enrollmentsApi } from "@/features/enrollments/api";

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  APPROVED: { label: "مقبول ✓", icon: <CheckCircle className="w-4 h-4 text-green-500" />, variant: "default" },
  PENDING: { label: "في الانتظار", icon: <Clock className="w-4 h-4 text-amber-500" />, variant: "secondary" },
  REJECTED: { label: "مرفوض", icon: <XCircle className="w-4 h-4 text-red-500" />, variant: "destructive" },
};

export function StudentPaymentsView() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [paymentData, enrollmentData] = await Promise.all([
        paymentsApi.getMyPayments(),
        enrollmentsApi.getMyEnrollments(),
      ]);
      setPayments(Array.isArray(paymentData) ? paymentData : []);
      // Only show enrollments without an approved payment (can still upload proof)
      setEnrollments(
        Array.isArray(enrollmentData)
          ? enrollmentData.filter((e) => e.paymentStatus !== "APPROVED")
          : []
      );
    } catch {
      // errors toasted
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedEnrollmentId) return;
    setIsSubmitting(true);
    try {
      await paymentsApi.uploadPayment(
        selectedEnrollmentId,
        file,
        amount ? parseFloat(amount) : undefined
      );
      toast.success("تم رفع إثبات الدفع بنجاح! انتظر موافقة الإدارة.");
      setIsUploadOpen(false);
      setFile(null);
      setAmount("");
      setSelectedEnrollmentId("");
      fetchData();
    } catch {
      // errors toasted
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">دفعاتي</h1>
          <p className="text-muted-foreground mt-1">
            رفع إثبات الدفع ومتابعة حالة الدفعات
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            تحديث
          </Button>
          {enrollments.length > 0 && (
            <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              رفع إثبات دفع
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(["APPROVED", "PENDING", "REJECTED"] as PaymentStatus[]).map((s) => (
          <Card key={s}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{STATUS_CONFIG[s].label}</p>
                <p className="text-2xl font-bold">
                  {payments.filter((p) => p.status === s).length}
                </p>
              </div>
              {STATUS_CONFIG[s].icon}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payments List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl">
          <Upload className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>لم ترفع أي دفعات بعد.</p>
          {enrollments.length > 0 && (
            <Button className="mt-4" onClick={() => setIsUploadOpen(true)}>
              رفع أول دفعة
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {payment.enrollment?.course?.name || "كورس غير معروف"}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {new Date(payment.createdAt).toLocaleDateString("ar-SD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <Badge variant={STATUS_CONFIG[payment.status]?.variant || "outline"}>
                    {STATUS_CONFIG[payment.status]?.label || payment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-2">
                {payment.amount && (
                  <p className="text-sm text-muted-foreground">
                    المبلغ: <span className="font-semibold text-foreground">{payment.amount} SDG</span>
                  </p>
                )}
                {payment.adminNote && (
                  <p className="text-sm bg-muted/50 rounded p-2">
                    <span className="font-medium">ملاحظة الإدارة: </span>
                    {payment.adminNote}
                  </p>
                )}
                {payment.proofImageUrl && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/${payment.proofImageUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline"
                  >
                    عرض إيصال الدفع ↗
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Payment Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفع إثبات دفع</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>اختر الكورس</Label>
              <Select
                value={selectedEnrollmentId}
                onValueChange={setSelectedEnrollmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر اشتراكاً..." />
                </SelectTrigger>
                <SelectContent>
                  {enrollments.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.course?.name || e.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>المبلغ (اختياري)</Label>
              <Input
                type="number"
                placeholder="مثال: 500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>صورة إيصال الدفع (JPG / PNG)</Label>
              <Input
                type="file"
                accept="image/jpeg,image/png"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUploadOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !file || !selectedEnrollmentId}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                رفع الإيصال
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
