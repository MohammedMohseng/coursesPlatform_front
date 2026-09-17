"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, Loader2, ShieldCheck, ShieldX, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { User, UserRole, AccountStatus } from "@/lib/types";
import { usersApi } from "@/features/users/api";

const STATUS_CONFIG: Record<AccountStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  ACTIVE: { label: "نشط", variant: "default" },
  PENDING: { label: "معلق", variant: "secondary" },
  SUSPENDED: { label: "موقوف", variant: "destructive" },
};

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "مدير",
  TEACHER: "معلم",
  STUDENT: "طالب",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      // errors toasted by api-client
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleStatusChange = async (userId: string, newStatus: AccountStatus) => {
    setUpdatingId(userId);
    try {
      await usersApi.updateStatus(userId, newStatus);
      toast.success("تم تحديث حالة المستخدم بنجاح");
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
    } catch {
      // errors toasted
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
          <p className="text-muted-foreground mt-1">عرض وإدارة جميع مستخدمي المنصة</p>
        </div>
        <Button variant="outline" onClick={fetchUsers} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "الكل", count: users.length, icon: null },
          { label: "نشط", count: users.filter(u => u.status === "ACTIVE").length, icon: <ShieldCheck className="w-4 h-4 text-green-500" /> },
          { label: "معلق", count: users.filter(u => u.status === "PENDING").length, icon: <Clock className="w-4 h-4 text-amber-500" /> },
          { label: "موقوف", count: users.filter(u => u.status === "SUSPENDED").length, icon: <ShieldX className="w-4 h-4 text-red-500" /> },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.count}</p>
              </div>
              {s.icon}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="البحث بالاسم أو البريد..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-8" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="الدور" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">جميع الأدوار</SelectItem>
                <SelectItem value="STUDENT">طالب</SelectItem>
                <SelectItem value="TEACHER">معلم</SelectItem>
                <SelectItem value="ADMIN">مدير</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">جميع الحالات</SelectItem>
                <SelectItem value="ACTIVE">نشط</SelectItem>
                <SelectItem value="PENDING">معلق</SelectItem>
                <SelectItem value="SUSPENDED">موقوف</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>{filtered.length} مستخدم</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">البريد</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-center">تغيير الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      لا يوجد مستخدمون يطابقون البحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {user.fullName.charAt(0)}
                          </div>
                          {user.fullName}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell><Badge variant="outline">{ROLE_LABELS[user.role] || user.role}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={STATUS_CONFIG[user.status]?.variant || "outline"}>
                          {STATUS_CONFIG[user.status]?.label || user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {updatingId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        ) : (
                          <Select
                            value={user.status}
                            onValueChange={(val) => handleStatusChange(user.id, val as AccountStatus)}
                            disabled={user.role === "ADMIN"}
                          >
                            <SelectTrigger className="w-32 mx-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">نشط</SelectItem>
                              <SelectItem value="PENDING">معلق</SelectItem>
                              <SelectItem value="SUSPENDED">موقوف</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
