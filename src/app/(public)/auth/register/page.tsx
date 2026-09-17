"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  BookOpen,
  UserCheck,
  ArrowLeft,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authApi } from "@/features/auth/api";
import { Logo } from "@/components/ui/custom/logo";
import { toast } from "sonner";
import { Loading } from "@/components/ui/custom/loading";


export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: "STUDENT" | "TEACHER";
  }>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "STUDENT",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.register(formData);
      toast.success("تم إنشاء الحساب بنجاح. يرجى تسجيل الدخول");
      window.location.href = "/auth/login";
    } catch (err: any) {
      // Errors are toasted automatically in api-client.ts
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden py-10">
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-lg border-border bg-card shadow-xl relative z-10">
        <CardHeader className="space-y-3 text-center pb-6">
          <Logo />
          <div>
            <CardTitle className="text-2xl font-bold text-card-foreground">
              إنشاء حساب جديد
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1 text-sm">
              انضم إلينا وابدأ رحلة التعلم أو التدريس اليوم
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>نوع الحساب</Label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, role: "STUDENT" });
                    setRole("STUDENT");
                  }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${role === "STUDENT"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:bg-accent"
                    }`}
                >
                  <BookOpen className="w-4 h-4" />
                  حساب طالب
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, role: "TEACHER" });
                    setRole("TEACHER");
                  }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${role === "TEACHER"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:bg-accent"
                    }`}
                >
                  <UserCheck className="w-4 h-4" />
                  حساب معلم
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="محمد أحمد"
                  required
                  className="pl-4 pr-10 border-input bg-background"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
                <User className="w-5 h-5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="pl-4 pr-10 border-input bg-background"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <Mail className="w-5 h-5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">phone number</Label>

              <div className="relative">
                <Input
                  id="phone"
                  type="number"
                  placeholder="+249xxxxxxxxxxx"
                  required
                  className="pl-4 pr-10 border-input bg-background"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <Phone className="w-5 h-5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 border-input bg-background"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <Lock className="w-5 h-5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="secondary"
              className="w-full h-11 text-base font-semibold gap-2 mt-2 shadow-md"
            >
              {!isLoading ? (
                <div className="flex items-center gap-1">
                  إنشاء الحساب
                  <ArrowLeft className="w-4 h-4" />
                </div>
              ) : (
                <Loading />
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-border pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/auth/login"
              className="text-primary font-semibold hover:underline"
            >
              تسجيل الدخول
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
