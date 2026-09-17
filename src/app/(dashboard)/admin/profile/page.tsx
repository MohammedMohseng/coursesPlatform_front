"use client";
import { ProfileView } from "@/components/users/profile-view";
import { useUser } from "@/hooks/useUser";

export default function AdminProfilePage() {
  const { user } = useUser();
  return <ProfileView user={user} />;
}
