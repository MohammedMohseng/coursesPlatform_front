'use client';

import { useState } from "react";
import { usersApi } from "@/features/users/api";
import { Button } from "@/components/ui/button";
import { Camera, User } from "lucide-react";
import { toast } from "sonner";
import { Loading } from "@/components/ui/custom/loading";

import { useUser } from "@/hooks/useUser";
import { User as UserInterface } from "@/lib/types";

export const ProfileView = ({
  user,
}: {
  user: UserInterface | null;
}) => {
  const { mutate } = useUser();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersApi.updateMe({
        fullName: formData.fullName,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
      });
      toast.success("تم حفظ البيانات الشخصية بنجاح!");
      if (mutate) mutate();
    } catch (err: any) {
      // Errors are toasted inside api-client.ts
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold">الملف الشخصي والبيانات</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Edit */}
          <div className="md:flex md:gap-4 ">
            <div className="flex items-center gap-6 justify-center md:w-[30%]">
              <div className="relative w-24 h-24 rounded-full bg-muted border-2 border-primary flex items-center justify-center overflow-hidden">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-muted-foreground" />
                )}
                <label className="absolute bottom-0 inset-x-0 bg-black/60 hover:bg-black/80 py-1 text-center cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 text-white mx-auto" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      /* رفع الصورة وتحديث URL */
                    }}
                  />
                </label>
              </div>
              <div>
                <h3 className="font-semibold text-base">{user?.fullName}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="grid gap-4 md:w-[60%]">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring outline-none"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  النبذة التعريفية (Bio)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring outline-none"
                  placeholder="اكتب نبذة مختارات عن خبرتك الدراسية أو التعليمية..."
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                />
              </div>
            </div>

          </div>
          <Button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {saving ? (<Loading />
            ) : "حفظ "}
          </Button>
        </form>
      </div>
    </div>
  );
};
