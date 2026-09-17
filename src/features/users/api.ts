import { api } from "@/lib/api-client";
import type { User, UpdateUserRequest, AccountStatus } from "@/lib/types";

export const usersApi = {
  getMe: () => api.get<User>("user/me"),
  updateMe: (data: UpdateUserRequest) => api.patch<User>("user/me", data),
  getAllUsers: () => api.get<User[]>("user/all"),
  getUser: (id: string) => api.get<User>(`user/${id}`),
  updateStatus: (id: string, status: AccountStatus) => api.patch<User>(`user/${id}/status?status=${status}`),
};
