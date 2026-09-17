"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
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
import { Loading } from "@/components/ui/custom/loading";
import { authApi } from "@/features/auth/api";
import { isAuthenticated, getUserRole } from "@/lib/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    { email: "", password: "" },
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated()) {

      // TODO:must be back
      // const role = getUserRole();
      // if (role === "ADMIN") window.location.href = "/admin";
      // else if (role === "TEACHER") window.location.href = "/teacher";
       window.location.href = "/student";
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await authApi.login(formData);

      toast.success("تم تسجيل الدخول بنجاح");

      // Redirect based on role returned from API
      if (user.role === "ADMIN") window.location.href = "/admin";
      else if (user.role === "TEACHER") window.location.href = "/teacher";
      else window.location.href = "/student";
    } catch (err: any) {
      // Error handling is mostly done inside api-client.ts (toasts),
      // but we catch here to stop the loading state
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border-border bg-card shadow-xl relative z-10">
        <CardHeader className="space-y-3 text-center pb-6">
          <Link href="/" className="inline-block mx-auto">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>
          </Link>
          <div>
            <CardTitle className="text-2xl font-bold text-card-foreground">
              مرحباً بعودتك!
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1 text-sm">
              أدخل بياناتك للدخول إلى منصتك التعليمية
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
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
              variant="default"
              className="w-full h-11 text-base font-semibold gap-2 mt-2 shadow-md"
            >
              {!isLoading ? (
                <div className="flex items-center gap-1">
                  تسجيل الدخول
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
            ليس لديك حساب بعد؟{" "}
            <Link
              href="/auth/register"
              className="text-primary font-semibold hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
