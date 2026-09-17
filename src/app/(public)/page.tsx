"use client";

import React from "react";
import Link from "next/link";
import {
  Video,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  BookOpen,
  Users,
} from "lucide-react";

// استيراد مكونات shadcn ui
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground"
    >
      {/* 1. الشريط العلوي (Navbar) */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* الشعار */}
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              منصتي <span className="text-primary">التعليمية</span>
            </span>
          </div>

          {/* روابط التنقل */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-muted-foreground text-sm">
            <a
              href="#features"
              className="hover:text-primary transition-colors"
            >
              المميزات
            </a>
            <a
              href="#how-it-works"
              className="hover:text-primary transition-colors"
            >
              كيف تعمل المنصة
            </a>
            <a
              href="#teachers"
              className="hover:text-primary transition-colors"
            >
              المعلمون
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              الأسعار
            </a>
          </nav>

          {/* أزرار الإجراءات */}
          <div className="flex items-center gap-3">
            <Link href={"/auth/login"}>
              <Button
                variant="ghost"
                className="text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                تسجيل الدخول
              </Button>
            </Link>
            <Link href={"/auth/register"}>
              <Button variant="secondary" className="font-semibold shadow-sm">
                حساب جديد
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. القسم الرئيسي (Hero Section) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* النصوص والدعوة للتفاعل */}
            <div className="space-y-6 text-right">
              {/* شارة تمييز باستخدام اللون الثانوي (Orange) */}
              <Badge
                variant="outline"
                className="bg-secondary/10 text-secondary border-secondary/30 px-3 py-1 text-sm font-medium rounded-full inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                المنصة التعليمية الأحدث لعام 2026
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                تعلم بذكاء مع أفضل <span className="text-primary">الخبراء</span>{" "}
                واشترك بسهولة
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                تجربة تعليمية متكاملة تتيح لك متابعة دروسك بجودة عالية، مع نظام
                اشتراك سلس يدعم التحقق التلقائي من إشعارات التحويل.
              </p>

              {/* أزرار الدعوة للإجراء (CTA) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  variant="default"
                  className="gap-2 text-base h-12 px-8 font-semibold shadow-md"
                >
                  ابدأ التعلم الآن
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-foreground hover:bg-accent h-12 px-8"
                >
                  انضم كمعلم
                </Button>
              </div>

              {/* إحصائيات سريعة */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-border mt-8">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-primary">
                    +50
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    معلم متميز
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-secondary">
                    +1,200
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    طالب نشط
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-primary">
                    +180
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    دورة تدريبية
                  </p>
                </div>
              </div>
            </div>

            {/* بطاقة العرض البصري (Preview Card) */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 to-secondary/30 opacity-50 blur-2xl"></div>

              <Card className="relative border-border shadow-2xl bg-card text-card-foreground rounded-2xl overflow-hidden">
                <div className="bg-muted aspect-video flex items-center justify-center relative border-b border-border">
                  <Video className="w-16 h-16 text-primary animate-pulse" />
                  <Badge
                    variant="default"
                    className="absolute bottom-3 right-3 text-xs"
                  >
                    مشغل HLS السريع
                  </Badge>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        كورس مميز
                      </Badge>
                      <h3 className="font-bold text-xl text-card-foreground">
                        أساسيات البرمجة وتطوير الويب
                      </h3>
                    </div>
                    <span className="text-lg font-bold text-secondary">
                      متاح الآن
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    شاهد الحصص بدقة متكيفة مع سرعة الإنترنت لديك مع دعم تحميل
                    المرفقات والإشعارات الفورية.
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-primary" /> 24 درس
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-secondary" /> 350+ طالب
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 3. المميزات الرئيسية (Features) */}
      <section
        id="features"
        className="py-20 bg-background border-t border-border"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-foreground">
              كل ما تحتاجه في منصة واحدة
            </h2>
            <p className="text-muted-foreground">
              صُممت المنصة بأحدث التقنيات لتقديم أفضل تجربة لكل من الطالب،
              الأستاذ، وإدارة المنصة.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* ميزة 1 */}
            <Card className="border-border bg-card hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Video className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">بث سلس ومُحسن</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                  مشغل فيديو ذكي يقلل استهلاك البيانات والتخزين المؤقت ليعمل
                  بكفاءة على جميع سرعات الشبكة.
                </CardDescription>
              </CardContent>
            </Card>

            {/* ميزة 2 */}
            <Card className="border-border bg-card hover:border-secondary/50 transition-all shadow-sm hover:shadow-md">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">تحقق ذكي بالتحويلات</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                  ارفع إشعار التحويل البنكي، وسيقوم النظام بالتحقق الآلي لتفعيل
                  الكورس في حسابك فوراً.
                </CardDescription>
              </CardContent>
            </Card>

            {/* ميزة 3 */}
            <Card className="border-border bg-card hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">
                  إدارات وصلاحيات متكاملة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                  لوحة تحكم سهلة تتيح للمعلمين رفع المحتوى وللطلاب متابعة التقدم
                  والإشعارات أولاً بأول.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. كيف تعمل المنصة (How It Works) */}
      <section
        id="how-it-works"
        className="py-20 bg-muted/50 border-t border-b border-border"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <Badge variant="secondary" className="px-3 py-1">
              خطوات بسيطة
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">
              كيف تبدأ رحلتك معنا؟
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-card-foreground">
                تصفح واختر دورك
              </h3>
              <p className="text-muted-foreground text-sm">
                اختر الدورات المناسبة لك واطلع على التفاصيل والمحتوى المتاح.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-card-foreground">
                ارفع إشعار الدفع
              </h3>
              <p className="text-muted-foreground text-sm">
                قم بتحويل المبلغ عبر تطبيقك البنكي المفضل ثم ارفع صورة الإشعار.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-card-foreground">
                متابعة وفورية
              </h3>
              <p className="text-muted-foreground text-sm">
                يتفعل حسابك تلقائياً وبشكل فوري لتستمتع بمشاهدة الكورس مباشرة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. دعوة للتسجيل (CTA Banner) */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container mx-auto px-4 text-center space-y-6 max-w-2xl relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            جاهز للانضمام إلى منطقتنا التعليمية؟
          </h2>
          <p className="text-primary-foreground/80 text-base sm:text-lg">
            سجل الآن وابدأ في استكشاف مئات الكورسات مع دعم فني متواصل وتجربة
            استخدام ممتازة.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="font-bold text-base h-12 px-8 shadow-lg"
            >
              إنشاء حساب الآن
            </Button>
          </div>
        </div>
      </section>

      {/* 6. التذييل (Footer) */}
      <footer className="bg-background text-muted-foreground py-8 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="text-foreground font-bold text-sm">
              منصتي التعليمية
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
