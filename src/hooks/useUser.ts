import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { getCookie } from "@/lib/auth";
import { usersApi } from "@/features/users/api";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    const token = getCookie("JWT_TOKEN");
    if (!token || token === "undefined") {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await usersApi.getMe();
      setUser(userData);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, isLoading, error, isTeacher: user?.role === "TEACHER", isStudent: user?.role === "STUDENT", isAdmin: user?.role === "ADMIN", mutate: fetchUser };
}
