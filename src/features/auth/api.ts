import { api } from "@/lib/api-client";
import type { LoginRequest, RegisterRequest, User } from "@/lib/types";

export const authApi = {
  login: (data: LoginRequest) => api.post<{ token: string; role: string; id: string; fullName: string; email: string; status: string; createdAt: string }>("auth/login", data),
  register: (data: RegisterRequest) => api.post<User>("auth/register", data),
};
