"use client";

export function ReportsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">التقارير الشاملة للأداء</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-5 rounded-xl">
          <h3 className="font-semibold text-sm mb-2">تقارير الكورسات</h3>
          <p className="text-xs text-muted-foreground">
            أعلى الكورسات مبيعاً ومشاهدة.
          </p>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl">
          <h3 className="font-semibold text-sm mb-2">تقارير الطلاب</h3>
          <p className="text-xs text-muted-foreground">
            نسب الإكمال والتفاعل مع الدروس.
          </p>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl">
          <h3 className="font-semibold text-sm mb-2">التقرير المالي (Cash)</h3>
          <p className="text-xs text-muted-foreground">
            ملخص التدفقات المالية الشهرية.
          </p>
        </div>
      </div>
    </div>
  );
}
